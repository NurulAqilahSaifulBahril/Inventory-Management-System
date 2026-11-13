import { NextRequest, NextResponse } from "next/server";
import { AuthError } from "@/lib/auth";
import { requireUser } from "@/lib/warehouse-auth";
import { fetchJobFiles } from "@/lib/source-api";

export const dynamic = "force-dynamic";

// One PV drawing file of a job, passed through this site so the Stock Out report can show it
// as a picture and put it in the downloaded PDF (a browser cannot copy a file shown from
// another website into a PDF). Only a link that belongs to that job's own drawings is
// fetched; any other address is refused.
//   GET ?job=<invoice id>&url=<drawing link>

const MAX_BYTES = 20 * 1024 * 1024;

// Same clean-up as the report: "//host/file.pdf" gets https, only http(s) links count.
function cleanLink(link: string): string {
  const trimmed = link.trim();
  return trimmed.startsWith("//") ? `https:${trimmed}` : trimmed;
}

export async function GET(request: NextRequest) {
  try {
    await requireUser();
  } catch (error) {
    const status = error instanceof AuthError ? error.status : 401;
    return NextResponse.json({ error: "Not signed in." }, { status });
  }

  const job = request.nextUrl.searchParams.get("job")?.trim() ?? "";
  const url = request.nextUrl.searchParams.get("url")?.trim() ?? "";
  if (!job || !url) return NextResponse.json({ error: "job and url are required." }, { status: 400 });

  let allowed: string[];
  try {
    const files = await fetchJobFiles(job);
    if (!files) return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    allowed = [...(files.pv ?? []), ...(files.sld ?? []), ...(files.seda ?? [])].map(cleanLink);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load the job's drawings." },
      { status: 503 },
    );
  }
  if (!allowed.includes(url) || !/^https?:\/\//i.test(url)) {
    return NextResponse.json({ error: "Not a drawing of this job." }, { status: 403 });
  }

  try {
    const upstream = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(20000), cache: "no-store" });
    if (!upstream.ok) {
      return NextResponse.json({ error: `The drawing could not be fetched (HTTP ${upstream.status}).` }, { status: 502 });
    }
    const length = Number(upstream.headers.get("content-length") ?? 0);
    if (length > MAX_BYTES) return NextResponse.json({ error: "The drawing is too large." }, { status: 413 });
    const bytes = await upstream.arrayBuffer();
    if (bytes.byteLength > MAX_BYTES) return NextResponse.json({ error: "The drawing is too large." }, { status: 413 });
    const type = upstream.headers.get("content-type") || (url.toLowerCase().includes(".pdf") ? "application/pdf" : "application/octet-stream");
    // Only PDFs and pictures are passed on.
    if (!/^(application\/pdf|image\/)/i.test(type)) {
      return NextResponse.json({ error: "The drawing is not a PDF or picture." }, { status: 415 });
    }
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "private, max-age=600",
        "Content-Security-Policy": "sandbox",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not fetch the drawing." },
      { status: 502 },
    );
  }
}
