import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "sonner";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const STATUS_COLORS = {
  new: "bg-[#D4AF37] text-white",
  confirmed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  contacted: "bg-blue-100 text-blue-700 border border-blue-200",
  completed: "bg-stone-200 text-stone-700",
  cancelled: "bg-red-100 text-red-700 border border-red-200",
};

export default function Admin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/bookings`);
      setBookings(res.data || []);
    } catch (e) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/bookings/${id}?status=${status}`);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error("Update failed");
    }
  };

  const visible =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const counts = bookings.reduce(
    (acc, b) => ({ ...acc, [b.status]: (acc[b.status] || 0) + 1 }),
    {}
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <header className="border-b border-[#E5E1D8] bg-white/70 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
          <Link
            to="/"
            data-testid="admin-back-home"
            className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.24em] text-[#5C5A59] hover:text-[#2C2A29]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> Back to site
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-serif-display text-xl text-[#2C2A29]">
              CLA — Bookings
            </span>
          </div>
          <button
            onClick={load}
            data-testid="admin-refresh"
            className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.24em] text-[#5C5A59] hover:text-[#B8932E]"
          >
            <RefreshCcw className="h-4 w-4" strokeWidth={1.5} /> Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="font-serif-display text-4xl md:text-5xl text-[#2C2A29] font-light">
              Booking requests
            </h1>
            <p className="mt-2 text-[14px] text-[#5C5A59]">
              {bookings.length} total · {counts.new || 0} new · {counts.confirmed || 0} confirmed
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.24em] text-[#5C5A59]">
              Filter
            </span>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger
                data-testid="admin-filter"
                className="w-[180px] bg-white border-[#E5E1D8] h-11"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-[#E5E1D8] bg-white overflow-hidden">
          <Table data-testid="admin-bookings-table">
            <TableHeader>
              <TableRow className="bg-[#F5F2EA] hover:bg-[#F5F2EA]">
                <TableHead>Client</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date / Time</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-[#5C5A59]">
                    Loading…
                  </TableCell>
                </TableRow>
              )}
              {!loading && visible.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-[#5C5A59]">
                    No bookings yet.
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                visible.map((b) => (
                  <TableRow key={b.id} data-testid={`admin-row-${b.id}`}>
                    <TableCell>
                      <p className="font-serif-display text-lg text-[#2C2A29]">
                        {b.name}
                      </p>
                      {b.notes && (
                        <p className="mt-1 text-[12px] text-[#5C5A59] max-w-xs line-clamp-2">
                          {b.notes}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-[14px] text-[#2C2A29]">
                      {b.service}
                    </TableCell>
                    <TableCell className="text-[14px] text-[#2C2A29]">
                      <p>{b.preferred_date}</p>
                      <p className="text-[#5C5A59]">{b.preferred_time}</p>
                    </TableCell>
                    <TableCell className="text-[13px] text-[#5C5A59]">
                      <a
                        href={`tel:${b.phone}`}
                        className="block text-[#2C2A29] hover:text-[#B8932E]"
                      >
                        {b.phone}
                      </a>
                      <a
                        href={`mailto:${b.email}`}
                        className="block hover:text-[#B8932E]"
                      >
                        {b.email}
                      </a>
                    </TableCell>
                    <TableCell className="text-[12px] text-[#5C5A59]">
                      {(() => {
                        try {
                          return format(new Date(b.created_at), "MMM d, h:mm a");
                        } catch {
                          return b.created_at;
                        }
                      })()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`uppercase tracking-[0.18em] text-[10px] px-2.5 py-1 ${
                            STATUS_COLORS[b.status] || ""
                          }`}
                        >
                          {b.status}
                        </Badge>
                        <Select
                          value={b.status}
                          onValueChange={(v) => updateStatus(b.id, v)}
                        >
                          <SelectTrigger
                            data-testid={`admin-status-${b.id}`}
                            className="w-[140px] h-9 bg-white border-[#E5E1D8] text-[12px]"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
