// ─── Backend API client for AFAQI ──────────────────────────────────────────
// Fetches schools, programs and thresholds from the FastAPI backend.
// No static fallback — the database is the single source of truth.

import axios from 'axios';
import type { School } from '../types/school';

// ─── Config ──────────────────────────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Backend response types (match FastAPI schemas) ──────────────────────────

export interface BackendSchool {
  id: number;
  name: string | null;
  city: string | null;
  type: string | null;
  domaine: string | null;
  is_public: string | null;
  access: string | null;
  admission_mode: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  founded: number | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  logo_url: string | null;
}

export interface BackendProgram {
  id: number;
  school_id: number | null;
  school_name: string | null;
  program_name: string | null;
  diploma: string | null;
  duration_years: number | null;
}

export interface BackendThreshold {
  id: number;
  school_id: number | null;
  school_name: string | null;
  bac_type: string | null;
  year: number | null;
  threshold: number | null;
  admission_mode: string | null;
}

export interface BackendSchoolDetail extends BackendSchool {
  programs: BackendProgram[];
  thresholds: BackendThreshold[];
}

// ─── Mapper: Backend → Frontend School shape ─────────────────────────────────

function mapBackendToFrontend(
  school: BackendSchoolDetail
): School {
  // Build seuilEntree from thresholds
  let seuilEntree: number | 'NA' | { [bacType: string]: number } = 'NA';
  if (school.thresholds && school.thresholds.length > 0) {
    // Group thresholds by bac_type, pick latest year per type
    const byBac: Record<string, number> = {};
    for (const t of school.thresholds) {
      if (t.bac_type && t.threshold != null) {
        // If multiple years exist for same bac_type, keep the latest
        const existing = byBac[t.bac_type];
        if (existing === undefined || t.threshold > 0) {
          byBac[t.bac_type] = t.threshold;
        }
      }
    }
    const entries = Object.entries(byBac);
    if (entries.length === 1) {
      seuilEntree = entries[0][1];
    } else if (entries.length > 1) {
      seuilEntree = byBac;
    }
  }

  // Build bacTypes from thresholds
  const bacTypes = school.thresholds
    ? [...new Set(school.thresholds.map(t => t.bac_type).filter(Boolean) as string[])]
    : [];

  // Build programs list
  const programs = school.programs
    ? school.programs.map(p => p.program_name || '').filter(Boolean)
    : [];

  // Build specialties from domaine or programs
  const specialties = programs.slice(0, 5);

  // Determine admissionType
  let admissionType: School['admissionType'] = 'Direct';
  if (school.admission_mode) {
    const mode = school.admission_mode.toLowerCase();
    if (mode.includes('selection') && mode.includes('concours')) {
      admissionType = 'Combined';
    } else if (mode.includes('concours')) {
      admissionType = 'Concours';
    } else if (
      mode.includes('preselection') ||
      mode.includes('présélection') ||
      mode.includes('selection')
    ) {
      admissionType = 'Preselection';
    }
  }

  return {
    id: school.id,
    name: school.name || 'Unknown',
    type: school.type || 'Autre',
    city: school.city || 'Inconnu',
    coordinates: [
      school.latitude ?? 31.7917,
      school.longitude ?? -7.0926,
    ] as [number, number],
    students: 0, // Not available from backend yet
    phone: school.phone || '',
    email: school.email || '',
    website: school.website || '',
    founded: school.founded ?? 0,
    specialties,
    filiere: school.domaine || 'Autre',
    bacTypes,
    seuilEntree,
    description: school.description || '',
    programs,
    facilities: [],
    image: school.logo_url || '',
    successRate: 'NA',
    averageSalary: 'NA',
    partnerships: [],
    researchAreas: [],
    isPublic:
      school.is_public != null &&
      ['oui', 'public', 'yes', 'true', '1'].includes(school.is_public.toLowerCase()),
    requiresConcours: admissionType === 'Concours' || admissionType === 'Combined',
    admissionType,
  };
}

// ─── API functions ───────────────────────────────────────────────────────────

export interface SchoolFilters {
  city?: string;
  domaine?: string;
  type?: string;
  access?: string;
  is_public?: string;
  admission_mode?: string;
  bac_type?: string;
  min_threshold?: number;
  year?: number;
}

/**
 * Fetch all schools from the backend, with optional filters.
 * Throws on failure — callers must handle the error.
 */
export async function fetchSchools(filters?: SchoolFilters): Promise<School[]> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
  }

  const { data: schools } = await api.get<BackendSchool[]>('/schools', { params });

  // Fetch details (programs + thresholds) for each school in parallel
  const detailPromises = schools.map((s: BackendSchool) =>
    api.get<BackendSchoolDetail>(`/schools/${s.id}`).then((r: { data: BackendSchoolDetail }) => r.data)
  );
  const details = await Promise.all(detailPromises);

  return details.map(mapBackendToFrontend);
}

/**
 * Fetch a single school by ID from the backend.
 * Returns null for 404, throws on other errors.
 */
export async function fetchSchoolById(schoolId: number): Promise<School | null> {
  try {
    const { data } = await api.get<BackendSchoolDetail>(`/schools/${schoolId}`);
    return mapBackendToFrontend(data);
  } catch (error: any) {
    if (error?.response?.status === 404) return null;
    throw error;
  }
}

/**
 * Health check — returns true if the backend is reachable.
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const { data } = await api.get<{ status: string }>('/health');
    return data.status === 'ok';
  } catch {
    return false;
  }
}

// ─── Export the API base URL for debugging ───────────────────────────────────
export { API_BASE_URL };
