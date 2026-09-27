export interface VerifiedCountry {
  code: string; // ISO 3166-1 alpha-2 (e.g. "IN", "US")
  name: string; // e.g. "India"
  flag?: string; // Emoji flag e.g. "🇮🇳"
}

export interface VerifiedCity {
  id: string; // Unique city ID (e.g. "city_in_kolkata")
  name: string; // City name (e.g. "Kolkata")
  state: string; // State / Region (e.g. "West Bengal")
  country: string; // Country name (e.g. "India")
  countryCode: string; // ISO 3166-1 alpha-2 (e.g. "IN")
  latitude?: number;
  longitude?: number;
}

export interface VerifiedUniversity {
  id: string; // Unique university ID (e.g. "uni_in_jadavpur")
  officialName: string; // Full official name (e.g. "Jadavpur University")
  shortName?: string; // Common abbreviation (e.g. "JU")
  city: string; // Campus city (e.g. "Kolkata")
  state: string; // Campus state (e.g. "West Bengal")
  country: string; // Country (e.g. "India")
  countryCode: string; // ISO code (e.g. "IN")
  website?: string; // Official website URL
  institutionType?: string; // e.g. "State University", "Institute of National Importance"
}

export interface LocationValidationRequest {
  countryCode?: string;
  cityId?: string;
  universityId?: string;
}

export interface LocationValidationResult {
  valid: boolean;
  errors: {
    country?: string;
    city?: string;
    university?: string;
  };
  verifiedData?: {
    country?: VerifiedCountry;
    city?: VerifiedCity;
    university?: VerifiedUniversity;
  };
}
