import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Contact } from "@/generated/prisma/client";
import { emptyContact } from "@/app/contacts/contact-data";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  contact: { findMany: vi.fn(), findFirst: vi.fn(), create: vi.fn(), updateMany: vi.fn(), deleteMany: vi.fn() },
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth", () => ({ auth: { api: { getSession: mocks.getSession } } }));
vi.mock("@/lib/prisma", () => ({ prisma: { contact: mocks.contact } }));

import { GET, POST, PATCH, DELETE } from "@/app/api/contacts/route";
import { serializeContact } from "@/lib/contact-store";

const origin = "http://localhost:3000";
const owner = "user-a";
const input = { ...emptyContact, name: "คุณทดสอบ", email: "contact@example.com", followUp: "2026-09-18" };
function record(overrides: Partial<Contact> = {}): Contact {
  return { ...input, id: "contact-a", userId: owner, followUp: new Date("2026-09-18T00:00:00Z"), createdAt: new Date(), updatedAt: new Date(), ...overrides };
}
function request(method = "GET", id?: string, body?: unknown, requestOrigin: string | null = origin) {
  return new Request(`${origin}/api/contacts${id ? `?id=${id}` : ""}`, {
    method, headers: { "Content-Type": "application/json", ...(requestOrigin ? { Origin: requestOrigin } : {}) },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}
function expectNoDatabaseCalls() {
  for (const method of Object.values(mocks.contact)) expect(method).not.toHaveBeenCalled();
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.getSession.mockResolvedValue({ user: { id: owner } });
  mocks.contact.findFirst.mockResolvedValue(record());
  mocks.contact.findMany.mockResolvedValue([record()]);
  mocks.contact.create.mockResolvedValue(record());
  mocks.contact.updateMany.mockResolvedValue({ count: 1 });
  mocks.contact.deleteMany.mockResolvedValue({ count: 1 });
});

describe("Contacts access", () => {
  it.each([["GET", GET], ["POST", POST], ["PATCH", PATCH], ["DELETE", DELETE]] as const)("rejects anonymous %s before accessing data", async (method, handler) => {
    mocks.getSession.mockResolvedValue(null);
    expect((await handler(request(method, "contact-a", method === "POST" || method === "PATCH" ? input : undefined))).status).toBe(401);
    expectNoDatabaseCalls();
  });
  it.each(["https://untrusted.example", null])("rejects mutations from origin %s", async requestOrigin => {
    for (const [method, handler] of [["POST", POST], ["PATCH", PATCH], ["DELETE", DELETE]] as const) {
      expect((await handler(request(method, "contact-a", method === "DELETE" ? undefined : input, requestOrigin))).status).toBe(403);
    }
    expectNoDatabaseCalls();
  });
  it.each([["GET", GET], ["PATCH", PATCH], ["DELETE", DELETE]] as const)("does not expose another owner's contact through %s", async (method, handler) => {
    mocks.contact.findFirst.mockResolvedValue(null);
    expect((await handler(request(method, "contact-b", method === "PATCH" ? input : undefined))).status).toBe(404);
    expect(mocks.contact.findFirst).toHaveBeenCalledWith({ where: { id: "contact-b", userId: owner } });
    expect(mocks.contact.updateMany).not.toHaveBeenCalled();
    expect(mocks.contact.deleteMany).not.toHaveBeenCalled();
  });
});

describe("Contacts CRUD", () => {
  it("lists only the session owner's contacts and hides internal fields", async () => {
    const response = await GET(request());
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(mocks.contact.findMany).toHaveBeenCalledWith({ where: { userId: owner }, orderBy: [{ createdAt: "desc" }, { id: "asc" }] });
    const contacts = await response.json();
    expect(contacts).toHaveLength(1);
    expect(contacts[0]).toMatchObject({ id: "contact-a", followUp: "2026-09-18" });
    expect(contacts[0]).not.toHaveProperty("userId");
    expect(contacts[0]).not.toHaveProperty("createdAt");
  });
  it("reads one owned contact", async () => {
    expect(await (await GET(request("GET", "contact-a"))).json()).toEqual(serializeContact(record()));
  });
  it("creates with session ownership and ignores supplied id and owner", async () => {
    const response = await POST(request("POST", undefined, { ...input, name: "  คุณทดสอบ  ", id: "forged-id", userId: "user-b" }));
    expect(response.status).toBe(201);
    expect(mocks.contact.create).toHaveBeenCalledWith({ data: { ...input, userId: owner, followUp: new Date("2026-09-18") } });
    expect((await response.json()).id).toBe("contact-a");
  });
  it("updates with ownership in the write filter and clears a follow-up date", async () => {
    mocks.contact.findFirst.mockResolvedValueOnce(record()).mockResolvedValueOnce(record({ name: "แก้ไขแล้ว", followUp: null }));
    const data = { ...input, name: "แก้ไขแล้ว", followUp: "" };
    const response = await PATCH(request("PATCH", "contact-a", { ...data, userId: "user-b" }));
    expect(response.status).toBe(200);
    expect(mocks.contact.updateMany).toHaveBeenCalledWith({ where: { id: "contact-a", userId: owner }, data: { ...data, followUp: null } });
    expect(await response.json()).toMatchObject({ name: "แก้ไขแล้ว", followUp: "" });
  });
  it("deletes only an owned contact with an empty response", async () => {
    const response = await DELETE(request("DELETE", "contact-a"));
    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
    expect(mocks.contact.deleteMany).toHaveBeenCalledWith({ where: { id: "contact-a", userId: owner } });
  });
  it.each([["PATCH", PATCH, "updateMany"], ["DELETE", DELETE, "deleteMany"]] as const)("returns 404 if contact disappears during %s", async (method, handler, operation) => {
    mocks.contact[operation].mockResolvedValue({ count: 0 });
    expect((await handler(request(method, "contact-a", method === "PATCH" ? input : undefined))).status).toBe(404);
  });
  it.each([["PATCH", PATCH], ["DELETE", DELETE]] as const)("requires an id for %s", async (method, handler) => {
    expect((await handler(request(method, undefined, method === "PATCH" ? input : undefined))).status).toBe(400);
    expectNoDatabaseCalls();
  });
});

describe("Contact validation", () => {
  it.each([
    ["blank name", { name: "   " }],
    ["invalid status", { status: "unknown" }],
    ["invalid channel", { channel: "unknown" }],
    ["impossible date", { followUp: "2026-02-30" }],
    ["date format", { followUp: "18/09/2026" }],
    ["non-string phone", { phone: 123 }],
    ["long name", { name: "x".repeat(121) }],
    ["long notes", { notes: "x".repeat(5001) }],
  ])("rejects %s without writing", async (_label, override) => {
    for (const [method, handler] of [["POST", POST], ["PATCH", PATCH]] as const) {
      expect((await handler(request(method, method === "PATCH" ? "contact-a" : undefined, { ...input, ...override }))).status).toBe(400);
    }
    expect(mocks.contact.create).not.toHaveBeenCalled();
    expect(mocks.contact.updateMany).not.toHaveBeenCalled();
  });
  it("rejects malformed JSON", async () => {
    const response = await POST(new Request(`${origin}/api/contacts`, { method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: "{" }));
    expect(response.status).toBe(400);
    expectNoDatabaseCalls();
  });
  it("accepts contacts with no follow-up date", async () => {
    await POST(request("POST", undefined, { ...input, followUp: "" }));
    expect(mocks.contact.create).toHaveBeenCalledWith({ data: { ...input, userId: owner, followUp: null } });
  });
});
