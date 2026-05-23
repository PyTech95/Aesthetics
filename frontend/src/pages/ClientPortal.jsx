import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import { ArrowLeft, LogOut, Calendar, Sparkles, X, Phone, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth, API } from "@/contexts/AuthContext";
import { BRAND } from "@/lib/content";

const STATUS_COLORS = {
  new: "bg-[#D4AF37] text-white",
  confirmed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  contacted: "bg-blue-100 text-blue-700 border border-blue-200",
  completed: "bg-stone-200 text-stone-700",
  cancelled: "bg-red-100 text-red-700 border border-red-200",
};

export default function ClientPortal() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/bookings/mine`);
      setBookings(data || []);
    } catch {
      toast.error("Couldn't load your bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancelBooking = async (id) => {
    try {
      await axios.patch(`${API}/bookings/${id}?status=cancelled`);
      toast.success("Booking cancelled");
      setBookings((p) => p.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
    } catch {
      toast.error("Couldn't cancel that booking");
    }
  };

  const upcoming = bookings.filter(
    (b) => b.status !== "cancelled" && b.status !== "completed"
  );
  const past = bookings.filter(
    (b) => b.status === "cancelled" || b.status === "completed"
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <header className="border-b border-[#E5E1D8] bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.24em] text-[#5C5A59] hover:text-[#2C2A29]">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> Back to site
          </Link>
          <div className="font-serif-display text-lg text-[#2C2A29]">My Portal</div>
          <button
            onClick={logout}
            data-testid="portal-logout"
            className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.24em] text-[#5C5A59] hover:text-[#B8932E]"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} /> Sign out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#D4AF37]">
              Welcome
            </p>
            <h1 className="mt-3 font-serif-display text-4xl sm:text-5xl text-[#2C2A29] font-light">
              Hello, <em className="italic text-shimmer">{user?.name?.split(" ")[0]}</em>.
            </h1>
            <p className="mt-2 text-[14px] text-[#5C5A59]">
              {bookings.length} bookings on record · {upcoming.length} upcoming
            </p>
          </div>
          <Link
            to="/#contact"
            data-testid="portal-book-new"
            className="self-start inline-flex items-center gap-2 rounded-full bg-[#2C2A29] text-white px-6 py-3 text-[12px] uppercase tracking-[0.24em] hover:bg-[#D4AF37] transition-colors"
          >
            <Calendar className="h-4 w-4" strokeWidth={1.5} /> Book new
          </Link>
        </div>

        {/* Upcoming */}
        <section className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-[#D4AF37]" strokeWidth={1.5} />
            <h2 className="font-serif-display text-2xl text-[#2C2A29]">Upcoming</h2>
          </div>
          <div className="rounded-2xl border border-[#E5E1D8] bg-white overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F5F2EA] hover:bg-[#F5F2EA]">
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-[#5C5A59]">
                      Loading…
                    </TableCell>
                  </TableRow>
                )}
                {!loading && upcoming.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-[#5C5A59]">
                      No upcoming bookings. Book your next visit from the home page.
                    </TableCell>
                  </TableRow>
                )}
                {upcoming.map((b) => (
                  <TableRow key={b.id} data-testid={`portal-upcoming-${b.id}`}>
                    <TableCell className="font-serif-display text-lg text-[#2C2A29]">
                      {b.service}
                    </TableCell>
                    <TableCell>{b.preferred_date}</TableCell>
                    <TableCell>{b.preferred_time}</TableCell>
                    <TableCell>
                      <Badge className={`uppercase tracking-[0.18em] text-[10px] px-2.5 py-1 ${STATUS_COLORS[b.status] || ""}`}>
                        {b.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => cancelBooking(b.id)}
                        data-testid={`portal-cancel-${b.id}`}
                        className="text-[12px] uppercase tracking-[0.18em] text-red-600 hover:text-red-700 inline-flex items-center gap-1"
                      >
                        <X className="h-3.5 w-3.5" strokeWidth={1.5} /> Cancel
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* History */}
        {past.length > 0 && (
          <section className="mt-12">
            <h2 className="font-serif-display text-2xl text-[#2C2A29] mb-4">
              History
            </h2>
            <div className="rounded-2xl border border-[#E5E1D8] bg-white overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F5F2EA] hover:bg-[#F5F2EA]">
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {past.map((b) => (
                    <TableRow key={b.id} className="text-[#5C5A59]">
                      <TableCell className="font-serif-display text-lg text-[#2C2A29]">{b.service}</TableCell>
                      <TableCell>{b.preferred_date} · {b.preferred_time}</TableCell>
                      <TableCell>
                        <Badge className={`uppercase tracking-[0.18em] text-[10px] px-2.5 py-1 ${STATUS_COLORS[b.status] || ""}`}>
                          {b.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        )}

        {/* Contact card */}
        <section className="mt-14 grid sm:grid-cols-2 gap-4">
          <a
            href={`tel:${BRAND.phoneRaw}`}
            className="rounded-2xl bg-white border border-[#E5E1D8] p-5 hover-lift flex items-center gap-4"
          >
            <span className="h-11 w-11 rounded-full bg-[#F2E8DF] grid place-items-center">
              <Phone className="h-4 w-4 text-[#B8932E]" strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#5C5A59]">Need to talk?</p>
              <p className="font-serif-display text-xl text-[#2C2A29]">{BRAND.phone}</p>
            </div>
          </a>
          <div className="rounded-2xl bg-white border border-[#E5E1D8] p-5 flex items-center gap-4">
            <span className="h-11 w-11 rounded-full bg-[#F2E8DF] grid place-items-center">
              <MapPin className="h-4 w-4 text-[#B8932E]" strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#5C5A59]">Studio</p>
              <p className="font-serif-display text-base text-[#2C2A29]">{BRAND.address}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
