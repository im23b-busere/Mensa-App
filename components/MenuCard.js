export default function MenuCard({ datum, gerichte }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold capitalize">{datum}</h2>
        <span className="text-sm text-gray-500">{new Date().toLocaleDateString('de-DE')}</span>
      </div>
      <div className="space-y-3">
        {gerichte.map((gericht, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-2">
            <div className="flex-1">
              <span className="font-medium block sm:inline">{gericht.name}</span>
              <span className="text-sm text-gray-500 ml-0 sm:ml-2 block sm:inline">({gericht.kategorie})</span>
            </div>
            <span className="font-semibold mt-1 sm:mt-0">{gericht.preis}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 