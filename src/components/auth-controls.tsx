"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import "./auth-controls.css";

export default function AuthControls() {
  const { data: session, isPending, error: sessionError } = authClient.useSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function logout() {
    setBusy(true);
    setError("");
    try {
      const result = await authClient.signOut();
      if (result.error) throw new Error("Sign out failed");
      router.replace("/sign-in");
      router.refresh();
    } catch {
      setError("ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง");
    } finally { setBusy(false); }
  }

  return <div className="auth-controls">
    {isPending ? <span role="status">กำลังโหลด…</span> : sessionError ? <span role="alert">โหลดบัญชีไม่สำเร็จ</span> : session ? <>
      <span className="auth-account-name" title={session.user.email}>{session.user.name || session.user.email}</span>
      <button type="button" onClick={logout} disabled={busy}>{busy ? "กำลังออก…" : "ออกจากระบบ"}</button>
    </> : <Link href="/sign-in">เข้าสู่ระบบ</Link>}
    {error && <span className="auth-control-error" role="alert">{error}</span>}
  </div>;
}
