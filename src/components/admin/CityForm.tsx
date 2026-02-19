import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export interface CityData {
  name: string;
  description: string;
  imageUrl?: string;
  color?: string; // Gradient class
}

interface CityFormProps {
  initialData?: Partial<CityData>;
  onSubmit: (data: CityData) => Promise<void>;
  buttonText: string;
}

const GRADIENTS = [
  'from-blue-600 to-blue-800',
  'from-orange-500 to-red-600',
  'from-emerald-600 to-teal-800',
  'from-purple-600 to-indigo-800',
  'from-pink-500 to-rose-600',
  'from-cyan-500 to-blue-600',
  'from-amber-500 to-orange-600',
  'from-fuchsia-600 to-purple-700'
];

const CityForm: React.FC<CityFormProps> = ({ initialData, onSubmit, buttonText }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CityData>({
    name: '',
    description: '',
    imageUrl: '',
    color: '',
    ...initialData
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Logic: If no image is provided, ensure a color is set.
    // If no color was manually set (we don't have a picker yet, assuming auto), pick one.
    let dataToSubmit = { ...formData };

    if (!dataToSubmit.imageUrl && !dataToSubmit.color) {
      const randomGradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
      dataToSubmit.color = randomGradient;
    }

    if (dataToSubmit.imageUrl) {
      // If image is present, we might want to clear color or keep it as backup.
      // Keeping it is safer.
      if (!dataToSubmit.color) {
        dataToSubmit.color = GRADIENTS[0]; // Default backup
      }
    }

    try {
      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Hubo un problema al guardar', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-md">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Nombre de la Ciudad/Zona</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Ej: Iquique"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Descripción Corta</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Ej: Tierra de campeones"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">URL de Imagen (Opcional)</label>
        <input
          type="url"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="https://... (Si se deja vacío, se usará un color aleatorio)"
        />
        <p className="text-xs text-gray-500 mt-1">Si no se proporciona imagen, se asignará un fondo de color aleatorio.</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 bg-primary text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Guardando...' : buttonText}
      </button>
    </form>
  );
};

export default CityForm;
