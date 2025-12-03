import { CountryData, PriceDataPoint, RawDataPoint } from '../types';

// Style mapping for known keys, with a fallback for unknown keys
const STYLE_MAP: Record<string, { name: string, color: string, secondaryColor: string }> = {
  columbia: { name: 'Columbia', color: 'bg-pop-yellow', secondaryColor: '#FFF100' },
  costaRica: { name: 'Costa Rica', color: 'bg-pop-cyan', secondaryColor: '#00FFFF' },
  guatemala: { name: 'Guatemala', color: 'bg-pop-magenta', secondaryColor: '#FF00FF' },
  panama: { name: 'Panama', color: 'bg-pop-lime', secondaryColor: '#32CD32' }
};

const DEFAULT_STYLES = [
  { color: 'bg-pop-pink', secondaryColor: '#FF69B4' },
  { color: 'bg-pop-purple', secondaryColor: '#9400D3' },
  { color: 'bg-pop-orange', secondaryColor: '#FF4500' },
];

// Processing logic to split historical and forecast data for charts
export const processData = (rawData: RawDataPoint[]): PriceDataPoint[] => {
  const processed: PriceDataPoint[] = [];
  let lastHistoricalIndex = -1;

  rawData.forEach((d, i) => {
    // DATA ALIGNMENT FIX: 
    // Round year to 2 decimal places to ensure consistent X-axis alignment.
    // This merges points like 2025.101 and 2025.099 into 2025.10 so they share a tooltip.
    const roundedYear = Math.round(d.year * 100) / 100;

    const point: PriceDataPoint = {
      year: roundedYear,
      price: d.isForecast ? null : d.price,
      forecast: d.isForecast ? d.price : null
    };
    
    if (!d.isForecast) {
      lastHistoricalIndex = i;
    }
    
    processed.push(point);
  });

  // Bridge the gap: Ensure the last historical point is also the start of the forecast line
  if (lastHistoricalIndex !== -1 && lastHistoricalIndex < processed.length - 1) {
     // Only if the next point is indeed a forecast point
     if (rawData[lastHistoricalIndex + 1].isForecast) {
        processed[lastHistoricalIndex].forecast = processed[lastHistoricalIndex].price;
     }
  }

  return processed;
};

// Transform arbitrary uploaded JSON into App Format
export const transformJsonToCountryData = (json: Record<string, RawDataPoint[]>): CountryData[] => {
  return Object.keys(json).map((key, index) => {
    // Determine style: Use predefined map if available, otherwise cycle through defaults
    const style = STYLE_MAP[key] || {
      name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(), // simple camelCase to Title Case
      ...DEFAULT_STYLES[index % DEFAULT_STYLES.length]
    };

    return {
      id: key,
      name: style.name,
      color: style.color,
      secondaryColor: style.secondaryColor,
      data: processData(json[key])
    };
  });
};

// Helper to merge all country data into a single array for a multi-line chart
// Output format: { year: 2020, columbia_price: 10, columbia_forecast: null, panama_price: null... }
export const getUnifiedChartData = (countries: CountryData[], yearStart: number, yearEnd: number) => {
  const dataMap = new Map<number, any>();

  countries.forEach(country => {
    country.data.forEach(point => {
      // Filter by range
      if (point.year < yearStart || point.year > yearEnd) return;

      // Because point.year is rounded in processData, points from different countries will align here
      if (!dataMap.has(point.year)) {
        dataMap.set(point.year, { year: point.year });
      }
      const existing = dataMap.get(point.year);
      existing[`${country.id}_price`] = point.price;
      existing[`${country.id}_forecast`] = point.forecast;
    });
  });

  // Convert map to array and sort by year
  return Array.from(dataMap.values()).sort((a, b) => a.year - b.year);
};

