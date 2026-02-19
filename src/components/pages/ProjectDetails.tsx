import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc, collection, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../configs/firebase';
import { Project } from '../../types';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

interface ApartmentModel {
  id: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  imageUrl: string;
  projectId: string;
  availability: 'Disponible' | 'Agotado';
}

const emptyModel = { bedrooms: '', bathrooms: '', area: '', imageUrl: '', availability: 'Disponible' as const };

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role } = useAuth();
  const isAdmin = role === 'admin';

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState<ApartmentModel[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyModel);
  const [saving, setSaving] = useState(false);
  const [editingModel, setEditingModel] = useState<ApartmentModel | null>(null);
  const [editData, setEditData] = useState(emptyModel);
  const [editingProject, setEditingProject] = useState(false);
  const [projectEditData, setProjectEditData] = useState({ name: '', location: '', status: 'Próximamente' as string, imageUrl: '' });
  const [editingMap, setEditingMap] = useState(false);
  const [mapUrl, setMapUrl] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project);
        } else {
          navigate('/proyectos');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, navigate]);

  // Fetch models for this project
  const fetchModels = async () => {
    if (!id) return;
    try {
      const { getDocs: gd } = await import('firebase/firestore');
      const snapshot = await gd(collection(db, 'projects', id, 'models'));
      const fetched: ApartmentModel[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as ApartmentModel);
      });
      setModels(fetched);
    } catch (err) {
      console.error('Error fetching models:', err);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [id]);

  const handleDelete = async () => {
    if (!project) return;
    const result = await Swal.fire({
      title: '¿Eliminar Proyecto?',
      text: 'No podrñ¡s revertir esto.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sñ­, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, 'projects', project.id));
        await Swal.fire('Eliminado', 'El proyecto ha sido eliminado.', 'success');
        navigate('/proyectos');
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el proyecto.', 'error');
      }
    }
  };

  const handleSaveModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'projects', id, 'models'), {
        bedrooms: `${formData.bedrooms} Dorm`,
        bathrooms: `${formData.bathrooms} Bañ±os`,
        area: `${formData.area} m²`,
        imageUrl: formData.imageUrl,
        availability: formData.availability,
        projectId: id,
      });
      setFormData(emptyModel);
      setShowForm(false);
      await fetchModels();
      Swal.fire('¡Listo!', 'Modelo creado correctamente.', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar el modelo.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteModel = async (modelId: string) => {
    if (!id) return;
    const result = await Swal.fire({
      title: '¿Eliminar modelo?',
      text: 'Esta acciñ³n no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sñ­, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, 'projects', id, 'models', modelId));
        await fetchModels();
      } catch (err) {
        Swal.fire('Error', 'No se pudo eliminar el modelo.', 'error');
      }
    }
  };

  const handleUpdateModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !editingModel) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'projects', id, 'models', editingModel.id), {
        bedrooms: `${editData.bedrooms} Dorm`,
        bathrooms: `${editData.bathrooms} Bañ±os`,
        area: `${editData.area} m²`,
        imageUrl: editData.imageUrl,
        availability: editData.availability,
      });
      setEditingModel(null);
      await fetchModels();
    } catch (err) {
      Swal.fire('Error', 'No se pudo actualizar el modelo.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMap = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'projects', id), { mapUrl });
      setProject(prev => prev ? { ...prev, mapUrl } : prev);
      setEditingMap(false);
      Swal.fire('¡Listo!', 'Mapa actualizado.', 'success');
    } catch (err) {
      Swal.fire('Error', 'No se pudo guardar el mapa.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'projects', id), {
        name: projectEditData.name,
        location: projectEditData.location,
        status: projectEditData.status,
        imageUrl: projectEditData.imageUrl,
      });
      setProject(prev => prev ? { ...prev, ...projectEditData } : prev);
      setEditingProject(false);
      Swal.fire('¡Listo!', 'Proyecto actualizado.', 'success');
    } catch (err) {
      Swal.fire('Error', 'No se pudo actualizar el proyecto.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section with Image */}
      <div className="relative h-[50vh] w-full bg-gray-900 mt-20 group">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-white/20 border border-white/20 transition-all shadow-lg font-semibold text-sm"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver
        </button>

        <img
          src={project.imageUrl}
          alt={project.name}
          className="w-full h-full object-cover opacity-60"
        />
        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4 text-center">
          {editingProject ? (
            /* Inline Edit Form */
            <form onSubmit={handleSaveProject} className="bg-black/60 backdrop-blur-md rounded-2xl p-6 w-full max-w-lg space-y-4">
              <h3 className="text-white font-bold text-lg mb-2">Editar Información del Proyecto</h3>
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-1">Nombre</label>
                <input
                  type="text"
                  value={projectEditData.name}
                  onChange={e => setProjectEditData({ ...projectEditData, name: e.target.value })}
                  required
                  className="w-full bg-white/10 border border-white/30 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-white/50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-1">Ubicación</label>
                <input
                  type="text"
                  value={projectEditData.location}
                  onChange={e => setProjectEditData({ ...projectEditData, location: e.target.value })}
                  required
                  className="w-full bg-white/10 border border-white/30 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-white/50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-1">Estado</label>
                <select
                  value={projectEditData.status}
                  onChange={e => setProjectEditData({ ...projectEditData, status: e.target.value })}
                  className="w-full bg-white/10 border border-white/30 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Próximamente" className="text-black">Próximamente</option>
                  <option value="En Venta" className="text-black">En Venta</option>
                  <option value="Entrega Inmediata" className="text-black">Entrega Inmediata</option>
                  <option value="En Verde" className="text-black">En Verde</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-1">URL Imagen</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={projectEditData.imageUrl}
                  onChange={e => setProjectEditData({ ...projectEditData, imageUrl: e.target.value })}
                  className="w-full bg-white/10 border border-white/30 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-white/50"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={saving} className="flex-1 bg-primary text-white py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50">
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
                <button type="button" onClick={() => setEditingProject(false)} className="flex-1 bg-white/10 text-white py-2 rounded-lg font-bold text-sm hover:bg-white/20 border border-white/20 transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            /* Normal View */
            <>
              <span className="bg-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                {project.status}
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-2 tracking-tight">{project.name}</h1>
              <div className="flex items-center gap-2 text-lg text-gray-200">
                <span className="material-symbols-outlined">location_on</span>
                {project.location}
              </div>
            </>
          )}
        </div>

        {/* Admin Controls Overlay */}
        {isAdmin && (
          <div className="absolute top-4 right-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => { setProjectEditData({ name: project.name, location: project.location, status: project.status, imageUrl: project.imageUrl }); setEditingProject(true); }}
              className="p-3 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 border border-white/20 transition-all shadow-lg"
              title="Editar Proyecto"
            >
              <span className="material-symbols-outlined">edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="p-3 bg-red-600/80 backdrop-blur-md text-white rounded-full hover:bg-red-600 border border-red-500/20 transition-all shadow-lg"
              title="Eliminar Proyecto"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        )}
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Models Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Modelos Disponibles</h2>
            {isAdmin && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg"
              >
                <span className="material-symbols-outlined">{showForm ? 'close' : 'add_home_work'}</span>
                {showForm ? 'Cancelar' : 'Crear Modelos-Dpto'}
              </button>
            )}
          </div>

          {/* Inline Create Form */}
          {showForm && isAdmin && (
            <form onSubmit={handleSaveModel} className="mb-8">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-5">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Nuevo Modelo</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Bedrooms */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                      <span className="material-symbols-outlined text-xs align-middle mr-1">bed</span>
                      Dormitorios
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Ej: 3"
                      value={formData.bedrooms}
                      onChange={e => setFormData({ ...formData, bedrooms: e.target.value })}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Bathrooms */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                      <span className="material-symbols-outlined text-xs align-middle mr-1">bathroom</span>
                      Baños
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Ej: 2"
                      value={formData.bathrooms}
                      onChange={e => setFormData({ ...formData, bathrooms: e.target.value })}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Area */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                      <span className="material-symbols-outlined text-xs align-middle mr-1">square_foot</span>
                      Superficie m²
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Ej: 75"
                      value={formData.area}
                      onChange={e => setFormData({ ...formData, area: e.target.value })}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                    <span className="material-symbols-outlined text-xs align-middle mr-1">image</span>
                    URL de la Imagen
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="preview"
                      className="mt-3 w-full h-48 object-cover rounded-xl border border-gray-200"
                    />
                  )}
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                    <span className="material-symbols-outlined text-xs align-middle mr-1">check_circle</span>
                    Estado del Modelo
                  </label>
                  <select
                    value={formData.availability}
                    onChange={e => setFormData({ ...formData, availability: e.target.value as 'Disponible' | 'Agotado' })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Agotado">Agotado</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar Modelo'}
                </button>
              </div>
            </form>
          )}

          {/* Models Grid */}
          {models.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50 block">apartment</span>
              <p>Añºn no hay modelos registrados para este proyecto.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model) => (
                <div key={model.id} className="bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group relative">
                  {/* Admin Buttons */}
                  {isAdmin && editingModel?.id !== model.id && (
                    <div className="absolute top-3 right-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingModel(model); setEditData({ bedrooms: model.bedrooms.replace(' Dorm', ''), bathrooms: model.bathrooms.replace(' Bañ±os', ''), area: model.area.replace(' m²', ''), imageUrl: model.imageUrl, availability: (model.availability || 'Disponible') as 'Disponible' | 'Agotado' }); }}
                        className="p-2 bg-white/90 text-blue-600 rounded-full hover:bg-white shadow-md transition-colors"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteModel(model.id)}
                        className="p-2 bg-white/90 text-red-600 rounded-full hover:bg-white shadow-md transition-colors"
                        title="Eliminar"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  )}

                  {editingModel?.id === model.id ? (
                    /* Inline Edit Form */
                    <form onSubmit={handleUpdateModel} className="p-5 space-y-3">
                      <h4 className="font-bold text-gray-700 mb-2">Editar Modelo</h4>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                          <span className="material-symbols-outlined text-xs align-middle mr-1">bed</span>Dormitorios
                        </label>
                        <input type="number" min="1" placeholder="Ej: 3" value={editData.bedrooms} onChange={e => setEditData({ ...editData, bedrooms: e.target.value })} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                          <span className="material-symbols-outlined text-xs align-middle mr-1">bathroom</span>Baños
                        </label>
                        <input type="number" min="1" placeholder="Ej: 2" value={editData.bathrooms} onChange={e => setEditData({ ...editData, bathrooms: e.target.value })} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                          <span className="material-symbols-outlined text-xs align-middle mr-1">square_foot</span>Superficie m²
                        </label>
                        <input type="number" min="1" placeholder="Ej: 75" value={editData.area} onChange={e => setEditData({ ...editData, area: e.target.value })} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                          <span className="material-symbols-outlined text-xs align-middle mr-1">image</span>URL Imagen
                        </label>
                        <input type="url" placeholder="https://..." value={editData.imageUrl} onChange={e => setEditData({ ...editData, imageUrl: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                          <span className="material-symbols-outlined text-xs align-middle mr-1">check_circle</span>Estado del Modelo
                        </label>
                        <select value={editData.availability} onChange={e => setEditData({ ...editData, availability: e.target.value as 'Disponible' | 'Agotado' })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                          <option value="Disponible">Disponible</option>
                          <option value="Agotado">Agotado</option>
                        </select>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button type="submit" disabled={saving} className="flex-1 bg-primary text-white py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar'}</button>
                        <button type="button" onClick={() => setEditingModel(null)} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors">Cancelar</button>
                      </div>
                    </form>
                  ) : (
                    /* Normal View */
                    <>
                      {model.imageUrl ? (
                        <img src={model.imageUrl} alt="modelo" className="w-full h-48 object-cover" />
                      ) : (
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                          <span className="material-symbols-outlined text-4xl text-gray-300">apartment</span>
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex justify-center mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${model.availability === 'Agotado'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-green-100 text-green-600'
                            }`}>
                            {model.availability || 'Disponible'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-gray-500 font-semibold text-sm justify-center">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-primary text-base">bed</span>
                            {model.bedrooms}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-primary text-base">bathroom</span>
                            {model.bathrooms}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-primary text-base">square_foot</span>
                            {model.area}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Google Maps Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <h2 className="text-2xl font-bold text-gray-900">Ubicación</h2>
            </div>
            {isAdmin && (
              <button
                onClick={() => { setEditingMap(!editingMap); setMapUrl(project.mapUrl || ''); }}
                className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-sm">{editingMap ? 'close' : 'edit'}</span>
                {editingMap ? 'Cancelar' : 'Editar mapa'}
              </button>
            )}
          </div>

          {isAdmin && editingMap && (
            <div className="mb-6 flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                  URL de embed de Google Maps
                </label>
                <input
                  type="text"
                  placeholder="Pega aquí la URL o el código <iframe> de Google Maps..."
                  value={mapUrl}
                  onChange={e => {
                    const val = e.target.value;
                    // Auto-extract src from full iframe code
                    const match = val.match(/src=["']([^"']+)["']/);
                    setMapUrl(match ? match[1] : val);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-400 mt-1">Puedes pegar directamente el código <code>&lt;iframe&gt;</code> que da Google Maps — la URL se extrae automáticamente.</p>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSaveMap}
                  disabled={saving}
                  className="bg-primary text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          )}

          {project.mapUrl ? (
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative">
              <iframe
                src={project.mapUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa del proyecto"
              />
              {/* Custom animated marker overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative flex flex-col items-center" style={{ transform: 'translateY(-20px)' }}>
                  <span
                    className="absolute rounded-full bg-primary/30"
                    style={{ width: 48, height: 48, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite' }}
                  />
                  <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 0C9 0 0 9 0 20C0 33 20 50 20 50C20 50 40 33 40 20C40 9 31 0 20 0Z" fill="#E11D48" />
                    <circle cx="20" cy="20" r="8" fill="white" />
                  </svg>
                  <div className="bg-black/20 rounded-full mt-1" style={{ width: 18, height: 6, filter: 'blur(3px)' }} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <span className="material-symbols-outlined text-5xl mb-3 opacity-40">map</span>
              <p className="text-sm font-medium">{isAdmin ? 'Aún no hay mapa. Haz clic en “Editar mapa” para agregar uno.' : 'Mapa no disponible.'}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetails;
