import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { useAuth, formatApiErrorDetail } from "@/contexts/AuthContext";
import { BRAND } from "@/lib/content";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await register(form);
      toast.success("Account created");
      nav("/portal", { replace: true });
    } catch (err) {
      setError(formatApiErrorDetail(err?.response?.data?.detail) || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center mb-8" data-testid="register-logo">
          <img src={BRAND.logoUrl} alt="CLA" className="h-16 w-16 rounded-full object-contain" />
        </Link>

        <div className="rounded-3xl bg-white border border-[#E5E1D8] p-8 sm:p-10 shadow-[0_30px_80px_-50px_rgba(44,42,41,0.25)]">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#D4AF37]">
              Create your account
            </p>
            <h1 className="mt-3 font-serif-display text-3xl sm:text-4xl text-[#2C2A29] font-light">
              Join CLA
            </h1>
            <p className="mt-3 text-[13px] text-[#5C5A59]">
              Manage your bookings, treatments and member perks in one place.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-7 space-y-3.5" data-testid="register-form">
            {[
              { k: "name", label: "Full name", type: "text", placeholder: "Your name", testid: "register-name" },
              { k: "email", label: "Email", type: "email", placeholder: "you@email.com", testid: "register-email" },
              { k: "phone", label: "Phone", type: "tel", placeholder: "(555) 555-5555", testid: "register-phone" },
              { k: "password", label: "Password", type: "password", placeholder: "Minimum 6 characters", testid: "register-password" },
            ].map((f) => (
              <div key={f.k}>
                <label className="text-[11px] uppercase tracking-[0.24em] text-[#5C5A59] mb-2 block">
                  {f.label}
                </label>
                <input
                  data-testid={f.testid}
                  type={f.type}
                  required
                  value={form[f.k]}
                  onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                  placeholder={f.placeholder}
                  className="cla-input w-full bg-transparent border border-[#E5E1D8] rounded-xl px-4 py-3 text-[14px]"
                />
              </div>
            ))}

            {error && (
              <p data-testid="register-error" className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              data-testid="register-submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#2C2A29] text-white py-3.5 text-[12px] uppercase tracking-[0.24em] hover:bg-[#D4AF37] transition-colors disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
              ) : (
                <>
                  Create account <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[13px] text-[#5C5A59]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#B8932E] hover:underline" data-testid="register-to-login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
