"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { emptyContact, statusLabels, type Contact, type ContactStatus } from "./contact-data";
import "../stitch.css";
import "./contact-list.css";
import AuthControls from "@/components/auth-controls";

function Symbol({ name }: { name: string }) { return <span className="material-symbols-outlined" aria-hidden="true">{name}</span>; }
function dateLabel(value: string) { return value ? new Date(value + "T00:00:00").toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }) : "ยังไม่กำหนด"; }

export default function ContactsView({ initialData, today }: { initialData: Contact[]; today: string }) {
  function isOverdue(c: Contact) { return c.status !== "closed" && Boolean(c.followUp && c.followUp < today); }
  const [contacts, setContacts] = useState<Contact[]>(initialData);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [status, setStatus] = useState("");
  const [channel, setChannel] = useState("");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mode, setMode] = useState<"create" | "edit" | "view" | null>(null);
  const [draft, setDraft] = useState(emptyContact);
  const [deleting, setDeleting] = useState<Contact | null>(null);
  const [message, setMessage] = useState("");
  const formDialog = useRef<HTMLDialogElement>(null);
  const deleteDialog = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("new") === "1") setMode("create");
    const shortcut = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && ["k", "f"].includes(e.key.toLowerCase())) { e.preventDefault(); search.current?.focus(); } };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  useEffect(() => { if (mode) formDialog.current?.showModal(); else formDialog.current?.close(); }, [mode]);
  useEffect(() => { if (deleting) deleteDialog.current?.showModal(); else deleteDialog.current?.close(); }, [deleting]);

  function create() { setEditingId(null); setDraft({ ...emptyContact }); setMode("create"); }
  function open(contact: Contact, nextMode: "edit" | "view") { const { id, ...fields } = contact; setEditingId(id); setDraft(fields); setMode(nextMode); }
  async function contactRequest(method: string, id?: string, data?: Omit<Contact, "id">) {
    const response = await fetch(`/api/contacts${id ? `?id=${encodeURIComponent(id)}` : ""}`, {
      method, headers: { "Content-Type": "application/json" },
      ...(data ? { body: JSON.stringify(data) } : {}),
    });
    if (response.status === 401) { window.location.replace("/sign-in"); throw new Error("กรุณาเข้าสู่ระบบอีกครั้ง"); }
    if (!response.ok) throw new Error(response.status === 404 ? "ไม่พบผู้ติดต่อหรือไม่มีสิทธิ์เข้าถึง" : "ดำเนินการไม่สำเร็จ กรุณาลองอีกครั้ง");
    return response.status === 204 ? null : response.json();
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    if (!draft.name.trim() || busy) return;
    setBusy(true);
    try {
    const record: Contact = await contactRequest(editingId ? "PATCH" : "POST", editingId ?? undefined, draft);
    setContacts(previous => editingId ? previous.map(c => c.id === editingId ? record : c) : [record, ...previous]);
    setMode(null); setMessage(editingId ? "แก้ไขผู้ติดต่อแล้ว" : "เพิ่มผู้ติดต่อแล้ว");
    if (!editingId) { resetFilters(); }
    } catch (error) { setMessage(error instanceof Error ? error.message : "ดำเนินการไม่สำเร็จ"); }
    finally { setBusy(false); }
  }
  async function remove() {
    if (!deleting || busy) return;
    setBusy(true);
    try {
      await contactRequest("DELETE", deleting.id);
      setContacts(previous => previous.filter(c => c.id !== deleting.id));
      setSelected(previous => previous.filter(id => id !== deleting.id));
      setDeleting(null); setMessage("ลบผู้ติดต่อแล้ว");
    } catch (error) { setMessage(error instanceof Error ? error.message : "ดำเนินการไม่สำเร็จ"); }
    finally { setBusy(false); }
  }
  function resetFilters() { setQuery(""); setTab("all"); setStatus(""); setChannel(""); setPage(1); }
  function changeFilter(action: () => void) { action(); setPage(1); }
  const filtered = contacts.filter(c => Object.values(c).join(" ").toLowerCase().includes(query.trim().toLowerCase()) && (!status || c.status === status) && (!channel || c.channel === channel) && (tab === "all" || (tab === "today" ? c.followUp === today && c.status !== "closed" : tab === "overdue" ? isOverdue(c) : c.status === tab)));
  const sorted = [...filtered].sort((a, b) => sort === "name" ? a.name.localeCompare(b.name, "th") : sort === "followUp" ? (a.followUp || "9999").localeCompare(b.followUp || "9999") : 0);
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const counts: Record<string, number> = { all: contacts.length, today: contacts.filter(c => c.followUp === today && c.status !== "closed").length, overdue: contacts.filter(isOverdue).length, new: contacts.filter(c => c.status === "new").length, talking: contacts.filter(c => c.status === "talking").length, closed: contacts.filter(c => c.status === "closed").length };

  return <div className="contacts-page bg-surface text-on-surface min-h-screen">
    <aside className="contacts-sidebar bg-surface-container-lowest">
      <a href="/" className="contacts-brand"><img src="/stitch/logo.png" alt="Follow-up Board Logo" /><div><strong>Follow-up Board</strong><small>ระบบติดตามลูกค้า</small></div></a>
      <div className="contacts-workspace bg-surface-container-low"><Symbol name="domain" /><div><strong>ทีมพัฒนาธุรกิจภูมิภาค (APAC)</strong><small>ผู้ติดต่อส่วนตัว</small></div><Symbol name="unfold_more" /></div>
      <nav aria-label="เมนูหลัก" className="contacts-nav"><a href="/"><Symbol name="dashboard" />แดชบอร์ด</a><a href="/contacts" aria-current="page" className="active-nav"><Symbol name="group" />รายชื่อผู้ติดต่อ <span>{contacts.length}</span></a><button onClick={create}><Symbol name="person_add" />เพิ่มผู้ติดต่อใหม่</button><button disabled title="ยังไม่อยู่ในขอบเขตงานนี้"><Symbol name="calendar_month" />ปฏิทินติดตามงาน</button><button disabled title="ยังไม่อยู่ในขอบเขตงานนี้"><Symbol name="settings" />ตั้งค่าระบบ</button></nav>
      <div className="contacts-storage bg-surface-container-low"><div><small>สถานะข้อมูล</small><strong>Supabase PostgreSQL</strong></div><Symbol name="cloud_done" /></div>
    </aside>
    <div className="contacts-shell"><header className="contacts-topbar bg-surface-container-lowest"><label className="contacts-global-search bg-surface-container-low"><Symbol name="search" /><input aria-label="ค้นหาผู้ติดต่อจากแถบด้านบน" placeholder="ค้นหาชื่อ, เบอร์โทร, บริษัท..." value={query} onChange={e => changeFilter(() => setQuery(e.target.value))} /><kbd>⌘K</kbd></label><span className="contacts-demo-date"><Symbol name="event" />วันนี้: {dateLabel(today)}</span><button className="contacts-primary" onClick={create}><Symbol name="add" />เพิ่มผู้ติดต่อ</button><AuthControls /></header>
      <main className="contacts-main"><section className="contacts-heading"><div><h1>รายชื่อผู้ติดต่อทั้งหมด <span className="contacts-total bg-surface-container-high">{contacts.length} รายชื่อ</span></h1><p>จัดการฐานข้อมูลลูกค้า บันทึกข้อมูล และกำหนดวันติดตามครั้งถัดไป</p></div><div className="contacts-header-actions"><button className="contacts-secondary" disabled title="ยังไม่อยู่ในขอบเขตงานนี้"><Symbol name="upload_file" />นำเข้าไฟล์ (Import)</button><button className="contacts-secondary" disabled title="ยังไม่อยู่ในขอบเขตงานนี้"><Symbol name="file_download" />ส่งออก Excel/CSV</button><button className="contacts-primary" onClick={create}><Symbol name="person_add" />เพิ่มผู้ติดต่อใหม่</button></div></section>
      <section className="contacts-filter-panel bg-surface-container-lowest" aria-label="ค้นหาและกรองผู้ติดต่อ"><label className="contacts-list-search bg-surface-container-low"><Symbol name="search" /><input ref={search} aria-label="ค้นหารายชื่อผู้ติดต่อ" placeholder="ค้นหาด้วยชื่อ, นามสกุล, บริษัท, เบอร์โทร, LINE ID หรืออีเมล..." value={query} onChange={e => changeFilter(() => setQuery(e.target.value))} /><kbd>⌘ F</kbd></label><div className="contacts-filter-tabs">{[["all", "ทั้งหมด"], ["today", "ต้องติดตามวันนี้"], ["overdue", "เกินกำหนด"], ["new", "รายการใหม่"], ["talking", "กำลังคุย"], ["closed", "ปิดงาน"]].map(([value, label]) => <button key={value} className={tab === value ? "selected-tab" : "bg-surface-container-low"} aria-pressed={tab === value} onClick={() => changeFilter(() => setTab(value))}><i className={`contact-dot ${value}`} />{label}<span>{counts[value]}</span></button>)}</div><div className="contacts-fine-filters"><select aria-label="กรองสถานะ" value={status} onChange={e => changeFilter(() => setStatus(e.target.value))}><option value="">สถานะ: ทั้งหมด</option>{Object.entries(statusLabels).map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select><select aria-label="กรองช่องทาง" value={channel} onChange={e => changeFilter(() => setChannel(e.target.value))}><option value="">ช่องทาง: ทั้งหมด</option>{["Phone", "LINE", "Email", "Facebook"].map(v => <option key={v}>{v}</option>)}</select><button className="contacts-reset" onClick={resetFilters}><Symbol name="filter_alt_off" />ล้างตัวกรอง</button><label className="contacts-sort">เรียงตาม: <select aria-label="เรียงผู้ติดต่อ" value={sort} onChange={e => changeFilter(() => setSort(e.target.value))}><option value="default">ค่าเริ่มต้น</option><option value="name">ชื่อผู้ติดต่อ</option><option value="followUp">วันติดตาม</option></select></label></div></section>
      <div className="contacts-results"><span>พบ {filtered.length} รายชื่อ{selected.length > 0 && ` • เลือก ${selected.length} รายชื่อ`}</span><span className="mock-label">ข้อมูลส่วนตัว • บันทึกใน Supabase</span></div>
      <section className="contacts-table-panel bg-surface-container-lowest" aria-label="ตารางผู้ติดต่อ"><div className="contacts-table-scroll"><table><thead className="bg-surface-container-low"><tr><th><input type="checkbox" aria-label="เลือกทุกรายชื่อในหน้านี้" checked={visible.length > 0 && visible.every(c => selected.includes(c.id))} onChange={e => setSelected(previous => e.target.checked ? [...new Set([...previous, ...visible.map(c => c.id)])] : previous.filter(id => !visible.some(c => c.id === id)))} /></th><th>ลูกค้า / บริษัท</th><th>ช่องทางติดต่อ</th><th>สถานะ</th><th>วันติดตามถัดไป</th><th>หมายเหตุ / สิ่งสนใจ</th><th className="contact-actions-heading">การดำเนินการ</th></tr></thead><tbody>{visible.map(c => <tr key={c.id}><td><input type="checkbox" aria-label={`เลือก ${c.name}`} checked={selected.includes(c.id)} onChange={e => setSelected(previous => e.target.checked ? [...previous, c.id] : previous.filter(id => id !== c.id))} /></td><td><div className="contacts-person"><span className={`contact-avatar ${c.status}`}>{c.name.replace(/^(คุณ|ดร\.)/, "").slice(0,2)}</span><div><button onClick={() => open(c,"view")}>{c.name}</button><small>{c.company || "ไม่ระบุองค์กร"}</small></div></div></td><td><div className="contact-channel-info"><span className={c.channel === "LINE" ? "line-text" : ""}><Symbol name={c.channel === "Email" ? "mail" : c.channel === "LINE" ? "chat" : c.channel === "Facebook" ? "forum" : "call"} />{(c.channel === "Phone" ? c.phone || c.channelId : c.channel === "Email" ? c.email || c.channelId : c.channelId) || "ไม่ระบุ"}</span><span><Symbol name={c.channel === "Phone" ? "mail" : "call"} />{c.channel === "Phone" ? c.email || "ไม่ระบุอีเมล" : c.phone || "ไม่ระบุเบอร์โทร"}</span></div></td><td><span className={`contact-status ${c.status}`}><i />{statusLabels[c.status]}</span></td><td><div className={`contact-followup ${isOverdue(c) ? "overdue" : ""}`}><span><Symbol name={c.status === "closed" ? "check_circle" : "event"} />{dateLabel(c.followUp)}</span><small>{c.status === "closed" ? "ปิดงานแล้ว" : isOverdue(c) ? "เกินกำหนด" : c.followUp === today ? "ต้องติดตามวันนี้" : "นัดหมายครั้งถัดไป"}</small></div></td><td className="contact-notes-cell"><p>{c.notes || "—"}</p><small>{c.interest}</small></td><td><div className="contact-row-actions"><button aria-label={`ดูรายละเอียด ${c.name}`} title="ดูรายละเอียด" onClick={() => open(c,"view")}><Symbol name="visibility" /></button><button aria-label={`แก้ไข ${c.name}`} title="แก้ไข" onClick={() => open(c,"edit")}><Symbol name="edit" /></button><button className="delete-action" aria-label={`ลบ ${c.name}`} title="ลบ" onClick={() => setDeleting(c)}><Symbol name="delete" /></button></div></td></tr>)}</tbody></table></div>{!visible.length && <div className="contacts-empty"><Symbol name="search_off" /><h2>ไม่พบรายชื่อผู้ติดต่อ</h2><p>ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p><button className="contacts-secondary" onClick={resetFilters}>ล้างตัวกรอง</button></div>}<footer className="contacts-pagination bg-surface-container-low"><span>แสดง {sorted.length ? (currentPage-1)*pageSize+1 : 0} – {Math.min(currentPage*pageSize,sorted.length)} จากทั้งหมด {sorted.length} รายการ</span><label>แสดงแถวต่อหน้า: <select aria-label="จำนวนแถวต่อหน้า" value={pageSize} onChange={e => {setPageSize(Number(e.target.value));setPage(1);}}>{[10,25,50].map(v => <option key={v}>{v}</option>)}</select></label><nav aria-label="Pagination"><button disabled={currentPage===1} aria-label="หน้าก่อนหน้า" onClick={() => setPage(currentPage-1)}><Symbol name="chevron_left" /></button><span>{currentPage} / {pages}</span><button disabled={currentPage===pages} aria-label="หน้าถัดไป" onClick={() => setPage(currentPage+1)}><Symbol name="chevron_right" /></button></nav></footer></section>
      <div className="contacts-summary">{[["รายการใหม่",counts.new,"person_add"],["กำลังคุย",counts.talking,"forum"],["ปิดงาน",counts.closed,"task_alt"]].map(([label,count,icon]) => <article className="bg-surface-container-lowest" key={label}><div><small>{label}</small><strong>{count} <span>รายชื่อ</span></strong><p>จากข้อมูลจำลองในพื้นที่ทำงาน</p></div><Symbol name={String(icon)} /></article>)}</div><p role="status" className="contacts-feedback">{message}</p>
      </main>
    </div>
    <dialog ref={formDialog} className="contact-form-dialog" onCancel={() => setMode(null)}><header><div><small>CONTACT INFORMATION</small><h2>{mode === "create" ? "เพิ่มผู้ติดต่อ" : mode === "edit" ? "แก้ไขผู้ติดต่อ" : "ข้อมูลผู้ติดต่อ"}</h2></div><button aria-label="ปิดฟอร์ม" onClick={() => setMode(null)}><Symbol name="close" /></button></header><form onSubmit={save}><fieldset disabled={mode === "view"}><div className="contact-form-grid"><label>ชื่อ <span>*</span><input autoComplete="name" required maxLength={120} value={draft.name} onChange={e => setDraft({...draft,name:e.target.value})} /></label><label>บริษัทหรือองค์กร<input maxLength={160} value={draft.company} onChange={e => setDraft({...draft,company:e.target.value})} /></label><label>อีเมล<input type="email" autoComplete="email" value={draft.email} onChange={e => setDraft({...draft,email:e.target.value})} /></label><label>เบอร์โทรศัพท์<input type="tel" autoComplete="tel" maxLength={30} value={draft.phone} onChange={e => setDraft({...draft,phone:e.target.value})} /></label><label>ช่องทางติดต่อ<select value={draft.channel} onChange={e => setDraft({...draft,channel:e.target.value})}>{["Phone","LINE","Email","Facebook"].map(v => <option key={v}>{v}</option>)}</select></label><label>ข้อมูลช่องทาง (ID / บัญชี)<input maxLength={200} value={draft.channelId} onChange={e => setDraft({...draft,channelId:e.target.value})} /></label><label className="full-width">สิ่งสนใจ<input maxLength={300} value={draft.interest} onChange={e => setDraft({...draft,interest:e.target.value})} /></label><label>สถานะ<select value={draft.status} onChange={e => setDraft({...draft,status:e.target.value as ContactStatus})}>{Object.entries(statusLabels).map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></label><label>วันที่ต้อง Follow-up<input type="date" value={draft.followUp} onChange={e => setDraft({...draft,followUp:e.target.value})} /></label><label className="full-width">หมายเหตุ<textarea rows={4} maxLength={5000} value={draft.notes} onChange={e => setDraft({...draft,notes:e.target.value})} /></label></div></fieldset><footer><button className="contacts-secondary" type="button" onClick={() => setMode(null)}>ปิด</button>{mode === "view" ? <button className="contacts-primary" type="button" onClick={() => setMode("edit")}>แก้ไขข้อมูล</button> : <button className="contacts-primary" type="submit" disabled={busy}>บันทึกข้อมูล</button>}</footer></form></dialog>
    <dialog ref={deleteDialog} className="contact-delete-dialog" onCancel={() => setDeleting(null)}><Symbol name="delete" /><h2>ลบผู้ติดต่อ?</h2><p>ต้องการลบ {deleting?.name} ออกจากบัญชีของคุณหรือไม่</p><footer><button className="contacts-secondary" onClick={() => setDeleting(null)}>ยกเลิก</button><button className="contacts-danger" onClick={remove} disabled={busy}>ลบผู้ติดต่อ</button></footer></dialog>
  </div>;
}



