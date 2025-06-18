export default function MenuCard({ datum, gerichte }) {
  const allergeneLegende = {
    'A': 'Gluten',
    'L': 'Laktose'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-xl font-bold capitalize text-gray-800">{datum}</h2>
        <span className="text-xs text-gray-400 font-medium">{new Date().toLocaleDateString('de-DE')}</span>
      </div>
      <div className="space-y-5">
        {gerichte.map((gericht, index) => (
          <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
              <div>
                <span className="font-semibold text-lg text-gray-900">{gericht.name}</span>
                <div className="flex gap-2 mt-1">
                  {gericht.vegan ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">Vegan</span>
                  ) : gericht.vegetarisch && (
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded font-semibold">Vegetarisch</span>
                  )}
                </div>
              </div>
              <span className="font-bold text-primary text-base">{gericht.preis}</span>
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-700">
                <span className="font-medium text-gray-800">Zutaten:</span> {gericht.zutaten.join(', ')}
              </p>
              {gericht.allergene.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium text-gray-700">Allergene:</span>{' '}
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