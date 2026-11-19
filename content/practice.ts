import { practice as schema } from "./schema";

// Practice facts. Source: berlin-hausaerzte.de
export const practice = schema.parse({
  name: "Ärztezentrum Dr. Sharafi und Kollegen",
  street: "Müllerstraße 138",
  postalCode: "13353",
  city: "Berlin",
  phone: { display: "030 45490303", tel: "+493045490303" },
  email: "praxis@aerztezentrum-sharafi.de",
  doctolibUrl: "https://www.doctolib.de/praxis/berlin/praxis-dr-aref-sharafi",
  googleMapsUrl:
    "https://www.google.com/maps/place/%C3%84rztezentrum+Dr.+Sharafi+und+Kollegen/@52.5496962,13.3523806,17z/data=!4m6!3m5!1s0x47a8517ea4df239b:0x235ee76d9f56c15a!8m2!3d52.5496962!4d13.3523806!16s%2Fg%2F1tcxt8b2",
  googleMapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2426.1010959939426!2d13.352380599999998!3d52.54969620000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a8517ea4df239b%3A0x235ee76d9f56c15a!2s%C3%84rztezentrum%20Dr.%20Sharafi%20und%20Kollegen!5e0!3m2!1sde!2sde!4v1795094131080!5m2!1sde!2sde",
});
