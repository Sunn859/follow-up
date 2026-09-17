"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import AuthControls from "./auth-controls";

export default function DashboardActions() {
  const [authSlot, setAuthSlot] = useState<HTMLElement | null>(null);
  useEffect(() => { setAuthSlot(document.getElementById("dashboard-auth-controls")); }, []);
  useEffect(() => {
    const click = (event: MouseEvent) => {
      const target = (event.target as Element).closest<HTMLAnchorElement>("a[data-path]");
      if (!target) return;
      const name = target.dataset.path;
      if (name === "แดชบอร์ด") { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }
      if (name === "รายชื่อผู้ติดต่อ" || name === "เพิ่มผู้ติดต่อใหม่") {
        event.preventDefault();
        window.location.assign(name === "เพิ่มผู้ติดต่อใหม่" ? "/contacts?new=1" : "/contacts");
      }
    };
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.querySelector<HTMLInputElement>('header input[type="text"]')?.focus();
      }
    };
    document.addEventListener("click", click);
    document.addEventListener("keydown", shortcut);
    return () => { document.removeEventListener("click", click); document.removeEventListener("keydown", shortcut); };
  }, []);
  return authSlot ? createPortal(<AuthControls />, authSlot) : null;
}
