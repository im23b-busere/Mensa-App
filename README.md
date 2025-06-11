# Mensa-App

Dieses Projekt beinhaltet einfache API-Endpunkte für die Registrierung und Anmeldung.

## Endpunkte

- **POST /api/register**
  - Felder: `name`, `email`, `password`
  - Validierung auf leere Felder und korrekte E-Mail-Adresse
  - Passwort wird mit `bcrypt` gehasht und der Nutzer in MySQL gespeichert
  - Antwort enthält ein JWT

- **POST /api/login**
  - Felder: `email`, `password`
  - Überprüft die Anmeldedaten und gibt bei Erfolg ein JWT zurück

- **GET /api/protected**
  - Beispiel für eine geschützte Route, die ein gültiges JWT erwartet

## Konfiguration

Die Datenbankverbindung und das JWT-Geheimnis werden über folgende Umgebungsvariablen konfiguriert:

```
DB_HOST=<host>
DB_USER=<benutzer>
DB_PASS=<passwort>
DB_NAME=<datenbank>
JWT_SECRET=<geheimnis>
```
