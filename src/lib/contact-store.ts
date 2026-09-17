import "server-only";
import { prisma } from "./prisma";
import type { Contact as DatabaseContact } from "@/generated/prisma/client";
import type { Contact } from "@/app/contacts/contact-data";

export function serializeContact(record: DatabaseContact): Contact {
  return {
    id: record.id, name: record.name, company: record.company,
    email: record.email, phone: record.phone, channel: record.channel,
    channelId: record.channelId, interest: record.interest, status: record.status,
    followUp: record.followUp?.toISOString().slice(0, 10) ?? "", notes: record.notes,
  };
}

export async function userContacts(userId: string): Promise<Contact[]> {
  return (await prisma.contact.findMany({ where: { userId }, orderBy: [{ createdAt: "desc" }, { id: "asc" }] })).map(serializeContact);
}

