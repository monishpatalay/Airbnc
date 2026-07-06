import { useState } from "react";
import axios from "axios";
import { photoUrl } from "./config.js";

export default function PhotosUploader({ addedPhotos, setAddedPhotos }) {
  const [photoLink, setPhotoLink] = useState("");

  async function addPhotoByLink(ev) {
    ev.preventDefault();
    try {
      const { data: filename } = await axios.post("/upload-by-link", {
        link: photoLink,
      });
      setAddedPhotos((prev) => [...prev, filename]);
      setPhotoLink("");
    } catch (err) {
      console.error("Error uploading photo:", err);
    }
  }

  function uploadPhoto(ev) {
    const files = ev.target.files;
    const data = new FormData();

    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    axios
      .post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filenames } = response;
        setAddedPhotos((prev) => [...prev, ...filenames]);
      })
      .catch((err) => {
        console.error("Upload failed:", err);
      });
  }

  function removePhoto(ev, link) {
    ev.preventDefault();
    setAddedPhotos((prev) => prev.filter((l) => l !== link));

    axios
      .delete("/remove-photo", { data: { link } })
      .catch((err) => {
        console.error("Failed to delete photo on server:", err);
      });
  }

  function selectAsMainPhoto(ev, link) {
    ev.preventDefault();
    // Move the selected photo to the front of the array (flattened).
    const filtered = addedPhotos.filter((l) => l !== link);
    setAddedPhotos([link, ...filtered]);
    // Optionally, send a request to the server to update the main photo.
  }

  return (
    <>
      <div className="flex items-center gap-2 w-full max-w-md">
        <input
          type="text"
          value={photoLink}
          onChange={(ev) => setPhotoLink(ev.target.value)}
          placeholder="Add using a link ...jpg"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={addPhotoByLink}
          type="button"
          className="bg-gray-500 text-white px-4 py-2 rounded shadow"
        >
          Add Photo
        </button>
      </div>

      <div className="mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {addedPhotos.length > 0 &&
          addedPhotos.map((link) => (
            <div
              className="relative aspect-square overflow-hidden rounded-2xl"
              key={link}
            >
              <img
                className="w-full h-full object-cover rounded-2xl"
                src={photoUrl(link)}
                alt=""
              />

              {/* Trash Button */}
              <button
                onClick={(ev) => removePhoto(ev, link)}
                className="absolute bottom-2 right-2 bg-white/70 p-1 rounded-full cursor-pointer hover:bg-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21
                       c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673
                       a2.25 2.25 0 0 1-2.244 2.077H8.084
                       a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79
                       m14.456 0a48.108 48.108 0 0 0-3.478-.397
                       m-12 .562c.34-.059.68-.114 1.022-.165m0 0
                       a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916
                       c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0
                       c-1.18.037-2.09 1.022-2.09 2.201v.916
                       m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>

              {/* Star Button */}
              <button
                onClick={(ev) => selectAsMainPhoto(ev, link)}
                className="absolute bottom-2 left-2 bg-white/70 p-1 rounded-full cursor-pointer hover:bg-gray-200"
              >
                {link === addedPhotos[0] ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0
                         l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651
                         l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591
                         l4.069 2.485c.713.436 1.598-.207 1.404-1.02
                         l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65
                         l-4.752-.382-1.831-4.401Z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0
                         l2.125 5.111a.563.563 0 0 0 .475.345
                         l5.518.442c.499.04.701.663.321.988
                         l-4.204 3.602a.563.563 0 0 0-.182.557
                         l1.285 5.385a.562.562 0 0 1-.84.61
                         l-4.725-2.885a.562.562 0 0 0-.586 0
                         L6.982 20.54a.562.562 0 0 1-.84-.61
                         l1.285-5.386a.562.562 0 0 0-.182-.557
                         l-4.204-3.602a.562.562 0 0 1 .321-.988
                         l5.518-.442a.563.563 0 0 0 .475-.345
                         L11.48 3.5Z"
                    />
                  </svg>
                )}
              </button>
            </div>
          ))}

        {/* Upload button */}
        <label
          className="aspect-square flex items-center justify-center border rounded-2xl overflow-hidden text-gray-500 hover:text-gray-700 border-gray-300 shadow-md cursor-pointer"
        >
          <input type="file" className="hidden" onChange={uploadPhoto} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 mb-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 8.25H7.5
                 a2.25 2.25 0 0 0-2.25 2.25v9
                 a2.25 2.25 0 0 0 2.25 2.25h9
                 a2.25 2.25 0 0 0 2.25-2.25v-9
                 a2.25 2.25 0 0 0-2.25-2.25H15
                 m0-3-3-3m0 0-3 3m3-3V15"
            />
          </svg>
          <span className="text-sm">Upload</span>
        </label>
      </div>
    </>
  );
}
