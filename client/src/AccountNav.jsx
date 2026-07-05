import { Link, useLocation } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const TABS = [
  {
    key: "profile",
    label: "My Profile",
    to: "/account/profile",
    icon: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
    fill: false,
  },
  {
    key: "bookings",
    label: "My Bookings",
    to: "/account/bookings",
    icon: "M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12A.75.75 0 0 1 7.5 12Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z",
    fill: true,
  },
  {
    key: "places",
    label: "My Accommodations",
    to: "/account/places",
    icon: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21",
    fill: false,
  },
];

export default function AccountNav() {
  const { pathname } = useLocation();
  let subpage = pathname.split("/")?.[2] || "profile";

  const containerRef = useRef(null);
  const pillRef = useRef(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const pill = pillRef.current;
    if (!container || !pill) return;
    const activeEl = container.querySelector(`[data-key="${subpage}"]`);
    if (!activeEl) return;

    const { left: cLeft, top: cTop } = container.getBoundingClientRect();
    const { left, width, height, top } = activeEl.getBoundingClientRect();

    gsap.to(pill, {
      x: left - cLeft,
      y: top - cTop,
      width,
      height,
      duration: 0.45,
      ease: "power3.out",
    });
  }, [subpage]);

  return (
    <nav
      ref={containerRef}
      className="relative w-full flex justify-center gap-2 mt-8 flex-wrap"
    >
      <div
        ref={pillRef}
        className="absolute left-0 top-0 rounded-full bg-primary shadow-soft -z-0"
        style={{ width: 0, height: 0 }}
      />
      {TABS.map((tab) => {
        const isActive = tab.key === subpage;
        return (
          <Link
            key={tab.key}
            data-key={tab.key}
            className={
              "relative z-10 inline-flex gap-1.5 items-center py-2.5 px-6 rounded-full font-medium text-sm transition-colors duration-300 " +
              (isActive ? "text-white" : "text-ink/60 hover:text-ink")
            }
            to={tab.to}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={tab.fill ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={tab.fill ? undefined : 1.5}
              stroke={tab.fill ? undefined : "currentColor"}
              className="size-5"
            >
              <path
                strokeLinecap={tab.fill ? undefined : "round"}
                strokeLinejoin={tab.fill ? undefined : "round"}
                fillRule={tab.fill ? "evenodd" : undefined}
                clipRule={tab.fill ? "evenodd" : undefined}
                d={tab.icon}
              />
            </svg>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
