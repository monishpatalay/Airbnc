import { useState, useEffect } from "react";
import axios from "axios";
import PhotosUploader from "../PhotosUploader.jsx";
import PerksPage from "../PerksPage.jsx";
import AccountNav from "../AccountNav.jsx";
import { Navigate, useParams } from "react-router-dom";

function Section({ title: heading, description: desc, children }) {
  return (
    <div className="bg-white rounded-3xl border border-black/5 shadow-soft p-6 mb-6">
      <h2 className="text-lg font-semibold">{heading}</h2>
      {desc && <p className="text-ink/50 text-sm mb-3">{desc}</p>}
      {children}
    </div>
  );
}

export default function PlacesFormPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState(false);
  const [price, setPrice] = useState(100);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let ignore = false;
    axios
      .get("/places/" + id)
      .then((response) => {
        if (ignore) return;
        const { data } = response;
        setTitle(data.title);
        setAddress(data.address);
        setDescription(data.description);
        setAddedPhotos(data.photos);
        setPerks(data.perks);
        setExtraInfo(data.extraInfo);
        setCheckIn(data.checkIn);
        setCheckOut(data.checkOut);
        setMaxGuests(data.maxGuests);
        setPrice(data.price);
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [id]);

  async function savePlace(ev) {
    ev.preventDefault();
    setSaving(true);
    const placeData = {
      title,
      address,
      description,
      addedPhotos,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };

    try {
      if (id) {
        await axios.put("/places", { id, ...placeData });
      } else {
        await axios.post("/places", { ...placeData });
      }
      setRedirect(true);
    } finally {
      setSaving(false);
    }
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace} className="max-w-3xl mx-auto mt-8">
        <Section title="Title" description="Give your place a catchy, memorable name">
          <label htmlFor="place-title" className="sr-only">Title</label>
          <input
            id="place-title"
            type="text"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            placeholder="Title"
          />
        </Section>

        <Section title="Address" description="Where is your place located?">
          <label htmlFor="place-address" className="sr-only">Address</label>
          <input
            id="place-address"
            type="text"
            value={address}
            onChange={(ev) => setAddress(ev.target.value)}
            placeholder="Address"
          />
        </Section>

        <Section title="Photos" description="More photos help guests picture themselves there">
          <PhotosUploader addedPhotos={addedPhotos} setAddedPhotos={setAddedPhotos} />
        </Section>

        <Section title="Description" description="Describe your place">
          <label htmlFor="place-description" className="sr-only">Description</label>
          <textarea
            id="place-description"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            placeholder="Description"
          />
        </Section>

        <Section title="Perks" description="Select all the perks of your place">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <PerksPage selected={perks} onChange={setPerks} />
          </div>
        </Section>

        <Section title="Extra information" description="House rules, etc.">
          <label htmlFor="place-extra-info" className="sr-only">Extra information</label>
          <textarea
            id="place-extra-info"
            value={extraInfo}
            onChange={(ev) => setExtraInfo(ev.target.value)}
            placeholder="Extra information"
          />
        </Section>

        <Section
          title="Check-in & check-out"
          description="Add check-in and check-out times, and allow time for cleaning between guests"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="place-checkin" className="text-xs font-semibold uppercase tracking-wide text-ink/40">Check-in time</label>
              <input
                id="place-checkin"
                type="text"
                value={checkIn}
                onChange={(ev) => setCheckIn(ev.target.value)}
                placeholder="14:00"
              />
            </div>
            <div>
              <label htmlFor="place-checkout" className="text-xs font-semibold uppercase tracking-wide text-ink/40">Check-out time</label>
              <input
                id="place-checkout"
                type="text"
                value={checkOut}
                onChange={(ev) => setCheckOut(ev.target.value)}
                placeholder="11:00"
              />
            </div>
            <div>
              <label htmlFor="place-max-guests" className="text-xs font-semibold uppercase tracking-wide text-ink/40">Max guests</label>
              <input
                id="place-max-guests"
                type="number"
                value={maxGuests}
                onChange={(ev) => setMaxGuests(ev.target.value)}
                placeholder="4"
              />
            </div>
            <div>
              <label htmlFor="place-price" className="text-xs font-semibold uppercase tracking-wide text-ink/40">Price per night</label>
              <input
                id="place-price"
                type="number"
                value={price}
                onChange={(ev) => setPrice(ev.target.value)}
                placeholder="100"
              />
            </div>
          </div>
        </Section>

        <button className="btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save place"}
        </button>
      </form>
    </div>
  );
}
