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

## Frontend

Es stehen einfache Seiten unter `/login` und `/register` bereit. Die Formulare
auf diesen Seiten senden Daten an die entsprechenden API-Endpunkte und speichern
das erhaltene JWT bei Erfolg im `localStorage`.

## Konfiguration

Die Datenbankverbindung und das JWT-Geheimnis werden über folgende Umgebungsvariablen konfiguriert:

```
DB_HOST=<host>
DB_USER=<benutzer>
DB_PASS=<passwort>
DB_NAME=<datenbank>
JWT_SECRET=<geheimnis>
```

## Datenbankschema

Die Datei `schema.sql` erstellt die benötigten Tabellen. Sie kann zum Beispiel mit folgendem Befehl ausgeführt werden:

```bash
mysql -u <benutzer> -p <datenbank> < schema.sql
```

- **POST /api/order**
  - Authentifizierung per JWT erforderlich (Authorization Header)
  - Felder: `mealName`, `date`, `time`
  - Speichert eine Vorbestellung in der Datenbank und gibt bei Erfolg `{ success: true }` zurück

