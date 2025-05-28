import MenuCard from './MenuCard';

export default function Speiseplan({ filter }) {
  const speiseplan = {
    montag: [
      { 
        name: "Schnitzel mit Pommes", 
        preis: "4,50 €", 
        kategorie: "Hauptgericht",
        zutaten: ["Schweineschnitzel", "Pommes Frites", "Zitrone", "Petersilie"],
        allergene: ["A"],
        vegetarisch: false,
        vegan: false
      },
      { 
        name: "Vegetarische Lasagne", 
        preis: "3,80 €", 
        kategorie: "Vegetarisch",
        zutaten: ["Nudelblätter", "Tomaten", "Zucchini", "Aubergine", "Käse", "Bechamelsauce"],
        allergene: ["A", "L"],
        vegetarisch: true,
        vegan: false
      },
      { 
        name: "Gemischter Salat", 
        preis: "2,50 €", 
        kategorie: "Beilage",
        zutaten: ["Eisbergsalat", "Tomaten", "Gurken", "Paprika", "Oliven"],
        allergene: [],
        vegetarisch: true,
        vegan: true
      }
    ],
    dienstag: [
      { 
        name: "Spaghetti Bolognese", 
        preis: "4,20 €", 
        kategorie: "Hauptgericht",
        zutaten: ["Spaghetti", "Hackfleisch", "Tomaten", "Zwiebeln", "Karotten", "Sellerie"],
        allergene: ["A"],
        vegetarisch: false,
        vegan: false
      },
      { 
        name: "Gemüsepfanne mit Reis", 
        preis: "3,90 €", 
        kategorie: "Vegetarisch",
        zutaten: ["Reis", "Brokkoli", "Karotten", "Paprika", "Zucchini", "Sojasauce"],
        allergene: ["A"],
        vegetarisch: true,
        vegan: true
      },
      { 
        name: "Kartoffelsuppe", 
        preis: "2,80 €", 
        kategorie: "Suppe",
        zutaten: ["Kartoffeln", "Zwiebeln", "Karotten", "Sellerie", "Sahne"],
        allergene: ["A", "L"],
        vegetarisch: true,
        vegan: false
      }
    ],
    mittwoch: [
      { 
        name: "Hähnchenbrust mit Gemüse", 
        preis: "4,80 €", 
        kategorie: "Hauptgericht",
        zutaten: ["Hähnchenbrust", "Karotten", "Brokkoli", "Zucchini", "Reis"],
        allergene: ["A"],
        vegetarisch: false,
        vegan: false
      },
      { 
        name: "Falafel mit Hummus", 
        preis: "3,70 €", 
        kategorie: "Vegetarisch",
        zutaten: ["Falafel", "Hummus", "Fladenbrot", "Salat", "Tahini"],
        allergene: ["A"],
        vegetarisch: true,
        vegan: true
      },
      { 
        name: "Obstsalat", 
        preis: "2,30 €", 
        kategorie: "Dessert",
        zutaten: ["Äpfel", "Bananen", "Orangen", "Trauben", "Joghurt"],
        allergene: ["L"],
        vegetarisch: true,
        vegan: false
      }
    ],
    donnerstag: [
      { 
        name: "Fischfilet mit Kartoffeln", 
        preis: "5,00 €", 
        kategorie: "Hauptgericht",
        zutaten: ["Fischfilet", "Kartoffeln", "Zitrone", "Dill", "Butter"],
        allergene: ["A", "L"],
        vegetarisch: false,
        vegan: false
      },
      { 
        name: "Quinoa Bowl", 
        preis: "4,20 €", 
        kategorie: "Vegan",
        zutaten: ["Quinoa", "Avocado", "Kichererbsen", "Tomaten", "Gurken", "Olivenöl"],
        allergene: [],
        vegetarisch: true,
        vegan: true
      },
      { 
        name: "Möhrensuppe", 
        preis: "2,80 €", 
        kategorie: "Suppe",
        zutaten: ["Möhren", "Zwiebeln", "Ingwer", "Kokosmilch", "Curry"],
        allergene: [],
        vegetarisch: true,
        vegan: true
      }
    ],
    freitag: [
      { 
        name: "Currywurst mit Pommes", 
        preis: "4,30 €", 
        kategorie: "Hauptgericht",
        zutaten: ["Currywurst", "Pommes Frites", "Currysauce", "Ketchup"],
        allergene: ["A"],
        vegetarisch: false,
        vegan: false
      },
      { 
        name: "Gemüsecurry mit Reis", 
        preis: "3,90 €", 
        kategorie: "Vegetarisch",
        zutaten: ["Reis", "Gemüsemischung", "Kokosmilch", "Currypaste", "Koriander"],
        allergene: [],
        vegetarisch: true,
        vegan: true
      },
      { 
        name: "Joghurt mit Früchten", 
        preis: "2,50 €", 
        kategorie: "Dessert",
        zutaten: ["Joghurt", "Beerenmischung", "Honig", "Müsli"],
        allergene: ["L"],
        vegetarisch: true,
        vegan: false
      }
    ]
  };

  const filterGerichte = (gerichte) => {
    if (filter === 'alle') return gerichte;
    if (filter === 'vegetarisch') return gerichte.filter(gericht => gericht.vegetarisch);
    if (filter === 'vegan') return gerichte.filter(gericht => gericht.vegan);
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