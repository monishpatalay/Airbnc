export const API_URL = import.meta.env.VITE_API_URL || "https://ems-2-v9qq.onrender.com";

export function uploadUrl(filename) {
  return `${API_URL}/uploads/${filename}`;
}
