// Practice facts. Source: berlin-hausaerzte.de. zod validation is added in T6.
export const practice = {
  name: "Ärztezentrum Dr. Sharafi und Kollegen",
  street: "Müllerstraße 138",
  postalCode: "13353",
  city: "Berlin",
  phone: { display: "030 45490303", tel: "+493045490303" },
  email: "praxis@aerztezentrum-sharafi.de",
  doctolibUrl: "https://www.doctolib.de/praxis/berlin/praxis-dr-aref-sharafi",
} as const;
