"use client";

import React, { useState, useEffect } from "react";
import { CompleteStudentProfile } from "@/types/onboarding";
import {
  VerifiedCountry,
  VerifiedCity,
  VerifiedUniversity,
} from "@/types/location";
import {
  searchCountries,
  searchCities,
  searchUniversities,
  getCountryByCode,
  getCityById,
  getUniversityById,
  validateLocationSelection,
} from "@/lib/locationService";
import { SearchableAutocomplete } from "@/components/ui/SearchableAutocomplete";
import {
  X,
  Check,
  User,
  GraduationCap,
  Compass,
  Sparkles,
  Save,
  Globe,
  MapPin,
  School,
  AlertTriangle,
  Loader2,
  Info,
} from "lucide-react";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CompleteStudentProfile;
  onSave: (updated: CompleteStudentProfile) => void;
  initialTab?: "personal" | "academic" | "preferences";
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  initialTab = "personal",
}) => {
  const [activeTab, setActiveTab] = useState<"personal" | "academic" | "preferences">(initialTab);
  const [formData, setFormData] = useState<CompleteStudentProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Structured Autocomplete States
  const [selectedCountry, setSelectedCountry] = useState<VerifiedCountry | null>(null);
  const [selectedCity, setSelectedCity] = useState<VerifiedCity | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<VerifiedUniversity | null>(null);

  // Field Validation Errors
  const [validationErrors, setValidationErrors] = useState<{
    country?: string;
    city?: string;
    university?: string;
  }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [countryChangeNotice, setCountryChangeNotice] = useState<string | null>(null);

  // Initialize form and autocomplete selections from incoming profile
  useEffect(() => {
    if (isOpen) {
      setFormData(profile);
      setValidationErrors({});
      setGeneralError(null);
      setCountryChangeNotice(null);

      const pInfo = profile.personalInfo;

      // 1. Initialize Country
      let country: VerifiedCountry | undefined;
      if (pInfo.countryCode) {
        country = getCountryByCode(pInfo.countryCode);
      }
      if (!country && pInfo.country) {
        country = searchCountries(pInfo.country, 1)[0];
      }
      setSelectedCountry(country || null);

      // 2. Initialize City
      let city: VerifiedCity | undefined = pInfo.cityDetails;
      if (!city && pInfo.cityId) {
        city = getCityById(pInfo.cityId);
      }
      if (!city && pInfo.locationCity) {
        const matches = searchCities(pInfo.locationCity, country?.code, 1);
        city = matches[0];
      }
      setSelectedCity(city || null);

      // 3. Initialize University
      let uni: VerifiedUniversity | undefined = pInfo.universityDetails;
      if (!uni && pInfo.universityId) {
        uni = getUniversityById(pInfo.universityId);
      }
      if (!uni && pInfo.college) {
        const matches = searchUniversities(pInfo.college, country?.code, 1);
        uni = matches[0];
      }
      setSelectedUniversity(uni || null);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleInputChange = (section: keyof CompleteStudentProfile, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
  };

  // --- Search Fetchers with API and Local Fallbacks ---

  const fetchCountryOptions = async (q: string): Promise<VerifiedCountry[]> => {
    try {
      const res = await fetch(`/api/locations/countries?q=${encodeURIComponent(q)}&limit=30`);
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch {
      // Fallback to client service
    }
    return searchCountries(q, 30);
  };

  const fetchCityOptions = async (q: string): Promise<VerifiedCity[]> => {
    const countryFilter = selectedCountry ? selectedCountry.code : "";
    try {
      const res = await fetch(
        `/api/locations/cities?q=${encodeURIComponent(q)}&country=${encodeURIComponent(
          countryFilter
        )}&limit=25`
      );
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch {
      // Fallback to client service
    }
    return searchCities(q, countryFilter, 25);
  };

  const fetchUniversityOptions = async (q: string): Promise<VerifiedUniversity[]> => {
    const countryFilter = selectedCountry ? selectedCountry.code : "";
    try {
      const res = await fetch(
        `/api/locations/universities?q=${encodeURIComponent(q)}&country=${encodeURIComponent(
          countryFilter
        )}&limit=25`
      );
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch {
      // Fallback to client service
    }
    return searchUniversities(q, countryFilter, 25);
  };

  // --- Handlers for Dropdown Selection ---

  const handleCountrySelect = (country: VerifiedCountry | null) => {
    setSelectedCountry(country);
    setValidationErrors((prev) => ({ ...prev, country: undefined }));
    setGeneralError(null);

    if (country) {
      handleInputChange("personalInfo", "country", country.name);
      handleInputChange("personalInfo", "countryCode", country.code);

      // Revalidate / reset city if it belongs to a different country
      if (selectedCity && selectedCity.countryCode.toUpperCase() !== country.code.toUpperCase()) {
        setSelectedCity(null);
        handleInputChange("personalInfo", "cityId", undefined);
        handleInputChange("personalInfo", "cityDetails", undefined);
        handleInputChange("personalInfo", "locationCity", "");
        setCountryChangeNotice(
          `City was reset because "${selectedCity.name}" belongs to ${selectedCity.country}, not ${country.name}. Please re-select your current city.`
        );
      } else {
        setCountryChangeNotice(null);
      }
    } else {
      handleInputChange("personalInfo", "country", "");
      handleInputChange("personalInfo", "countryCode", "");
      setCountryChangeNotice(null);
    }
  };

  const handleCitySelect = (city: VerifiedCity | null) => {
    setSelectedCity(city);
    setValidationErrors((prev) => ({ ...prev, city: undefined }));
    setCountryChangeNotice(null);
    setGeneralError(null);

    if (city) {
      const formatted = `${city.name}, ${city.state}, ${city.country}`;
      handleInputChange("personalInfo", "cityId", city.id);
      handleInputChange("personalInfo", "cityDetails", city);
      handleInputChange("personalInfo", "locationCity", formatted);

      // Auto-sync country if not selected or mismatched
      if (!selectedCountry || selectedCountry.code.toUpperCase() !== city.countryCode.toUpperCase()) {
        const autoCountry = getCountryByCode(city.countryCode);
        if (autoCountry) {
          setSelectedCountry(autoCountry);
          handleInputChange("personalInfo", "country", autoCountry.name);
          handleInputChange("personalInfo", "countryCode", autoCountry.code);
        }
      }
    } else {
      handleInputChange("personalInfo", "cityId", undefined);
      handleInputChange("personalInfo", "cityDetails", undefined);
      handleInputChange("personalInfo", "locationCity", "");
    }
  };

  const handleUniversitySelect = (uni: VerifiedUniversity | null) => {
    setSelectedUniversity(uni);
    setValidationErrors((prev) => ({ ...prev, university: undefined }));
    setGeneralError(null);

    if (uni) {
      handleInputChange("personalInfo", "universityId", uni.id);
      handleInputChange("personalInfo", "universityDetails", uni);
      handleInputChange("personalInfo", "college", uni.officialName);
    } else {
      handleInputChange("personalInfo", "universityId", undefined);
      handleInputChange("personalInfo", "universityDetails", undefined);
      handleInputChange("personalInfo", "college", "");
    }
  };

  // --- Strict Validation & Save ---

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    // Rule 5: Frontend MUST NOT consider the field valid merely because text was typed.
    // Explicit selection of approved records is strictly enforced.
    const errors: { country?: string; city?: string; university?: string } = {};

    if (!selectedCountry) {
      errors.country = "❌ Please select a verified country from the suggestions.";
    }

    if (!selectedCity) {
      errors.city = "❌ Please select a verified city from the suggestions.";
    }

    if (!selectedUniversity) {
      errors.university = "❌ Please select a verified college / university from the suggestions.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setActiveTab("personal");
      return;
    }

    // Rule 6: Backend validation of submitted IDs.
    // Prevent malicious or manipulated IDs.
    setIsSaving(true);
    try {
      const response = await fetch("/api/profile/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryCode: selectedCountry?.code,
          cityId: selectedCity?.id,
          universityId: selectedUniversity?.id,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setValidationErrors(result.errors || {});
        setGeneralError(
          result.message || "Backend rejected location or institution. Please re-select verified values."
        );
        setActiveTab("personal");
        setIsSaving(false);
        return;
      }

      // Reconciled and validated profile object
      const updatedPersonalInfo = {
        ...formData.personalInfo,
        country: selectedCountry!.name,
        countryCode: selectedCountry!.code,
        cityId: selectedCity!.id,
        cityDetails: selectedCity!,
        locationCity: `${selectedCity!.name}, ${selectedCity!.state}, ${selectedCity!.country}`,
        universityId: selectedUniversity!.id,
        universityDetails: selectedUniversity!,
        college: selectedUniversity!.officialName,
        locationNeedsConfirmation: false,
      };

      const finalProfile: CompleteStudentProfile = {
        ...formData,
        personalInfo: updatedPersonalInfo,
      };

      onSave(finalProfile);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 600);
    } catch (err) {
      console.warn("Backend validation request failed, falling back to local service validation:", err);

      // Local service validation as offline fallback
      const localResult = validateLocationSelection({
        countryCode: selectedCountry?.code,
        cityId: selectedCity?.id,
        universityId: selectedUniversity?.id,
      });

      if (!localResult.valid) {
        setValidationErrors(localResult.errors);
        setGeneralError("Validation failed. Please select approved records from the suggestions.");
        setActiveTab("personal");
        setIsSaving(false);
        return;
      }

      const updatedPersonalInfo = {
        ...formData.personalInfo,
        country: selectedCountry!.name,
        countryCode: selectedCountry!.code,
        cityId: selectedCity!.id,
        cityDetails: selectedCity!,
        locationCity: `${selectedCity!.name}, ${selectedCity!.state}, ${selectedCity!.country}`,
        universityId: selectedUniversity!.id,
        universityDetails: selectedUniversity!,
        college: selectedUniversity!.officialName,
        locationNeedsConfirmation: false,
      };

      onSave({
        ...formData,
        personalInfo: updatedPersonalInfo,
      });
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 600);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center font-bold text-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">Edit Career Profile</h3>
              <p className="text-[11px] text-ink-muted">
                Verified location and institution details power AI matching & campus recruiting.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-3 pb-2 border-b border-border/60 flex items-center gap-2 bg-canvas/40">
          <button
            type="button"
            onClick={() => setActiveTab("personal")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "personal"
                ? "bg-accent text-white shadow-xs"
                : "text-ink-muted hover:text-ink hover:bg-surface"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Personal & Location</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("academic")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "academic"
                ? "bg-accent text-white shadow-xs"
                : "text-ink-muted hover:text-ink hover:bg-surface"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Details</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preferences")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "preferences"
                ? "bg-accent text-white shadow-xs"
                : "text-ink-muted hover:text-ink hover:bg-surface"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Preferences & Goals</span>
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* General Error Banner */}
          {generalError && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Validation Error</p>
                <p className="text-[11px] opacity-90 mt-0.5">{generalError}</p>
              </div>
            </div>
          )}

          {/* Country Reset Notice */}
          {countryChangeNotice && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2 text-xs text-amber-700 dark:text-amber-300 animate-in fade-in">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-[11px]">{countryChangeNotice}</p>
            </div>
          )}

          {/* 1. PERSONAL TAB */}
          {activeTab === "personal" && (
            <div className="space-y-4">
              {/* Row 1: Full Legal Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    Full Legal Name <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.fullName}
                    onChange={(e) => handleInputChange("personalInfo", "fullName", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    Academic Email <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) => handleInputChange("personalInfo", "email", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Phone Number & Country Autocomplete */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.phone}
                    onChange={(e) => handleInputChange("personalInfo", "phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2.5 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Country Autocomplete */}
                <div>
                  <SearchableAutocomplete<VerifiedCountry>
                    id="profile-country-autocomplete"
                    label="Country"
                    placeholder="Search country (e.g. India, United States)..."
                    required
                    value={selectedCountry}
                    onSelect={handleCountrySelect}
                    fetchOptions={fetchCountryOptions}
                    getOptionKey={(c) => c.code}
                    getOptionLabel={(c) => c.name}
                    renderOption={(c, isSelected) => (
                      <div className="flex items-center gap-2">
                        <span className="text-base">{c.flag || "🌐"}</span>
                        <div className="flex-1 min-w-0">
                          <span className={`block font-semibold ${isSelected ? "text-accent" : ""}`}>
                            {c.name}
                          </span>
                          <span className="text-[10px] text-ink-muted">ISO: {c.code}</span>
                        </div>
                      </div>
                    )}
                    error={validationErrors.country}
                    noResultsText="No matching country found"
                    icon={Globe}
                    initialFetchOnFocus={true}
                    debounceMs={250}
                  />
                </div>
              </div>

              {/* Row 3: Current City Autocomplete (dependent on country) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <SearchableAutocomplete<VerifiedCity>
                    id="profile-city-autocomplete"
                    label="Current City"
                    placeholder={
                      selectedCountry
                        ? `Search city in ${selectedCountry.name} (e.g. kol)...`
                        : "Search city (e.g. kol)..."
                    }
                    required
                    value={selectedCity}
                    onSelect={handleCitySelect}
                    fetchOptions={fetchCityOptions}
                    getOptionKey={(city) => city.id}
                    getOptionLabel={(city) => city.name}
                    renderOption={(city, isSelected) => (
                      <div>
                        <span className={`block font-semibold ${isSelected ? "text-accent" : ""}`}>
                          {city.name}
                        </span>
                        <span className="text-[11px] text-ink-muted block mt-0.5">
                          {city.name}, {city.state}, {city.country}
                        </span>
                      </div>
                    )}
                    helperText={
                      selectedCountry
                        ? `Showing verified cities in ${selectedCountry.name}`
                        : "Filter automatically adapts when a country is selected"
                    }
                    error={validationErrors.city}
                    noResultsText="No matching city found"
                    icon={MapPin}
                    debounceMs={300}
                  />
                </div>

                {/* College / University Autocomplete */}
                <div>
                  <SearchableAutocomplete<VerifiedUniversity>
                    id="profile-university-autocomplete"
                    label="College / University"
                    placeholder="Search university (e.g. jad, iit, nit)..."
                    required
                    value={selectedUniversity}
                    onSelect={handleUniversitySelect}
                    fetchOptions={fetchUniversityOptions}
                    getOptionKey={(u) => u.id}
                    getOptionLabel={(u) => u.officialName}
                    renderOption={(u, isSelected) => (
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`block font-semibold truncate ${isSelected ? "text-accent" : ""}`}>
                            {u.officialName}
                          </span>
                          {u.shortName && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border text-ink-muted font-bold shrink-0">
                              {u.shortName}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-ink-muted block mt-0.5">
                          {u.city}, {u.state}, {u.country}
                          {u.institutionType ? ` • ${u.institutionType}` : ""}
                        </span>
                      </div>
                    )}
                    error={validationErrors.university}
                    noResultsText="No matching educational institution found"
                    icon={School}
                    debounceMs={300}
                  />
                </div>
              </div>

              {/* Row 4: Degree & Graduation Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    Degree / Program
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.degree}
                    onChange={(e) => handleInputChange("personalInfo", "degree", e.target.value)}
                    placeholder="e.g. B.Tech Computer Science & Engineering"
                    className="w-full px-3 py-2.5 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.graduationYear}
                    onChange={(e) => handleInputChange("personalInfo", "graduationYear", e.target.value)}
                    placeholder="2025"
                    className="w-full px-3 py-2.5 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Developer Links */}
              <div className="pt-2 border-t border-border/60">
                <span className="text-xs font-bold text-ink block mb-2">Developer Links</span>
                <div className="space-y-2.5">
                  <input
                    type="url"
                    placeholder="GitHub URL (e.g. https://github.com/...)"
                    value={formData.personalInfo.githubUrl}
                    onChange={(e) => handleInputChange("personalInfo", "githubUrl", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                  <input
                    type="url"
                    placeholder="LinkedIn Profile URL"
                    value={formData.personalInfo.linkedInUrl}
                    onChange={(e) => handleInputChange("personalInfo", "linkedInUrl", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                  <input
                    type="url"
                    placeholder="Portfolio Website URL"
                    value={formData.personalInfo.portfolioUrl}
                    onChange={(e) => handleInputChange("personalInfo", "portfolioUrl", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. ACADEMIC TAB */}
          {activeTab === "academic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    Cumulative CGPA
                  </label>
                  <input
                    type="text"
                    value={formData.academicProfile.cgpa}
                    onChange={(e) => handleInputChange("academicProfile", "cgpa", e.target.value)}
                    placeholder="e.g. 8.85"
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    Current Semester
                  </label>
                  <input
                    type="text"
                    value={formData.academicProfile.semester}
                    onChange={(e) => handleInputChange("academicProfile", "semester", e.target.value)}
                    placeholder="e.g. Semester 7"
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    10th Board %
                  </label>
                  <input
                    type="text"
                    value={formData.academicProfile.tenthPercentage}
                    onChange={(e) => handleInputChange("academicProfile", "tenthPercentage", e.target.value)}
                    placeholder="e.g. 94.2%"
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    12th Board %
                  </label>
                  <input
                    type="text"
                    value={formData.academicProfile.twelfthPercentage}
                    onChange={(e) => handleInputChange("academicProfile", "twelfthPercentage", e.target.value)}
                    placeholder="e.g. 91.8%"
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    Active Backlogs
                  </label>
                  <select
                    value={formData.academicProfile.activeBacklogs}
                    onChange={(e) => handleInputChange("academicProfile", "activeBacklogs", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  >
                    <option value="0">0 (Zero / Clear)</option>
                    <option value="1">1</option>
                    <option value="2+">2+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                  Department / Branch
                </label>
                <input
                  type="text"
                  value={formData.academicProfile.branch}
                  onChange={(e) => handleInputChange("academicProfile", "branch", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          )}

          {/* 3. PREFERENCES TAB */}
          {activeTab === "preferences" && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                  Primary Target Career Role
                </label>
                <input
                  type="text"
                  value={formData.careerPreferences.primaryRole}
                  onChange={(e) => handleInputChange("careerPreferences", "primaryRole", e.target.value)}
                  placeholder="e.g. AI/ML Engineer"
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                  Target Salary / Compensation Bracket
                </label>
                <input
                  type="text"
                  value={formData.careerPreferences.targetSalary}
                  onChange={(e) => handleInputChange("careerPreferences", "targetSalary", e.target.value)}
                  placeholder="e.g. ₹12 - ₹18 LPA"
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                  Earliest Availability
                </label>
                <input
                  type="text"
                  value={formData.careerPreferences.earliestJoining}
                  onChange={(e) => handleInputChange("careerPreferences", "earliestJoining", e.target.value)}
                  placeholder="e.g. Post Graduation (May 2025)"
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                  Career Objective Statement
                </label>
                <textarea
                  rows={3}
                  value={formData.careerGoals.primaryObjective}
                  onChange={(e) => handleInputChange("careerGoals", "primaryObjective", e.target.value)}
                  placeholder="To build scalable machine learning systems..."
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Footer Save Actions */}
          <div className="pt-4 border-t border-border/80 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-canvas text-xs font-semibold text-ink-muted hover:text-ink hover:bg-border/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent/90 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-accent/20 flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying & Saving...</span>
                </>
              ) : savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
