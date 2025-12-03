export interface PriceDataPoint {
  year: number;
  price: number | null;
  forecast?: number | null;
}

export interface CountryData {
  id: string;
  name: string;
  color: string;
  secondaryColor: string;
  data: PriceDataPoint[];
}

export type CountryId = string;

export interface ForecastResponse {
  analysis: string;
}

export interface RawDataPoint {
  year: number;
  price: number;
  isForecast: boolean;
}