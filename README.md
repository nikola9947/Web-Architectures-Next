## Testing Strategy – Test-Pyramide

| Ebene | Was testen wir bei uns? | Tool |
|---|---|---|
| Unit | Reine Hilfsfunktionen, z. B. Eingabevalidierung für Login/Register oder Datum-Formatierung | Vitest |
| Integration | Backend-Routen, z. B. POST /api/auth/register erstellt User und POST /api/entries erstellt Journal-Eintrag | Vitest |
| E2E | Kompletter User-Flow: Registrieren/Login, Mood auswählen, Journal-Eintrag erstellen, Skill hinzufügen | Cypress |

### Kritische Bereiche im Projekt

| Bereich | Warum kritisch? |
|---|---|
| Login/Register/Auth | Wenn das kaputtgeht, können User sich nicht anmelden oder registrieren. |
| Mood- und Journal-Einträge speichern | Wenn das kaputtgeht, verliert die App ihren Hauptnutzen, weil keine persönlichen Daten gespeichert werden können. |

## Agent als Test-Schreiber

Für größere Testabdeckung verwenden wir den Agenten gezielt als Unterstützung beim Schreiben von Unit Tests.

### Beispiel-Prompt Frontend

```txt
Schreibe Vitest Unit Tests für validatePassword aus frontend/src/utils/validation.js.
Decke folgende Fälle ab:
- Normalfall
- leerer Input
- ungültiger Typ
- Passwort genau 6 Zeichen lang