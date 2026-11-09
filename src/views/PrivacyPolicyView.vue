<template>
  <article class="mx-auto max-w-4xl py-8 text-gray-800 dark:text-gray-100">
    <h1 class="mb-3 text-3xl font-bold">Datenschutzerklärung</h1>
    <p class="mb-6 text-sm text-gray-600 dark:text-gray-400">Stand: 2. November 2026</p>

    <aside
      class="mb-8 rounded-lg border border-amber-400 bg-amber-50 p-4 text-amber-950 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100"
    >
      <p class="font-semibold">Vor der Veröffentlichung vervollständigen</p>
      <p class="mt-1">
        Die Angaben in eckigen Klammern müssen durch die verantwortliche Stelle ergänzt werden.
        Insbesondere Betreiber, Kontakt, Hosting, NocoDB-Anbieter, Speicherort und Löschfristen sind
        aus dem Projektcode nicht verlässlich feststellbar. Bitte lassen Sie diese Erklärung vor dem
        Einsatz rechtlich und technisch prüfen.
      </p>
    </aside>

    <section class="mb-8">
      <h2 class="mb-2 text-xl font-semibold">1. Verantwortliche Stelle</h2>
      <p>Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website ist:</p>
      <address class="mt-2 not-italic">
        [Vollständiger Name der verantwortlichen Stelle]<br />
        [Anschrift]<br />
        E-Mail: [Datenschutz- oder Kontakt-E-Mail]
      </address>
      <p class="mt-2">
        Ob das Berufsschulzentrum Radolfzell, ein Schulträger oder eine andere Stelle
        datenschutzrechtlich verantwortlich ist, muss der Betreiber verbindlich festlegen.
      </p>
      <p class="mt-2">
        Eine Datenschutzbeauftragte oder ein Datenschutzbeauftragter ist erreichbar unter:
        [Kontaktdaten oder Hinweis, falls keine Benennung erforderlich ist].
      </p>
    </section>

    <section class="mb-8">
      <h2 class="mb-2 text-xl font-semibold">2. Allgemeine Hinweise und Rechtsgrundlagen</h2>
      <p>
        Wir verarbeiten personenbezogene Daten nur, soweit dies für den Betrieb dieser Website, die
        Bereitstellung ihrer Funktionen oder die Bearbeitung Ihrer Anfragen erforderlich ist. Je
        nach Verarbeitung erfolgt dies auf Grundlage von Art. 6 Abs. 1 lit. a, b, c oder f DSGVO.
        Soweit eine Einwilligung erforderlich ist, können Sie diese jederzeit mit Wirkung für die
        Zukunft widerrufen.
      </p>
      <p class="mt-2">
        Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder
        identifizierbare Person beziehen.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="mb-2 text-xl font-semibold">3. Hosting und Server-Protokolle</h2>
      <p>
        Beim Aufruf der Website verarbeitet der Hosting-Anbieter technisch erforderliche
        Verbindungsdaten (insbesondere IP-Adresse, Zeitpunkt des Zugriffs, aufgerufene Ressource,
        übertragene Datenmenge sowie Browser- und Betriebssysteminformationen), um die Website
        auszuliefern und die Sicherheit und Stabilität des Betriebs zu gewährleisten.
      </p>
      <p class="mt-2">
        Hosting-Anbieter: [Name und Anschrift des Hosting-Anbieters]. Serverstandort: [Land/Region].
        Protokolldaten werden für [konkrete Speicherdauer] gespeichert und anschließend gelöscht,
        sofern sie nicht zur Aufklärung eines Sicherheitsvorfalls benötigt werden. Rechtsgrundlage
        ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist der sichere und
        zuverlässige Betrieb der Website.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="mb-2 text-xl font-semibold">4. Datenbank und Website-Inhalte (NocoDB)</h2>
      <p>
        Die Website ruft Inhalte wie Baumarten und Standorte von einer NocoDB-Datenbank ab. Die
        Verbindung wird über die im Browser ausgeführte Anwendung hergestellt. Dabei werden
        Verbindungsdaten (einschließlich Ihrer IP-Adresse) und die für die jeweilige Funktion
        erforderlichen Abfrage- oder Eingabedaten an den konfigurierten NocoDB-Dienst übertragen.
      </p>
      <p class="mt-2">
        Anbieter und Betreiber der Datenbank: [Name und Anschrift]. Serverstandort: [Land/Region].
        Angaben zu einem Auftragsverarbeitungsvertrag und etwaigen Übermittlungen in Drittländer:
        [ergänzen]. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Verarbeitung zur
        Bereitstellung eines angefragten Kontos oder einer Funktion erforderlich ist, ansonsten Art.
        6 Abs. 1 lit. f DSGVO für den Betrieb des Projektangebots.
      </p>
      <p class="mt-2">
        Bitte beachten Sie: Die tatsächlichen Empfänger, Speicherorte, Zugriffsberechtigungen und
        Löschfristen richten sich nach der produktiven NocoDB-Konfiguration und müssen vom Betreiber
        ergänzt werden.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="mb-2 text-xl font-semibold">5. Benutzerkonto</h2>
      <p>
        Wenn Sie ein Konto erstellen oder sich anmelden, verarbeiten wir Ihren Benutzernamen, Ihre
        E-Mail-Adresse und Ihr Passwort. Das Passwort wird laut Anwendung vor der Übermittlung mit
        bcrypt gehasht. Die Kontodaten dienen der Kontoerstellung und Anmeldung; Rechtsgrundlage ist
        Art. 6 Abs. 1 lit. b DSGVO.
      </p>
      <p class="mt-2">
        Nach der Anmeldung speichert die Anwendung im lokalen Speicher Ihres Browsers unter anderem
        Benutzerkennung, Benutzername, E-Mail-Adresse sowie Anmelde-, Erneuerungs- und CSRF-Token.
        Diese Daten werden für die angemeldeten Funktionen verwendet und beim Abmelden entfernt.
        Eine aktivierte Anmeldeerinnerung und die gewählte Darstellung können ebenfalls lokal
        gespeichert werden. Einträge im Browser-Speicher können Sie außerdem über die Einstellungen
        Ihres Browsers löschen. Der Betreiber sollte die vorgesehene Speicherdauer und das Verfahren
        zur Kontolöschung festlegen: [ergänzen].
      </p>
    </section>

    <section class="mb-8">
      <h2 class="mb-2 text-xl font-semibold">6. Baumeinträge</h2>
      <p>
        Wenn Sie über die Website einen Baumeintrag anlegen, werden die von Ihnen eingegebene
        Nachricht (sofern angegeben), die Anzahl, die ausgewählte Baumart und der Standort sowie der
        Erstellungszeitpunkt gespeichert. Bei angemeldeten Personen wird der Eintrag außerdem dem
        Benutzerkonto zugeordnet. Die Verarbeitung dient der Bereitstellung dieser Funktion und
        erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.
      </p>
      <p class="mt-2">
        Speicherdauer und Sichtbarkeit von Baumeinträgen: [Der Betreiber muss festlegen, wie lange
        Einträge gespeichert werden und ob bzw. welche Angaben öffentlich angezeigt werden.]
      </p>
    </section>

    <section class="mb-8">
      <h2 class="mb-2 text-xl font-semibold">7. Karten und externe Kartendienste</h2>
      <p>
        Auf der Kartenansicht können Kartenkacheln von OpenStreetMap und Esri (ArcGIS World Imagery)
        geladen werden. Erst beim Aufruf bzw. der Nutzung der Karte stellt Ihr Browser Verbindungen
        zu den Servern dieser Anbieter her. Dabei werden insbesondere Ihre IP-Adresse, technische
        Browserdaten und die angefragten Kartenkacheln übermittelt. Auf diese Datenverarbeitung
        durch die Anbieter haben wir keinen unmittelbaren Einfluss.
      </p>
      <ul class="mt-2 list-inside list-disc">
        <li>
          OpenStreetMap:
          <a
            class="text-blue-700 underline dark:text-blue-300"
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
            >Informationen zum Urheberrecht und Datenschutz</a
          >
        </li>
        <li>
          Esri:
          <a
            class="text-blue-700 underline dark:text-blue-300"
            href="https://www.esri.com/en-us/privacy/overview"
            target="_blank"
            rel="noopener noreferrer"
            >Datenschutzhinweise</a
          >
        </li>
      </ul>
      <p class="mt-2">
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO für die Bereitstellung der Kartenfunktion.
        Falls die konkrete Kartenintegration eine Einwilligung erfordert, muss diese vor dem Laden
        der externen Inhalte eingeholt werden.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="mb-2 text-xl font-semibold">8. Cookies und lokaler Speicher</h2>
      <p>
        Die Anwendung setzt nach dem derzeitigen Projektstand keine Analyse- oder Marketing-Cookies
        ein. Sie speichert jedoch für notwendige Funktionen bestimmte Angaben lokal im Browser,
        darunter die gewählte Darstellung (Hell-/Dunkelmodus) und – nach Anmeldung – die oben
        beschriebenen Konto- und Tokeninformationen. Diese Speicherung erfolgt auf Grundlage von §
        25 Abs. 2 TDDDG, soweit sie unbedingt erforderlich ist, um ausdrücklich gewünschte
        Funktionen bereitzustellen. Soweit dabei personenbezogene Daten verarbeitet werden, gilt
        ergänzend die jeweils einschlägige Rechtsgrundlage nach Art. 6 DSGVO.
      </p>
      <p class="mt-2">
        Sie können den lokalen Speicher über Ihren Browser löschen. Dadurch können Funktionen wie
        die Anmeldung oder die gespeicherte Darstellungseinstellung zurückgesetzt werden.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="mb-2 text-xl font-semibold">9. Speicherdauer</h2>
      <p>
        Wir speichern personenbezogene Daten nur so lange, wie dies für den jeweiligen Zweck
        erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen. Die konkreten
        Löschfristen für Hosting-Protokolle, Konten und Baumeinträge müssen vom Betreiber festgelegt
        und hier ergänzt werden. Daten im lokalen Browserspeicher können Sie selbst löschen;
        Anmeldeinformationen werden beim Abmelden entfernt.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="mb-2 text-xl font-semibold">10. Ihre Rechte</h2>
      <p>Sie haben im Rahmen der gesetzlichen Voraussetzungen das Recht auf:</p>
      <ul class="mt-2 list-inside list-disc">
        <li>Auskunft über Ihre gespeicherten personenbezogenen Daten (Art. 15 DSGVO),</li>
        <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO),</li>
        <li>Löschung (Art. 17 DSGVO) und Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO),</li>
        <li>
          Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21 DSGVO),
        </li>
        <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft.</li>
      </ul>
      <p class="mt-2">
        Für die Ausübung Ihrer Rechte wenden Sie sich bitte an die oben genannte verantwortliche
        Stelle. Sie haben außerdem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu
        beschweren. Für Baden-Württemberg ist dies der Landesbeauftragte für den Datenschutz und die
        Informationsfreiheit Baden-Württemberg:
        <a
          class="text-blue-700 underline dark:text-blue-300"
          href="https://www.baden-wuerttemberg.datenschutz.de/"
          target="_blank"
          rel="noopener noreferrer"
          >baden-wuerttemberg.datenschutz.de</a
        >.
      </p>
    </section>

    <section>
      <h2 class="mb-2 text-xl font-semibold">11. Aktualität</h2>
      <p>
        Wir passen diese Datenschutzerklärung an, wenn sich die Website oder die Datenverarbeitung
        ändert. Es gilt die oben angegebene Fassung.
      </p>
    </section>
  </article>
</template>
