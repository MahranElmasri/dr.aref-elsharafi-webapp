import { z } from "zod";
import { localized } from "./schema";

// "Zum ersten Termin mitbringen" checklist. Needs practice sign-off.
export const firstVisit = z.array(localized).min(1).parse([
  {
    "de": "Ihre Versichertenkarte oder Ihren Versicherungsnachweis",
    "en": "Your health insurance card or proof of insurance",
    "ar": "بطاقة التأمين الصحي أو ما يثبت التأمين"
  },
  {
    "de": "Ihren aktuellen Medikationsplan",
    "en": "Your current medication list",
    "ar": "قائمة الأدوية الحالية"
  },
  {
    "de": "Vorbefunde, Arztbriefe und Ihren Impfpass",
    "en": "Previous results, doctor's letters and your vaccination record",
    "ar": "نتائج الفحوصات السابقة وتقارير الأطباء وبطاقة التطعيم"
  },
  {
    "de": "Überweisungen, falls vorhanden",
    "en": "Referrals, if you have any",
    "ar": "التحويلات الطبية إن وُجدت"
  }
]);
