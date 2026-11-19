// SVG bodies (24×24, stroke) from the design sample, keyed by content `icon`.
// Static, trusted markup rendered with dangerouslySetInnerHTML.
export const sectionIcons = {
  "practice": "<path d=\"M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M12 7v4M10 9h4\"/>",
  "checkup": "<path d=\"M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11\"/>",
  "vaccine": "<path d=\"m18 2 4 4M17 7l3-3M19 9 8.7 19.3a2.4 2.4 0 0 1-3.4 0l-.6-.6a2.4 2.4 0 0 1 0-3.4L15 5M9 11l4 4M5 19l-3 3M14 4l6 6\"/>",
  "lab": "<path d=\"M22 12h-4l-3 9L9 3l-3 9H2\"/>",
  "chronic": "<path d=\"M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z\"/>",
  "home": "<path d=\"m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/><path d=\"M9 22V12h6v10\"/>",
  "calendar": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M16 2v4M8 2v4M3 10h18\"/>",
  "prescription": "<path d=\"m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7zM8.5 8.5l7 7\"/>",
  "sicknote": "<path d=\"M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z\"/>"
} as const;

export type SectionIcon = keyof typeof sectionIcons;
