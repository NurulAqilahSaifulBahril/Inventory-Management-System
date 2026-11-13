"use client";

import { useEffect, useState } from "react";

// A job's PV drawing shown as a picture, so it also appears in the downloaded report PDF.
// The file is fetched through this site (/api/warehouse/drawing); a PDF drawing shows its
// first page. If it cannot be read, the drawing is shown the old way (embedded), which the
// screen shows but the PDF download cannot include.

type State = { kind: "loading" } | { kind: "image"; src: string } | { kind: "failed" };

async function pdfFirstPage(bytes: ArrayBuffer): Promise<string> {
  const { getDocumentProxy } = await import("unpdf");
  const pdf = await getDocumentProxy(new Uint8Array(bytes));
  const page = await pdf.getPage(1);
  // Sharp enough for an A4 report: about 1600 px across.
  const base = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({ scale: Math.min(3, 1600 / base.width) });
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("No canvas");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  // "print" draws the page in one go; the screen mode waits on the browser's animation frames,
  // which stop while the tab is in the background.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const task = page.render({ canvas, canvasContext: context, viewport, intent: "print" } as any);
  // Never wait forever: after 15 s the drawing falls back to the embedded view.
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      task.promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          task.cancel();
          reject(new Error("The drawing took too long to draw."));
        }, 15000);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
    // Free the PDF's memory where this version supports it.
    void (pdf as { destroy?: () => Promise<void> }).destroy?.();
  }
  return canvas.toDataURL("image/jpeg", 0.9);
}

export function PvDrawingImage({
  jobSourceId,
  url,
  label,
  style,
}: {
  jobSourceId: string;
  url: string;
  label: string;
  style?: React.CSSProperties;
}) {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    let objectUrl = "";
    (async () => {
      try {
        const res = await fetch(
          `/api/warehouse/drawing?job=${encodeURIComponent(jobSourceId)}&url=${encodeURIComponent(url)}`,
          { credentials: "same-origin" },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const type = res.headers.get("content-type") ?? "";
        const bytes = await res.arrayBuffer();
        let src: string;
        if (type.includes("pdf") || url.toLowerCase().includes(".pdf")) {
          src = await pdfFirstPage(bytes);
        } else {
          objectUrl = URL.createObjectURL(new Blob([bytes], { type: type || "image/png" }));
          src = objectUrl;
        }
        if (!cancelled) setState({ kind: "image", src });
      } catch (error) {
        console.error("PV drawing could not be shown as a picture", error);
        if (!cancelled) setState({ kind: "failed" });
      }
    })();
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [jobSourceId, url]);

  if (state.kind === "loading") {
    return <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 10px" }}>Loading drawing…</p>;
  }
  if (state.kind === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={state.src}
        alt={label}
        style={{ display: "block", maxWidth: "100%", maxHeight: "340px", width: "auto", height: "auto", margin: "0 auto 10px", ...style }}
      />
    );
  }
  // Fallback: the drawing as before (visible on screen only).
  return url.toLowerCase().includes(".pdf") ? (
    <iframe
      title={label}
      src={url}
      referrerPolicy="no-referrer"
      style={{ width: "100%", height: "260px", border: "1px solid #e5e7eb", borderRadius: "8px", marginBottom: "10px" }}
    />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={label}
      referrerPolicy="no-referrer"
      style={{ display: "block", maxWidth: "55%", maxHeight: "260px", width: "auto", height: "auto", marginBottom: "10px" }}
    />
  );
}
