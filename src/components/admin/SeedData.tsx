import React, { useState } from 'react';
import { db } from '../../configs/firebase';
import { doc, setDoc, collection, writeBatch } from 'firebase/firestore';
import Swal from 'sweetalert2';

const BACKUP_PROJECTS = [
  {
    "name": "Edificio Costa Brava",
    "location": "Sector Sur, Iquique",
    "description": "Disfruta de la brisa marina. Departamentos con amplias terrazas frente al mar, piscina panorámica y gimnasio totalmente equipado. Conectividad inigualable a pasos de la playa.",
    "bedrooms": "2-3 Dorm",
    "bathrooms": "2 Baños",
    "area": "75-120 m²",
    "status": "En Venta",
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAaJHeeTtq8g02nemaEOcy6A-1aSy3icUsXEKdUNPNMTt1A_1MJpDBadsJdUqxfc3PbWO6kjLIk591nhLHEOlV0O4o6BVDqkvAcvBZ8n7DuvW5LtDMR281CIS7tjpisLNhpSN0eUBsR06BXq4lCofbt6mHMQknRuC8-REjT7oTmj3Ah9p3KB2Q4-CUDeeo8ToIc0lsneW-TOeZOFE8AoaJCQfdwXpA23KQ883NItRtcmu0KRjvMxBNXyBfGnUNlwS_dMUk7AudhjLW9",
    "cityId": "santiago"
  },
  {
    "name": "Condominio Los Tamarugos",
    "location": "Sector Autoconstrucción, Alto Hospicio",
    "description": "Espacios pensados para la familia en pleno crecimiento. Acabados de calidad, cocina integrada y áreas comunes seguras. Cercano a nuevos centros comerciales y servicios.",
    "bedrooms": "1-4 Dorm",
    "bathrooms": "2-3 Baños",
    "area": "60-180 m²",
    "status": "Entrega Inmediata",
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuCs_DKGfSHa9Bu3M3ZtUDC0qCmz6ZrReUhcqBO2TDcq86eaVvxq0ETL1sfTuh1VuQzIhU3XTN_KrSmftUBxeZnwfCII74ndwR3qctQni9pGyJhyZdfa01PhIS7iW4CfNmQNzT37gKypcdJltXIqytYbjUGZ7JSh9MeWPHzRalBhjjrUpHD-gsWR0Vo3NOsQFsepFxKbWSuT5_OdZr8HgJJSMq-X-YTHbgJhp3XbPr0pInuEJjoA8DasK8Uze1Y9dvP3K_zuh1vPp6S6",
    "reverse": true,
    "cityId": "santiago"
  },
  {
    "name": "Torre Península",
    "location": "Península de Cavancha, Iquique",
    "description": "Vive rodeado de mar en la ubicación más exclusiva de Iquique. Proyecto de vanguardia que destaca por su arquitectura moderna y vistas panorámicas de la costa.",
    "bedrooms": "1-2 Dorm",
    "bathrooms": "1-2 Baños",
    "area": "45-90 m²",
    "status": "En Verde",
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAVVUbb30TC_y1AIVniiGNu6BNpZU63LFRRu5S1lXze-A_ydaKKe3sQpemTNLHjUZ5PdhGo5-OpBUOj7xJLm3U4AgBXsYhbru9YI0COJM3AYtGT4_rJ3uQSwpp9q1IqNMiJ5a5t2Q-ILuQUYJWj9mmFY2PW0sR9rrLsLOzjLQrT_PhqPGPdc81y92TWHzO4Itk13xDt4TFGnGctYaB778lSLWEB0lIqJMAaTY4nCpjvYv61cZjJRtJLloDEqXpHgGRLobkF6swz-L-L",
    "cityId": "santiago"
  },
  {
    "name": "Marina Golf",
    "location": "Pedro Prado con Padre Hurtado",
    "description": "Proyecto exclusivo con cancha de golf.",
    "bedrooms": "2-3 Dorm",
    "bathrooms": "2 Baños",
    "area": "70-90 m²",
    "status": "Próximamente",
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAaJHeeTtq8g02nemaEOcy6A-1aSy3icUsXEKdUNPNMTt1A_1MJpDBadsJdUqxfc3PbWO6kjLIk591nhLHEOlV0O4o6BVDqkvAcvBZ8n7DuvW5LtDMR281CIS7tjpisLNhpSN0eUBsR06BXq4lCofbt6mHMQknRuC8-REjT7oTmj3Ah9p3KB2Q4-CUDeeo8ToIc0lsneW-TOeZOFE8AoaJCQfdwXpA23KQ883NItRtcmu0KRjvMxBNXyBfGnUNlwS_dMUk7AudhjLW9",
    "cityId": "santiago"
  }
];

const SeedData: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      const batch = writeBatch(db);

      // 1. Create City
      const cityRef = doc(db, 'cities', 'santiago');
      batch.set(cityRef, {
        name: 'Santiago',
        description: 'Capital de Chile',
        imageUrl: 'https://images.unsplash.com/photo-1596409614488-8839d3d3a726?q=80&w=2070&auto=format&fit=crop', // Generic Santiago image
        color: 'from-blue-600 to-blue-800'
      });

      // 2. Create Projects
      BACKUP_PROJECTS.forEach(proj => {
        const newProjRef = doc(collection(db, 'projects'));
        batch.set(newProjRef, proj);
      });

      await batch.commit();
      Swal.fire('Éxito', 'Base de datos restaurada correctamente', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Falló la restauración', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow bg-white mt-4">
      <h3 className="font-bold mb-2">Restaurar Datos (Admin)</h3>
      <p className="text-sm mb-4">Úsalo solo una vez para poblar la nueva base de datos.</p>
      <button
        onClick={handleSeed}
        disabled={loading}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Restaurando...' : 'Restaurar Ciudad y Proyectos'}
      </button>
    </div>
  );
};

export default SeedData;
