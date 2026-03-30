import { useState, useMemo, useEffect } from 'react';
import type { School } from '../types/school';
import { useSchools } from '../hooks/useSchools';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import {
  Search,
  Filter,
  MapPin,
  X,
  Phone,
  Mail,
  Globe,
  Award,
  BookOpen,
  ExternalLink,
} from 'lucide-react';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createSchoolIcon = () =>
  L.divIcon({
    html: '<div style="background:#004235;width:24px;height:24px;border-radius:50% 50% 50% 0;border:2px solid #cda86b;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,.3)"><div style="color:#fff;font-size:12px;font-weight:700;transform:rotate(45deg)">🎓</div></div>',
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });

const SEUIL_MIN = 10;
const SEUIL_MAX = 20;
const SEUIL_STEP = 0.5;

export default function Platform() {
  const { schools: schoolsData, loading: schoolsLoading } = useSchools();

  // UI
  const [activeView, setActiveView] = useState<'explore' | 'map'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [selectedFiliere, setSelectedFiliere] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBacType, setSelectedBacType] = useState('');
  const [selectedInstitutionType, setSelectedInstitutionType] = useState('');
  const [seuilValue, setSeuilValue] = useState(SEUIL_MIN);
  const [selectedPublicPrivate, setSelectedPublicPrivate] = useState('');

  // Derived
  const uniqueFilieres = Array.from(new Set(schoolsData.map((s) => s.filiere)));
  const uniqueCities = Array.from(new Set(schoolsData.map((s) => s.city)));
  const uniqueBacTypes = Array.from(new Set(schoolsData.flatMap((s) => s.bacTypes)));
  const uniqueInstitutionTypes = Array.from(new Set(schoolsData.map((s) => s.type)));

  const filteredSchools = useMemo(() => {
    return schoolsData.filter((school) => {
      const q = searchQuery.toLowerCase();
      const searchMatch =
        !searchQuery ||
        school.name.toLowerCase().includes(q) ||
        school.city.toLowerCase().includes(q) ||
        school.filiere.toLowerCase().includes(q);
      const filiereMatch = !selectedFiliere || school.filiere === selectedFiliere;
      const cityMatch = !selectedCity || school.city === selectedCity;
      const bacTypeMatch = !selectedBacType || school.bacTypes.includes(selectedBacType);
      const institutionTypeMatch = !selectedInstitutionType || school.type === selectedInstitutionType;
      const seuilMatch =
        school.seuilEntree === 'NA' ||
        (typeof school.seuilEntree === 'number' && school.seuilEntree >= seuilValue) ||
        (typeof school.seuilEntree === 'object' &&
          school.seuilEntree !== null &&
          Object.values(school.seuilEntree).some((v) => v >= seuilValue));
      const ppMatch =
        !selectedPublicPrivate ||
        (selectedPublicPrivate === 'public' && school.isPublic) ||
        (selectedPublicPrivate === 'private' && !school.isPublic);
      return searchMatch && filiereMatch && cityMatch && bacTypeMatch && institutionTypeMatch && seuilMatch && ppMatch;
    });
  }, [searchQuery, selectedFiliere, selectedCity, selectedBacType, selectedInstitutionType, seuilValue, selectedPublicPrivate, schoolsData]);

  const hasActiveFilters =
    selectedFiliere || selectedCity || selectedBacType || selectedInstitutionType || seuilValue > SEUIL_MIN || selectedPublicPrivate;

  const clearAllFilters = () => {
    setSelectedFiliere('');
    setSelectedCity('');
    setSelectedBacType('');
    setSelectedInstitutionType('');
    setSeuilValue(SEUIL_MIN);
    setSelectedPublicPrivate('');
    setSearchQuery('');
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedSchool(null);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const renderSeuil = (school: School) => {
    if (typeof school.seuilEntree === 'object' && school.seuilEntree !== null) {
      const v = Object.values(school.seuilEntree);
      return `${Math.min(...v)}–${Math.max(...v)}/20`;
    }
    return `${school.seuilEntree}/20`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search + Filter bar */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une école, ville, filière…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004235]/20 focus:border-[#004235] transition-colors"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-all ${
              showFilters
                ? 'bg-[#004235] text-white border-[#004235]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtres</span>
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-[#cda86b]" />}
          </button>

          {/* View toggles */}
          <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setActiveView('explore')}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                activeView === 'explore'
                  ? 'bg-white text-gray-900 shadow-sm font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Liste
            </button>
            <button
              onClick={() => setActiveView('map')}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                activeView === 'map'
                  ? 'bg-white text-gray-900 shadow-sm font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Carte
            </button>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      <div
        className={`bg-white border-b border-gray-200 transition-all duration-300 overflow-hidden flex-shrink-0 ${
          showFilters ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 lg:px-6 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <select
              value={selectedBacType}
              onChange={(e) => setSelectedBacType(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#004235]/20 focus:border-[#004235]"
            >
              <option value="">Type de Bac</option>
              {uniqueBacTypes.map((b) => (
                <option key={b} value={b}>
                  {b.length > 25 ? b.substring(0, 25) + '…' : b}
                </option>
              ))}
            </select>

            <select
              value={selectedInstitutionType}
              onChange={(e) => setSelectedInstitutionType(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#004235]/20 focus:border-[#004235]"
            >
              <option value="">Établissement</option>
              {uniqueInstitutionTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select
              value={selectedFiliere}
              onChange={(e) => setSelectedFiliere(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#004235]/20 focus:border-[#004235]"
            >
              <option value="">Filière</option>
              {uniqueFilieres.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#004235]/20 focus:border-[#004235]"
            >
              <option value="">Ville</option>
              {uniqueCities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={selectedPublicPrivate}
              onChange={(e) => setSelectedPublicPrivate(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#004235]/20 focus:border-[#004235]"
            >
              <option value="">Public / Privé</option>
              <option value="public">Public</option>
              <option value="private">Privé</option>
            </select>

            {/* Seuil */}
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-white">
              <button
                onClick={() => setSeuilValue(Math.max(SEUIL_MIN, seuilValue - SEUIL_STEP))}
                disabled={seuilValue <= SEUIL_MIN}
                className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 hover:bg-[#004235] hover:text-white disabled:opacity-40 text-xs font-bold transition-colors"
              >
                −
              </button>
              <span className="flex-1 text-center text-sm font-semibold text-[#004235]">
                {seuilValue}
                <span className="text-gray-400 font-normal">/20</span>
              </span>
              <button
                onClick={() => setSeuilValue(Math.min(SEUIL_MAX, seuilValue + SEUIL_STEP))}
                disabled={seuilValue >= SEUIL_MAX}
                className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 hover:bg-[#004235] hover:text-white disabled:opacity-40 text-xs font-bold transition-colors"
              >
                +
              </button>
            </div>
          </div>
          {hasActiveFilters && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {filteredSchools.length} résultat{filteredSchools.length !== 1 ? 's' : ''}
              </span>
              <button onClick={clearAllFilters} className="text-sm text-red-500 hover:text-red-700 transition-colors">
                Effacer les filtres
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {activeView === 'map' ? 'Carte des établissements' : 'Explorer les écoles'}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {filteredSchools.length} établissement{filteredSchools.length !== 1 ? 's' : ''} disponible
                {filteredSchools.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {schoolsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#004235] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-500">Chargement…</span>
              </div>
            </div>
          ) : activeView === 'map' ? (
            /* Full map view */
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-[calc(100vh-220px)]">
              <MapContainer
                center={[31.7917, -7.0926] as LatLngExpression}
                zoom={6}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {filteredSchools.map((school) => (
                  <Marker
                    key={school.id}
                    position={school.coordinates as LatLngExpression}
                    icon={createSchoolIcon()}
                    eventHandlers={{ click: () => setSelectedSchool(school) }}
                  >
                    <Popup>
                      <div className="font-semibold text-sm">{school.name}</div>
                      <div className="text-xs text-gray-500">{school.city}</div>
                      <div className="text-xs text-[#cda86b] font-bold mt-1">Seuil: {renderSeuil(school)}</div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          ) : (
            /* Explore: map + cards side by side */
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {/* Map */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-[400px] xl:h-[calc(100vh-220px)]">
                <MapContainer
                  center={[31.7917, -7.0926] as LatLngExpression}
                  zoom={6}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {filteredSchools.map((school) => (
                    <Marker
                      key={school.id}
                      position={school.coordinates as LatLngExpression}
                      icon={createSchoolIcon()}
                      eventHandlers={{ click: () => setSelectedSchool(school) }}
                    >
                      <Popup>
                        <div className="font-semibold text-sm">{school.name}</div>
                        <div className="text-xs text-gray-500">{school.city}</div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* School cards */}
              <div className="space-y-3 xl:overflow-y-auto xl:max-h-[calc(100vh-220px)] xl:pr-1">
                {filteredSchools.map((school) => (
                  <button
                    key={school.id}
                    onClick={() => setSelectedSchool(school)}
                    className={`w-full text-left bg-white rounded-xl border p-4 transition-all duration-200 hover:shadow-md hover:border-[#004235]/30 group
                      ${
                        selectedSchool?.id === school.id
                          ? 'border-[#004235] shadow-md ring-1 ring-[#004235]/10'
                          : 'border-gray-200'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-[#004235] transition-colors truncate">
                          {school.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span>{school.city}</span>
                          <span className="text-gray-300">·</span>
                          <span>{school.type}</span>
                          <span className="text-gray-300">·</span>
                          <span>{school.isPublic ? 'Public' : 'Privé'}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <span className="px-2 py-0.5 text-xs rounded-full bg-[#004235]/5 text-[#004235] font-medium">
                            {school.filiere}
                          </span>
                          {school.specialties.slice(0, 2).map((s, i) => (
                            <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-[#004235]">{renderSeuil(school)}</div>
                        <div className="text-xs text-gray-400">seuil</div>
                      </div>
                    </div>
                  </button>
                ))}
                {filteredSchools.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Aucune école trouvée</p>
                    <p className="text-sm text-gray-400 mt-1">Essayez de modifier vos critères</p>
                    {hasActiveFilters && (
                      <button onClick={clearAllFilters} className="mt-3 text-sm text-[#004235] hover:underline">
                        Effacer les filtres
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* ═══ RIGHT PANEL ═══ */}
        {selectedSchool && (
          <aside className="w-full sm:w-[380px] bg-white border-l border-gray-200 flex flex-col overflow-hidden flex-shrink-0 fixed sm:static inset-y-0 right-0 z-40">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="font-semibold text-gray-900 text-sm">Détails de l'école</h2>
              <button
                onClick={() => setSelectedSchool(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Name + meta */}
              <div className="px-5 py-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 leading-tight">{selectedSchool.name}</h3>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-[#004235]/10 text-[#004235]">
                    {selectedSchool.filiere}
                  </span>
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                    {selectedSchool.type}
                  </span>
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                    {selectedSchool.isPublic ? '🏛 Public' : '🏢 Privé'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-3 leading-relaxed">{selectedSchool.description}</p>
              </div>

              {/* Stats */}
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-base font-bold text-[#004235]">{renderSeuil(selectedSchool)}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Seuil</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-base font-bold text-[#004235]">{selectedSchool.students}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Étudiants</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-base font-bold text-[#004235]">
                      {selectedSchool.successRate !== 'NA' ? `${selectedSchool.successRate}%` : 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">Réussite</div>
                  </div>
                </div>
              </div>

              {/* Seuils by bac */}
              {typeof selectedSchool.seuilEntree === 'object' && selectedSchool.seuilEntree !== null && (
                <div className="px-5 py-4 border-b border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Seuils par type de Bac</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedSchool.seuilEntree).map(([bt, seuil]) => (
                      <div key={bt} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-600 truncate mr-2">{bt}</span>
                        <span className="text-sm font-bold text-[#004235] flex-shrink-0">{seuil}/20</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specialties */}
              <div className="px-5 py-4 border-b border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-gray-400" /> Spécialités
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSchool.specialties.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Programs */}
              <div className="px-5 py-4 border-b border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-400" /> Programmes
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSchool.programs.map((p, i) => (
                    <span key={i} className="px-2.5 py-1 text-xs rounded-full bg-[#cda86b]/10 text-[#004235] font-medium">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bac types */}
              <div className="px-5 py-4 border-b border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Types de Bac acceptés</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSchool.bacTypes.map((b, i) => (
                    <span key={i} className="px-2.5 py-1 text-xs rounded-full bg-amber-50 text-amber-700">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="px-5 py-4 border-b border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Contact</h4>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{selectedSchool.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{selectedSchool.email}</span>
                  </div>
                  <a
                    href={selectedSchool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-[#004235] hover:underline"
                  >
                    <Globe className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{selectedSchool.website}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{selectedSchool.city}</span>
                  </div>
                </div>
              </div>

              {/* Extra info */}
              <div className="px-5 py-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">Fondée en</div>
                    <div className="font-semibold text-gray-900">{selectedSchool.founded}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">Salaire moyen</div>
                    <div className="font-semibold text-gray-900">
                      {selectedSchool.averageSalary !== 'NA'
                        ? `${selectedSchool.averageSalary?.toLocaleString()} MAD`
                        : 'N/A'}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">Admission</div>
                    <div className="font-semibold text-gray-900">{selectedSchool.admissionType}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">Concours</div>
                    <div className="font-semibold text-gray-900">
                      {selectedSchool.requiresConcours ? 'Oui' : 'Non'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
