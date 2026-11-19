import { notice as schema } from "./schema";

// Optional practice notice above the header. Set to null to hide.
// `from`/`to` (optional, inclusive) limit when it shows.
// Example:
//   { title: { de: "Praxishinweis" }, message: { de: "Am 3. Dezember schließen wir um 12 Uhr." }, to: "2026-12-03" }
export const notice = schema.nullable().parse(null);
