import { readFileSync } from "node:fs";
import path from "node:path";
import DashboardActions from "@/components/dashboard-actions";
import { requireSession } from "@/lib/auth-session";
import "./stitch.css";

export default async function Home() {
  await requireSession();
  const html = readFileSync(path.join(process.cwd(), "docs/stitch/dashboard/design.html"), "utf8");
  let body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1];
  if (!body) throw new Error("Stitch dashboard body not found");
  body = body.replace(/<div class="flex items-center gap-space-sm pl-space-xs">[\s\S]*?<\/div><\/div>(?=<\/div><\/header>)/, '<div id="dashboard-auth-controls"></div>');
  body = body.replace(/(<img alt="Follow-up Board Logo"[^>]*src=")[^"]+("[^>]*>)/, "$1/stitch/logo.png$2");
  body = body.replace(/(<a\b[^>]*data-path="รายชื่อผู้ติดต่อ"[^>]*href=")#"/g, "$1/contacts\"");
  body = body.replace(/(<a\b[^>]*data-path="เพิ่มผู้ติดต่อใหม่"[^>]*href=")#"/g, "$1/contacts?new=1\"");
  return <><div className="bg-surface text-on-surface min-h-screen" dangerouslySetInnerHTML={{ __html: body }} /><DashboardActions /></>;
}
