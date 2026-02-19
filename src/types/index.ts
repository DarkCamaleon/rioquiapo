
export interface Project {
  id: string;
  name: string;
  location: string;
  description: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  status: 'En Venta' | 'Entrega Inmediata' | 'En Verde';
  imageUrl: string;
  reverse?: boolean;
  cityId?: string;
  mapUrl?: string;
}

export interface NavItem {
  label: string;
  href: string;
}
