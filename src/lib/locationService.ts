import {
  VerifiedCountry,
  VerifiedCity,
  VerifiedUniversity,
  LocationValidationRequest,
  LocationValidationResult,
} from "@/types/location";
import { VERIFIED_COUNTRIES } from "@/data/reference/countries";
import { VERIFIED_CITIES } from "@/data/reference/cities";
import { VERIFIED_UNIVERSITIES } from "@/data/reference/universities";

// In-memory lookup maps for O(1) validations
const countryByCodeMap = new Map<string, VerifiedCountry>(
  VERIFIED_COUNTRIES.map((c) => [c.code.toUpperCase(), c])
);

const countryByNameMap = new Map<string, VerifiedCountry>(
  VERIFIED_COUNTRIES.map((c) => [c.name.toLowerCase().trim(), c])
);

const cityByIdMap = new Map<string, VerifiedCity>(
  VERIFIED_CITIES.map((c) => [c.id, c])
);

const cityByNameAndCountryMap = new Map<string, VerifiedCity>(
  VERIFIED_CITIES.map((c) => [
    `${c.name.toLowerCase().trim()}::${c.countryCode.toUpperCase()}`,
    c,
  ])
);

const universityByIdMap = new Map<string, VerifiedUniversity>(
  VERIFIED_UNIVERSITIES.map((u) => [u.id, u])
);

const universityByNameMap = new Map<string, VerifiedUniversity>(
  VERIFIED_UNIVERSITIES.map((u) => [u.officialName.toLowerCase().trim(), u])
);

// Add shortName aliases to university name map
VERIFIED_UNIVERSITIES.forEach((u) => {
  if (u.shortName) {
    universityByNameMap.set(u.shortName.toLowerCase().trim(), u);
  }
});

/**
 * Search countries by name or code
 */
export function searchCountries(query?: string, limit = 20): VerifiedCountry[] {
  if (!query || !query.trim()) {
    return VERIFIED_COUNTRIES.slice(0, limit);
  }

  const cleanQuery = query.toLowerCase().trim();

  const exactCodeMatches: VerifiedCountry[] = [];
  const startsWithMatches: VerifiedCountry[] = [];
  const containsMatches: VerifiedCountry[] = [];

  for (const country of VERIFIED_COUNTRIES) {
    const code = country.code.toLowerCase();
    const name = country.name.toLowerCase();

    if (code === cleanQuery) {
      exactCodeMatches.push(country);
    } else if (name.startsWith(cleanQuery)) {
      startsWithMatches.push(country);
    } else if (name.includes(cleanQuery)) {
      containsMatches.push(country);
    }
  }

  return [...exactCodeMatches, ...startsWithMatches, ...containsMatches].slice(
    0,
    limit
  );
}

/**
 * Get verified country by ISO code
 */
export function getCountryByCode(code?: string): VerifiedCountry | undefined {
  if (!code) return undefined;
  return countryByCodeMap.get(code.toUpperCase().trim());
}

/**
 * Search cities by query, optionally filtered by country code
 */
export function searchCities(
  query: string,
  countryCode?: string,
  limit = 20
): VerifiedCity[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const cleanQuery = query.toLowerCase().trim();
  const filterCountry = countryCode ? countryCode.toUpperCase().trim() : null;

  const startsWithName: VerifiedCity[] = [];
  const containsName: VerifiedCity[] = [];
  const containsState: VerifiedCity[] = [];

  for (const city of VERIFIED_CITIES) {
    if (filterCountry && city.countryCode.toUpperCase() !== filterCountry) {
      continue;
    }

    const cityName = city.name.toLowerCase();
    const stateName = city.state.toLowerCase();

    if (cityName.startsWith(cleanQuery)) {
      startsWithName.push(city);
    } else if (cityName.includes(cleanQuery)) {
      containsName.push(city);
    } else if (stateName.includes(cleanQuery)) {
      containsState.push(city);
    }
  }

  return [...startsWithName, ...containsName, ...containsState].slice(0, limit);
}

/**
 * Get verified city by ID
 */
export function getCityById(id?: string): VerifiedCity | undefined {
  if (!id) return undefined;
  return cityByIdMap.get(id);
}

/**
 * Search universities by query, optionally filtered or sorted by country
 */
export function searchUniversities(
  query: string,
  countryCode?: string,
  limit = 20
): VerifiedUniversity[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const cleanQuery = query.toLowerCase().trim();
  const filterCountry = countryCode ? countryCode.toUpperCase().trim() : null;

  const directMatches: VerifiedUniversity[] = [];
  const secondaryMatches: VerifiedUniversity[] = [];

  for (const uni of VERIFIED_UNIVERSITIES) {
    const official = uni.officialName.toLowerCase();
    const short = uni.shortName?.toLowerCase() || "";
    const city = uni.city.toLowerCase();
    const state = uni.state.toLowerCase();

    const matchesName =
      official.includes(cleanQuery) || short.includes(cleanQuery);
    const matchesLocation =
      city.includes(cleanQuery) || state.includes(cleanQuery);

    if (matchesName || matchesLocation) {
      // Prioritize matches that are in the user's selected country
      if (filterCountry && uni.countryCode.toUpperCase() === filterCountry) {
        directMatches.push(uni);
      } else {
        secondaryMatches.push(uni);
      }
    }
  }

  return [...directMatches, ...secondaryMatches].slice(0, limit);
}

