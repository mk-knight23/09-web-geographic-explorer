import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, Users, MapPin, Navigation, ArrowRight, Languages, Loader2, Info } from 'lucide-react';

interface Country {
    name: { common: string };
    flags: { svg: string };
    population: number;
    region: string;
    capital?: string[];
    subregion?: string;
    languages?: Record<string, string>;
    cca3: string;
}

function App() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [search, setSearch] = useState('');
    const [region, setRegion] = useState('All');
    const [loading, setLoading] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await axios.get('https://restcountries.com/v3.1/all');
                setCountries(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCountries();
    }, []);

    const filteredCountries = countries.filter(c =>
        c.name.common.toLowerCase().includes(search.toLowerCase()) &&
        (region === 'All' || c.region === region)
    ).sort((a, b) => a.name.common.localeCompare(b.name.common));

    const regions = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-xl tracking-tight text-indigo-600">
                        <Globe className="w-6 h-6" />
                        <span>EXPLO<span className="text-slate-900">GEO</span></span>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        {regions.map(r => (
                            <button
                                key={r}
                                onClick={() => setRegion(r)}
                                className={`text-sm font-bold transition-all ${region === r ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Premium Hero Section */}
            <header className="py-28 bg-slate-950 text-white overflow-hidden relative border-b border-white/5">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-6xl md:text-8xl font-black mb-10 leading-[0.9] tracking-tighter">
                            Discover the <br />
                            <span className="bg-gradient-to-br from-indigo-400 via-white to-blue-400 bg-clip-text text-transparent">Great Unknown.</span>
                        </h1>

                        <div className="flex flex-col md:flex-row gap-4 max-w-4xl relative z-20">
                            <div className="flex-1 relative group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search 250+ countries..."
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] py-5 px-14 focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/[0.08] outline-none transition-all placeholder:text-slate-600 font-medium text-lg"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <select
                                className="bg-white/[0.03] border border-white/10 rounded-[1.5rem] py-5 px-8 md:w-56 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/[0.08] transition-all cursor-pointer font-bold text-slate-300"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                            >
                                {regions.map(r => <option key={r} value={r} className="text-slate-900 bg-white">{r}</option>)}
                            </select>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-6 py-20">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                        <p className="font-bold text-slate-400 uppercase tracking-widest text-sm">Mapping the fragments...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        <AnimatePresence>
                            {filteredCountries.map((country, idx) => (
                                <CountryCard
                                    key={country.cca3}
                                    country={country}
                                    index={idx}
                                    onClick={() => setSelectedCountry(country)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>

            {/* Country Modal */}
            <AnimatePresence>
                {selectedCountry && (
                    <CountryModal
                        country={selectedCountry}
                        onClose={() => setSelectedCountry(null)}
                    />
                )}
            </AnimatePresence>

            <footer className="py-12 border-t border-slate-200 text-center">
                <p className="text-slate-400 font-medium">Powered by REST Countries API • 30 Projects Rebuild Wave</p>
            </footer>
        </div>
    );
}

function CountryCard({ country, index, onClick }: { country: Country, index: number, onClick: () => void }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.5 }}
            whileHover={{ y: -12, transition: { duration: 0.3 } }}
            onClick={onClick}
            className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-[0_32px_64px_-16px_rgba(79,70,229,0.12)] transition-all duration-300 cursor-pointer group flex flex-col h-full"
        >
            <div className="h-52 overflow-hidden bg-slate-50 border-b border-slate-50">
                <img
                    src={country.flags.svg}
                    alt={country.name.common}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
            </div>
            <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-black mb-5 group-hover:text-indigo-600 transition-colors line-clamp-1 tracking-tight">
                    {country.name.common}
                </h3>

                <div className="space-y-3 mb-8 flex-1">
                    <InfoRow icon={<Users className="w-4 h-4" />} label="Population" value={country.population.toLocaleString()} />
                    <InfoRow icon={<Navigation className="w-4 h-4" />} label="Region" value={country.region} />
                    <InfoRow icon={<MapPin className="w-4 h-4" />} label="Capital" value={country.capital?.[0] || 'N/A'} />
                </div>

                <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-[0.1em] group/btn">
                    Explore deeper <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </div>
            </div>
        </motion.div>
    );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-center justify-between text-sm font-medium">
            <div className="flex items-center gap-3 text-slate-400">
                <div className="opacity-70 group-hover:opacity-100 group-hover:text-indigo-500 transition-all">{icon}</div>
                <span className="font-bold text-[10px] uppercase tracking-widest">{label}</span>
            </div>
            <span className="text-slate-900 font-bold tracking-tight">{value}</span>
        </div>
    );
}

function CountryModal({ country, onClose }: { country: Country, onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-[2.5rem] max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[80vh]"
                onClick={e => e.stopPropagation()}
            >
                <div className="md:w-1/2 h-64 md:h-auto overflow-hidden bg-slate-100 flex-shrink-0">
                    <img src={country.flags.svg} alt={country.name.common} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-4xl font-black text-slate-900">{country.name.common}</h2>
                        <button
                            onClick={onClose}
                            className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                        >
                            <ArrowRight className="w-5 h-5 rotate-180" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <DetailBox label="Subregion" value={country.subregion || 'N/A'} icon={<Navigation className="w-5 h-5 text-indigo-500" />} />
                            <DetailBox label="Population" value={country.population.toLocaleString()} icon={<Users className="w-5 h-5 text-blue-500" />} />
                            <DetailBox label="Languages" value={Object.values(country.languages || {}).join(', ') || 'N/A'} icon={<Languages className="w-5 h-5 text-purple-500" />} />
                        </div>

                        <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-slate-50 border border-slate-100 text-center">
                            <Globe className="w-12 h-12 text-indigo-500 mb-4" />
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Cca3 Code</p>
                            <p className="text-3xl font-black text-slate-900">{country.cca3}</p>
                        </div>
                    </div>

                    <div className="mt-12">
                        <div className="flex items-center gap-2 text-indigo-600 font-bold mb-4">
                            <Info className="w-4 h-4" />
                            <span>Contextual Data</span>
                        </div>
                        <p className="text-slate-500 leading-relaxed italic border-l-4 border-slate-100 pl-4">
                            {country.name.common} is located in the {country.region} region. It has a population of {country.population.toLocaleString()} people and uses {Object.values(country.languages || {}).length} unique languages.
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function DetailBox({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-lg font-bold text-slate-900 leading-tight">{value}</p>
            </div>
        </div>
    );
}

export default App;
