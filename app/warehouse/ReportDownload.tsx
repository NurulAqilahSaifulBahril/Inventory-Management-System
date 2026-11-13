"use client";

import { useState, type MouseEvent } from "react";
import styles from "./warehouse.module.css";

// Saves a report pop-up as an A4 PDF. The report is the pop-up (role="dialog") the button sits
// in. It is copied into a hidden page laid out at A4 width with no screen zoom, so the PDF is
// the same on a phone, a laptop or a big (zoomed) monitor: nothing is cut off at the side and
// the tables fill the page width. Buttons (Close, Print, Download, ...) are left out, and the
// whole report is included even when the pop-up is scrolled. Long reports run over several
// pages, or are shrunk onto one (onePage). The PDF libraries load only when the button is pressed.

// Width of the report on paper, in screen pixels (A4 at 96 dpi is 794 px).
const PAPER_WIDTH_PX = 794;

// A copy of the report laid out for paper, attached out of sight; remove() takes it away.
function paperCopy(report: HTMLElement): { copy: HTMLElement; remove: () => void } {
  const copy = report.cloneNode(true) as HTMLElement;
  // Typed-in values are not part of a copy: carry them over. Empty boxes print blank.
  const from = report.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input, textarea, select");
  const to = copy.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input, textarea, select");
  to.forEach((field, i) => {
    const source = from[i];
    if (!source) return;
    if (field instanceof HTMLInputElement && (field.type === "checkbox" || field.type === "radio")) {
      field.checked = (source as HTMLInputElement).checked;
      if (field.checked) field.setAttribute("checked", "");
    } else if (field instanceof HTMLTextAreaElement) {
      field.textContent = source.value;
    } else if (field instanceof HTMLSelectElement) {
      field.value = source.value;
    } else {
      field.setAttribute("value", source.value);
    }
    if ("placeholder" in field) field.placeholder = "";
  });
  // Pictures drawn on a canvas are not copied either: keep them as images.
  const canvases = report.querySelectorAll("canvas");
  copy.querySelectorAll("canvas").forEach((canvas, i) => {
    const img = document.createElement("img");
    try {
      img.src = canvases[i].toDataURL("image/png");
    } catch {
      return;
    }
    img.style.cssText = canvas.style.cssText;
    canvas.replaceWith(img);
  });
  copy.querySelectorAll("button, [data-pdf-skip]").forEach((el) => el.remove());
  copy.removeAttribute("role");
  copy.removeAttribute("aria-modal");
  Object.assign(copy.style, {
    position: "static",
    width: `${PAPER_WIDTH_PX}px`,
    maxWidth: "none",
    minWidth: "0",
    height: "auto",
    maxHeight: "none",
    overflow: "visible",
    margin: "0",
    padding: "28px 32px",
    transform: "none",
    boxShadow: "none",
    border: "none",
    borderRadius: "0",
    background: "#ffffff",
    boxSizing: "border-box",
  } satisfies Partial<CSSStyleDeclaration>);
  // Out of sight, outside the page (so no screen zoom applies), at A4 width.
  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText = `position:absolute;left:-${PAPER_WIDTH_PX + 200}px;top:0;width:${PAPER_WIDTH_PX}px;background:#fff;zoom:1;pointer-events:none;`;
  host.appendChild(copy);
  document.body.appendChild(host);
  return { copy, remove: () => host.remove() };
}

// Waits until every picture in the copy has loaded (a broken one is skipped).
async function picturesReady(root: HTMLElement): Promise<void> {
  await Promise.all(
    Array.from(root.querySelectorAll("img")).map((img) =>
      img.complete && img.naturalWidth > 0 ? Promise.resolve() : img.decode().catch(() => undefined),
    ),
  );
}

