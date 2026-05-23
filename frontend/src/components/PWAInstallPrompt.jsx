import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

export default function PWAInstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("cla_pwa_dismissed")) return;
    const handler = (e) => {
      e.preventDefault();
      setDeferred(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!show || !deferred) return null;

  const install = async () => {
    deferred.prompt();
    try {
      await deferred.userChoice;
    } catch {
      /* ignore */
    }
    setShow(false);
    setDeferred(null);
    sessionStorage.setItem("cla_pwa_dismissed", "1");
  };

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem("cla_pwa_dismissed", "1");
  };

  return (
    <div
      data-testid="pwa-install-pill"
      className="fixed left-1/2 -translate-x-1/2 bottom-24 z-[58] inline-flex items-center gap-3 rounded-full bg-[#2C2A29] text-white px-4 py-2.5 shadow-[0_18px_40px_-12px_rgba(212,175,55,0.4)] border border-[#D4AF37]/40"
    >
      <span className="grid place-items-center h-7 w-7 rounded-full bg-[#D4AF37]">
        <Download className="h-3.5 w-3.5" strokeWidth={1.6} />
      </span>
      <span className="text-[12px] uppercase tracking-[0.22em]">Install CLA app</span>
      <button
        onClick={install}
        data-testid="pwa-install-confirm"
        className="text-[11px] uppercase tracking-[0.22em] rounded-full bg-[#D4AF37] text-white px-3 py-1 hover:bg-[#C5A059]"
      >
        Install
      </button>
      <button
        onClick={dismiss}
        aria-label="Dismiss install prompt"
        className="ml-1 opacity-60 hover:opacity-100"
      >
        <X className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}
