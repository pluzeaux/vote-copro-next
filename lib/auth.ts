import { NextRequest } from "next/server";

export function isAdminFromRequest(req: Request | NextRequest) {
  const headers = (req as any).headers ?? {};
  // Next.js App Router Request: headers is a Headers object
  const pw = typeof (req as any).headers?.get === "function"
    ? (req as any).headers.get("x-admin-password") || null
    : headers["x-admin-password"] || null;
  return pw === process.env.ADMIN_PASSWORD;
}