// onePage: shrink the report to fit a single A4 page instead of running over several.
export async function downloadReportPdf(report: HTMLElement, fileName: string, onePage = false): Promise<void> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
  const { copy, remove } = paperCopy(report);
  let canvas: HTMLCanvasElement;
  try {
    await picturesReady(copy);
    if (onePage) {
      // A tall report shrunk onto one page would leave wide empty margins. Lay it out wider
      // (tables stretch, the height barely changes) until its shape matches the page.
      const pageShape = (297 - 20) / (210 - 20);
      for (let w = PAPER_WIDTH_PX; w <= 1400 && copy.scrollHeight / copy.scrollWidth > pageShape; w += 60) {
        copy.style.width = `${w}px`;
        if (copy.parentElement) copy.parentElement.style.width = `${w}px`;
      }
    }
    const width = copy.scrollWidth;
    const height = copy.scrollHeight;
    canvas = await html2canvas(copy, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      width,
      height,
      scrollX: 0,
      scrollY: 0,
      windowWidth: Math.max(document.documentElement.clientWidth, width + 400),
      windowHeight: Math.max(document.documentElement.clientHeight, height + 100),
    });
  } finally {
    remove();
  }

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const margin = 10;
  const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2;
  const pageHeight = pdf.internal.pageSize.getHeight() - margin * 2;
  if (onePage) {
    // Whole report on one page: full width when it fits, else scaled down (centred) to the
    // page height so nothing is cut off.
    const fullHeight = (canvas.height * pageWidth) / canvas.width;
    const scale = Math.min(1, pageHeight / fullHeight);
    const width = pageWidth * scale;
    const height = fullHeight * scale;
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", margin + (pageWidth - width) / 2, margin, width, height);
    pdf.save(fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`);
    return;
  }
  // How many canvas pixels fit on one PDF page.
  const pxPerMm = canvas.width / pageWidth;
  const slicePx = Math.floor(pageHeight * pxPerMm);
  for (let top = 0, page = 0; top < canvas.height; top += slicePx, page += 1) {
    const height = Math.min(slicePx, canvas.height - top);
    const slice = document.createElement("canvas");
    slice.width = canvas.width;
    slice.height = height;
    const ctx = slice.getContext("2d");
    if (!ctx) break;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, slice.width, slice.height);
    ctx.drawImage(canvas, 0, top, canvas.width, height, 0, 0, canvas.width, height);
    if (page > 0) pdf.addPage();
    pdf.addImage(slice.toDataURL("image/jpeg", 0.92), "JPEG", margin, margin, pageWidth, height / pxPerMm);
  }
  pdf.save(fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`);
}

// A file name made from the report's name and date, e.g. "Transfer-Report-TRF-0012-2026-11-13".
export function reportFileName(...parts: Array<string | undefined | null>): string {
  const today = new Date();
  const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  // Today's date is added unless the report already names its own day.
  const hasDate = parts.some((part) => !!part && /^\d{4}-\d{2}-\d{2}$/.test(part.trim()));
  return [...parts, hasDate ? null : date]
    .filter((part): part is string => !!part && !!part.trim())
    .map((part) => part.trim().replace(/[^\w.-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""))
    .join("-");
}

// The download icon button for a report pop-up's header.
export function DownloadReportButton({ fileName, onePage = false }: { fileName: string; onePage?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  async function onClick(event: MouseEvent<HTMLButtonElement>) {
    const report = event.currentTarget.closest<HTMLElement>('[role="dialog"]');
    if (!report || busy) return;
    setBusy(true);
    setFailed(false);
    try {
      await downloadReportPdf(report, fileName, onePage);
    } catch (error) {
      console.error("Report download failed", error);
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }
  const label = busy ? "Preparing PDF…" : failed ? "Download failed, try again" : "Download report (PDF)";
  return (
    <button
      type="button"
      className={`${styles.btnActionGhost} ${styles.reportDownloadBtn}`}
      onClick={onClick}
      disabled={busy}
      aria-label={label}
      title={label}
    >
      {busy ? (
        <span className={styles.reportDownloadSpin} aria-hidden="true" />
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
      )}
    </button>
  );
}
