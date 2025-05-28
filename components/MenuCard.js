export default function MenuCard({ datum, gerichte }) {
  const allergeneLegende = {
    'A': 'Gluten',
    'L': 'Laktose'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold capitalize">{datum}</h2>
        <span className="text-sm text-gray-500">{new Date().toLocaleDateString('de-DE')}</span>
      </div>
      <div className="space-y-4">
        {gerichte.map((gericht, index) => (
          <div key={index} className="border-b pb-4 last:border-b-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-medium text-lg text-gray-800">{gericht.name}</span>
                <div className="flex gap-2 mt-1">
                  {gericht.vegan ? (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">Vegan</span>
                  ) : gericht.vegetarisch && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">Vegetarisch</span>
                  )}
                </div>
              </div>
              <span className="font-semibold text-gray-800">{gericht.preis}</span>
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-gray-700">
                <span className="font-medium text-gray-800">Zutaten:</span> {gericht.zutaten.join(', ')}
              </p>
              {gericht.allergene.length > 0 && (
                <div className="mt-1">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-gray-800">Allergene:</span>{' '}
                    {gericht.allergene.map(code => allergeneLegende[code]).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 