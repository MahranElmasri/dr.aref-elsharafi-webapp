import { sectionIcons, type SectionIcon as Key } from "@/components/sectionIcons";

export function SectionIcon({ name }: { name: Key }) {
  return (
    <span className="icon" aria-hidden="true">
      <svg
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}
        strokeLinecap="round" strokeLinejoin="round"
        dangerouslySetInnerHTML={{ __html: sectionIcons[name] }}
      />
    </span>
  );
}
