import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import PlaceImg from "./PlaceImg";
import { uploadUrl } from "./config.js";

export default function PlaceGallery({ place }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const overlayRef = useRef(null);

  function openPhotos() {
    setShowAllPhotos(true);
  }

  function closePhotos() {
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => setShowAllPhotos(false),
      });
    } else {
      setShowAllPhotos(false);
    }
  }

  useLayoutEffect(() => {
    if (showAllPhotos && overlayRef.current) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
    }
  }, [showAllPhotos]);

  if (showAllPhotos) {
    return (
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-ink text-white min-h-screen z-50 overflow-y-auto"
      >
        <div className="p-6 md:p-8 grid gap-4 max-w-6xl mx-auto">
          <div className="flex justify-between items-center sticky top-0 py-2">
            <h2 className="font-display text-2xl md:text-3xl">Photos of {place.title}</h2>
            <button
              type="button"
              onClick={closePhotos}
              className="flex gap-1 py-2 px-4 rounded-full shadow shadow-black/40 bg-white text-ink hover:bg-white/90 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
              Close
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-8">
            {place?.photos?.map((photo, index) => (
              <div key={index} className="rounded-2xl overflow-hidden">
                <PlaceImg
                  place={{ photos: [photo], title: place.title }}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto">
      <div className="grid grid-cols-3 gap-2 rounded-3xl overflow-hidden h-[320px] md:h-[500px]">
        {place.photos?.[0] && (
          <button
            type="button"
            onClick={openPhotos}
            className="col-span-2 h-full overflow-hidden group cursor-pointer"
          >
            <img
              src={uploadUrl(place.photos[0])}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              alt={`${place.title} photo 1`}
            />
          </button>
        )}

        <div className="grid grid-rows-2 gap-2 h-full">
          {place.photos?.[1] && (
            <button
              type="button"
              onClick={openPhotos}
              className="h-full overflow-hidden group cursor-pointer"
            >
              <img
                src={uploadUrl(place.photos[1])}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt={`${place.title} photo 2`}
              />
            </button>
          )}
          {place.photos?.[2] && (
            <button
              type="button"
              onClick={openPhotos}
              className="h-full overflow-hidden group cursor-pointer"
            >
              <img
                src={uploadUrl(place.photos[2])}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt={`${place.title} photo 3`}
              />
            </button>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={openPhotos}
        className="flex gap-1.5 items-center absolute bottom-4 right-4 py-2 px-4 bg-white rounded-full shadow-lifted text-sm font-medium hover:bg-white/90 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zM13.125 8.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
          />
        </svg>
        Show all photos
      </button>
    </div>
  );
}
