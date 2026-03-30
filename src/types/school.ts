/** Frontend School shape — used across all components. */
export interface School {
  id: number;
  name: string;
  type: string;
  city: string;
  coordinates: [number, number];
  students: number;
  phone: string;
  email: string;
  website: string;
  founded: number;
  specialties: string[];
  filiere: string;
  bacTypes: string[];
  seuilEntree: number | 'NA' | { [bacType: string]: number };
  description: string;
  programs: string[];
  facilities: string[];
  image: string;
  successRate: number | 'NA';
  averageSalary: number | 'NA';
  partnerships: string[];
  researchAreas: string[];
  isPublic: boolean;
  requiresConcours: boolean;
  admissionType: 'Concours' | 'Preselection' | 'Combined' | 'Direct';
}
