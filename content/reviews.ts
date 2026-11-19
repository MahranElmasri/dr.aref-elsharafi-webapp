import { z } from "zod";
import { review } from "./schema";

// Patient reviews. Real reviews need the author's consent: set `consentConfirmed: true`
// and `source`. Entries with `sample: true` are invented placeholders: they carry a
// "Beispieltext" badge and are never shown on the production site.
export const reviews = z.array(review).parse([
  {
    "sample": true,
    "quote": {
      "de": "Ich fühle mich hier seit Jahren gut aufgehoben. Die Ärzte nehmen sich Zeit, erklären verständlich und denken mit – auch bei Befunden von Fachärzten.",
      "en": "I have felt in good hands here for years. The doctors take their time, explain clearly and think ahead – including specialists' results.",
      "ar": "أشعر منذ سنوات أنني في أيدٍ أمينة هنا. يأخذ الأطباء وقتهم ويشرحون بوضوح ويفكرون معي، حتى في نتائج الأطباء المختصين."
    },
    "author": {
      "de": "Maria K.",
      "en": "Maria K.",
      "ar": "Maria K."
    },
    "meta": {
      "de": "Patientin seit 2015",
      "en": "Patient since 2015",
      "ar": "مريضة منذ 2015"
    },
    "tag": {
      "de": "Hausärztliche Versorgung",
      "en": "General practice",
      "ar": "الرعاية العامة"
    },
    "rating": 5
  },
  {
    "sample": true,
    "quote": {
      "de": "Termin online gebucht, pünktlich drangekommen, Blutabnahme und EKG direkt vor Ort. So unkompliziert habe ich das selten erlebt.",
      "en": "Booked online, seen on time, blood test and ECG done right here. Rarely has it been this easy.",
      "ar": "حجزت عبر الإنترنت ودخلت في موعدي، وتم سحب الدم وتخطيط القلب في العيادة نفسها. نادرًا ما كان الأمر بهذه السهولة."
    },
    "author": {
      "de": "Thomas B.",
      "en": "Thomas B.",
      "ar": "Thomas B."
    },
    "meta": {
      "de": "Check-up",
      "en": "Check-up",
      "ar": "فحص شامل"
    },
    "tag": {
      "de": "Vorsorge",
      "en": "Check-ups",
      "ar": "الفحوصات الوقائية"
    },
    "rating": 5
  },
  {
    "sample": true,
    "quote": {
      "de": "Dass meine Eltern sich auf Arabisch erklären können, macht für unsere Familie einen großen Unterschied.",
      "en": "That my parents can explain things in Arabic makes a big difference for our family.",
      "ar": "أن يستطيع والداي الشرح بالعربية يُحدث فرقًا كبيرًا لعائلتنا."
    },
    "author": {
      "de": "Samira A.",
      "en": "Samira A.",
      "ar": "سميرة أ."
    },
    "meta": {
      "de": "Angehörige",
      "en": "Relative",
      "ar": "أحد الأقارب"
    },
    "tag": {
      "de": "Sprachen",
      "en": "Languages",
      "ar": "اللغات"
    },
    "rating": 5
  },
  {
    "sample": true,
    "quote": {
      "de": "Mein Diabetes wird hier regelmäßig und gründlich kontrolliert. Ich weiß immer, wann der nächste Termin ansteht.",
      "en": "My diabetes is checked regularly and thoroughly here. I always know when my next appointment is.",
      "ar": "يتابعون مرض السكري لدي بانتظام ودقة، وأعرف دائمًا موعد زيارتي القادمة."
    },
    "author": {
      "de": "Ahmet Y.",
      "en": "Ahmet Y.",
      "ar": "Ahmet Y."
    },
    "meta": {
      "de": "DMP Diabetes",
      "en": "DMP diabetes",
      "ar": "برنامج السكري"
    },
    "tag": {
      "de": "Chronische Erkrankungen",
      "en": "Chronic conditions",
      "ar": "الأمراض المزمنة"
    },
    "rating": 5
  },
  {
    "sample": true,
    "quote": {
      "de": "Vor unserer Reise wurden wir gut beraten und haben alle Impfungen an einem Termin bekommen.",
      "en": "We got good advice before our trip and all our vaccinations in one appointment.",
      "ar": "حصلنا قبل سفرنا على استشارة جيدة وجميع التطعيمات في موعد واحد."
    },
    "author": {
      "de": "Julia und Paul S.",
      "en": "Julia and Paul S.",
      "ar": "Julia و Paul S."
    },
    "meta": {
      "de": "Reiseberatung",
      "en": "Travel advice",
      "ar": "استشارة سفر"
    },
    "tag": {
      "de": "Impfungen",
      "en": "Vaccinations",
      "ar": "التطعيمات"
    },
    "rating": 5
  }
]);
