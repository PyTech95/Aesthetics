import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Sparkles,
  X,
  Send,
  Phone,
  MessageCircle,
  Loader2,
  Check,
} from "lucide-react";
import { BRAND } from "@/lib/content";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SUGGESTIONS = [
  "What facials do you offer?",
  "Pricing for membership?",
  "Best for sensitive skin?",
  "Do you offer couple's treatments?",
];

const sid = () =>
  `cla_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [sessionId] = useState(() => sid());
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome to CLA Aesthetics. I'm Camille, your concierge — how can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [leadStep, setLeadStep] = useState("idle"); // idle | collecting | sent
  const [lead, setLead] = useState({
    name: "",
    phone: "",
    interest: "",
    preferred_channel: "phone",
  });
  const scrollerRef = useRef(null);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 6000);
    return () => clearTimeout(t);
  }, []);

  // Auto-open chat after 10 seconds (once per session)
  useEffect(() => {
    if (sessionStorage.getItem("cla_chat_auto_opened")) return;
    const t = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem("cla_chat_auto_opened", "1");
    }, 10000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [messages, open]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;
    setMessages((m) => [...m, { role: "user", content }]);
    setInput("");
    setSending(true);
    try {
      const res = await axios.post(`${API}/chat`, {
        session_id: sessionId,
        message: content,
      });
      setMessages((m) => [
        ...m,
        { role: "assistant", content: res.data.reply },
      ]);
      // Reveal lead form after a couple of exchanges
      setMessages((m) => {
        const userTurns = m.filter((x) => x.role === "user").length;
        if (userTurns >= 1 && leadStep === "idle") setLeadStep("collecting");
        return m;
      });
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        "Camille can't respond right now. Please call 516-620-9158.";
      setMessages((m) => [
        ...m,
        { role: "assistant", content: typeof msg === "string" ? msg : "Please call 516-620-9158." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const submitLead = async (e) => {
    e?.preventDefault?.();
    if (!lead.name || !lead.phone) {
      toast.error("Please share your name and phone so we can reach you.");
      return;
    }
    try {
      await axios.post(`${API}/leads`, {
        session_id: sessionId,
        ...lead,
      });
      setLeadStep("sent");
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `Thank you, ${lead.name.split(" ")[0]} — we have your number. Cinthia will reach out shortly. In the meantime, you can call or message us directly below.`,
        },
      ]);
    } catch {
      toast.error("Couldn't save your details. Please try calling us instead.");
    }
  };

  return (
    <>
      {/* Floating launcher */}
      <button
        data-testid="chat-launcher"
        aria-label="Open concierge chat"
        onClick={() => setOpen((o) => !o)}
        className={`fixed bottom-6 right-6 z-[60] h-16 w-16 rounded-full bg-[#2C2A29] text-white grid place-items-center shadow-[0_18px_40px_-12px_rgba(212,175,55,0.55)] hover:bg-[#D4AF37] transition-all duration-500 ${
          open ? "scale-90 opacity-0 pointer-events-none" : "scale-100"
        }`}
      >
        <span
          className={`absolute inset-0 rounded-full bg-[#D4AF37]/40 ${
            pulse ? "animate-ping" : ""
          }`}
        />
        <Sparkles className="h-6 w-6 relative" strokeWidth={1.4} />
      </button>

      {/* Panel */}
      <div
        data-testid="chat-panel"
        className={`fixed z-[61] inset-x-3 bottom-3 sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[400px] max-h-[calc(100svh-1.5rem)] sm:max-h-[640px] rounded-3xl bg-[#FAF9F6] border border-[#E5E1D8] shadow-[0_40px_80px_-20px_rgba(44,42,41,0.35)] overflow-hidden flex flex-col origin-bottom-right transition-all duration-500 ${
          open
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-3 scale-95 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-[#2C2A29] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#D4AF37] grid place-items-center font-serif-display text-lg">
              C
            </div>
            <div>
              <p className="font-serif-display text-[17px] leading-none">
                Camille
              </p>
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/60 mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                Online · Concierge
              </p>
            </div>
          </div>
          <button
            data-testid="chat-close"
            aria-label="Close chat"
            onClick={() => setOpen(false)}
            className="h-9 w-9 grid place-items-center rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollerRef}
          data-testid="chat-messages"
          className="flex-1 overflow-y-auto px-4 py-5 space-y-3 bg-[#FAF9F6]"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
                  m.role === "user"
                    ? "bg-[#2C2A29] text-white rounded-br-md"
                    : "bg-white border border-[#E5E1D8] text-[#2C2A29] rounded-bl-md"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-white border border-[#E5E1D8] rounded-2xl px-4 py-3 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-bounce" />
              </div>
            </div>
          )}

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="pt-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  data-testid={`chat-suggest-${s.slice(0, 8)}`}
                  onClick={() => send(s)}
                  className="text-[12px] rounded-full border border-[#E5E1D8] bg-white px-3 py-1.5 text-[#5C5A59] hover:border-[#D4AF37] hover:text-[#B8932E] transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Lead capture inline */}
          {leadStep === "collecting" && (
            <form
              onSubmit={submitLead}
              data-testid="chat-lead-form"
              className="mt-4 rounded-2xl border border-[#E5E1D8] bg-white p-4 space-y-2.5"
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37]">
                Reserve a callback
              </p>
              <input
                data-testid="chat-lead-name"
                value={lead.name}
                onChange={(e) => setLead({ ...lead, name: e.target.value })}
                placeholder="Your name"
                className="cla-input w-full text-[14px] border border-[#E5E1D8] rounded-xl px-3 py-2"
              />
              <input
                data-testid="chat-lead-phone"
                value={lead.phone}
                onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                placeholder="Phone number"
                type="tel"
                className="cla-input w-full text-[14px] border border-[#E5E1D8] rounded-xl px-3 py-2"
              />
              <input
                value={lead.interest}
                onChange={(e) => setLead({ ...lead, interest: e.target.value })}
                placeholder="Service you're curious about (optional)"
                className="cla-input w-full text-[14px] border border-[#E5E1D8] rounded-xl px-3 py-2"
              />
              <div className="flex items-center gap-2 pt-1">
                {["phone", "whatsapp"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    data-testid={`chat-channel-${c}`}
                    onClick={() => setLead({ ...lead, preferred_channel: c })}
                    className={`text-[11px] uppercase tracking-[0.18em] rounded-full px-3 py-1.5 border transition-colors ${
                      lead.preferred_channel === c
                        ? "bg-[#2C2A29] text-white border-[#2C2A29]"
                        : "bg-white text-[#5C5A59] border-[#E5E1D8] hover:border-[#D4AF37]"
                    }`}
                  >
                    {c === "phone" ? "Call me" : "WhatsApp me"}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                data-testid="chat-lead-submit"
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] text-white py-2.5 text-[12px] uppercase tracking-[0.22em] hover:bg-[#C5A059] transition-colors"
              >
                Send my details
              </button>
            </form>
          )}

          {leadStep === "sent" && (
            <div className="mt-4 rounded-2xl border border-[#E5E1D8] bg-[#F2E8DF] p-4">
              <p className="flex items-center gap-2 text-[12px] uppercase tracking-[0.22em] text-[#B8932E]">
                <Check className="h-3.5 w-3.5" strokeWidth={1.8} /> Details saved
              </p>
              <p className="mt-2 text-[13px] text-[#2C2A29] leading-relaxed">
                Reach us now if you'd like:
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <a
                  href={`tel:${BRAND.phoneRaw}`}
                  data-testid="chat-cta-call"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2C2A29] text-white py-2.5 text-[12px] uppercase tracking-[0.22em] hover:bg-[#D4AF37] transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" strokeWidth={1.5} /> Call {BRAND.phone}
                </a>
                <a
                  href={BRAND.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="chat-cta-whatsapp"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white py-2.5 text-[12px] uppercase tracking-[0.22em] hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} /> WhatsApp us
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="px-3 py-3 bg-white border-t border-[#E5E1D8] flex items-center gap-2"
        >
          <input
            data-testid="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={sending ? "Camille is typing…" : "Ask Camille…"}
            disabled={sending}
            className="cla-input flex-1 text-[14px] border border-[#E5E1D8] rounded-full px-4 py-2.5 bg-[#FAF9F6]"
          />
          <button
            type="submit"
            data-testid="chat-send"
            disabled={sending || !input.trim()}
            aria-label="Send"
            className="h-10 w-10 grid place-items-center rounded-full bg-[#2C2A29] text-white hover:bg-[#D4AF37] disabled:opacity-50 transition-colors"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
            ) : (
              <Send className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>
        </form>
      </div>
    </>
  );
}
