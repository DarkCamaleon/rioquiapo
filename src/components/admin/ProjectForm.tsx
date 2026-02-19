import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import Swal from 'sweetalert2';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../configs/firebase';

interface ProjectFormProps {
  initialData?: Partial<Project>;
  onSubmit: (data: Omit<Project, 'id'>) => Promise<void>;
  buttonText: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, onSubmit, buttonText }) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  // Default to URL as per user request to avoid Storage costs
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('url');

  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    name: '',
    location: '',
    description: '',
    status: 'En Venta',
    imageUrl: '',
    bedrooms: '2-3 Dorm',
    bathrooms: '2 Baños',
    area: '70-90 m²',
    reverse: false,
    ...initialData
  });

  // Update form if initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
      // If we are editing and have an image, default to URL mode to show it?
      // Or maybe keep 'upload' to allow changing it?
      // Better: If url exists, maybe show URL mode? But URL usually is long firebase token.
      // Let's default to 'url' if there's an image, so user sees "Image URL set".
      // But for better UX, maybe just leave it as user selected or default 'upload'.
      // Actually, if we set 'url', the input will show the long URL.
      if (initialData.imageUrl) {
        setImageMode('url');
      }
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = formData.imageUrl;

      if (imageMode === 'upload' && imageFile) {
        // Upload image ONLY if mode is 'upload'
        const storageRef = ref(storage, `projects/${Date.now()}_${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              console.error(error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              finalImageUrl = downloadURL;
              resolve();
            }
          );
        });
      } else if (imageMode === 'url') {
        // If mode is URL, use the input value (already in formData.imageUrl)
        // Ensure we don't accidentally ignore it.
        finalImageUrl = formData.imageUrl;
      } else if (imageMode === 'upload' && !imageFile && !initialData?.imageUrl) {
        // Validation: If uploading but no file selected (and no previous image), maybe warn?
        // For now, allow saving without image if that's desired, or continue.
        // If editing, we might keep existing URL.
        // If mode is upload, we assume user wants to CHANGE image or keep if not provided?
        // Actually, if mode is upload and no file, we should probably keep existing URL if any.
        finalImageUrl = formData.imageUrl;
      }

      await onSubmit({ ...formData, imageUrl: finalImageUrl });
    } catch (error: any) {
      console.error(error);
      let errorMessage = 'Hubo un problema al guardar el proyecto.';
      if (error.code === 'storage/unauthorized') {
        errorMessage = 'Permiso denegado para subir imágenes via Storage.';
      }
      Swal.fire('Error', errorMessage, 'error');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Proyecto</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ej: Edificio Costa Brava"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Ubicación</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ej: Iquique"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Estado</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="En Venta">En Venta</option>
            <option value="En Verde">En Verde</option>
            <option value="Entrega Inmediata">Entrega Inmediata</option>
            <option value="Próximamente">Próximamente</option>
          </select>
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2 space-y-4 border p-4 rounded-lg bg-gray-50">
          <label className="block text-sm font-bold text-gray-700">Imagen del Proyecto</label>

          {/* Mode Toggle */}
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setImageMode('upload')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${imageMode === 'upload' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Subir Imagen
            </button>
            <button
              type="button"
              onClick={() => setImageMode('url')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${imageMode === 'url' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Usar URL
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {/* Option 1: File Upload */}
            {imageMode === 'upload' && (
              <div className="animate-fade-in">
                <span className="text-xs text-gray-500 mb-1 block">Sube una imagen desde tu dispositivo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-red-700 transition"
                />
              </div>
            )}

            {/* Option 2: URL */}
            {imageMode === 'url' && (
              <div className="animate-fade-in">
                <span className="text-xs text-gray-500 mb-1 block">Pega la URL directa de la imagen</span>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Descripción atractiva del proyecto..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Dormitorios</label>
          <input
            type="text"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Ej: 2-3 Dorm"
          />
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Baños</label>
          <input
            type="text"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Ej: 2 Baños"
          />
        </div>

        {/* Area */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Superficie</label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Ej: 70-90 m²"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="reverse"
          checked={formData.reverse}
          onChange={handleCheckboxChange}
          id="reverse"
          className="text-primary focus:ring-primary h-4 w-4 rounded"
        />
        <label htmlFor="reverse" className="text-sm text-gray-700">Invertir diseño (Imagen a la derecha)</label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 bg-primary text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {loading ? (uploadProgress > 0 ? `Subiendo imagen... ${uploadProgress.toFixed(0)}%` : 'Guardando...') : buttonText}
      </button>
    </form>
  );
};

export default ProjectForm;
