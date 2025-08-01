"use client";

import { useEffect } from "react";

export const ServiceWorkerRegister = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }
  }, []);

  return null;
};
