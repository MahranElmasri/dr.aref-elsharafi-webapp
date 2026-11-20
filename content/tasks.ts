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
      "de": "Buchen Sie online über Doctolib oder rufen Sie uns während der Sprechzeiten an.",
      "en": "Book online with Doctolib, or call us during opening hours.",
      "ar": "احجز عبر الإنترنت من خلال Doctolib، أو اتصل بنا خلال أوقات العمل."
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
      "de": "Folgerezepte bestellen Sie telefonisch. Gesetzlich Versicherte lösen das E-Rezept mit ihrer Versichertenkarte direkt in der Apotheke ein. Überweisungen liegen an der Anmeldung für Sie bereit. Bringen Sie einmal im Quartal Ihre Versichertenkarte mit.",
      "en": "Order repeat prescriptions by phone. With statutory insurance, the pharmacy reads your e-prescription from your insurance card. Referrals are ready for you at reception. Bring your insurance card once each quarter.",
      "ar": "اطلب تجديد الوصفات الطبية هاتفيًا. إذا كان تأمينك قانونيًا، تقرأ الصيدلية الوصفة الإلكترونية (E-Rezept) من بطاقة التأمين فتستلم الدواء مباشرة. أما التحويلات (Überweisung) فتجدها جاهزة في الاستقبال. أحضر بطاقة التأمين (Versichertenkarte) مرة واحدة كل ربع سنة."
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
      "de": "Melden Sie sich am ersten Krankheitstag. Bei leichten Beschwerden können wir bekannte Patientinnen und Patienten nach telefonischer Rücksprache bis zu fünf Tage krankschreiben. Bei gesetzlich Versicherten geht die Krankschreibung elektronisch an die Krankenkasse – Sie müssen nichts einreichen. Ihren Arbeitgeber informieren Sie bitte selbst.",
      "en": "Contact us on your first day of illness. If you are already our patient and have mild symptoms, we can issue a sick note for up to five days after a phone consultation. With statutory insurance, your sick note goes electronically to your insurer – you don't need to hand anything in. Please tell your employer yourself.",
      "ar": "تواصل معنا في أول يوم من مرضك. إذا كنت من مرضانا وكانت أعراضك خفيفة، يمكننا إصدار شهادة مرضية لمدة تصل إلى خمسة أيام بعد استشارة هاتفية. للمؤمَّن عليهم تأمينًا قانونيًا تُرسَل الشهادة المرضية (Krankschreibung) إلكترونيًا إلى شركة التأمين الصحي، ولا تحتاج إلى تقديم أي ورقة. يرجى إبلاغ صاحب العمل بنفسك."
    },
    "action": "call"
  }
]);
