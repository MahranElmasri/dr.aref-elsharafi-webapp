import { notFound } from "next/navigation";

// Any unknown path below a locale renders the localized 404.
export default function CatchAll() {
  notFound();
}
