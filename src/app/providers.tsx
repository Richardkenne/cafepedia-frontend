"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init("phc_3sSssFQfiIvIyC4nR2C6gIroExqzDzj7QLWQGClH38", {
      api_host: "https://us.i.posthog.com",
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
      session_recording: { maskAllInputs: false },
      enable_heatmaps: true,
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
