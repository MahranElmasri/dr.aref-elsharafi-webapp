import { z } from "zod";
import { task } from "./schema";

// "Wie können wir Ihnen helfen?" cards. action: "book" links to Doctolib, "call" to the practice phone.
// Process details (prescriptions, sick notes) need practice sign-off.
export const tasks = z.array(task).parse([
  {
    "icon": "calendar",
    "title": {
      "de": "Termin vereinbaren",
      "en": "Book an appointment",
      "ar": "حجز موعد"
    },
    "text": {
      "de": "Buchen Sie online über Doctolib, ohne Konto oder App, oder rufen Sie uns während der Sprechzeiten an.",
      "en": "Book online with Doctolib, no account or app needed, or call us during opening hours.",
      "ar": "احجز عبر الإنترنت من خلال Doctolib دون حساب أو تطبيق، أو اتصل بنا خلال أوقات العمل."
    },
    "action": "book"
  },
  {
    "icon": "prescription",
    "title": {
      "de": "Rezept oder Überweisung",
      "en": "Prescription or referral",
      "ar": "وصفة طبية أو تحويل"
    },
    "text": {
      "de": "Folgerezepte und Überweisungen bestellen Sie telefonisch und holen sie an der Anmeldung ab. Bringen Sie einmal im Quartal Ihre Versichertenkarte mit.",
      "en": "Order repeat prescriptions and referrals by phone and collect them at reception. Bring your insurance card once each quarter.",
      "ar": "اطلب تجديد الوصفات والتحويلات هاتفياً واستلمها من الاستقبال. أحضر بطاقة التأمين مرة واحدة كل ربع سنة."
    },
    "action": "call"
  },
  {
    "icon": "sicknote",
    "title": {
      "de": "Krankschreibung",
      "en": "Sick note",
      "ar": "شهادة مرضية"
    },
    "text": {
      "de": "Melden Sie sich am ersten Krankheitstag. Bei leichten Beschwerden können wir bekannte Patientinnen und Patienten nach telefonischer Rücksprache bis zu fünf Tage krankschreiben.",
      "en": "Contact us on your first day of illness. If you are already our patient and have mild symptoms, we can issue a sick note for up to five days after a phone consultation.",
      "ar": "تواصل معنا في أول يوم من مرضك. إذا كنت من مرضانا وكانت أعراضك خفيفة، يمكننا إصدار شهادة مرضية لمدة تصل إلى خمسة أيام بعد استشارة هاتفية."
    },
    "action": "call"
  }
]);