// Simplified Raw Data (Quarterly points for mock display)
const RAW_JSON = {
  "columbia": [
    { "year": 2019.00, "price": 0.66, "isForecast": false },
    { "year": 2019.25, "price": 0.55, "isForecast": false },
    { "year": 2019.50, "price": 0.75, "isForecast": false },
    { "year": 2019.75, "price": 0.62, "isForecast": false },
    { "year": 2020.00, "price": 0.66, "isForecast": false },
    { "year": 2020.50, "price": 1.05, "isForecast": false },
    { "year": 2021.00, "price": 0.66, "isForecast": false },
    { "year": 2021.50, "price": 0.82, "isForecast": false },
    { "year": 2022.00, "price": 0.79, "isForecast": false },
    { "year": 2023.00, "price": 0.86, "isForecast": false },
    { "year": 2024.00, "price": 0.78, "isForecast": false },
    { "year": 2025.00, "price": 0.59, "isForecast": false },
    { "year": 2025.50, "price": 0.90, "isForecast": false },
    { "year": 2025.99, "price": 1.01, "isForecast": false },
    { "year": 2026.00, "price": 0.95, "isForecast": true }, // Jan
    { "year": 2026.08, "price": 0.93, "isForecast": true }, // Feb
    { "year": 2026.16, "price": 0.91, "isForecast": true }, // Mar
    { "year": 2026.25, "price": 0.90, "isForecast": true },
    { "year": 2026.50, "price": 0.92, "isForecast": true }
  ],
  "costaRica": [
    { "year": 2019.00, "price": 0.55, "isForecast": false },
    { "year": 2019.50, "price": 0.73, "isForecast": false },
    { "year": 2020.00, "price": 0.60, "isForecast": false },
    { "year": 2020.50, "price": 1.05, "isForecast": false },
    { "year": 2021.00, "price": 0.75, "isForecast": false },
    { "year": 2022.00, "price": 0.62, "isForecast": false },
    { "year": 2023.00, "price": 0.83, "isForecast": false },
    { "year": 2024.00, "price": 0.94, "isForecast": false },
    { "year": 2025.00, "price": 0.83, "isForecast": false },
    { "year": 2025.50, "price": 0.90, "isForecast": false },
    { "year": 2025.99, "price": 0.94, "isForecast": false },
    { "year": 2026.00, "price": 0.86, "isForecast": true }, // Jan
    { "year": 2026.08, "price": 0.89, "isForecast": true }, // Feb
    { "year": 2026.16, "price": 0.92, "isForecast": true }, // Mar
    { "year": 2026.25, "price": 0.94, "isForecast": true },
    { "year": 2026.50, "price": 0.95, "isForecast": true }
  ],
  "guatemala": [
    { "year": 2019.00, "price": 0.64, "isForecast": false },
    { "year": 2019.50, "price": 0.59, "isForecast": false },
    { "year": 2020.00, "price": 0.40, "isForecast": false },
    { "year": 2020.50, "price": 0.39, "isForecast": false },
    { "year": 2021.00, "price": 0.61, "isForecast": false },
    { "year": 2022.00, "price": 0.55, "isForecast": false },
    { "year": 2023.00, "price": 0.79, "isForecast": false },
    { "year": 2024.00, "price": 0.61, "isForecast": false },
    { "year": 2025.00, "price": 1.01, "isForecast": false },
    { "year": 2025.50, "price": 0.96, "isForecast": false },
    { "year": 2025.98, "price": 0.98, "isForecast": false },
    { "year": 2026.00, "price": 0.92, "isForecast": true }, // Jan
    { "year": 2026.08, "price": 0.89, "isForecast": true }, // Feb
    { "year": 2026.16, "price": 0.86, "isForecast": true }, // Mar
    { "year": 2026.25, "price": 0.83, "isForecast": true },
    { "year": 2026.50, "price": 0.83, "isForecast": true }
  ],
  "panama": [
    { "year": 2019.00, "price": 0.55, "isForecast": false },
    { "year": 2019.50, "price": 0.82, "isForecast": false },
    { "year": 2020.00, "price": 0.60, "isForecast": false },
    { "year": 2020.50, "price": 0.48, "isForecast": false },
    { "year": 2021.00, "price": 0.76, "isForecast": false },
    { "year": 2022.00, "price": 0.87, "isForecast": false },
    { "year": 2023.00, "price": 0.81, "isForecast": false },
    { "year": 2024.00, "price": 0.82, "isForecast": false },
    { "year": 2025.00, "price": 0.82, "isForecast": false },
    { "year": 2025.50, "price": 0.96, "isForecast": false },
    { "year": 2025.99, "price": 1.05, "isForecast": true },
    { "year": 2026.00, "price": 1.04, "isForecast": true }, // Jan
    { "year": 2026.08, "price": 1.03, "isForecast": true }, // Feb
    { "year": 2026.16, "price": 1.01, "isForecast": true }, // Mar
    { "year": 2026.25, "price": 1.00, "isForecast": true },
    { "year": 2026.50, "price": 0.99, "isForecast": true }
  ]
};

export const MOCK_DATA: CountryData[] = transformJsonToCountryData(RAW_JSON);