import { z } from "zod";
import { doctor } from "./schema";

// Doctors in display order. Source: berlin-hausaerzte.de. Portraits: public/assets/dr.<portrait>.jpg
// Each doctor must approve their (AI-edited) portrait before launch.
export const doctors = z.array(doctor).min(1).parse([
  {
    "name": "Dr. Aref Sharafi",
    "portrait": "aref",
    "role": {
      "de": "Hausärztlich tätiger Internist",
      "en": "Internist working in general practice",
      "ar": "أخصائي باطنية يعمل كطبيب أسرة"
    },
    "focus": [
      {
        "de": "Diabetes",
        "en": "Diabetes",
        "ar": "السكري"
      },
      {
        "de": "Bluthochdruck",
        "en": "High blood pressure",
        "ar": "ارتفاع ضغط الدم"
      },
      {
        "de": "Reisemedizin",
        "en": "Travel medicine",
        "ar": "طب السفر"
      }
    ]
  },
  {
    "name": "Dr. Nabil Elnahas",
    "portrait": "nahas",
    "role": {
      "de": "Hausärztlich tätiger Internist",
      "en": "Internist working in general practice",
      "ar": "أخصائي باطنية يعمل كطبيب أسرة"
    },
    "focus": [
      {
        "de": "Hepatitis",
        "en": "Hepatitis",
        "ar": "التهاب الكبد"
      },
      {
        "de": "Diabetes",
        "en": "Diabetes",
        "ar": "السكري"
      },
      {
        "de": "Bluthochdruck",
        "en": "High blood pressure",
        "ar": "ارتفاع ضغط الدم"
      }
    ]
  },
  {
    "name": "Dr. Abdel Jabar Zoghbi",
    "portrait": "zoghbi",
    "role": {
      "de": "Facharzt für Allgemeinmedizin",
      "en": "Specialist in family medicine",
      "ar": "أخصائي طب الأسرة"
    },
    "focus": [
      {
        "de": "Infektionskrankheiten",
        "en": "Infectious diseases",
        "ar": "الأمراض المعدية"
      },
      {
        "de": "Atemwegserkrankungen",
        "en": "Respiratory illness",
        "ar": "أمراض الجهاز التنفسي"
      },
      {
        "de": "Diabetes",
        "en": "Diabetes",
        "ar": "السكري"
      }
    ]
  },
  {
    "name": "Dr. Guido Königer",
    "portrait": "koeniger",
    "role": {
      "de": "Facharzt für Allgemeinmedizin",
      "en": "Specialist in family medicine",
      "ar": "أخصائي طب الأسرة"
    },
    "focus": [
      {
        "de": "Bluthochdruck",
        "en": "High blood pressure",
        "ar": "ارتفاع ضغط الدم"
      },
      {
        "de": "Reisemedizin",
        "en": "Travel medicine",
        "ar": "طب السفر"
      }
    ]
  }
]);
