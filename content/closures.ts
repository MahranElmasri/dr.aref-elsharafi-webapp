import { z } from "zod";
import { closure } from "./schema";

// Days the practice is closed (holidays, training). Both dates inclusive.
// The status and the notice bar switch on and off by themselves on these dates.
// Example:
//   { from: "2026-12-24", to: "2027-01-01", message: { de: "Praxisurlaub. Vertretung: …" } },
export const closures = z.array(closure).parse([]);
