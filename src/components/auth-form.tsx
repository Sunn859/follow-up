"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import "./auth-form.css";

export default function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const signingUp = mode === "sign-up";
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const credentials = { email: String(form.get("email")).trim(), password: String(form.get("password")) };
    try {
      const result = signingUp
        ? await authClient.signUp.email({ ...credentials, name: String(form.get("name")).trim() })
        : await authClient.signIn.email(credentials);
      if (result.error) {
        const messages: Record<string, string> = {
          INVALID_EMAIL_OR_PASSWORD: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
          USER_ALREADY_EXISTS: "อีเมลนี้มีบัญชีอยู่แล้ว กรุณาเข้าสู่ระบบ",
          USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "อีเมลนี้มีบัญชีอยู่แล้ว กรุณาเข้าสู่ระบบ",
          PASSWORD_TOO_SHORT: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
          PASSWORD_TOO_LONG: "รหัสผ่านต้องไม่เกิน 128 ตัวอักษร",
        };
        setError(messages[result.error.code ?? ""] ?? "ไม่สามารถดำเนินการได้ กรุณาลองอีกครั้ง");
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("ไม่สามารถเชื่อมต่อได้ กรุณาลองอีกครั้ง");
    } finally { setPending(false); }
  }

  return <main className="auth-page">
    <section className="auth-card" aria-labelledby="auth-title">
      <Link href="/" className="auth-brand"><img src="/stitch/logo.png" alt="" width="44" height="44" />Follow-up Board</Link>
      <h1 id="auth-title">{signingUp ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}</h1>
      <p className="auth-description">จัดการผู้ติดต่อและติดตามงานของคุณในที่เดียว</p>
      <form onSubmit={submit}>
        {signingUp && <label>ชื่อ<input name="name" autoComplete="name" required maxLength={100} placeholder="ชื่อของคุณ" /></label>}
        <label>อีเมล<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
        <label>รหัสผ่าน<input name="password" type="password" autoComplete={signingUp ? "new-password" : "current-password"} required minLength={8} maxLength={128} placeholder="อย่างน้อย 8 ตัวอักษร" /></label>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button type="submit" disabled={pending}>{pending ? "กำลังดำเนินการ…" : signingUp ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}</button>
      </form>
      <p className="auth-switch">{signingUp ? "มีบัญชีอยู่แล้ว?" : "ยังไม่มีบัญชี?"} <Link href={signingUp ? "/sign-in" : "/sign-up"}>{signingUp ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}</Link></p>
    </section>
  </main>;
}
