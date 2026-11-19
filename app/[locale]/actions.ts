"use server";

import { headers } from "next/headers";
import { handleContact, sendContact, type ContactState } from "@/lib/contact";

export async function submitContact(_prev: ContactState, fd: FormData): Promise<ContactState> {
  const h = await headers();
  // Vercel sets x-forwarded-for; the first entry is the client.
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return handleContact(fd, { ip, now: Date.now(), send: sendContact });
}
