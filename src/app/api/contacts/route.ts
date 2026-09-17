import { auth } from "@/lib/auth";
import { userContacts, serializeContact } from "@/lib/contact-store";
import { prisma } from "@/lib/prisma";
import { emptyContact, type Contact, type ContactStatus } from "@/app/contacts/contact-data";

function fields(value: unknown): Omit<Contact, "id"> | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const result = { ...emptyContact };
  for (const key of Object.keys(emptyContact) as (keyof typeof emptyContact)[]) {
    if (typeof input[key] !== "string") return null;
    Object.assign(result, { [key]: input[key] });
  }
  result.name = result.name.trim();
  const limits = { name: 120, company: 160, email: 320, phone: 30, channelId: 200, interest: 300, notes: 5000 };
  if (!result.name || Object.entries(limits).some(([key, limit]) => result[key as keyof typeof result].length > limit)) return null;
  if (!["new", "talking", "closed"].includes(result.status)) return null;
  if (!["Phone", "LINE", "Email", "Facebook"].includes(result.channel)) return null;
  if (result.followUp) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(result.followUp)) return null;
    const date = new Date(result.followUp);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== result.followUp) return null;
  }
  result.status = result.status as ContactStatus;
  return result;
}

async function handle(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (request.method !== "GET" && request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  const id = new URL(request.url).searchParams.get("id");
  const userId = session.user.id;
  const contact = id ? await prisma.contact.findFirst({ where: { id, userId } }) : undefined;
  if (id && !contact) return Response.json({ error: "Not found" }, { status: 404 });
  if (request.method === "GET") return Response.json(contact ? serializeContact(contact) : await userContacts(userId), { headers: { "Cache-Control": "no-store" } });
  if (request.method === "DELETE") {
    if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
    const removed = await prisma.contact.deleteMany({ where: { id, userId } });
    if (!removed.count) return Response.json({ error: "Not found" }, { status: 404 });
    return new Response(null, { status: 204 });
  }
  if (request.method === "PATCH" && !id) return Response.json({ error: "Missing id" }, { status: 400 });
  const data = fields(await request.json().catch(() => null));
  if (!data) return Response.json({ error: "Invalid contact" }, { status: 400 });
  const databaseData = { ...data, followUp: data.followUp ? new Date(data.followUp) : null };
  if (request.method === "POST") {
    const record = await prisma.contact.create({ data: { ...databaseData, userId } });
    return Response.json(serializeContact(record), { status: 201 });
  }
  const updated = await prisma.contact.updateMany({ where: { id: id!, userId }, data: databaseData });
  if (!updated.count) return Response.json({ error: "Not found" }, { status: 404 });
  const record = await prisma.contact.findFirst({ where: { id: id!, userId } });
  if (!record) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(serializeContact(record));
}

export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const DELETE = handle;

