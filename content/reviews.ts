import { z } from "zod";
import { review } from "./schema";

// Patient reviews. Real reviews need the author's consent: set `consentConfirmed: true`
// and `source`, and get written consent first, above all when a review names an illness.
// Empty until approved reviews exist: the section then shows only the Google links.
// Entries with `sample: true` are invented placeholders: badged and never shown in production.
export const reviews = z.array(review).parse([]);
