// 模拟数据
export const MOCK_DATA = [
  { 
    id: 'columbia', 
    name: 'Colombia', 
    color: 'bg-pop-yellow', 
    secondaryColor: '#FFE135',
    data: [
      { year: 2019, price: 0.80, forecast: null },
      { year: 2020, price: 0.85, forecast: null },
      { year: 2021, price: 0.90, forecast: null },
      { year: 2022, price: 0.95, forecast: null },
      { year: 2023, price: 1.10, forecast: null },
      { year: 2024, price: 1.15, forecast: 1.15 },
      { year: 2025, price: null, forecast: 1.25 },
      { year: 2026, price: null, forecast: 1.40 },
    ]
  },
  { 
    id: 'costaRica', 
    name: 'Costa Rica', 
    color: 'bg-pop-blue', 
    secondaryColor: '#00FFFF',
    data: [
      { year: 2019, price: 0.90, forecast: null },
      { year: 2024, price: 1.20, forecast: 1.20 },
      { year: 2026, price: null, forecast: 1.50 },
    ]
  },
  { 
    id: 'guatemala', 
    name: 'Guatemala', 
    color: 'bg-pop-green', 
    secondaryColor: '#00FF00',
    data: [
      { year: 2019, price: 0.70, forecast: null },
      { year: 2024, price: 1.05, forecast: 1.05 },
      { year: 2026, price: null, forecast: 1.30 },
    ]
  },
  { 
    id: 'panama', 
    name: 'Panama', 
    color: 'bg-pop-pink', 
    secondaryColor: '#FF00FF',
    data: [
      { year: 2019, price: 0.85, forecast: null },
      { year: 2024, price: 1.10, forecast: 1.10 },
      { year: 2026, price: null, forecast: 1.35 },
    ]
  }
];

// 转换上传的JSON
export const transformJsonToCountryData = (json) => {
  // 如果直接是数组就返回，如果不是就尝试解析
  if (Array.isArray(json)) return json;
  return MOCK_DATA; // 失败回退
};

// 生成图表数据
export const getUnifiedChartData = (activeCountries, startYear, endYear) => {
  const dataMap = new Map();

  // 初始化年份
  for (let y = startYear; y <= endYear; y++) {
    dataMap.set(y, { year: y });
  }

  activeCountries.forEach(country => {
    country.data.forEach(point => {
      if (point.year >= startYear && point.year <= endYear) {
        const existing = dataMap.get(point.year) || { year: point.year };
        
        if (point.price !== null) {
          existing[`${country.id}_price`] = point.price;
        }
        if (point.forecast !== null) {
          existing[`${country.id}_forecast`] = point.forecast;
        }
        
        dataMap.set(point.year, existing);
      }
    });
  });

  return Array.from(dataMap.values()).sort((a, b) => a.year - b.year);
};
