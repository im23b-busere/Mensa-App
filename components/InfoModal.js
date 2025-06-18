'use client';
export default function InfoModal({ meal, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg p-6 w-80 space-y-4">
        <h3 className="text-lg font-semibold">{meal.title}</h3>
        {meal.ingredients && (
          <p className="text-sm text-gray-700">
            <span className="font-medium text-gray-800">Zutaten:</span>{' '}
            {meal.ingredients}
          </p>
        )}
        {meal.allergens && (
          <p className="text-sm text-gray-700">
            <span className="font-medium text-gray-800">Allergene:</span>{' '}
            {meal.allergens}
          </p>
        )}
        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded bg-primary text-white">
            Schliessen
          </button>
        </div>
      </div>
    </div>
  );
}
