import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../Image.jsx";
import { useEntranceReveal, useStaggerReveal } from "../lib/animations.js";

function PlaceCardSkeleton() {
  return (
    <div>
      <div className="skeleton mb-3 rounded-2xl aspect-square" />
      <div className="skeleton h-3.5 w-3/4 rounded-full mb-2" />
      <div className="skeleton h-3 w-1/2 rounded-full" />
    </div>
  );
}

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const heroRef = useRef(null);
  const gridRef = useRef(null);

  useEntranceReveal(heroRef, { y: 24, duration: 0.8 });
  useStaggerReveal(gridRef, "[data-card]", [places]);

  useEffect(() => {
    axios
      .get("/places")
      .then((response) => {
        setPlaces([...response.data]);
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section ref={heroRef} className="pt-10 pb-8 md:pt-14 md:pb-10">
        <p className="text-primary font-semibold tracking-wide uppercase text-xs mb-3">
          Stays worth the trip
        </p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight max-w-2xl">
          Find a place that feels like <span className="italic text-primary">home</span>, wherever you land.
        </h1>
      </section>

      <div
        ref={gridRef}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10"
      >
        {loading &&
          Array.from({ length: 8 }).map((_, i) => <PlaceCardSkeleton key={i} />)}

        {!loading && loadError && (
          <div className="col-span-full text-center py-20 text-ink/50">
            We couldn&apos;t reach the server right now. Please try again in a moment.
          </div>
        )}

        {!loading && !loadError && places.length === 0 && (
          <div className="col-span-full text-center py-20 text-ink/50">
            No places have been listed yet.
          </div>
        )}

        {!loading &&
          places.map((place) => (
            <Link
              data-card
              to={`/place/` + place._id}
              key={place._id}
              className="group block"
            >
              <div className="bg-surface-alt mb-3 rounded-2xl overflow-hidden aspect-square relative">
                {place.photos?.[0] && (
                  <Image
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    src={place.photos?.[0]}
                    alt={place.title || ""}
                  />
                )}
                <span className="absolute top-3 right-3 grid place-items-center w-8 h-8 rounded-full bg-white/80 backdrop-blur text-ink/60 shadow-soft opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </span>
              </div>
              <h2 className="font-semibold text-[15px] leading-snug truncate">{place.address}</h2>
              <h3 className="text-sm text-ink/50 truncate">{place.title}</h3>
              <div className="mt-1.5">
                <span className="font-semibold">${place.price}</span>
                <span className="text-ink/50"> / night</span>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
