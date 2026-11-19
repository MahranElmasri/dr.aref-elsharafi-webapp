import { z } from "zod";
import { faqItem } from "./schema";

// Häufige Fragen, in display order. Answers need practice sign-off.
// Arabic: wrap phone numbers in U+2066…U+2069 (isolate) so their digit groups keep their order.
export const faq = z.array(faqItem).min(1).parse([
  {
    "q": {
      "de": "Wie bekomme ich einen Termin?",
      "en": "How do I get an appointment?",
      "ar": "كيف أحصل على موعد؟"
    },
    "a": {
      "de": "Online über Doctolib – ohne Konto und ohne App. Oder Sie rufen uns während der Sprechzeiten unter 030 45490303 an.",
      "en": "Book online through Doctolib – no account or app needed. Or call us on 030 45490303 during opening hours.",
      "ar": "احجز عبر Doctolib دون حساب أو تطبيق، أو اتصل بنا خلال أوقات العمل على الرقم ⁦030 45490303⁩."
    }
  },
  {
    "q": {
      "de": "Welche Versicherungen nehmen Sie an?",
      "en": "Which insurance do you accept?",
      "ar": "ما شركات التأمين التي تقبلونها؟"
    },
    "a": {
      "de": "Wir behandeln alle gesetzlich und privat versicherten Patientinnen und Patienten.",
      "en": "We treat all patients with public or private health insurance.",
      "ar": "نعالج جميع المرضى المؤمَّن عليهم لدى التأمين الحكومي أو الخاص."
    }
  },
  {
    "q": {
      "de": "Machen Sie Hausbesuche?",
      "en": "Do you make home visits?",
      "ar": "هل تقومون بزيارات منزلية؟"
    },
    "a": {
      "de": "Ja, für Patientinnen und Patienten, die nicht in die Praxis kommen können. Bitte vereinbaren Sie den Besuch telefonisch.",
      "en": "Yes, for patients who can't come to the practice. Please arrange the visit by phone.",
      "ar": "نعم، للمرضى الذين لا يستطيعون الحضور إلى العيادة. يرجى ترتيب الزيارة هاتفيًا."
    }
  },
  {
    "q": {
      "de": "Ist die Praxis barrierefrei?",
      "en": "Is the practice step-free?",
      "ar": "هل العيادة خالية من العوائق؟"
    },
    "a": {
      "de": "Ja, die Praxisräume sind barrierefrei zugänglich.",
      "en": "Yes, the practice rooms are step-free.",
      "ar": "نعم، يمكن الوصول إلى غرف العيادة دون عوائق."
    }
  },
  {
    "q": {
      "de": "Was mache ich außerhalb der Sprechzeiten?",
      "en": "What do I do outside opening hours?",
      "ar": "ماذا أفعل خارج أوقات العمل؟"
    },
    "a": {
      "de": "Rufen Sie den Ärztlichen Bereitschaftsdienst unter 116 117 an. In lebensbedrohlichen Notfällen wählen Sie 112.",
      "en": "Call the on-call doctor service on 116 117. In a life-threatening emergency, call 112.",
      "ar": "اتصل بخدمة الطبيب المناوب على الرقم ⁦116 117⁩. في الحالات الطارئة التي تهدد الحياة اتصل بالرقم 112."
    }
  },
  {
    "q": {
      "de": "In welchen Sprachen kann ich mich verständigen?",
      "en": "Which languages can I speak with you?",
      "ar": "بأي لغات يمكنني التواصل معكم؟"
    },
    "a": {
      "de": "In unserer Sprechstunde sprechen wir Deutsch, Englisch und Arabisch.",
      "en": "In our consultations we speak German, English and Arabic.",
      "ar": "نتحدث في العيادة الألمانية والإنجليزية والعربية."
    }
  },
  {
    "q": {
      "de": "Übernimmt die Krankenkasse Reiseimpfungen?",
      "en": "Does my health insurance pay for travel vaccinations?",
      "ar": "هل يغطي التأمين الصحي تطعيمات السفر؟"
    },
    "a": {
      "de": "Das hängt von Ihrer Krankenkasse ab. Viele Kassen erstatten Reiseimpfungen ganz oder teilweise. Fragen Sie vor der Reise bei Ihrer Kasse nach – wir beraten Sie zu den nötigen Impfungen.",
      "en": "That depends on your insurer. Many insurers cover travel vaccinations in full or in part. Check with yours before you travel – we will advise you on the vaccinations you need.",
      "ar": "يعتمد ذلك على شركة التأمين. كثير من الشركات تغطي تطعيمات السفر كليًا أو جزئيًا. استفسر لدى شركتك قبل السفر، ونحن ننصحك بالتطعيمات اللازمة."
    }
  }
]);
