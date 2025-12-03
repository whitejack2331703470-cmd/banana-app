

const WARHOL_QUOTES: Record<string, string> = {
  "Columbia": "A commodity turned icon. 96kg of pure consumerist desire packaged in nature's own wrapper. The yellow screams for attention.",
  "Costa Rica": "Mass production meets tropical soul. The repetition of the curve suggests a market in endless, beautiful decay.",
  "Guatemala": "Bold. Graphic. Unapologetic. The price chart isn't just data, it's a heartbeat of the global trade machine.",
  "Panama": "Fifteen minutes of fame for every banana. The fluctuating line is art; the fruit is merely the medium.",
  "default": "Industrial pop art at its finest. Consumption is the new culture."
};

export const getAnalysis = async (countryName: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Find the matching quote or use default
      const key = Object.keys(WARHOL_QUOTES).find(k => 
        countryName.toLowerCase().includes(k.toLowerCase())
      ) || "default";
      
      resolve(WARHOL_QUOTES[key]);
    }, 500); // Simulate "Thinking" delay
  });
};