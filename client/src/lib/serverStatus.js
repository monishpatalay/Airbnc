import axios from "axios";
import { useEffect, useState } from "react";

// The API runs on Render's free tier, which spins the service down after
// ~15 minutes idle. The next request has to cold-start the container, which
// can take 30-60s and blows past a normal request timeout, surfacing as a
// network error even though the server is fine — it's just not awake yet.
//
// This module retries idempotent (GET) requests through that boot window
// instead of failing immediately, and exposes a "waking" flag so the UI can
// explain the wait instead of showing a bare error.

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 4000;

let waking = false;
const listeners = new Set();

function setWaking(value) {
  if (waking === value) return;
  waking = value;
  listeners.forEach((listener) => listener(waking));
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// A cold-start failure has no response at all (connection refused/timeout
// while Render boots the container) — that's distinct from the server being
// up and returning a real 4xx/5xx, which should surface immediately.
function isColdStartError(error) {
  return !error.response;
}

export function installColdStartRetry() {
  axios.interceptors.response.use(
    (response) => {
      setWaking(false);
      return response;
    },
    async (error) => {
      const config = error.config || {};
      const isGet = (config.method || "get").toLowerCase() === "get";
      const retryCount = config.__retryCount || 0;

      // Only auto-retry GETs: retrying a POST/PUT/DELETE blindly risks
      // double-submitting (e.g. a duplicate booking) if the request actually
      // reached the server and only the response was lost.
      if (!isGet || !isColdStartError(error) || retryCount >= MAX_RETRIES) {
        setWaking(false);
        return Promise.reject(error);
      }

      config.__retryCount = retryCount + 1;
      setWaking(true);
      await wait(RETRY_DELAY_MS * config.__retryCount);
      return axios(config);
    }
  );
}

export function useServerWaking() {
  const [isWaking, setIsWaking] = useState(waking);

  useEffect(() => {
    listeners.add(setIsWaking);
    return () => listeners.delete(setIsWaking);
  }, []);

  return isWaking;
}
