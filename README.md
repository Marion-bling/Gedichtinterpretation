# Gedichte deuten – Lernwebsite zur Gedichtinterpretation

Unterrichtseinheit für die Klasse 11 am beruflichen Gymnasium: sechs Aspekte der Gedichtanalyse, Barock (Gryphius) und Expressionismus (van Hoddis, Heym, Lichtenstein), Interpretation schreiben, Epochenvergleich.

Die Seite besteht nur aus HTML, CSS und JavaScript. Sie braucht keinen Server, keine Anmeldung und lädt keine externen Dienste. Notizen, Markierungen und Häkchen der Schülerinnen und Schüler bleiben nur im Browser ihres Geräts gespeichert.

## Auf GitHub Pages veröffentlichen

1. Bei [github.com](https://github.com) anmelden (oder ein kostenloses Konto anlegen).
2. Oben rechts auf **+** → **New repository** klicken. Einen Namen vergeben, z. B. `gedichtinterpretation`, **Public** wählen und auf **Create repository** klicken.
3. Auf der neuen, leeren Seite auf **uploading an existing file** klicken.
4. Den **Inhalt** des Ordners `gedichtinterpretation` (alle HTML-Dateien sowie die Ordner `css` und `js`) per Drag-and-drop in das Browserfenster ziehen. Wichtig: `index.html` muss auf der obersten Ebene liegen, nicht in einem Unterordner.
5. Unten auf **Commit changes** klicken.
6. Im Repository auf **Settings** → links **Pages** gehen. Unter **Branch** `main` und `/ (root)` auswählen und **Save** klicken.
7. Nach ein bis zwei Minuten erscheint oben auf derselben Seite die Adresse, meist `https://IHR-BENUTZERNAME.github.io/gedichtinterpretation/`. Diesen Link geben Sie an die Klasse weiter (z. B. als QR-Code).

Änderungen: Datei im Repository anklicken, auf das Stift-Symbol klicken, bearbeiten, **Commit changes**. Die Seite aktualisiert sich nach kurzer Zeit.

## Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | Start, Lernziele, Ablaufplan, Fortschritt |
| `werkzeugkasten.html` | Modul 1 (DS 1–2): Einstieg, sechs Analyseaspekte |
| `barock.html` | Modul 2 (DS 3–4): Epoche Barock, „Es ist alles eitel“ |
| `expressionismus.html` | Modul 3 (DS 5–6): Epoche, „Weltende“, „Der Gott der Stadt“, „Die Dämmerung“ |
| `interpretation.html` | Modul 4 (DS 7): Deutungshypothese, Aufbau, Zitieren, Schreibkonferenz |
| `vergleich.html` | Modul 5 (DS 8): Epochenvergleich, Abschlussinterpretation |
| `glossar.html` | Fachbegriffe mit Suchfunktion |
| `css/style.css` | Gestaltung (inkl. Dunkelmodus und Druckansicht) |
| `js/script.js` | Quiz, Zuordnungen, Textmarker, Notizen, Fortschritt |

## Hinweise für die Lehrkraft

- **Gedichttexte:** Alle Texte sind gemeinfrei. Die Schreibweise der Barockgedichte ist leicht modernisiert; bitte vor dem Einsatz mit der im Unterricht verwendeten Textausgabe abgleichen.
- **Galeriegang (Modul 3):** Die Gemälde sind nicht eingebunden, um Urheberrechtsfragen zu vermeiden. Die Schülerinnen und Schüler suchen sie selbst, oder Sie bringen Ausdrucke mit.
- **Speichern:** Die Daten liegen im `localStorage` des Browsers. Auf geteilten Schulgeräten können andere sie sehen; auf der Startseite gibt es eine Schaltfläche zum Löschen. Im privaten Modus geht beim Schließen alles verloren.
- **Anpassen:** Zeitangaben, Sozialformen und Aufgaben stehen direkt im HTML und lassen sich mit jedem Texteditor ändern.
