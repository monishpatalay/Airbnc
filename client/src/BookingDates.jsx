import { differenceInCalendarDays, format } from "date-fns";

export default function BookingDates({ booking, className }) {
  return (
    <div className={"flex flex-wrap items-center gap-2 text-sm " + className}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>
      <span className="font-semibold">
        {differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn))} nights
      </span>
      <span className="inline-flex items-center gap-1 bg-surface-alt rounded-full px-3 py-1">
        {format(new Date(booking.checkIn), "MMM d, yyyy")}
      </span>
      <span className="text-ink/30">&rarr;</span>
      <span className="inline-flex items-center gap-1 bg-surface-alt rounded-full px-3 py-1">
        {format(new Date(booking.checkOut), "MMM d, yyyy")}
      </span>
    </div>
  );
}
