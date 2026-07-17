"use client";

import * as React from "react";

/**
 * ClientErrorGuard — turns two classes of benign, uninformative client errors
 * into graceful recovery instead of a dead "[object Event]" overlay:
 *
 *  1. Stale code chunks. After a redeploy (or a dev restart), an already-open
 *     tab references old <script>/<link> chunk hashes that no longer exist.
 *     Fetching them fails with a generic resource `error` Event — which is
 *     exactly what surfaces as "[object Event]". We reload once to pull the
 *     fresh chunks (one-shot guarded so it can never loop).
 *  2. "ResizeObserver loop" notifications — harmless, but noisy in dev. We let
 *     them pass without blocking.
 *
 * Anything else is left untouched and logged with real detail, so genuine
 * errors stay visible and debuggable.
 */

const CHUNK_RE =
  /(ChunkLoadError|Loading chunk [\w-]+ failed|Loading CSS chunk|Failed to fetch dynamically imported module|error loading dynamically imported module|React Client Manifest|__webpack_modules__\[moduleId\] is not a function|Failed to find Server Action|app-pages-browser)/i;
const RO_RE = /ResizeObserver loop/i;
const RELOAD_KEY = "ss:chunk-recovered";
const LAST_BUILD_KEY = "ss:last-build";

export function ClientErrorGuard() {
  React.useEffect(() => {
    // In development, a route can compile against a different manifest after a
    // large edit. Detect the changed Next build id before client navigation has
    // a chance to hydrate stale chunks, then refresh exactly once.
    const buildId = document.querySelector<HTMLScriptElement>("script#__NEXT_DATA__")?.textContent
      ? (() => {
          try {
            return JSON.parse(
              document.querySelector<HTMLScriptElement>("script#__NEXT_DATA__")!.textContent!
            ).buildId as string | undefined;
          } catch {
            return undefined;
          }
        })()
      : undefined;

    if (buildId) {
      try {
        const previousBuild = sessionStorage.getItem(LAST_BUILD_KEY);
        sessionStorage.setItem(LAST_BUILD_KEY, buildId);
        if (previousBuild && previousBuild !== buildId) {
          window.location.reload();
          return;
        }
      } catch {
        /* storage can be blocked */
      }
    }

    const recoverFromStaleChunks = () => {
      try {
        if (sessionStorage.getItem(RELOAD_KEY)) return; // already tried — don't loop
        sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
      } catch {
        /* storage blocked — fall through to a single reload */
      }
      window.location.reload();
    };

    // If the page survives a few seconds, clear the one-shot so a *future*
    // stale-chunk error (e.g. the next redeploy) can recover again too.
    const clearTimer = window.setTimeout(() => {
      try {
        sessionStorage.removeItem(RELOAD_KEY);
      } catch {
        /* ignore */
      }
    }, 5000);

    const onError = (e: Event) => {
      const ee = e as ErrorEvent;
      const msg = ee?.message || ee?.error?.message || "";

      if (CHUNK_RE.test(msg)) {
        e.preventDefault?.();
        e.stopImmediatePropagation?.();
        recoverFromStaleChunks();
        return;
      }
      if (RO_RE.test(msg)) {
        e.stopImmediatePropagation?.();
        return;
      }

      // Resource load failures fire a generic Event whose target is the element.
      // A failed code chunk (script/stylesheet) → recover; anything else just
      // gets logged so it isn't a silent "[object Event]".
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "SCRIPT" || tag === "LINK") {
        recoverFromStaleChunks();
        return;
      }
      if (target && target !== (window as unknown as EventTarget)) {
        console.warn("[ClientErrorGuard] resource error on", tag ?? target, target);
      }
    };

    const onRejection = (e: PromiseRejectionEvent) => {
      const reason = e?.reason as { message?: string } | string | undefined;
      const msg = typeof reason === "string" ? reason : reason?.message || "";
      if (CHUNK_RE.test(msg)) {
        e.preventDefault?.();
        recoverFromStaleChunks();
      }
    };

    // Capture phase so resource (script/link/img) errors, which don't bubble,
    // are still seen.
    window.addEventListener("error", onError, true);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.clearTimeout(clearTimer);
      window.removeEventListener("error", onError, true);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
