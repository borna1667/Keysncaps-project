import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const keyboardSizes = [
  '40%', '50%', '60%', '65%', '75%', 'TKL', 'Full-size', 'Split', 'Compact', 'Other',
];
const standards = ['ANSI', 'ISO', 'JIS'];
const switchTypes = [
  'Cherry MX Red', 'Cherry MX Blue', 'Cherry MX Brown', 'Cherry MX Black', 'Cherry MX Silent Red',
  'Gateron Red', 'Gateron Blue', 'Gateron Brown', 'Gateron Black', 'Gateron Yellow',
  'Kailh Box Red', 'Kailh Box Blue', 'Kailh Box Brown', 'Kailh Box White', 
  'Optical', 'Topre', 'Alps', 'Romer-G', 'HyperX', 'SteelSeries QX2',
  'Logitech GL', 'Razer Green', 'Razer Yellow', 'Razer Orange', 'Holy Pandas', 'Other'
];
const connectivities = ['Wired', 'Wireless', 'Both'];
const keycapMaterials = ['PBT', 'ABS', 'POM', 'PC', 'PETG', 'Zinc', 'Aluminum', 'Brass', 'Wood', 'Resin', 'Silicone', 'Ceramic', 'Artisan'];

// Filter options for each category
const filterConfig: Record<string, { title: string; param: string; options: string[] }[]> = {
  keyboards: [
    { title: 'Keyboard Size', param: 'size', options: ['40%', '50%', '60%', '65%', '75%', 'TKL', 'Full-size', 'Split', 'Compact', 'Other'] },
    { title: 'Keyboard Standard', param: 'standard', options: ['ANSI', 'ISO', 'JIS'] },
    { title: 'Switch Type', param: 'switchType', options: ['Cherry MX Red', 'Cherry MX Blue', 'Cherry MX Brown', 'Cherry MX Black', 'Cherry MX Silent Red', 'Gateron Red', 'Gateron Blue', 'Gateron Brown', 'Gateron Black', 'Gateron Yellow', 'Kailh Box Red', 'Kailh Box Blue', 'Kailh Box Brown', 'Kailh Box White', 'Optical', 'Topre', 'Alps', 'Romer-G', 'HyperX', 'SteelSeries QX2', 'Logitech GL', 'Razer Green', 'Razer Yellow', 'Razer Orange', 'Holy Pandas', 'Other'] },
    { title: 'Connectivity', param: 'connectivity', options: ['Wired', 'Wireless', 'Both'] },
    { title: 'Keycap Material', param: 'keycapMaterial', options: ['PBT', 'ABS', 'POM', 'PC', 'PETG', 'Zinc', 'Aluminum', 'Brass', 'Wood', 'Resin', 'Silicone', 'Ceramic', 'Artisan'] },
  ],
  keycaps: [
    { title: 'Material', param: 'material', options: ['PBT', 'ABS', 'POM', 'PC', 'PETG', 'Zinc', 'Aluminum', 'Brass', 'Resin', 'Silicone', 'Ceramic', 'Artisan'] },
    { title: 'Profile', param: 'profile', options: ['Cherry', 'OEM', 'SA', 'MT3', 'DSA', 'XDA', 'Other'] },
    { title: 'Compatibility', param: 'compatibility', options: ['MX', 'Topre', 'Alps', 'Other'] },
    { title: 'Legends', param: 'legends', options: ['ANSI', 'ISO', 'Nordic', 'Other'] },
    { title: 'Keycap Count', param: 'count', options: ['61', '87', '104', '126', '140', 'Other'] },
    { title: 'Thickness', param: 'thickness', options: ['1.2mm', '1.5mm', '1.8mm', '2.0mm', 'Other'] },
  ],
  switches: [
    { title: 'Brand', param: 'brand', options: ['Cherry', 'Gateron', 'Kailh', 'KTT', 'Other'] },
    { title: 'Type', param: 'switchType', options: ['Linear', 'Tactile', 'Clicky', 'Silent', 'Other'] },
    { title: 'Actuation Force', param: 'actuation', options: ['35g', '45g', '55g', '65g', '75g', 'Other'] },
    { title: 'Spring Weight', param: 'springWeight', options: ['35g', '45g', '55g', '65g', '75g', 'Other'] },
  ],
  barebones: [
    { title: 'Layout', param: 'layout', options: ['40%', '50%', '60%', '65%', '75%', 'TKL', 'Full-size', 'Split', 'Compact', 'Other'] },
    { title: 'Case Material', param: 'caseMaterial', options: ['Aluminum', 'Plastic', 'Wood', 'Acrylic', 'Other'] },
    { title: 'PCB Type', param: 'pcbType', options: ['Hotswap', 'Solder', 'Other'] },
    { title: 'Plate Material', param: 'plateMaterial', options: ['Brass', 'Aluminum', 'PC', 'FR4', 'Polycarbonate', 'Other'] },
  ],
};

