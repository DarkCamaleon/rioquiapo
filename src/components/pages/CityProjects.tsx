
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import ProjectsSection from '../landing/ProjectsSection';
import { useAuth } from '../../context/AuthContext';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore'; // optimized query?
// Actually, 'location' is a string field like "Iquique, Chile".
// A precise 'where' clause might be hard if data is unstructured.
// But for now, let's fetch all and filter in client or use a simple query if possible.
// Fetching all is safer for small datasets.
import { db } from '../../configs/firebase';
import { Project } from '../../types';
import { PROJECTS } from '../../configs/constants';

const CityProjects: React.FC = () => {
  const { cityId } = useParams<{ cityId: string }>();
  const { role } = useAuth();
  const isAdmin = role === 'admin';
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityName, setCityName] = useState<string>('');

  useEffect(() => {
    const fetchCityInfo = async () => {
      if (!cityId) return;
      try {
        const cityDoc = await getDoc(doc(db, 'cities', cityId));
        if (cityDoc.exists()) {
          setCityName(cityDoc.data().name);
        } else {
          // Fallback to formatted ID if doc doesn't exist (legacy/url params)
          setCityName(cityId.charAt(0).toUpperCase() + cityId.slice(1).replace(/-/g, ' '));
        }
      } catch (error) {
        console.error("Error fetching city:", error);
      }
    };
    fetchCityInfo();
  }, [cityId]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const fetchedProjects: Project[] = [];
      snapshot.forEach((doc) => {
        fetchedProjects.push({ id: doc.id, ...doc.data() } as Project);
      });

      // AUTO-FIX: Check if "Marina Golf" (5Fcpu...) is missing cityId and fix it.
      // This is a temporary one-time fix for the user's specific case.
      const marinaGolf = fetchedProjects.find(p => p.id === '5Fcpu96uofHNqOyBYMOg');
      if (marinaGolf && !marinaGolf.cityId && cityId === 'santiago') {
        // imports needed: updateDoc, doc from firebase
        // We will do this silently.
        import('firebase/firestore').then(({ updateDoc, doc }) => {
          updateDoc(doc(db, 'projects', '5Fcpu96uofHNqOyBYMOg'), { cityId: 'santiago' })
            .then(() => console.log("Fixed Marina Golf cityId"));
        });
        // Update local state immediately for instant feedback
        marinaGolf.cityId = 'santiago';
      }

      setProjects(fetchedProjects);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const cityProjects = useMemo(() => {
    if (!cityId) return [];

    // Search term: Prefer the DB name, fallback to ID.
    // We search across: Location
    const searchTerms = [cityName, cityId, cityId.replace(/-/g, ' ')].filter(Boolean);

    return projects.filter(p => {
      // Strict match by cityId (best)
      if (p.cityId === cityId) return true;

      // Fallback: Text search in location
      const loc = p.location.toLowerCase();
      return searchTerms.some(term => loc.includes(term!.toLowerCase()));
    });
  }, [cityId, projects, cityName]);

  if (!cityId) {
    return <Navigate to="/proyectos" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center mb-6">
          <Link to="/proyectos" className="inline-flex items-center text-primary font-bold hover:text-red-700 transition-colors group">
            <span className="material-symbols-outlined mr-1 transform group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Volver a Proyectos
          </Link>

          {isAdmin && (
            <Link
              to={`/admin/projects/new?city=${cityId}`} // Pass city as query param if we want to prefill (Bonus)
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-all text-sm"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Crear Proyecto en {cityName || cityId}
            </Link>
          )}
        </div>

        <ProjectsSection
          projects={cityProjects}
          title={`Proyectos en ${cityName || cityId} `}
          showCityCards={false}
        />

        {!loading && cityProjects.length === 0 && (
          <div className="text-center pb-20 px-4">
            <p className="text-xl text-gray-500">
              No hay proyectos visibles en esta zona por ahora.
            </p>
            {isAdmin && (
              <p className="mt-2 text-primary">¡Como admin, puedes crear el primero ahora mismo!</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CityProjects;
