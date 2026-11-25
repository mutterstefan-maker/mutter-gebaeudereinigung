# Mutter Gebäudereinigung – Webseite

Statische, mobil optimierte Webseite (HTML, CSS, JavaScript – ohne Build-Schritt, ohne Abhängigkeiten).

## Struktur

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite (Hero, Leistungen Firmen/Privat, Festverträge, Ablauf, Ansprechpartner, FAQ, Kontakt) |
| `impressum.html` | Impressum (Demo-Daten) |
| `datenschutz.html` | Datenschutzerklärung (Demo-Text) |
| `agb.html` | Allgemeine Geschäftsbedingungen (Demo-Text) |
| `css/style.css` | Design (Wasserblau, Farb-Tokens in `:root`) |
| `js/main.js` | Alle Animationen, Menü, Formular |
| `assets/logo.svg` | Platzhalter-Logo – durch echtes Logo ersetzen |
| `assets/favicon.svg` | Browser-Icon |

## Vor dem Livegang anpassen

1. **Logo:** Platzhalter in `assets/logo.svg` und im Header (`<svg class="logo-mark">`) ersetzen.
2. **Rechtstexte:** In `impressum.html`, `datenschutz.html`, `agb.html` alle Demo-Daten (Name, Adresse, USt-IdNr., Gewerbe-Nr., E-Mail) ersetzen. Die Texte rechtlich prüfen lassen. Den gelben Hinweis „Demo-Inhalt“ danach entfernen.
3. **Öffnungszeiten:** In `index.html` steht „Mo–Fr, 8–18 Uhr (Demo-Zeiten)“.
4. **Kontaktformular:** Standardmäßig öffnet das Formular WhatsApp mit der vorbereiteten Anfrage. Optional: In `index.html` bei `<form id="contactForm" data-endpoint="">` eine Formspree-URL (oder anderen Form-Endpoint) eintragen, dann wird die Anfrage per POST versendet.

## Animationen

Scroll-Reveal (Fade/Slide/Zoom), animierter Hero-Text mit Buchstaben-Split, morphende Blobs mit Parallax, Canvas-Blasen, Preloader mit Tropfen, Scroll-Fortschrittsbalken, Marquee, Wellen-Divider, Vorher/Nachher-Regler, Tilt-Karten, magnetische Buttons, Ripple-Effekt, Shimmer-Buttons, eigener Cursor (nur Desktop), Timeline-Füllung beim Scrollen, Tabs mit gleitendem Indikator, FAQ-Akkordeon, pulsierender WhatsApp-Button, Zurück-nach-oben-Button.

Alle Bewegungen werden bei aktivierter Einstellung „Bewegung reduzieren“ des Betriebssystems abgeschaltet.

## Lokal ansehen

Einfach `index.html` im Browser öffnen, oder per Mini-Server:

```
python -m http.server 8000
```

## Veröffentlichung

GitHub Pages (Branch `main`, Ordner `/`). Die Datei `.nojekyll` sorgt dafür, dass alles unverändert ausgeliefert wird.
