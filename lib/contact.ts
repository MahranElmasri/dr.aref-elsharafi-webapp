import { contactValues, validateContact, type ContactErrors, type ContactMessage, type ContactValues } from "./contactSchema";

export { validateContact, type ContactMessage };

// Server side of the contact form. Nothing is stored; the message body is never logged.

export type ContactState = {
  status: "idle" | "ok" | "invalid" | "error" | "rate";
  errors?: ContactErrors;
  values?: ContactValues;
};

/** A person needs longer than this to fill in the form; faster submissions are bots. */
export const MIN_FILL_MS = 3000;
const RATE_MAX = 5;
const RATE_WINDOW_MS = 10 * 60_000;

// Per server instance only. Good enough against casual abuse; see tasks/plan.md risks.
const recent = new Map<string, number[]>();

export function resetRateLimit() {
  recent.clear();
}

function overLimit(ip: string, now: number) {
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX) {
    recent.set(ip, hits);
    return true;
  }
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5000) recent.delete(recent.keys().next().value!);
  return false;
}

type Context = { ip: string; now: number; send: (m: ContactMessage) => Promise<boolean> };

export async function handleContact(fd: FormData, { ip, now, send }: Context): Promise<ContactState> {
  // Bots: report success so they learn nothing, but send nothing.
  // `elapsed` is measured in the browser, so a wrong visitor clock cannot drop a real message.
  const elapsed = Number(fd.get("elapsed") || NaN);
  if (fd.get("website") || !(elapsed >= MIN_FILL_MS)) {
    return { status: "ok" };
  }

  const r = validateContact(fd);
  if (!r.success) return { status: "invalid", errors: r.errors, values: contactValues(fd) };

  if (overLimit(ip, now)) return { status: "rate", values: contactValues(fd) };

  const sent = await send(r.data).catch(() => false);
  return sent ? { status: "ok" } : { status: "error", values: contactValues(fd) };
}

/**
 * Delivers one email to the practice. The provider is not chosen yet (SPEC.md open question 1):
 * until then development logs metadata only and production reports a failure, so the visitor
 * is told to call instead of believing the message arrived.
 */
export async function sendContact(m: ContactMessage): Promise<boolean> {
  // CONTACT_TEST_SINK lets the e2e suite see the success path; it never applies on the live site.
  const testSink = process.env.CONTACT_TEST_SINK === "1" && process.env.VERCEL_ENV !== "production";
  if (process.env.NODE_ENV !== "production" || testSink) {
    console.info(`[contact] dev: would send topic=${m.topic} length=${m.message.length}`);
    return true;
  }
  console.error("[contact] no email provider configured");
  return false;
}
