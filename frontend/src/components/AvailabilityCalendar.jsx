import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, ArrowRight, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { scrollToId } from "@/lib/hooks";
import { API } from "@/contexts/AuthContext";

export default function AvailabilityCalendar() {
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ slots: [], available: [], note: "" });
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    if (!date) return;
    const d = format(date, "yyyy-MM-dd");
    setLoading(true);
    axios
      .get(`${API}/availability`, { params: { d } })
      .then((res) => setData(res.data || { slots: [], available: [] }))
      .catch(() => setData({ slots: [], available: [], note: "Couldn't load availability." }))
      .finally(() => setLoading(false));
  }, [date]);

  const useThisSlot = () => {
    if (!date || !selectedSlot) return;
    // Pre-fill localStorage so Booking form can read it
    sessionStorage.setItem(
      "cla_prefill",
      JSON.stringify({ date: format(date, "yyyy-MM-dd"), time: selectedSlot })
    );
    scrollToId("contact");
    // Notify the form to refresh from sessionStorage
    window.dispatchEvent(new Event("cla:prefill"));
  };

  return (
    <section
      data-testid="availability-section"
      className="relative bg-[#FAF9F6] py-20 sm:py-24 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5 reveal">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#D4AF37]" />
              <span className="text-[11px] uppercase tracking-[0.32em] text-[#D4AF37]">
                Live Availability
              </span>
            </div>
            <h2 className="mt-5 font-serif-display font-light text-[34px] sm:text-[40px] md:text-5xl lg:text-[56px] leading-[1.05] tracking-tight text-[#2C2A29]">
              Choose your{" "}
              <em className="italic text-shimmer">date</em>.
            </h2>
            <p className="mt-6 text-[15px] md:text-[17px] leading-relaxed text-[#5C5A59] font-light max-w-md">
              Pick a date to see open time slots in real time. Tap one and we'll
              pre-fill the booking form for you below.
            </p>

            <div className="mt-7 inline-flex items-center gap-2 text-[12px] text-[#5C5A59] bg-white border border-[#E5E1D8] rounded-full px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Hours: Mon–Fri 10am–8pm · Sat 9am–6pm · Sun by appt.
            </div>
          </div>

          <div className="lg:col-span-7 reveal">
            <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
              <div className="rounded-3xl bg-white border border-[#E5E1D8] p-4 sm:p-5">
                <div className="flex items-center gap-2 px-2 mb-3">
                  <CalendarIcon className="h-4 w-4 text-[#B8932E]" strokeWidth={1.5} />
                  <span className="text-[11px] uppercase tracking-[0.24em] text-[#5C5A59]">
                    Select date
                  </span>
                </div>
                <Calendar
                  data-testid="availability-calendar"
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  className="rounded-md"
                />
              </div>

              <div className="rounded-3xl bg-white border border-[#E5E1D8] p-5 min-h-[300px]">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-[#B8932E]" strokeWidth={1.5} />
                  <span className="text-[11px] uppercase tracking-[0.24em] text-[#5C5A59]">
                    Available slots
                  </span>
                </div>

                {!date && (
                  <p className="mt-6 text-[14px] text-[#5C5A59]">
                    Choose a date to view available times.
                  </p>
                )}
                {date && loading && (
                  <div className="mt-6 flex items-center gap-2 text-[#5C5A59]">
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} /> Loading…
                  </div>
                )}
                {date && !loading && (
                  <>
                    {data.note && (
                      <p className="mb-3 text-[12px] text-[#B8932E] italic">{data.note}</p>
                    )}
                    {data.available?.length === 0 ? (
                      <p className="text-[13px] text-[#5C5A59]">
                        No open slots on this day. Try another date or{" "}
                        <a href="tel:5166209158" className="text-[#B8932E] hover:underline">
                          call us
                        </a>
                        .
                      </p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {data.available.map((slot) => (
                          <button
                            key={slot}
                            data-testid={`avail-slot-${slot}`}
                            onClick={() => setSelectedSlot(slot)}
                            className={`text-[12px] rounded-full px-2 py-2 border transition-all ${
                              selectedSlot === slot
                                ? "bg-[#2C2A29] text-white border-[#2C2A29]"
                                : "bg-white text-[#2C2A29] border-[#E5E1D8] hover:border-[#D4AF37] hover:text-[#B8932E]"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    )}
                    {selectedSlot && (
                      <button
                        onClick={useThisSlot}
                        data-testid="avail-use-slot"
                        className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] text-white py-3 text-[12px] uppercase tracking-[0.22em] hover:bg-[#C5A059] transition-colors"
                      >
                        Continue to booking
                        <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
