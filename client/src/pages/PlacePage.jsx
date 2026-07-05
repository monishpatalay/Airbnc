import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";

function PlacePageSkeleton() {
  return (
    <div className="mt-6 space-y-4">
      <div className="skeleton h-8 w-2/3 rounded-full" />
      <div className="skeleton h-5 w-1/3 rounded-full" />
      <div className="skeleton h-[320px] md:h-[500px] w-full rounded-3xl" />
    </div>
  );
}

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`/places/${id}`)
      .then((response) => {
        setPlace(response.data);
      })
      .catch(() => setLoadError(true));
  }, [id]);

  if (loadError) {
    return (
      <div className="text-center py-20 text-ink/50">
        We couldn&apos;t load this place right now. Please try again in a moment.
      </div>
    );
  }

  if (!place) return <PlacePageSkeleton />;

  return (
    <div className="mt-4">
      <h1 className="font-display text-3xl md:text-4xl">{place.title}</h1>
      <AddressLink className="mt-2">{place.address}</AddressLink>

      <div className="mt-6">
        <PlaceGallery place={place} />
      </div>

      <div className="mt-10 mb-8 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10 items-start">
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">About this place</h2>
            <p className="text-ink/70 leading-relaxed whitespace-pre-line">{place.description}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 rounded-2xl bg-surface-alt p-5 text-sm">
            <div>
              <div className="text-ink/40 uppercase tracking-wide text-xs font-semibold mb-1">Check-in</div>
              <div className="font-semibold">{place.checkIn}</div>
            </div>
            <div>
              <div className="text-ink/40 uppercase tracking-wide text-xs font-semibold mb-1">Check-out</div>
              <div className="font-semibold">{place.checkOut}</div>
            </div>
            <div>
              <div className="text-ink/40 uppercase tracking-wide text-xs font-semibold mb-1">Max guests</div>
              <div className="font-semibold">{place.maxGuests}</div>
            </div>
          </div>
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>

      {place.extraInfo && (
        <div className="bg-surface-alt -mx-5 sm:-mx-8 p-6 sm:p-8 rounded-3xl mb-8">
          <h2 className="text-xl font-semibold mb-2">Extra information</h2>
          <p className="text-sm text-ink/70 leading-relaxed whitespace-pre-line">{place.extraInfo}</p>
        </div>
      )}
    </div>
  );
}
