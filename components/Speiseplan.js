import MenuCard from './MenuCard';

export default function Speiseplan({ filter }) {
  const speiseplan = {
    montag: [
      { name: "Schnitzel mit Pommes", preis: "4,50 €", kategorie: "Hauptgericht" },
      { name: "Vegetarische Lasagne", preis: "3,80 €", kategorie: "Vegetarisch" },
      { name: "Gemischter Salat", preis: "2,50 €", kategorie: "Beilage" }
    ],
    dienstag: [
      { name: "Spaghetti Bolognese", preis: "4,20 €", kategorie: "Hauptgericht" },
      { name: "Gemüsepfanne mit Reis", preis: "3,90 €", kategorie: "Vegetarisch" },
      { name: "Kartoffelsuppe", preis: "2,80 €", kategorie: "Suppe" }
    ],
    mittwoch: [
      { name: "Hähnchenbrust mit Gemüse", preis: "4,80 €", kategorie: "Hauptgericht" },
      { name: "Falafel mit Hummus", preis: "3,70 €", kategorie: "Vegetarisch" },
      { name: "Obstsalat", preis: "2,30 €", kategorie: "Dessert" }
    ],
    donnerstag: [
      { name: "Fischfilet mit Kartoffeln", preis: "5,00 €", kategorie: "Hauptgericht" },
      { name: "Quinoa Bowl", preis: "4,20 €", kategorie: "Vegetarisch" },
      { name: "Möhrensuppe", preis: "2,80 €", kategorie: "Suppe" }
    ],
    freitag: [
      { name: "Currywurst mit Pommes", preis: "4,30 €", kategorie: "Hauptgericht" },
      { name: "Gemüsecurry mit Reis", preis: "3,90 €", kategorie: "Vegetarisch" },
      { name: "Joghurt mit Früchten", preis: "2,50 €", kategorie: "Dessert" }
    ]
  };

  const filterGerichte = (gerichte) => {
    if (filter === 'alle') return gerichte;
    return gerichte.filter(gericht => 
      gericht.kategorie.toLowerCase() === filter.toLowerCase()
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Aktuelle Woche</h2>
        <div className="text-sm text-gray-600">
          {new Date().toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long' })}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(speiseplan).map(([tag, gerichte]) => {
          const gefilterteGerichte = filterGerichte(gerichte);
          if (gefilterteGerichte.length === 0) return null;
          
          return (
            <MenuCard 
              key={tag} 
              datum={tag} 
              gerichte={gefilterteGerichte} 
            />
          );
        })}
      </div>
    </div>
  );
} 