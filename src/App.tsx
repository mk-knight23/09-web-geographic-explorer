import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Globe, Users, MapPin, Navigation, ArrowRight, ArrowLeft,
  Languages, Loader2, AlertCircle, RefreshCw, Heart,
  DollarSign, Phone, Clock, BarChart3, Scale
} from 'lucide-react';
import { analytics } from './utils/analytics';

// ============================================
// Types
// ============================================
interface Country {
  name: { common: string; official: string };
  flags: { svg: string; alt?: string };
  population: number;
  region: string;
  capital?: string[];
  subregion?: string;
  languages?: Record<string, string>;
  currencies?: Record<string, { name: string; symbol: string }>;
  cca3: string;
  cca2?: string;
  area?: number;
  timezones?: string[];
  borders?: string[];
  coatOfArms?: { svg?: string };
  idd?: { root?: string; suffixes?: string[] };
  maps?: { googleMaps?: string };
}

// ============================================
// Data Hooks
// ============================================
function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCountries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check sessionStorage cache first
      const cached = sessionStorage.getItem('exploGeo_countries');
      if (cached) {
        setCountries(JSON.parse(cached));
        setLoading(false);
        return;
      }

      const res = await axios.get('https://restcountries.com/v3.1/all', {
        timeout: 15000,
      });
      setCountries(res.data);
      sessionStorage.setItem('exploGeo_countries', JSON.stringify(res.data));
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Failed to load country data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCountries(); }, [fetchCountries]);

  return { countries, loading, error, refetch: fetchCountries };
}

function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('exploGeo_favorites') || '[]');
  });

  const toggle = useCallback((cca3: string) => {
    setFavorites(prev => {
      const next = prev.includes(cca3) ? prev.filter(f => f !== cca3) : [...prev, cca3];
      localStorage.setItem('exploGeo_favorites', JSON.stringify(next));
      return next;
    });
  }, []);

  return { favorites, toggle, isFavorite: (cca3: string) => favorites.includes(cca3) };
}

// ============================================
// Layout Components
// ============================================
function Navbar({ regions, region, setRegion }: {
  regions: string[];
  region: string;
  setRegion: (r: string) => void;
}) {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-black text-xl tracking-tight text-indigo-600 no-underline">
          <Globe className="w-6 h-6" aria-hidden="true" />
          <span>EXPLO<span className="text-slate-900">GEO</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-6" role="group" aria-label="Region filters">
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`text-sm font-bold transition-all ${region === r ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
              aria-pressed={region === r}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link to="/compare" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors no-underline">
            <Scale className="w-4 h-4" /> Compare
          </Link>
          <Link to="/about" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors no-underline">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="py-12 border-t border-slate-200 text-center mt-20">
      <div className="max-w-7xl mx-auto px-6 space-y-4">
        <div className="flex justify-center gap-6 text-sm">
          <Link to="/" className="text-slate-500 hover:text-indigo-600 no-underline font-medium">Home</Link>
          <Link to="/compare" className="text-slate-500 hover:text-indigo-600 no-underline font-medium">Compare</Link>
          <Link to="/about" className="text-slate-500 hover:text-indigo-600 no-underline font-medium">About</Link>
        </div>
        <p className="text-slate-400 font-medium text-sm">
          Powered by REST Countries API • ExploGeo by Musharraf Kazi • © 2026
        </p>
        <p className="text-slate-300 text-xs">
          <Link to="/about#privacy" className="text-slate-400 hover:text-indigo-600 no-underline">Privacy Policy</Link>
          {' • '}
          <Link to="/about#terms" className="text-slate-400 hover:text-indigo-600 no-underline">Terms of Service</Link>
        </p>
      </div>
    </footer>
  );
}

// ============================================
// Country Card
// ============================================
function CountryCard({ country, index, isFavorite, onToggleFavorite }: {
  country: Country;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const navigate = useNavigate();
  const slug = country.name.common.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.4 }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      onClick={() => { navigate(`/country/${slug}`); analytics.track('country_viewed', { country: country.name.common }); }}
      className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-[0_24px_48px_-12px_rgba(79,70,229,0.12)] transition-all duration-300 cursor-pointer group flex flex-col h-full"
      role="article"
      tabIndex={0}
      aria-label={`View details for ${country.name.common}`}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/country/${slug}`); }}
    >
      <div className="h-44 overflow-hidden bg-slate-50 border-b border-slate-50 relative" aria-hidden="true">
        <img
          src={country.flags.svg}
          alt={country.flags.alt || `Flag of ${country.name.common}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-slate-400 hover:text-red-500'}`}
          aria-label={isFavorite ? `Remove ${country.name.common} from favorites` : `Add ${country.name.common} to favorites`}
        >
          {isFavorite ? <Heart className="w-4 h-4 fill-current" /> : <Heart className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-black mb-4 group-hover:text-indigo-600 transition-colors line-clamp-1 tracking-tight">
          {country.name.common}
        </h3>
        <div className="space-y-2 mb-6 flex-1">
          <InfoRow icon={<Users className="w-4 h-4" />} label="Population" value={country.population.toLocaleString()} />
          <InfoRow icon={<Navigation className="w-4 h-4" />} label="Region" value={country.region} />
          <InfoRow icon={<MapPin className="w-4 h-4" />} label="Capital" value={country.capital?.[0] || 'N/A'} />
        </div>
        <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-[0.1em]">
          Explore <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </div>
      </div>
    </motion.div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm font-medium">
      <div className="flex items-center gap-2 text-slate-400">
        <div className="opacity-70" aria-hidden="true">{icon}</div>
        <span className="font-bold text-[10px] uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-slate-900 font-bold tracking-tight">{value}</span>
    </div>
  );
}

