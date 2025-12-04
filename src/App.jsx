import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceArea
} from 'recharts';
import { PopButton } from './components/PopButton';
import { ChartFrame } from './components/ChartFrame';
import { MOCK_DATA, transformJsonToCountryData, getUnifiedChartData } from './utils/data';
import { getAnalysis } from './services/MarketAnalysis';

// --- Custom Tooltip Component ---
const CustomTooltip = ({ active, payload, label, confirmedAmount }) => {
  if (active && payload && payload.length) {
    // 1. Logic: Find the lowest unit price in the current dataset
    const validEntries = payload.filter(p => typeof p.value === 'number');
    const minPrice = Math.min(...validEntries.map(p => p.value));

    return (
      <div className="bg-white border-4 border-black p-4 shadow-hard-lg min-w-[320px] z-50">
        {/* Header */}
        <div className="border-b-4 border-black pb-2 mb-3 bg-gray-100 -mx-4 -mt-4 px-4 pt-4">
          <p className="font-display text-3xl uppercase tracking-tighter">
            YEAR {Number(label).toFixed(2)}
          </p>
        </div>
        
        {/* Comparison List */}
        <div className="flex flex-col gap-3">
          {payload.map((entry, index) => {
             const unitPrice = entry.value;
             const total = unitPrice * confirmedAmount;
             const isCheapest = unitPrice === minPrice;
             // Clean name for display
             const displayName = entry.name.replace(' (Forecast)', '');
             
             return (
              <div 
                key={index} 
                className={`
                  relative p-3 border-2 transition-all duration-300
                  ${isCheapest 
                    ? 'bg-pop-yellow border-black shadow-hard-sm z-10 scale-105' 
                    : 'bg-white border-transparent opacity-80 hover:opacity-100 hover:border-gray-200'
                  }
                `}
              >
                {/* Best Value Badge */}
                {isCheapest && (
                  <div className="absolute -top-3 -right-2 bg-black text-white text-[10px] font-black px-2 py-1 transform rotate-2 shadow-sm border border-white">
                    ★ BEST PRICE
                  </div>
                )}

                {/* Top Row: Name and Unit Price */}
                <div className="flex items-center justify-between gap-4">
                   <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-3 h-3 border-2 border-black flex-shrink-0" style={{ backgroundColor: entry.color }}></div>
                      <span className={`font-display uppercase tracking-wide truncate ${isCheapest ? 'text-lg text-black' : 'text-sm text-gray-700'}`}>
                        {displayName}
                      </span>
                   </div>
                   
                   <span className={`font-mono font-bold whitespace-nowrap ${isCheapest ? 'text-xl' : 'text-sm'}`}>
                     £{unitPrice.toFixed(2)}
                   </span>
                </div>

                {/* Bottom Row: Total Calculation */}
                {confirmedAmount > 0 && (
                   <div className={`mt-2 pt-1 border-t ${isCheapest ? 'border-black border-dashed' : 'border-gray-200'} flex justify-between items-center`}>
                      <span className="font-bold text-[10px] text-gray-500 uppercase tracking-widest">
                        Total for {confirmedAmount}kg
                      </span>
                      <span className={`font-black ${isCheapest ? 'text-lg' : 'text-sm'}`}>
                        £{total.toFixed(2)}
                      </span>
                   </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

// --- Banana Button Component (With Squish & Pop) ---
const BananaButton = ({ onClick, isConfirmed, amount }) => {
  const [isBursting, setIsBursting] = useState(false);
  const [isSquishing, setIsSquishing] = useState(false);

  const handleClick = () => {
    // Trigger animations
    setIsBursting(true);
    setIsSquishing(true);
    
    // Call parent handler
    onClick();

    // Reset animation states
    setTimeout(() => setIsSquishing(false), 200); // Quick squish reset
    setTimeout(() => setIsBursting(false), 500); // Burst duration
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 relative z-10">
      {/* Animation Styles */}
      <style>{`
        @keyframes squish-bounce {
          0% { transform: scaleY(1); }
          50% { transform: scaleY(0.7) translateY(10px); }
          100% { transform: scaleY(1) translateY(0); }
        }
        @keyframes pop-burst {
          0% { transform: scale(0) rotate(0deg); opacity: 1; }
          50% { opacity: 1; }
          100% { transform: scale(1.8) rotate(45deg); opacity: 0; }
        }
        .animate-squish {
          animation: squish-bounce 0.2s ease-in-out forwards;
        }
        .animate-pop-burst {
          animation: pop-burst 0.5s ease-out forwards;
        }
      `}</style>
      
      <div className="relative w-32 h-20 flex items-center justify-center">
        {/* Background Burst Effect - Behind Banana */}
        {isBursting && (
           <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-48 h-48 animate-pop-burst">
                <path 
                  d="M50 0 L63 25 L90 10 L80 35 L100 50 L80 65 L90 90 L63 75 L50 100 L37 75 L10 90 L20 65 L0 50 L20 35 L10 10 L37 25 Z" 
                  className="fill-pop-magenta stroke-black stroke-2"
                />
                <path 
                  d="M50 10 L60 30 L80 20 L70 40 L90 50 L70 60 L80 80 L60 70 L50 90 L40 70 L20 80 L30 60 L10 50 L30 40 L20 20 L40 30 Z" 
                  className="fill-pop-cyan mix-blend-multiply"
                />
              </svg>
           </div>
        )}

        {/* The Banana Button */}
        <button 
          onClick={handleClick}
          className={`
            group relative w-32 h-20 focus:outline-none transition-transform
            ${isSquishing ? 'animate-squish' : 'hover:scale-105 hover:-rotate-3'}
            z-10
          `}
          aria-label="Confirm Amount"
        >
          {/* Shadow - Offset */}
          <svg viewBox="0 0 120 80" className="absolute top-1 left-1 w-full h-full z-0 overflow-visible">
             <path 
              d="M5,40 Q60,75 115,25 L115,10 Q60,55 5,25 Z" 
              fill="black" 
            />
          </svg>
          {/* Main Banana Shape */}
          <svg viewBox="0 0 120 80" className="absolute top-0 left-0 w-full h-full z-10 overflow-visible">
            <path 
              d="M5,40 Q60,75 115,25 L115,10 Q60,55 5,25 Z" 
              className="fill-pop-yellow stroke-black stroke-[3px] group-hover:fill-pop-pink transition-colors duration-300"
            />
            {/* Stem details */}
            <path d="M115,10 L120,5" stroke="black" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      
      {/* Label */}
      <div className={`
        relative z-20 transition-all duration-300
        ${isConfirmed 
          ? 'bg-black text-white px-3 py-1 -skew-x-6 shadow-hard-sm scale-110' 
          : 'bg-transparent text-black'
        }
      `}>
        <span className="font-display uppercase font-black text-sm tracking-widest select-none block transform skew-x-6">
          {isConfirmed ? `CONFIRMED! ${amount} KG` : 'CONFIRM'}
        </span>
      </div>
    </div>
  );
};


const App = () => {
  const [countryData, setCountryData] = useState(MOCK_DATA);
  const [selectedCountries, setSelectedCountries] = useState(new Set(['columbia', 'costaRica', 'guatemala', 'panama']));
  const [yearStart, setYearStart] = useState(2019);
  const [yearEnd, setYearEnd] = useState(2026);
  const [analyses, setAnalyses] = useState({});
  const [loadingAnalysis, setLoadingAnalysis] = useState({});
  
  // Calculator State
  const [purchaseInput, setPurchaseInput] = useState('');
  const [confirmedAmount, setConfirmedAmount] = useState(0);
  // We use a derived boolean for visual state, but rely on confirmedAmount > 0 for logic
  const isConfirmed = confirmedAmount > 0;

  const fileInputRef = useRef(null);

  // Unified year options for both dropdowns
  const YEAR_OPTIONS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027];

  const toggleCountry = (id) => {
    const newSet = new Set(selectedCountries);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedCountries(newSet);
  };

  const handleWarholize = async (countryName, id) => {
    if (loadingAnalysis[id]) return;

    setLoadingAnalysis(prev => ({ ...prev, [id]: true }));
    
    // Fetch hardcoded analysis
    const text = await getAnalysis(countryName);
    
    setAnalyses(prev => ({ ...prev, [id]: text }));
    setLoadingAnalysis(prev => ({ ...prev, [id]: false }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const jsonContent = evt.target?.result;
        const parsed = JSON.parse(jsonContent);
        const newData = transformJsonToCountryData(parsed);
        
        if (newData.length === 0) {
          alert("No valid data found in JSON.");
          return;
        }

        setCountryData(newData);
        
        // Ensure comparison is immediately visible by selecting all new countries
        const newSelection = new Set();
        newData.forEach(c => newSelection.add(c.id));
        setSelectedCountries(newSelection);
        
        // Clear input to allow re-uploading of the same file
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
      } catch (error) {
        console.error("Failed to parse JSON", error);
        alert("Invalid JSON format. Please upload a valid banana forecast file.");
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmAmount = () => {
    const val = parseFloat(purchaseInput);
    if (!isNaN(val) && val > 0) {
      setConfirmedAmount(val);
    } else {
      setConfirmedAmount(0);
    }
  };

  // Reset confirmation visual when input changes
  useEffect(() => {
    if (parseFloat(purchaseInput) !== confirmedAmount) {
       setConfirmedAmount(0);
    }
  }, [purchaseInput]);


  // Prepare active countries
  const activeCountries = useMemo(() => 
    countryData.filter(c => selectedCountries.has(c.id)),
  [countryData, selectedCountries]);

  // Generate unified data for the single chart
  const unifiedData = useMemo(() => 
    getUnifiedChartData(activeCountries, yearStart, yearEnd),
  [activeCountries, yearStart, yearEnd]);

  // Determine forecast start year for reference area (approximate based on first found forecast)
  const forecastStartYear = useMemo(() => {
    let startYear = 2026;
    for (const country of activeCountries) {
      const firstForecast = country.data.find(d => d.forecast !== null && d.price !== null); // finding the bridge point
      if (firstForecast) {
        startYear = Math.min(startYear, firstForecast.year);
      }
    }
    return startYear;
  }, [activeCountries]);

  // Reusable Time Selector Component for the Chart Header
  const TimeSelectors = (
    <div className="flex items-center gap-2 bg-white/50 p-1 border-2 border-transparent hover:border-black transition-colors rounded-sm">
      <select 
        value={yearStart} 
        onChange={(e) => setYearStart(Number(e.target.value))}
        className="font-display text-lg bg-pop-cyan/30 border-2 border-black focus:outline-none focus:bg-pop-cyan p-1 cursor-pointer"
      >
        {YEAR_OPTIONS.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <span className="text-lg font-black">→</span>
      <select 
        value={yearEnd} 
        onChange={(e) => setYearEnd(Number(e.target.value))}
        className="font-display text-lg bg-pop-pink/30 border-2 border-black focus:outline-none focus:bg-pop-pink p-1 cursor-pointer"
      >
        {YEAR_OPTIONS.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-pop-cyan/20 banana-pattern flex flex-col font-body">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".json" 
        className="hidden" 
      />

      {/* Header */}
      <header className="bg-white border-b-8 border-black p-8 shadow-hard relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="bg-pop-yellow border-4 border-black p-4 shadow-hard-sm transform -rotate-1">
             <h1 className="text-5xl md:text-7xl font-display uppercase leading-none tracking-tighter text-black drop-shadow-sm">
              Banana<br/><span className="text-pop-magenta">Forecast</span>
            </h1>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex gap-2">
              <span className="font-bold bg-black text-white px-2 py-1 transform rotate-2">FACTORY EDITION</span>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="font-bold bg-pop-pink text-black border-2 border-black px-2 py-1 transform -rotate-2 hover:scale-105 transition-transform"
              >
                UPLOAD JSON
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full p-6 md:p-12">
        
        {/* Country Selector (Legend) */}
        <div className="mb-8">
          <div className="bg-white border-4 border-black p-6 shadow-hard-lg">
             <div className="flex justify-between items-end mb-6">
                <h3 className="text-2xl font-display uppercase flex items-center gap-2">
                  <span className="w-4 h-4 bg-black block"></span>
                  Select Sources
                </h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden md:block">Toggle to filter master chart</p>
             </div>
             
             {/* Grid layout for even distribution */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {countryData.map(country => (
                <div key={country.id} className="flex flex-col gap-2">
                  <PopButton 
                    label={country.name}
                    selected={selectedCountries.has(country.id)}
                    onClick={() => toggleCountry(country.id)}
                    colorClass={country.color}
                    className="w-full"
                  />
                  {/* Mini Analysis Button */}
                  {selectedCountries.has(country.id) && (
                    <button 
                      onClick={() => handleWarholize(country.name, country.id)}
                      disabled={loadingAnalysis[country.id]}
                      className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black border-b border-transparent hover:border-black self-center transition-all"
                    >
                      {loadingAnalysis[country.id] ? 'Thinking...' : 'Warholize'}
                    </button>
                  )}
                </div>
              ))}
             </div>
          </div>
        </div>

        {/* --- Price Calculator Section --- */}
        <div className="mb-8 relative">
           {/* Decorative visual elements */}
           <div className="absolute -top-4 -left-4 w-12 h-12 bg-pop-orange border-4 border-black z-0"></div>
           <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-pop-lime border-4 border-black z-0"></div>
           
           <div className="relative z-10 bg-white border-4 border-black p-8 shadow-hard flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 w-full">
                <label className="block font-display text-2xl uppercase mb-2 transform -skew-x-6">
                  Input Amount of Banana you plan to purchase (KG)
                </label>
                <input 
                  type="number" 
                  value={purchaseInput}
                  onChange={(e) => {
                    setPurchaseInput(e.target.value);
                  }}
                  placeholder="e.g. 100"
                  className="w-full bg-gray-100 border-4 border-black p-4 font-display text-4xl focus:bg-pop-cyan/20 focus:outline-none transition-colors"
                />
              </div>
              <div className="flex-shrink-0 pt-2 flex flex-col items-center justify-center">
                 <BananaButton 
                   onClick={handleConfirmAmount} 
                   isConfirmed={isConfirmed}
                   amount={confirmedAmount}
                 />
              </div>
              {confirmedAmount > 0 && (
                 <div className="hidden md:flex flex-col items-center justify-center p-4 border-4 border-black border-dashed bg-pop-pink/10 h-full rotate-2">
                    <span className="font-bold text-xs">CALCULATING FOR</span>
                    <span className="font-display text-3xl">{confirmedAmount} KG</span>
                 </div>
              )}
           </div>
        </div>

        {/* Dynamic Data Display - Single Big Chart */}
        <div className="flex flex-col gap-4">
          <ChartFrame 
            title="Market Masterpiece" 
            bgColor="bg-white"
            headerContent={TimeSelectors}
          >
            {/* Chart Wrapper with Fix for Recharts Dimensions (No Wheel Event) */}
            <div 
              className="h-[500px] w-full bg-white relative"
              style={{ height: 500, width: '100%', minWidth: 0 }}
            >
              {activeCountries.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                  <p className="font-display text-4xl text-gray-300 uppercase">Art requires a subject</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={unifiedData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    {/* SVG Pattern Definition */}
                    <defs>
                      <pattern id="popStripes" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
                        <line x1="0" y1="0" x2="0" y2="10" stroke="#000" strokeWidth="2" opacity="0.3" />
                      </pattern>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#000" strokeOpacity={0.1} />
                    <XAxis 
                      dataKey="year" 
                      stroke="#000" 
                      type="number"
                      domain={[yearStart, yearEnd]}
                      tick={{ fill: 'black', fontWeight: 900, fontFamily: 'Anton' }}
                      tickLine={{ stroke: 'black', strokeWidth: 2 }}
                      axisLine={{ stroke: 'black', strokeWidth: 3 }}
                      tickCount={8}
                      allowDecimals={false}
                    />
                    <YAxis 
                      stroke="#000" 
                      tick={{ fill: 'black', fontWeight: 700 }}
                      tickLine={{ stroke: 'black', strokeWidth: 2 }}
                      axisLine={{ stroke: 'black', strokeWidth: 3 }}
                      domain={['auto', 'auto']}
                    />
                    
                    {/* Custom Tooltip replacing the default */}
                    <Tooltip 
                      content={<CustomTooltip confirmedAmount={confirmedAmount} />}
                    />
                    
                    {/* Forecast Area Highlight with Pattern */}
                    <ReferenceArea x1={forecastStartYear} x2={yearEnd} strokeOpacity={0} fill="url(#popStripes)" />
                    <ReferenceArea x1={forecastStartYear} x2={yearEnd} strokeOpacity={0} fill="#000" fillOpacity={0.05} />

                    {/* Render Lines for each active country */}
                    {activeCountries.map((country) => (
                      <React.Fragment key={country.id}>
                        {/* Historical Line */}
                        <Line 
                          type="monotone" 
                          dataKey={`${country.id}_price`} 
                          name={`${country.name}`}
                          stroke={country.secondaryColor} 
                          strokeWidth={4} 
                          dot={false}
                          activeDot={{ r: 6, fill: country.secondaryColor, stroke: 'black', strokeWidth: 2 }}
                          connectNulls
                          animationDuration={1500}
                        />
                        {/* Forecast Line - Bold and Dashed */}
                        <Line 
                          type="monotone" 
                          dataKey={`${country.id}_forecast`} 
                          name={`${country.name} (Forecast)`}
                          stroke={country.secondaryColor} 
                          strokeWidth={4} 
                          strokeDasharray="15 5" 
                          dot={false}
                          activeDot={{ r: 6, fill: 'white', stroke: country.secondaryColor, strokeWidth: 2 }}
                          connectNulls
                          animationDuration={1500}
                        />
                      </React.Fragment>
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </ChartFrame>

          {/* Analysis Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {activeCountries.map(country => analyses[country.id] && (
              <div key={country.id} className="bg-white border-4 border-black p-4 shadow-hard-sm transform hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-2 mb-2 border-b-2 border-black pb-1">
                   <div className={`w-3 h-3 rounded-none ${country.color} border border-black`}></div>
                   <span className="font-display uppercase">{country.name}</span>
                </div>
                <p className="font-bold italic text-md leading-tight">"{analyses[country.id]}"</p>
                <p className="text-right text-xs font-black mt-2 text-gray-500">- GHOST OF ANDY</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-black text-white p-8 mt-12 text-center font-display uppercase tracking-widest text-xl border-t-8 border-pop-pink">
        <p>Consumerism is the new art • 2025</p>
      </footer>
    </div>
  );
};

export default App;
