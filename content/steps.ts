import { z } from "zod";
import { step } from "./schema";

// "So läuft Ihr Besuch ab", in order. Practice processes need sign-off.
export const steps = z.array(step).min(1).parse([
  {
    "title": {
      "de": "Termin vereinbaren",
      "en": "Book an appointment",
      "ar": "احجز موعدًا"
    },
    "text": {
      "de": "Online oder telefonisch während der Sprechzeiten.",
      "en": "Online, or by phone during opening hours.",
      "ar": "عبر Doctolib أو هاتفيًا خلال أوقات العمل."
    }
  },
  {
    "title": {
      "de": "Anmeldung",
      "en": "Check in",
      "ar": "التسجيل"
    },
    "text": {
      "de": "Bringen Sie Ihre Versichertenkarte, Ihren Medikationsplan und vorhandene Befunde mit.",
      "en": "Bring your insurance card, your medication plan and any previous test results.",
      "ar": "أحضر بطاقة التأمين (Versichertenkarte) وخطة الأدوية (Medikationsplan) ونتائج الفحوصات السابقة إن وجدت."
    }
  },
  {
    "title": {
      "de": "Gespräch und Untersuchung",
      "en": "Consultation and examination",
      "ar": "الاستشارة والفحص"
    },
    "text": {
      "de": "Wir hören zu, untersuchen Sie und machen Labor oder EKG bei Bedarf direkt vor Ort.",
      "en": "We listen, examine you and, if needed, run blood tests or an ECG on the spot.",
      "ar": "نستمع إليك ونفحصك، ونجري التحاليل أو تخطيط القلب في العيادة عند الحاجة."
    }
  },
  {
    "title": {
      "de": "Nächste Schritte",
      "en": "Next steps",
      "ar": "الخطوات التالية"
    },
    "text": {
      "de": "Wir besprechen das Ergebnis mit Ihnen und planen gemeinsam: Rezept, Überweisung oder Kontrolltermin.",
      "en": "We go through the results with you and plan together: a prescription, a referral or a follow-up visit.",
      "ar": "نناقش النتائج معك ونخطط معًا: وصفة طبية أو تحويل أو موعد متابعة."
    }
  }
]);
