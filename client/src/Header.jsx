import { Link } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import gsap from "gsap";
import { UserContext } from "./UserContext";
import { useEntranceReveal } from "./lib/animations";

export default function Header() {
  const { user } = useContext(UserContext);
  const headerRef = useRef(null);

  useEntranceReveal(headerRef, { y: -12, duration: 0.6 });

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    function onScroll() {
      const scrolled = window.scrollY > 8;
      gsap.to(el, {
        boxShadow: scrolled
          ? "0 8px 24px -12px rgb(34 28 43 / 0.18)"
          : "0 0 0 0 rgb(34 28 43 / 0)",
        duration: 0.3,
        ease: "power2.out",
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-black/5"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex justify-between items-center gap-4">
        <Link to={"/"} className="flex items-center gap-2 shrink-0 group">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-primary text-white shadow-soft transition-transform duration-300 group-hover:-rotate-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3.75c-4.09 5.19-6.25 8.77-6.25 11.5a6.25 6.25 0 0012.5 0c0-2.73-2.16-6.31-6.25-11.5z"
              />
            </svg>
          </span>
          <span className="font-display font-semibold text-xl tracking-tight hidden xs:inline">
            Airbnc
          </span>
        </Link>

        <div className="hidden md:flex flex-1 max-w-md border border-black/10 items-center rounded-full py-2 px-2 gap-1 shadow-soft bg-white hover:shadow-lifted transition-shadow duration-300">
          <button className="flex-1 text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-black/5 transition-colors">
            Anywhere
          </button>
          <span className="w-px h-5 bg-black/10" />
          <button className="flex-1 text-sm font-medium text-ink/60 px-4 py-1.5 rounded-full hover:bg-black/5 transition-colors">
            Any week
          </button>
          <span className="w-px h-5 bg-black/10" />
          <button className="flex-1 text-sm font-medium text-ink/60 px-4 py-1.5 rounded-full hover:bg-black/5 transition-colors text-left">
            Add guests
          </button>
          <button
            aria-label="Search"
            className="grid place-items-center bg-primary rounded-full p-2 text-white shadow-soft hover:bg-primary-dark transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <Link
          to={user ? "/account" : "/login"}
          className="flex items-center gap-2 border border-black/10 rounded-full py-1.5 pl-3 pr-1.5 shadow-soft bg-white hover:shadow-lifted transition-shadow duration-300 shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5 text-ink/70"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>

          <div className="bg-ink rounded-full text-white overflow-hidden grid place-items-center w-8 h-8 text-sm font-semibold">
            {user?.name ? user.name.charAt(0).toUpperCase() : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5 relative top-0.5"
              >
                <path
                  fillRule="evenodd"
                  d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          {!!user && (
            <span className="pr-2 text-sm font-medium hidden sm:inline">{user.name}</span>
          )}
        </Link>
      </div>
    </header>
  );
}
