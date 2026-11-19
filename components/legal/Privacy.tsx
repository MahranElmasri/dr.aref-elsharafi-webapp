import { practice } from "@/content/practice";
import { Fill } from "./LegalPage";

// Draft that describes what this site actually does. Must be reviewed before launch;
// update it whenever a provider, analytics or embed changes.
export function Privacy() {
  return (
    <>
      <h2>1. Verantwortliche Stelle</h2>
      <p>
        {practice.name}, <Fill>Inhaber</Fill><br />
        {practice.street}, {practice.postalCode} {practice.city}<br />
        Telefon: <a href={`tel:${practice.phone.tel}`}>{practice.phone.display}</a>, E-Mail: <a href={`mailto:${practice.email}`}>{practice.email}</a>
      </p>
      <p><Fill>Datenschutzbeauftragte Person, falls benannt</Fill></p>

      <h2>2. Hosting und Server-Logdateien</h2>
      <p>
        Die Website wird bei Vercel Inc. betrieben und aus einem Rechenzentrum in Frankfurt am Main ausgeliefert.
        Beim Aufruf verarbeitet der Server technisch notwendige Daten wie IP-Adresse, Datum und Uhrzeit, aufgerufene
        Adresse und Browsertyp, um die Seite auszuliefern und vor Missbrauch zu schützen (Art. 6 Abs. 1 lit. f DSGVO).
        <Fill>Auftragsverarbeitungsvertrag, Speicherdauer der Logs und Drittlandübermittlung (USA) prüfen</Fill>
      </p>

      <h2>3. Keine Cookies, kein Tracking</h2>
      <p>
        Diese Website setzt keine Cookies und verwendet keine Analyse- oder Werbedienste. Schriftarten werden von unserem
        eigenen Server geladen, nicht von Drittanbietern.
      </p>

      <h2>4. Kontaktformular</h2>
      <p>
        Wenn Sie uns über das Formular schreiben, verarbeiten wir Name, E-Mail-Adresse, Anliegen, Ihre Nachricht und
        freiwillig Ihre Telefonnummer, um Ihre Anfrage zu beantworten (Art. 6 Abs. 1 lit. a und b DSGVO). Die Website
        speichert die Angaben nicht; sie werden einmalig per E-Mail an die Praxis übermittelt über
        <Fill> E-Mail-Dienstleister</Fill>. Ihre Einwilligung können Sie jederzeit widerrufen. Bitte senden Sie über das
        Formular keine Gesundheitsdaten.
      </p>

      <h2>5. Google Maps</h2>
      <p>
        Die Karte wird erst geladen, wenn Sie auf „Karte laden“ klicken. Dann übermittelt Ihr Browser Daten wie Ihre
        IP-Adresse an Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland; eine Übermittlung in die USA
        ist möglich. Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Ohne Klick findet keine
        Verbindung zu Google statt.
      </p>

      <h2>6. Links zu anderen Anbietern</h2>
      <p>
        Für die Terminbuchung verlinken wir auf Doctolib, für Bewertungen auf Google. Erst wenn Sie einem dieser Links
        folgen, gelten die Datenschutzbestimmungen des jeweiligen Anbieters.
      </p>

      <h2>7. Ihre Rechte</h2>
      <p>
        Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit
        und Widerspruch (Art. 15–21 DSGVO) sowie auf Widerruf einer Einwilligung. Sie können sich bei der Berliner
        Beauftragten für Datenschutz und Informationsfreiheit beschweren.
      </p>

      <p className="legal-date">Stand: <Fill>Datum der Freigabe</Fill></p>
    </>
  );
}