// ============================================
// Home Page
// ============================================
function HomePage({
  countries, loading, error, refetch, search, setSearch, region, setRegion, regions, favorites
}: {
  countries: Country[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  search: string;
  setSearch: (s: string) => void;
  region: string;
  setRegion: (r: string) => void;
  regions: string[];
  favorites: { favorites: string[]; toggle: (cca3: string) => void; isFavorite: (cca3: string) => boolean };
}) {
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value.replace(/[<>{}]/g, ''));
  }, [setSearch]);

  const filteredCountries = countries
    .filter(c =>
      c.name.common.toLowerCase().includes(search.toLowerCase()) &&
      (region === 'All' || region === 'Favorites' ? true : c.region === region)
    )
    .filter(c => region === 'Favorites' ? favorites.isFavorite(c.cca3) : true)
    .sort((a, b) => a.name.common.localeCompare(b.name.common));

  return (
    <>
      {/* Hero */}
      <header className="py-24 bg-slate-950 text-white overflow-hidden relative border-b border-white/5">
        <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tighter">
              Explore the <br />
              <span className="bg-gradient-to-br from-indigo-400 via-white to-blue-400 bg-clip-text text-transparent">World&apos;s Data.</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mb-8 leading-relaxed">
              Discover detailed information about 250+ countries — population, languages, currencies, borders, and more. Compare nations side by side.
            </p>

            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-red-200 mb-2">Unable to load countries</p>
                  <p className="text-red-100/80 text-sm">{error}</p>
                </div>
                <button onClick={refetch} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors text-sm">
                  <RefreshCw className="w-4 h-4" /> Retry
                </button>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 max-w-4xl relative z-20">
              <div className="flex-1 relative group">
                <label htmlFor="country-search" className="sr-only">Search countries</label>
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  id="country-search"
                  type="text"
                  placeholder="Search 250+ countries..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] py-4 px-14 focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/[0.08] outline-none transition-all placeholder:text-slate-600 font-medium text-lg"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
              <select
                className="bg-white/[0.03] border border-white/10 rounded-[1.5rem] py-4 px-8 md:w-56 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/[0.08] transition-all cursor-pointer font-bold text-slate-300"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                aria-label="Select region"
              >
                {[...regions, 'Favorites'].map(r => <option key={r} value={r} className="text-slate-900 bg-white">{r}</option>)}
              </select>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Country Grid */}
      <main className="max-w-7xl mx-auto px-6 py-16" role="main" aria-label="Country list">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4" role="status" aria-live="polite">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="font-bold text-slate-400 uppercase tracking-widest text-sm">Loading countries...</p>
          </div>
        ) : error ? null : filteredCountries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-bold text-slate-400">
              {region === 'Favorites' ? 'No favorites yet. Click the heart icon on any country to add it.' : `No countries found matching "${search}"`}
            </p>
            {search && <button onClick={() => setSearch('')} className="mt-4 text-indigo-600 font-black uppercase tracking-widest text-xs hover:underline">Clear search</button>}
          </div>
        ) : (
          <>
            <p className="text-sm font-bold text-slate-400 mb-6">{filteredCountries.length} countries found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredCountries.map((country, idx) => (
                  <CountryCard
                    key={country.cca3}
                    country={country}
                    index={idx}
                    isFavorite={favorites.isFavorite(country.cca3)}
                    onToggleFavorite={() => favorites.toggle(country.cca3)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </main>
    </>
  );
}

// ============================================
// Country Detail Page
// ============================================
function CountryPage({ countries }: { countries: Country[] }) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggle } = useFavorites();

  const country = countries.find(c =>
    c.name.common.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === slug
  );

  useEffect(() => {
    if (country) {
      document.title = `${country.name.common} — ExploGeo | Country Data`;
    }
    return () => { document.title = 'ExploGeo | Interactive Country Explorer'; };
  }, [country]);

  if (!country) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        {countries.length === 0 ? (
          <>
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-slate-400 font-bold">Loading country data...</p>
          </>
        ) : (
          <>
            <p className="text-2xl font-black text-slate-400">Country not found</p>
            <button onClick={() => navigate('/')} className="text-indigo-600 font-bold hover:underline flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to all countries
            </button>
          </>
        )}
      </div>
    );
  }

  const currencyInfo = country.currencies ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`).join(', ') : 'N/A';
  const languageInfo = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
  const callingCode = country.idd?.root ? `${country.idd.root}${country.idd.suffixes?.[0] || ''}` : 'N/A';
  const borderCountries = country.borders
    ? country.borders.map(b => countries.find(c => c.cca3 === b)).filter(Boolean) as Country[]
    : [];

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-indigo-600 font-bold mb-8 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Flag */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <img
            src={country.flags.svg}
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            className="w-full rounded-3xl shadow-lg border border-slate-100"
          />
          <button
            onClick={() => toggle(country.cca3)}
            className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-lg transition-all ${
              isFavorite(country.cca3) ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-400 hover:text-red-500'
            }`}
            aria-label={isFavorite(country.cca3) ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite(country.cca3) ? <Heart className="w-5 h-5 fill-current" /> : <Heart className="w-5 h-5" />}
          </button>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">{country.name.common}</h1>
            <p className="text-slate-500 font-medium">{country.name.official}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <DetailBox icon={<Users className="w-5 h-5 text-indigo-500" />} label="Population" value={country.population.toLocaleString()} />
            <DetailBox icon={<Navigation className="w-5 h-5 text-blue-500" />} label="Region" value={`${country.region}${country.subregion ? ` · ${country.subregion}` : ''}`} />
            <DetailBox icon={<MapPin className="w-5 h-5 text-green-500" />} label="Capital" value={country.capital?.join(', ') || 'N/A'} />
            <DetailBox icon={<Languages className="w-5 h-5 text-purple-500" />} label="Languages" value={languageInfo} />
            <DetailBox icon={<DollarSign className="w-5 h-5 text-amber-500" />} label="Currencies" value={currencyInfo} />
            <DetailBox icon={<Phone className="w-5 h-5 text-teal-500" />} label="Calling Code" value={callingCode} />
            <DetailBox icon={<BarChart3 className="w-5 h-5 text-pink-500" />} label="Area" value={country.area ? `${country.area.toLocaleString()} km²` : 'N/A'} />
            <DetailBox icon={<Clock className="w-5 h-5 text-orange-500" />} label="Timezones" value={country.timezones?.join(', ') || 'N/A'} />
          </div>

          {country.maps?.googleMaps && (
            <a
              href={country.maps.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors no-underline"
            >
              <Globe className="w-4 h-4" /> View on Google Maps
            </a>
          )}
        </motion.div>
      </div>

      {/* Border Countries */}
      {borderCountries.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-black mb-6">Neighboring Countries</h2>
          <div className="flex flex-wrap gap-3">
            {borderCountries.map(b => {
              const bSlug = b.name.common.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
              return (
                <Link
                  key={b.cca3}
                  to={`/country/${bSlug}`}
                  className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all no-underline text-slate-900"
                >
                  <img src={b.flags.svg} alt="" className="w-8 h-5 rounded object-cover" />
                  <span className="font-bold text-sm">{b.name.common}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}

function DetailBox({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0" aria-hidden="true">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-900 leading-tight">{value}</p>
      </div>
    </div>
  );
}

// ============================================
// Compare Page
// ============================================
function ComparePage({ countries }: { countries: Country[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');

  const compareCountries = countries.filter(c => selected.includes(c.cca3));
  const searchResults = searchText.length > 1
    ? countries.filter(c => c.name.common.toLowerCase().includes(searchText.toLowerCase()) && !selected.includes(c.cca3)).slice(0, 8)
    : [];

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold mb-8 hover:underline no-underline">
        <ArrowLeft className="w-4 h-4" /> Back to all countries
      </Link>

      <h1 className="text-4xl font-black tracking-tight mb-4">Compare Countries</h1>
      <p className="text-slate-500 mb-8 max-w-2xl">Select two or more countries to compare their population, area, languages, currencies, and more.</p>

      {/* Country Search */}
      <div className="mb-8 max-w-md relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search countries to compare..."
          className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none font-medium"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-20">
            {searchResults.map(c => (
              <button
                key={c.cca3}
                onClick={() => { setSelected(prev => [...prev, c.cca3]); setSearchText(''); analytics.track('compare_country_added', { country: c.name.common }); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 transition-colors text-left"
              >
                <img src={c.flags.svg} alt="" className="w-8 h-5 rounded object-cover" />
                <span className="font-bold text-sm">{c.name.common}</span>
                <span className="text-xs text-slate-400 ml-auto">{c.region}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {selected.map(cca3 => {
            const c = countries.find(co => co.cca3 === cca3);
            if (!c) return null;
            return (
              <div key={cca3} className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-full">
                <img src={c.flags.svg} alt="" className="w-6 h-4 rounded object-cover" />
                <span className="font-bold text-xs">{c.name.common}</span>
                <button onClick={() => setSelected(prev => prev.filter(s => s !== cca3))} className="text-slate-400 hover:text-red-500 ml-1" aria-label={`Remove ${c.name.common}`}>×</button>
              </div>
            );
          })}
          {selected.length > 0 && (
            <button onClick={() => setSelected([])} className="text-xs font-bold text-slate-400 hover:text-red-500 px-3 py-2">Clear all</button>
          )}
        </div>
      )}

      {/* Comparison Table */}
      {compareCountries.length >= 2 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Attribute</th>
                {compareCountries.map(c => (
                  <th key={c.cca3} className="px-6 py-4 text-center">
                    <img src={c.flags.svg} alt="" className="w-12 h-8 rounded object-cover mx-auto mb-2" />
                    <span className="font-black text-sm">{c.name.common}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Population', fn: (c: Country) => c.population.toLocaleString() },
                { label: 'Region', fn: (c: Country) => c.region },
                { label: 'Capital', fn: (c: Country) => c.capital?.join(', ') || 'N/A' },
                { label: 'Area (km²)', fn: (c: Country) => c.area ? c.area.toLocaleString() : 'N/A' },
                { label: 'Languages', fn: (c: Country) => c.languages ? Object.values(c.languages).join(', ') : 'N/A' },
                { label: 'Currencies', fn: (c: Country) => c.currencies ? Object.values(c.currencies).map(cu => cu.name).join(', ') : 'N/A' },
                { label: 'Timezones', fn: (c: Country) => c.timezones?.join(', ') || 'N/A' },
              ].map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? '' : 'bg-slate-50/50'}>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{row.label}</td>
                  {compareCountries.map(c => (
                    <td key={c.cca3} className="px-6 py-4 text-center text-sm font-medium">{row.fn(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {compareCountries.length < 2 && (
        <div className="text-center py-16 text-slate-400">
          <Scale className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="font-bold text-lg">Select at least 2 countries to compare</p>
          <p className="text-sm mt-2">Use the search above to find and add countries</p>
        </div>
      )}
    </main>
  );
}

// ============================================
// About Page
// ============================================
function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold mb-8 hover:underline no-underline">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <h1 className="text-4xl font-black tracking-tight mb-4">About ExploGeo</h1>
      <p className="text-slate-500 mb-12 leading-relaxed">
        ExploGeo is a free, interactive country explorer built for anyone curious about the world. Browse detailed information about every country — population, languages, currencies, borders, and more. Compare countries side by side.
      </p>

      <div className="space-y-8">
        <section className="bg-white rounded-2xl p-8 border border-slate-200">
          <h2 className="text-xl font-black mb-4">Features</h2>
          <ul className="space-y-2 text-slate-600 text-sm">
            <li>• Browse 250+ countries with search and region filtering</li>
            <li>• Detailed country pages with population, languages, currencies, area, timezones</li>
            <li>• Side-by-side country comparison tool</li>
            <li>• Favorite countries saved locally in your browser</li>
            <li>• Neighboring countries navigation</li>
            <li>• Data cached in session for fast browsing</li>
            <li>• Responsive design for all devices</li>
          </ul>
        </section>

        <section id="privacy" className="bg-white rounded-2xl p-8 border border-slate-200">
          <h2 className="text-xl font-black mb-4">Privacy Policy</h2>
          <p className="text-slate-600 text-sm mb-4"><strong>Data Collection:</strong> ExploGeo does not collect personal data. No accounts, no registration required.</p>
          <p className="text-slate-600 text-sm mb-4"><strong>Local Storage:</strong> Your favorites and preferences are stored in your browser's localStorage. This data never leaves your device.</p>
          <p className="text-slate-600 text-sm mb-4"><strong>API:</strong> Country data is fetched from the public REST Countries API. Flag images are served from their API.</p>
          <p className="text-slate-600 text-sm"><strong>Analytics:</strong> When analytics are enabled, we track anonymous usage events. No personal information is collected or transmitted.</p>
          <p className="text-slate-400 text-xs mt-4">Last updated: July 2026</p>
        </section>

        <section id="terms" className="bg-white rounded-2xl p-8 border border-slate-200">
          <h2 className="text-xl font-black mb-4">Terms of Service</h2>
          <p className="text-slate-600 text-sm">ExploGeo is provided "as is" without warranty. Country data is sourced from REST Countries API and may not reflect the most current information. This is a free educational and informational tool.</p>
          <p className="text-slate-400 text-xs mt-4">Last updated: July 2026</p>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-slate-200">
          <h2 className="text-xl font-black mb-4">Contact</h2>
          <p className="text-slate-600 text-sm">
            Built by <strong>Musharraf Kazi</strong>.
            For questions or suggestions, visit <a href="https://github.com/mk-knight23/09-web-geographic-explorer/issues" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">GitHub Issues</a>.
          </p>
        </section>
      </div>
    </main>
  );
}

// ============================================
// 404 Page
// ============================================
function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
      <Globe className="w-16 h-16 text-slate-300" />
      <h1 className="text-3xl font-black text-slate-400">Page Not Found</h1>
      <p className="text-slate-500">The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-indigo-600 font-bold hover:underline flex items-center gap-2 no-underline">
        <ArrowLeft className="w-4 h-4" /> Back to ExploGeo
      </Link>
    </div>
  );
}

// ============================================
// App Root
// ============================================
function App() {
  const { countries, loading, error, refetch } = useCountries();
  const favorites = useFavorites();
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const regions = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans" role="application" aria-label="ExploGeo Country Explorer">
      <Navbar regions={regions} region={region} setRegion={setRegion} />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              countries={countries}
              loading={loading}
              error={error}
              refetch={refetch}
              search={search}
              setSearch={setSearch}
              region={region}
              setRegion={setRegion}
              regions={regions}
              favorites={favorites}
            />
          }
        />
        <Route path="/country/:slug" element={<CountryPage countries={countries} />} />
        <Route path="/compare" element={<ComparePage countries={countries} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
