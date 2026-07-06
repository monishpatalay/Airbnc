import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import { useStaggerReveal } from "../lib/animations.js";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const listRef = useRef(null);

  useStaggerReveal(listRef, "[data-row]", [places]);

  useEffect(() => {
    axios
      .get("/user-places")
      .then((response) => setPlaces(response.data))
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  function askDelete(ev, id) {
    ev.preventDefault();
    ev.stopPropagation();
    setDeleteError("");
    setConfirmingId(id);
  }

  function cancelDelete(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    setConfirmingId(null);
  }

  async function confirmDelete(ev, id) {
    ev.preventDefault();
    ev.stopPropagation();
    setDeleteError("");
    setDeletingId(id);
    try {
      await axios.delete(`/places/${id}`);
      setPlaces((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setDeleteError("Couldn't delete this listing. Please try again.");
    } finally {
      setDeletingId(null);
      setConfirmingId(null);
    }
  }

  return (
    <div>
      <AccountNav />
      <div className="mt-8 flex flex-col items-center gap-4 text-center">
        <h1 className="font-display text-2xl">Your accommodations</h1>
        <Link
          className="inline-flex bg-primary gap-2 text-white py-2.5 px-5 rounded-full font-medium shadow-soft hover:bg-primary-dark hover:shadow-lifted transition-all"
          to="/account/places/new"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
            />
          </svg>
          Add new place
        </Link>
      </div>

      {deleteError && (
        <div className="max-w-lg mx-auto mt-6 rounded-2xl bg-primary-light text-primary-dark text-sm px-4 py-3 text-center">
          {deleteError}
        </div>
      )}

      <div ref={listRef} className="mt-8 space-y-4">
        {!loading && loadError && (
          <div className="text-center py-16 text-ink/50">
            We couldn&apos;t load your accommodations right now. Please try again in a moment.
          </div>
        )}
        {!loading && !loadError && places.length === 0 && (
          <div className="text-center py-16 text-ink/50">
            You haven&apos;t listed any places yet.
          </div>
        )}
        {places.map((place) => (
          <Link
            data-row
            key={place._id}
            to={"/account/places/" + place._id}
            className="border border-black/5 bg-white cursor-pointer rounded-2xl p-4 shadow-soft hover:shadow-lifted transition-shadow flex gap-4 items-center card-hover"
          >
            <div className="flex h-28 w-28 shrink-0 bg-surface-alt rounded-xl overflow-hidden">
              <PlaceImg place={place} />
            </div>
            <div className="grow-0 shrink min-w-0 flex-1">
              <h2 className="text-lg font-semibold truncate">{place.title}</h2>
              <p className="text-sm text-ink/50 mt-1 line-clamp-2">{place.description}</p>
              <p className="text-sm font-semibold mt-2">${place.price} <span className="text-ink/40 font-normal">/ night</span></p>
            </div>

            <div className="shrink-0 flex items-center gap-2 ml-auto pl-2">
              {confirmingId === place._id ? (
                <>
                  <span className="text-sm text-ink/60 hidden sm:inline">Delete?</span>
                  <button
                    type="button"
                    onClick={(ev) => confirmDelete(ev, place._id)}
                    disabled={deletingId === place._id}
                    className="text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-full px-3 py-2 min-h-11 transition-colors duration-150 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                  >
                    {deletingId === place._id ? "Deleting…" : "Confirm"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelDelete}
                    className="text-sm font-medium text-ink/60 hover:text-ink rounded-full px-3 py-2 min-h-11 transition-colors duration-150 active:scale-95"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  aria-label="Delete listing"
                  onClick={(ev) => askDelete(ev, place._id)}
                  className="grid place-items-center w-11 h-11 rounded-full text-ink/40 hover:text-primary hover:bg-primary-light transition-colors duration-150 active:scale-90 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