const FilterDigging: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = useParams<{ category: string }>();
  const cat = category || 'keyboards';
  const groups = filterConfig[cat] || filterConfig['keyboards'];

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string | null>>({});

  // Read price from URL when component mounts
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const priceParam = params.get('price');
    if (priceParam) {
      // Price will be preserved when navigating back
    }
  }, [location.search]);

  // Load existing filters from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newSel: Record<string, string> = {};
    groups.forEach(({ param }) => {
      const v = params.get(param);
      if (v) newSel[param] = v;
    });
    setSelectedFilters(newSel);
  }, [location.search, cat]);

  return (
    <div className="relative pt-20 md:pt-32 pb-16 md:pb-24 bg-gradient-to-br from-background via-white to-secondary min-h-screen overflow-hidden">
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary opacity-20 rounded-full blur-3xl z-0 animate-pulse-light" />
      <div className="container-custom relative z-10 px-4 md:px-0">
        <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-6 md:mb-10 text-center drop-shadow">🔍 Find Your Perfect {cat.charAt(0).toUpperCase()+cat.slice(1)}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 mb-8 md:mb-12">
          {groups.map(({ title, param, options }) => (
            <div key={param} className="bg-white rounded-xl md:rounded-2xl shadow-md md:shadow-lg p-4 md:p-8 flex flex-col items-center">
              <h2 className="font-bold text-base md:text-lg mb-3 md:mb-4 text-primary">{title}</h2>
              <div className="flex flex-wrap gap-2 md:gap-3 justify-center max-h-36 md:max-h-40 overflow-y-auto w-full px-1">
                {options.map(opt => (
                  <button
                    key={opt}
                    className={`px-3 md:px-4 py-1 md:py-2 rounded-lg border-2 font-semibold text-sm md:text-base transition-all ${selectedFilters[param] === opt ? 'bg-primary text-white border-primary scale-105' : 'bg-white text-primary border-gray-200 hover:bg-primary/10 hover:border-primary'}`}
                    onClick={() => setSelectedFilters(prev => ({
                      ...prev,
                      [param]: prev[param] === opt ? null : opt
                    }))}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Mobile-friendly return to shop button */}
        <div className="flex justify-center mt-6 md:mt-10">
          <button
            className="px-5 md:px-10 py-3 md:py-5 rounded-xl md:rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold md:font-extrabold text-base md:text-xl shadow-lg md:shadow-xl hover:scale-105 transition-all border-2 md:border-4 border-primary/30 animate-bounce"
            onClick={() => {
              // Build query params including price and selected filters
              const params = new URLSearchParams();
              const priceParam = new URLSearchParams(location.search).get('price');
              if (priceParam) params.set('price', priceParam);
              Object.entries(selectedFilters).forEach(([k, v]) => v && params.set(k, v));
              navigate(`/products?${params.toString()}`);
            }}
          >
            🚀 Show Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterDigging;
