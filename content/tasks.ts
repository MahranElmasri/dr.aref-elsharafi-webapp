import { z } from "zod";
import { task } from "./schema";

// "Wie können wir Ihnen helfen?" cards: one short lede plus up to four checklist points.
// action: "book" links to Doctolib, "call" to the practice phone.
// Process details (prescriptions, sick notes) need practice sign-off.
export const tasks = z.array(task).parse([
  {
    "icon": "calendar",
    "title": { "de": "Termin vereinbaren", "en": "Book an appointment", "ar": "حجز موعد" },
    "lede": {
      "de": "Schnell und unkompliziert zu Ihrem Termin.",
      "en": "Get your appointment quickly and easily.",
      "ar": "احصلوا على موعدكم بسرعة وسهولة."
    },
    "points": [
      { "de": "Online über Doctolib buchen", "en": "Book online via Doctolib", "ar": "الحجز عبر الإنترنت من خلال Doctolib" },
      { "de": "Telefonisch während unserer Sprechzeiten", "en": "By phone during our opening hours", "ar": "هاتفيًا خلال أوقات عمل العيادة" }
    ],
    "action": "book"
  },
  {
    "icon": "prescription",
    "title": { "de": "Rezept oder Überweisung", "en": "Prescription or referral", "ar": "وصفة طبية أو تحويل" },
    "lede": {
      "de": "Folgerezepte und Überweisungen ohne Umwege.",
      "en": "Repeat prescriptions and referrals made simple.",
      "ar": "تجديد الوصفات والتحويلات بلا تعقيد."
    },
    "points": [
      { "de": "Folgerezepte telefonisch bestellen", "en": "Order repeat prescriptions by phone", "ar": "طلب تجديد الوصفات هاتفيًا" },
      {
        "de": "Gesetzlich Versicherte lösen das E-Rezept mit der Versichertenkarte in der Apotheke ein",
        "en": "With statutory insurance, redeem your e-prescription at the pharmacy with your insurance card",
        "ar": "للتأمين القانوني: صرف الوصفة الإلكترونية (\u2066E\u2011Rezept\u2069) من الصيدلية ببطاقة التأمين"
      },
      { "de": "Überweisungen an der Anmeldung abholen", "en": "Collect referrals at reception", "ar": "استلام التحويلات (Überweisung) من الاستقبال" },
      { "de": "Versichertenkarte einmal pro Quartal vorlegen", "en": "Present your insurance card once per quarter", "ar": "تقديم بطاقة التأمين (Versichertenkarte) مرة كل ربع سنة" }
    ],
    "action": "call"
  },
  {
    "icon": "sicknote",
    "title": { "de": "Krankschreibung", "en": "Sick note", "ar": "شهادة مرضية" },
    "lede": {
      "de": "Bitte kontaktieren Sie uns am ersten Krankheitstag.",
      "en": "Please contact us on your first day of illness.",
      "ar": "يُرجى التواصل معنا في اليوم الأول من المرض."
    },
    "points": [
      {
        "de": "Bei leichten Beschwerden bis zu fünf Tage nach telefonischer Rücksprache – für bekannte Patientinnen und Patienten",
        "en": "Up to five days after a phone consultation for mild symptoms – for existing patients",
        "ar": "حتى خمسة أيام بعد استشارة هاتفية في حال الأعراض الخفيفة – للمرضى المسجَّلين لدينا"
      },
      {
        "de": "Gesetzlich Versicherte: elektronische Übermittlung an die Krankenkasse",
        "en": "Statutory insurance: sent electronically to your health insurer",
        "ar": "للتأمين القانوني: إرسال الشهادة (Krankschreibung) إلكترونيًا إلى شركة التأمين"
      },
      { "de": "Ihren Arbeitgeber informieren Sie bitte selbst", "en": "Please inform your employer yourself", "ar": "يُرجى إبلاغ صاحب العمل بأنفسكم" }
    ],
    "action": "call"
  }
]);
