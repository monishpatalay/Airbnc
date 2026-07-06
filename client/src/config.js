export const API_URL = import.meta.env.VITE_API_URL || "https://airbnc-api.onrender.com";

export function uploadUrl(filename) {
  return `${API_URL}/uploads/${filename}`;
}

export function photoUrl(value) {
  if (!value) return value;
  return value.startsWith("http") ? value : uploadUrl(value);
}
