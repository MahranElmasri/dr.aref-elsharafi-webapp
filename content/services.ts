import { z } from "zod";
import { service } from "./schema";

// Services the practice lists on berlin-hausaerzte.de. The first entry is shown as the wide lead card.
// Medical wording needs practice sign-off; EN/AR are drafts pending native-speaker review.
export const services = z.array(service).min(1).parse([
  {
    "icon": "practice",
    "title": {
      "de": "Hausärztliche Versorgung",
      "en": "General practice",
      "ar": "الرعاية الطبية العامة"
    },
    "summary": {
      "de": "Ihre erste Anlaufstelle bei Beschwerden – und eine Praxis, die Ihre Krankengeschichte kennt.",
      "en": "Your first point of contact when you feel unwell – and a practice that knows your medical history.",
      "ar": "وجهتك الأولى عند أي شكوى صحية، وعيادة تعرف تاريخك المرضي."
    },
    "items": [
      {
        "de": "Akute Infekte und Schmerzen",
        "en": "Acute infections and pain",
        "ar": "الالتهابات الحادة والآلام"
      },
      {
        "de": "Betreuung bei Bluthochdruck und Diabetes",
        "en": "Care for high blood pressure and diabetes",
        "ar": "متابعة ضغط الدم والسكري"
      },
      {
        "de": "Medikationsplan und Rezepte",
        "en": "Medication plans and prescriptions",
        "ar": "خطة الأدوية والوصفات الطبية"
      },
      {
        "de": "Überweisungen und Abstimmung mit Fachärzten",
        "en": "Referrals and coordination with specialists",
        "ar": "التحويل إلى الأطباء المختصين والتنسيق معهم"
      }
    ]
  },
  {
    "icon": "checkup",
    "title": {
      "de": "Vorsorgeuntersuchungen",
      "en": "Preventive check-ups",
      "ar": "الفحوصات الوقائية"
    },
    "summary": {
      "de": "Früh erkennen, bevor Beschwerden entstehen.",
      "en": "Catch problems early, before symptoms appear.",
      "ar": "الكشف المبكر قبل ظهور الأعراض."
    },
    "items": [
      {
        "de": "Gesundheits-Check-up",
        "en": "Health check-up",
        "ar": "الفحص الصحي الشامل"
      },
      {
        "de": "Hautkrebs-Screening",
        "en": "Skin cancer screening",
        "ar": "فحص سرطان الجلد"
      },
      {
        "de": "Krebsfrüherkennung für Männer",
        "en": "Cancer screening for men",
        "ar": "الكشف المبكر عن السرطان للرجال"
      },
      {
        "de": "Stuhltest auf verstecktes Blut",
        "en": "Stool test for hidden blood",
        "ar": "فحص البراز للكشف عن الدم الخفي"
      }
    ],
    "linksToCareFinder": true
  },
  {
    "icon": "vaccine",
    "title": {
      "de": "Impfungen & Reisemedizin",
      "en": "Vaccinations & travel medicine",
      "ar": "التطعيمات وطب السفر"
    },
    "summary": {
      "de": "Gut geschützt im Alltag und auf Reisen.",
      "en": "Protected in everyday life and when you travel.",
      "ar": "حماية جيدة في حياتك اليومية وفي السفر."
    },
    "items": [
      {
        "de": "Impfungen nach STIKO-Empfehlung",
        "en": "Vaccinations following STIKO guidance",
        "ar": "التطعيمات حسب توصيات STIKO"
      },
      {
        "de": "Grippe- und COVID-19-Impfung im Herbst",
        "en": "Flu and COVID-19 vaccination in autumn",
        "ar": "تطعيم الإنفلونزا وكوفيد-19 في الخريف"
      },
      {
        "de": "Reiseberatung und Reiseimpfungen",
        "en": "Travel advice and travel vaccinations",
        "ar": "استشارات السفر وتطعيماته"
      },
      {
        "de": "Kontrolle Ihres Impfpasses",
        "en": "Checking your vaccination record",
        "ar": "مراجعة بطاقة التطعيم"
      }
    ]
  },
  {
    "icon": "lab",
    "title": {
      "de": "Labor & Diagnostik",
      "en": "Lab & diagnostics",
      "ar": "المختبر والتشخيص"
    },
    "summary": {
      "de": "Viele Untersuchungen direkt bei uns – Sie sparen sich zusätzliche Termine.",
      "en": "Many tests done right here – no extra appointments elsewhere.",
      "ar": "كثير من الفحوصات تُجرى لدينا مباشرة، فتوفّر على نفسك مواعيد إضافية."
    },
    "items": [
      {
        "de": "Blutentnahme und Laborwerte",
        "en": "Blood tests",
        "ar": "سحب الدم والتحاليل المخبرية"
      },
      {
        "de": "Ruhe-EKG",
        "en": "Resting ECG",
        "ar": "تخطيط القلب أثناء الراحة"
      },
      {
        "de": "Lungenfunktionstest",
        "en": "Lung function test",
        "ar": "اختبار وظائف الرئة"
      },
      {
        "de": "24-Stunden-Blutdruckmessung",
        "en": "24-hour blood pressure monitoring",
        "ar": "قياس ضغط الدم على مدار 24 ساعة"
      }
    ]
  },
  {
    "icon": "chronic",
    "title": {
      "de": "Chronische Erkrankungen (DMP)",
      "en": "Chronic conditions (DMP)",
      "ar": "الأمراض المزمنة (DMP)"
    },
    "summary": {
      "de": "Regelmäßige Kontrollen nach festem Plan, abgestimmt mit Ihrer Krankenkasse.",
      "en": "Regular check-ups on a set plan, agreed with your health insurer.",
      "ar": "فحوصات منتظمة وفق خطة ثابتة بالتنسيق مع تأمينك الصحي."
    },
    "items": [
      {
        "de": "Diabetes mellitus Typ 2",
        "en": "Type 2 diabetes",
        "ar": "السكري من النوع الثاني"
      },
      {
        "de": "Asthma bronchiale",
        "en": "Asthma",
        "ar": "الربو"
      },
      {
        "de": "COPD",
        "en": "COPD",
        "ar": "الانسداد الرئوي المزمن"
      },
      {
        "de": "Koronare Herzkrankheit",
        "en": "Coronary heart disease",
        "ar": "مرض القلب التاجي"
      }
    ]
  },
  {
    "icon": "home",
    "title": {
      "de": "Hausbesuche",
      "en": "Home visits",
      "ar": "الزيارات المنزلية"
    },
    "summary": {
      "de": "Wenn Sie nicht in die Praxis kommen können, kommen wir zu Ihnen.",
      "en": "If you can't come to the practice, we come to you.",
      "ar": "إذا لم تستطع الحضور إلى العيادة، نأتي إليك."
    },
    "items": [
      {
        "de": "Für Patientinnen und Patienten mit eingeschränkter Mobilität",
        "en": "For patients with limited mobility",
        "ar": "للمرضى ذوي الحركة المحدودة"
      },
      {
        "de": "Nach telefonischer Absprache",
        "en": "Arranged by phone",
        "ar": "بعد الاتفاق هاتفيًا"
      }
    ]
  }
]);