/**
 * Get verified university by ID
 */
export function getUniversityById(id?: string): VerifiedUniversity | undefined {
  if (!id) return undefined;
  return universityByIdMap.get(id);
}

/**
 * Validate location & university request against verified datasets.
 * Used for backend API validation to prevent tampered or unverified IDs.
 */
export function validateLocationSelection(
  req: LocationValidationRequest
): LocationValidationResult {
  const errors: LocationValidationResult["errors"] = {};
  const verifiedData: LocationValidationResult["verifiedData"] = {};

  // 1. Validate Country
  let country: VerifiedCountry | undefined;
  if (req.countryCode) {
    country = getCountryByCode(req.countryCode);
    if (!country) {
      errors.country = `Invalid country code '${req.countryCode}'. Please select a valid country.`;
    } else {
      verifiedData.country = country;
    }
  }

  // 2. Validate City
  if (req.cityId) {
    const city = getCityById(req.cityId);
    if (!city) {
      errors.city = `Invalid city ID '${req.cityId}'. Please select an approved city from suggestions.`;
    } else {
      // Check if city matches the country if country was specified
      if (req.countryCode && city.countryCode.toUpperCase() !== req.countryCode.toUpperCase()) {
        errors.city = `City '${city.name}' belongs to ${city.country}, but selected country is ${
          country?.name || req.countryCode
        }.`;
      } else {
        verifiedData.city = city;
      }
    }
  }

  // 3. Validate University
  if (req.universityId) {
    const uni = getUniversityById(req.universityId);
    if (!uni) {
      errors.university = `Invalid university ID '${req.universityId}'. Please select an approved institution from suggestions.`;
    } else {
      verifiedData.university = uni;
    }
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    valid: isValid,
    errors,
    verifiedData: isValid ? verifiedData : undefined,
  };
}

export interface ReconciledLegacyProfile {
  country?: VerifiedCountry;
  city?: VerifiedCity;
  university?: VerifiedUniversity;
  legacyCountryNeedsConfirmation?: boolean;
  legacyCityNeedsConfirmation?: boolean;
  legacyCollegeNeedsConfirmation?: boolean;
}

/**
 * Safely reconcile legacy free-text profile data into verified reference records.
 * If cannot be confidently matched, marks for reselection without assigning random records.
 */
export function reconcileLegacyProfile(legacyData: {
  country?: string;
  countryCode?: string;
  cityId?: string;
  locationCity?: string;
  universityId?: string;
  college?: string;
}): ReconciledLegacyProfile {
  const result: ReconciledLegacyProfile = {};

  // 1. Reconcile Country
  if (legacyData.countryCode) {
    const country = getCountryByCode(legacyData.countryCode);
    if (country) {
      result.country = country;
    }
  }

  if (!result.country && legacyData.country) {
    const query = legacyData.country.toLowerCase().trim();
    // Try matching by name
    const foundByName = countryByNameMap.get(query);
    if (foundByName) {
      result.country = foundByName;
    } else {
      // Try code
      const foundByCode = countryByCodeMap.get(query.toUpperCase());
      if (foundByCode) {
        result.country = foundByCode;
      } else {
        result.legacyCountryNeedsConfirmation = true;
      }
    }
  }

  // 2. Reconcile City
  if (legacyData.cityId) {
    const city = getCityById(legacyData.cityId);
    if (city) {
      result.city = city;
    }
  }

  if (!result.city && legacyData.locationCity) {
    const targetCountryCode = (result.country?.code || "IN").toUpperCase();
    const cityKey = `${legacyData.locationCity.toLowerCase().trim()}::${targetCountryCode}`;
    const foundCity = cityByNameAndCountryMap.get(cityKey);

    if (foundCity) {
      result.city = foundCity;
    } else {
      // Look across any country if not found with country code
      const looseMatch = VERIFIED_CITIES.find(
        (c) => c.name.toLowerCase().trim() === legacyData.locationCity?.toLowerCase().trim()
      );
      if (looseMatch) {
        result.city = looseMatch;
      } else {
        result.legacyCityNeedsConfirmation = true;
      }
    }
  }

  // 3. Reconcile University
  if (legacyData.universityId) {
    const uni = getUniversityById(legacyData.universityId);
    if (uni) {
      result.university = uni;
    }
  }

  if (!result.university && legacyData.college) {
    const collegeQuery = legacyData.college.toLowerCase().trim();
    const foundUni = universityByNameMap.get(collegeQuery);
    if (foundUni) {
      result.university = foundUni;
    } else {
      // Search partial match if very close
      const match = VERIFIED_UNIVERSITIES.find(
        (u) =>
          u.officialName.toLowerCase().trim() === collegeQuery ||
          (u.shortName && u.shortName.toLowerCase().trim() === collegeQuery)
      );
      if (match) {
        result.university = match;
      } else {
        result.legacyCollegeNeedsConfirmation = true;
      }
    }
  }

  return result;
}
