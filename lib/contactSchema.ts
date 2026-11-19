import { z } from "zod";

// Shared by the browser (instant errors) and the server action (the real check).

export const contactTopics = ["general", "appointment", "feedback", "other"] as const;
export type ContactTopic = (typeof contactTopics)[number];

export const contactFields = ["name", "email", "phone", "topic", "message", "consent"] as const;
export type ContactField = (typeof contactFields)[number];
export type ContactErrors = Partial<Record<ContactField, true>>;
export type ContactValues = Partial<Record<Exclude<ContactField, "consent">, string>>;

const text = (max: number) => z.string().trim().min(1).max(max);

export const contactSchema = z.object({
  name: text(100),
  email: z.string().trim().max(200).pipe(z.email()),
  phone: z
    .string()
    .trim()
    .max(40)
    .regex(/^[+\d\s()/-]*$/)
    .transform((v) => v || undefined),
  topic: z.enum(contactTopics),
  message: text(2000),
  consent: z.literal("on"),
});
export type ContactMessage = z.infer<typeof contactSchema>;

const field = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return typeof v === "string" ? v : undefined;
};

export function validateContact(fd: FormData) {
  const r = contactSchema.safeParse({
    name: field(fd, "name") ?? "",
    email: field(fd, "email") ?? "",
    phone: field(fd, "phone") ?? "",
    topic: field(fd, "topic"),
    message: field(fd, "message") ?? "",
    consent: field(fd, "consent"),
  });
  if (r.success) return { success: true as const, data: r.data };
  const errors: ContactErrors = {};
  for (const issue of r.error.issues) errors[issue.path[0] as ContactField] = true;
  return { success: false as const, errors };
}

/** What the visitor typed, sent back so a failed attempt does not clear the form. */
export function contactValues(fd: FormData): ContactValues {
  const values: ContactValues = {};
  for (const k of ["name", "email", "phone", "topic", "message"] as const) {
    const v = field(fd, k);
    if (v !== undefined) values[k] = v.slice(0, 2000);
  }
  return values;
}
