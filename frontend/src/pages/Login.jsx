import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import { useAuth, formatApiErrorDetail } from "@/contexts/AuthContext";
import { BRAND } from "@/lib/content";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from || null;
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.name.split(" ")[0]}`);
      nav(from || (data.role === "admin" ? "/admin" : "/portal"), { replace: true });
    } catch (err) {
      const msg = formatApiErrorDetail(err?.response?.data?.detail) || err.message;
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="flex items-center justify-center mb-8"
          data-testid="login-logo"
        >
          <img src={BRAND.logoUrl} alt="CLA" className="h-16 w-16 rounded-full object-contain" />
        </Link>

        <div className="rounded-3xl bg-white border border-[#E5E1D8] p-8 sm:p-10 shadow-[0_30px_80px_-50px_rgba(44,42,41,0.25)]">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#D4AF37]">
              Welcome back
            </p>
            <h1 className="mt-3 font-serif-display text-3xl sm:text-4xl text-[#2C2A29] font-light">
              Sign in
            </h1>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-4" data-testid="login-form">
            <div>
              <label className="text-[11px] uppercase tracking-[0.24em] text-[#5C5A59] mb-2 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8A39B]" strokeWidth={1.5} />
                <input
                  data-testid="login-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="cla-input w-full bg-transparent border border-[#E5E1D8] rounded-xl pl-11 pr-4 py-3 text-[14px]"
                  placeholder="you@email.com"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.24em] text-[#5C5A59] mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8A39B]" strokeWidth={1.5} />
                <input
                  data-testid="login-password"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="cla-input w-full bg-transparent border border-[#E5E1D8] rounded-xl pl-11 pr-4 py-3 text-[14px]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p data-testid="login-error" className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              data-testid="login-submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#2C2A29] text-white py-3.5 text-[12px] uppercase tracking-[0.24em] hover:bg-[#D4AF37] transition-colors disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
              ) : (
                <>
                  Sign in <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[13px] text-[#5C5A59]">
            New here?{" "}
            <Link to="/register" className="text-[#B8932E] hover:underline" data-testid="login-to-register">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
