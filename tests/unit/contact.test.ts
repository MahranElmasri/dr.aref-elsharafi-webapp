import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleContact, MIN_FILL_MS, resetRateLimit, validateContact, type ContactMessage } from "@/lib/contact";

const T0 = 1_800_000_000_000;

function form(over: Record<string, string | null> = {}) {
  const base: Record<string, string> = {
    name: "Maria K.",
    email: "maria@example.de",
    phone: "",
    topic: "appointment",
    message: "Ich brauche eine Bescheinigung für die Arbeit.",
    consent: "on",
    website: "",
    elapsed: String(MIN_FILL_MS + 1000),
  };
  const fd = new FormData();
  for (const [k, v] of Object.entries({ ...base, ...over })) if (v !== null) fd.set(k, v);
  return fd;
}

const later = T0;

describe("validateContact", () => {
  it("accepts a complete message", () => {
    expect(validateContact(form()).success).toBe(true);
  });
  it.each([
    ["name", { name: "  " }],
    ["email", { email: "" }],
    ["email", { email: "maria@" }],
    ["message", { message: "" }],
    ["message", { message: "x".repeat(2001) }],
    ["consent", { consent: null }],
    ["topic", { topic: "medical" }],
  ])("flags %s", (field, over) => {
    const r = validateContact(form(over));
    expect(r.success).toBe(false);
    if (!r.success) expect(r.errors).toHaveProperty(field);
  });
  it("trims values and drops an empty phone", () => {
    const r = validateContact(form({ name: "  Maria  ", phone: " " }));
    expect(r.success && r.data.name).toBe("Maria");
    expect(r.success && r.data.phone).toBeUndefined();
  });
});

describe("handleContact", () => {
  let send: ReturnType<typeof vi.fn<(m: ContactMessage) => Promise<boolean>>>;
  beforeEach(() => {
    resetRateLimit();
    send = vi.fn(async () => true);
  });
  const ctx = (now = later, ip = "203.0.113.7") => ({ ip, now, send });

  it("sends a valid message", async () => {
    const s = await handleContact(form(), ctx());
    expect(s.status).toBe("ok");
    expect(send).toHaveBeenCalledOnce();
    expect(send.mock.calls[0][0]).toMatchObject({ name: "Maria K.", topic: "appointment" });
  });

  it("rejects invalid input with field errors and keeps the values", async () => {
    const s = await handleContact(form({ email: "nope", consent: null }), ctx());
    expect(s.status).toBe("invalid");
    expect(s.errors).toEqual({ email: true, consent: true });
    expect(s.values?.message).toContain("Bescheinigung");
    expect(send).not.toHaveBeenCalled();
  });

  it("silently drops honeypot hits", async () => {
    const s = await handleContact(form({ website: "http://spam.example" }), ctx());
    expect(s.status).toBe("ok");
    expect(send).not.toHaveBeenCalled();
  });

  it("silently drops forms submitted faster than a person can type", async () => {
    const s = await handleContact(form({ elapsed: "500" }), ctx());
    expect(s.status).toBe("ok");
    expect(send).not.toHaveBeenCalled();
  });

  it("drops forms without a fill time", async () => {
    const s = await handleContact(form({ elapsed: null }), ctx());
    expect(s.status).toBe("ok");
    expect(send).not.toHaveBeenCalled();
  });

  it("limits each address to 5 messages per 10 minutes", async () => {
    for (let i = 0; i < 5; i++) expect((await handleContact(form(), ctx(later + i))).status).toBe("ok");
    expect((await handleContact(form(), ctx(later + 10))).status).toBe("rate");
    expect((await handleContact(form(), ctx(later + 10, "198.51.100.1"))).status).toBe("ok");
    expect((await handleContact(form(), ctx(later + 10 * 60_000 + 1))).status).toBe("ok");
    expect(send).toHaveBeenCalledTimes(7);
  });

  it("reports a delivery failure and keeps the values", async () => {
    send.mockResolvedValueOnce(false);
    const s = await handleContact(form(), ctx());
    expect(s.status).toBe("error");
    expect(s.values?.name).toBe("Maria K.");
  });
});
