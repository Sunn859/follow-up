export type ContactStatus = "new" | "talking" | "closed";
export type Contact = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  channel: string;
  channelId: string;
  interest: string;
  status: ContactStatus;
  followUp: string;
  notes: string;
};


export const statusLabels: Record<ContactStatus, string> = { new: "รายการใหม่", talking: "กำลังคุย", closed: "ปิดงาน" };
export const emptyContact: Omit<Contact, "id"> = { name: "", company: "", email: "", phone: "", channel: "Phone", channelId: "", interest: "", status: "new", followUp: "", notes: "" };

