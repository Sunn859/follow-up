import ContactsView from "./contacts-view";
import { requireSession } from "@/lib/auth-session";
import { userContacts } from "@/lib/contact-store";

export default async function ContactsPage() {
  const session = await requireSession();
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
  return <ContactsView key={session.user.id} initialData={await userContacts(session.user.id)} today={today} />;
}
