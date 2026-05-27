# Weather Dashboard

Ein modernes, echtzeit-Wetter-Dashboard, das Wetterdaten von einer öffentlichen Wetter-API abruft.

## Features

### 🌍 Echtzeit-Wetterdaten
- Aktuelle Wetterbedingungen mit Temperatur, Luftfeuchtigkeit, Windgeschwindigkeit
- Detaillierte Wetterinformationen (Luftdruck, Sichtweite, UV-Index)
- Wettersymbol und Beschreibung

### 🔍 Intelligente Suche
- Suche nach jeder Stadt weltweit
- Auto-Vorschläge während der Eingabe
- Geolokalisierungsunterstützung (aktuellen Standort nutzen)

### 📊 Mehrere Vorhersagen
- **Stundliche Vorhersage**: Nächste 24 Stunden Wettervorhersage
- **7-Tage-Vorhersage**: Wöchentliche Wetteraussichten
- Sonnenauf- und Sonnenuntergangszeiten

### ⭐ Lieblingsstädte-System
- Lieblingsstädte speichern
- Schneller Zugriff auf gespeicherte Städte
- Persistente Speicherung mit localStorage

### 🎨 Modernes UI/UX
- Dunkles Design mit Gradient-Effekten
- Responsives Layout (Desktop, Tablet, Mobil)
- Sanfte Animationen und Übergänge
- Interaktive Karten und Hover-Effekte

## Technologien

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: WeatherAPI.com (Kostenlos)
- **Speicher**: LocalStorage für Favoriten
- **Icons**: Font Awesome

## API Integration

### WeatherAPI.com verwenden

Das Dashboard nutzt den kostenlosen Tier von [WeatherAPI.com](https://www.weatherapi.com/)

**Verfügbare Endpoints:**
```javascript
// Aktuelles Wetter
GET /current.json?key=YOUR_API_KEY&q=CITY

// 7-Tage-Vorhersage
GET /forecast.json?key=YOUR_API_KEY&q=CITY&days=7
```

**API Key:**
1. Registrieren bei [WeatherAPI.com](https://www.weatherapi.com/)
2. Kostenlosen API Key erhalten
3. `API_KEY` in `weather-script.js` ersetzen

## Dateistruktur

```
├── weather-dashboard.html      # Haupt-HTML-Datei
├── weather-styles.css          # Styling und Layout
├── weather-script.js           # JavaScript Logik & API Aufrufe
└── README-weather-dashboard.md # Diese Datei
```

## Verwendung

1. **Dashboard öffnen:**
   - `weather-dashboard.html` im Browser öffnen

2. **Stadt suchen:**
   - Stadtnamen in Suchfeld eingeben
   - Aus Vorschlägen wählen oder Enter drücken
   - Daten laden warten

3. **Standort nutzen:**
   - Standort-Icon-Button klicken
   - Browser-Berechtigung erlauben
   - Wetterdaten für deinen Standort laden

4. **Favoriten speichern:**
   - Stadt zu Favoriten hinzufügen
   - Später aus Lieblings-Sektion laden
   - Zum Anzeigen klicken

## Wichtige Funktionen

### `fetchWeatherData(location)`
Ruft aktuelle Wetterdaten und Vorhersage für einen Standort ab.

### `displayWeather(currentData, forecastData)`
Rendert alle Wetterinformationen im DOM.

### `displayHourlyForecast(hours)`
Zeigt nächste 24 Stunden in horizontaler Scroll-Ansicht.

### `displayDailyForecast(days)`
Zeigt 7-Tage-Vorhersage mit Max/Min-Temperaturen.

### `handleGeolocation()`
Nutzt Browser Geolocation API für Benutzerkoordinaten.

## Anpassung

### Farben ändern
CSS-Variablen in `weather-styles.css` bearbeiten:

```css
:root {
    --primary: #6366f1;      /* Hauptfarbe */
    --secondary: #a855f7;    /* Sekundärfarbe */
    --accent: #ec4899;       /* Akzentfarbe */
}
```

### Weitere Details hinzufügen
`displayWeather()` Funktion erweitern für:
- Luftqualitätsindex (AQI)
- Polleninfo
- Mondphase
- Niederschlagswahrscheinlichkeit

### API-Anbieter wechseln
API-Endpoints und Parse-Logik in `weather-script.js` anpassen

## Browser-Kompatibilität

- Chrome/Edge: ✅ Vollständig unterstützt
- Firefox: ✅ Vollständig unterstützt
- Safari: ✅ Vollständig unterstützt
- Mobile Browser: ✅ Responsives Design

## Performance-Tipps

- API-Aufrufe gedrosselt um Rate Limits zu vermeiden
- Daten in localStorage gecacht
- Bilder lazy-loaded
- Minimal CSS-Animationen für bessere Performance

## Zukünftige Verbesserungen

- [ ] Wetterwarnungen und Benachrichtigungen
- [ ] Luftqualitätsindex (AQI) Anzeige
- [ ] Historische Wetterdaten
- [ ] Mehrere Städte Vergleich
- [ ] Wetter-Diagramme und Graphen
- [ ] Dunkles/Helles Design Toggle
- [ ] Mehrsprachigkeit
- [ ] PWA-Funktionalitäten

## Fehlerbehebung

### API Key Fehler
- Stelle sicher, dass API Key gültig ist
- Überprüfe Rate Limits (kostenloses Tier hat Grenzen)
- Verifiziere Internetverbindung

### Geolokalisierung funktioniert nicht
- Überprüfe Browser-Berechtigungen
- HTTPS ist für Geolokalisierung erforderlich
- Nicht alle Browser unterstützen Geolokalisierung

### Daten laden nicht
- Browser-Konsole auf Fehler überprüfen
- Stadtnamen-Rechtschreibung verifizieren
- Mit großer Stadtname versuchen

## Weitere APIs

### OpenWeatherMap
```javascript
const API_KEY = 'your_openweathermap_key';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

// Aktuelles Wetter
GET /weather?q=CITY&appid=API_KEY&units=metric
```

### Open-Meteo (Kein API Key erforderlich!)
```javascript
// Geokodierung
GET https://geocoding-api.open-meteo.com/v1/search?name=CITY

// Wettervorhersage
GET https://api.open-meteo.com/v1/forecast?latitude=LATITUDE&longitude=LONGITUDE
```

## Credits

- Wetterdaten: [WeatherAPI.com](https://www.weatherapi.com/)
- Icons: [Font Awesome](https://fontawesome.com/)
- Design: Modernes Gradient Aesthetic

## Lizenz

Frei nutzbar und anpassbar für persönliche Projekte.
