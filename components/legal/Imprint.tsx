import { practice } from "@/content/practice";
import { Fill } from "./LegalPage";

// Draft based on § 5 DDG and § 18 MStV. Facts marked with <Fill> come from the practice.
export function Imprint() {
  return (
    <>
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        {practice.name}<br />
        <Fill>Inhaber bzw. Rechtsform, z. B. Berufsausübungsgemeinschaft der Ärzte …</Fill><br />
        {practice.street}<br />
        {practice.postalCode} {practice.city}
      </p>

      <h2>Kontakt</h2>
      <p>
        Telefon: <a href={`tel:${practice.phone.tel}`}>{practice.phone.display}</a><br />
        E-Mail: <a href={`mailto:${practice.email}`}>{practice.email}</a>
      </p>

      <h2>Berufsrechtliche Angaben</h2>
      <p>
        Gesetzliche Berufsbezeichnung: Arzt (verliehen in der Bundesrepublik Deutschland) <Fill>je Ärztin/Arzt bestätigen</Fill><br />
        Zuständige Kammer: Ärztekammer Berlin <Fill>Anschrift bestätigen</Fill><br />
        Zuständige Kassenärztliche Vereinigung: Kassenärztliche Vereinigung Berlin <Fill>Anschrift bestätigen</Fill><br />
        Berufsrechtliche Regelungen: Berufsordnung der Ärztekammer Berlin, Berliner Heilberufekammergesetz.
        Die Regelungen sind bei der Ärztekammer Berlin abrufbar.
      </p>

      <h2>Umsatzsteuer</h2>
      <p><Fill>Umsatzsteuer-Identifikationsnummer, falls vorhanden – sonst Abschnitt streichen</Fill></p>

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p><Fill>Name</Fill>, Anschrift wie oben</p>

      <h2>Verbraucherstreitbeilegung</h2>
      <p>
        Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen. <Fill>bestätigen</Fill>
      </p>
    </>
  );
}
