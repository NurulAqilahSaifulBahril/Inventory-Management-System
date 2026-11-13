import { NextResponse } from "next/server";
import { AuthError } from "@/lib/auth";
import { requireUser } from "@/lib/warehouse-auth";
import { queryProxy } from "@/lib/proxy-db";

export const dynamic = "force-dynamic";

// Who is signed in to Inventory Management in this browser. The page asks on load, so a
// person whose 30-day sign-in cookie is still valid is let straight in (new tab, reopened
// browser, phone that dropped the tab) instead of seeing the sign-in screen again, and a
// change of access (made admin in the Admin tab) is picked up without signing in again.
// 401 when there is no valid sign-in.

export async function GET() {
  let user;
  try {
    user = await requireUser();
  } catch (error) {
    const status = error instanceof AuthError ? error.status : 401;
    return NextResponse.json({ signedIn: false }, { status });
  }

  // The phone number of an Inventory Management user (the page keeps it as its sign-in flag).
  let phone = "";
  try {
    const rows = await queryProxy<{ phone: string | null }>("select phone from public.warehouse_users where id::text = $1", [user.id]);
    phone = rows[0]?.phone ?? "";
  } catch {
    // Signed in with the Scheduling dashboard instead: no Inventory Management phone.
  }

  return NextResponse.json(
    {
      signedIn: true,
      username: user.username || user.displayName,
      access: user.role === "admin" ? "admin" : "staff",
      phone,
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
