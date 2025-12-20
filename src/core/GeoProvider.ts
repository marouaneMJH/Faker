/**
 * Geographic data structure for countries and regions.
 */
export interface CountryData {
    /** Country name in English. */
    name: string;
    /** ISO 3166-1 alpha-2 code (e.g., 'US', 'GB'). */
    alpha2: string;
    /** ISO 3166-1 alpha-3 code (e.g., 'USA', 'GBR'). */
    alpha3: string;
    /** ISO 3166-1 numeric code (e.g., '840', '826'). */
    numeric: string;
    /** States, provinces, or regions within the country. */
    regions: string[];
    /** Major cities within the country. */
    cities: string[];
    /** Postal code pattern (regex string). */
    postalPattern: string;
    /** Example postal code. */
    postalExample: string;
    /** Common street types/suffixes. */
    streetTypes: string[];
    /** IANA timezone identifiers. */
    timezones: string[];
    /** Coordinate bounds: [minLat, minLng, maxLat, maxLng]. */
    bounds: [number, number, number, number];
}

/**
 * Geographic coordinate information.
 */
export interface Coordinates {
    /** Latitude (-90 to 90). */
    lat: number;
    /** Longitude (-180 to 180). */
    lng: number;
}

/**
 * Complete address format configuration.
 */
export interface AddressFormat {
    /** Address line format (street number + name). */
    streetFormat: string;
    /** City line format. */
    cityFormat: string;
    /** Full address template. */
    template: string;
}

/**
 * Geographic data for the United States.
 */
const US_DATA: CountryData = {
    name: "United States",
    alpha2: "US",
    alpha3: "USA",
    numeric: "840",
    regions: [
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "Florida",
        "Georgia",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming",
    ],
    cities: [
        "New York",
        "Los Angeles",
        "Chicago",
        "Houston",
        "Phoenix",
        "Philadelphia",
        "San Antonio",
        "San Diego",
        "Dallas",
        "San Jose",
        "Austin",
        "Jacksonville",
        "San Francisco",
        "Columbus",
        "Fort Worth",
        "Indianapolis",
        "Charlotte",
        "Seattle",
        "Denver",
        "El Paso",
        "Detroit",
        "Washington",
        "Boston",
        "Memphis",
        "Nashville",
        "Portland",
        "Oklahoma City",
        "Las Vegas",
        "Baltimore",
        "Louisville",
        "Milwaukee",
        "Albuquerque",
        "Tucson",
        "Fresno",
        "Sacramento",
        "Mesa",
        "Kansas City",
        "Atlanta",
        "Long Beach",
        "Colorado Springs",
        "Raleigh",
        "Miami",
        "Virginia Beach",
        "Omaha",
        "Oakland",
        "Minneapolis",
        "Tulsa",
        "Arlington",
        "Tampa",
        "New Orleans",
    ],
    postalPattern: "^[0-9]{5}(-[0-9]{4})?$",
    postalExample: "12345",
    streetTypes: [
        "St",
        "Ave",
        "Blvd",
        "Dr",
        "Ct",
        "Pl",
        "Ln",
        "Rd",
        "Way",
        "Pkwy",
    ],
    timezones: [
        "America/New_York",
        "America/Chicago",
        "America/Denver",
        "America/Los_Angeles",
        "America/Anchorage",
        "Pacific/Honolulu",
    ],
    bounds: [24.396308, -125.0, 49.384358, -66.93457],
};

/**
 * Geographic data for the United Kingdom.
 */
const GB_DATA: CountryData = {
    name: "United Kingdom",
    alpha2: "GB",
    alpha3: "GBR",
    numeric: "826",
    regions: [
        "England",
        "Scotland",
        "Wales",
        "Northern Ireland",
        "Greater London",
        "West Midlands",
        "Greater Manchester",
        "West Yorkshire",
        "Merseyside",
        "South Yorkshire",
        "Tyne and Wear",
        "Leicestershire",
    ],
    cities: [
        "London",
        "Birmingham",
        "Manchester",
        "Glasgow",
        "Liverpool",
        "Newcastle",
        "Sheffield",
        "Bristol",
        "Belfast",
        "Cardiff",
        "Edinburgh",
        "Leicester",
        "Coventry",
        "Hull",
        "Bradford",
        "Nottingham",
        "Plymouth",
        "Southampton",
        "Reading",
        "Derby",
        "Dudley",
        "Northampton",
        "Portsmouth",
        "Norwich",
    ],
    postalPattern: "^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\\s?[0-9][A-Z]{2}$",
    postalExample: "SW1A 1AA",
    streetTypes: [
        "St",
        "Rd",
        "Ave",
        "Ln",
        "Close",
        "Drive",
        "Gardens",
        "Square",
        "Mews",
    ],
    timezones: ["Europe/London"],
    bounds: [49.959999905, -7.57216793459, 58.6350001085, 1.68153079591],
};

/**
 * Geographic data for Germany.
 */
const DE_DATA: CountryData = {
    name: "Germany",
    alpha2: "DE",
    alpha3: "DEU",
    numeric: "276",
    regions: [
        "Baden-Württemberg",
        "Bavaria",
        "Berlin",
        "Brandenburg",
        "Bremen",
        "Hamburg",
        "Hesse",
        "Lower Saxony",
        "Mecklenburg-Vorpommern",
        "North Rhine-Westphalia",
        "Rhineland-Palatinate",
        "Saarland",
        "Saxony",
        "Saxony-Anhalt",
        "Schleswig-Holstein",
        "Thuringia",
    ],
    cities: [
        "Berlin",
        "Hamburg",
        "Munich",
        "Cologne",
        "Frankfurt",
        "Stuttgart",
        "Düsseldorf",
        "Dortmund",
        "Essen",
        "Leipzig",
        "Bremen",
        "Dresden",
        "Hanover",
        "Nuremberg",
        "Duisburg",
        "Bochum",
        "Wuppertal",
        "Bielefeld",
        "Bonn",
        "Münster",
        "Karlsruhe",
        "Mannheim",
        "Augsburg",
        "Wiesbaden",
        "Gelsenkirchen",
        "Mönchengladbach",
    ],
    postalPattern: "^[0-9]{5}$",
    postalExample: "12345",
    streetTypes: ["Straße", "Weg", "Platz", "Allee", "Gasse", "Ring", "Damm"],
    timezones: ["Europe/Berlin"],
    bounds: [47.3024876979, 5.98865807458, 54.983104153, 15.0169958839],
};

/**
 * Geographic data for France.
 */
const FR_DATA: CountryData = {
    name: "France",
    alpha2: "FR",
    alpha3: "FRA",
    numeric: "250",
    regions: [
        "Île-de-France",
        "Auvergne-Rhône-Alpes",
        "Hauts-de-France",
        "Nouvelle-Aquitaine",
        "Occitanie",
        "Grand Est",
        "Provence-Alpes-Côte dAzur",
        "Pays de la Loire",
        "Bretagne",
        "Normandie",
        "Bourgogne-Franche-Comté",
        "Centre-Val de Loire",
        "Corsica",
    ],
    cities: [
        "Paris",
        "Marseille",
        "Lyon",
        "Toulouse",
        "Nice",
        "Nantes",
        "Strasbourg",
        "Montpellier",
        "Bordeaux",
        "Lille",
        "Rennes",
        "Reims",
        "Le Havre",
        "Saint-Étienne",
        "Toulon",
        "Grenoble",
        "Dijon",
        "Angers",
        "Nîmes",
        "Villeurbanne",
        "Saint-Denis",
        "Le Mans",
        "Aix-en-Provence",
        "Clermont-Ferrand",
        "Brest",
        "Limoges",
    ],
    postalPattern: "^[0-9]{5}$",
    postalExample: "75001",
    streetTypes: [
        "Rue",
        "Avenue",
        "Boulevard",
        "Place",
        "Allée",
        "Chemin",
        "Impasse",
    ],
    timezones: ["Europe/Paris"],
    bounds: [41.3253001, -9.56001631027, 51.1485061713, 10.2676819],
};

/**
 * Geographic data for Japan.
 */
const JP_DATA: CountryData = {
    name: "Japan",
    alpha2: "JP",
    alpha3: "JPN",
    numeric: "392",
    regions: [
        "Hokkaido",
        "Aomori",
        "Iwate",
        "Miyagi",
        "Akita",
        "Yamagata",
        "Fukushima",
        "Ibaraki",
        "Tochigi",
        "Gunma",
        "Saitama",
        "Chiba",
        "Tokyo",
        "Kanagawa",
        "Niigata",
        "Toyama",
        "Ishikawa",
        "Fukui",
        "Yamanashi",
        "Nagano",
        "Gifu",
        "Shizuoka",
        "Aichi",
        "Mie",
        "Shiga",
        "Kyoto",
        "Osaka",
        "Hyogo",
        "Nara",
        "Wakayama",
        "Tottori",
        "Shimane",
        "Okayama",
        "Hiroshima",
        "Yamaguchi",
        "Tokushima",
        "Kagawa",
        "Ehime",
        "Kochi",
        "Fukuoka",
        "Saga",
        "Nagasaki",
        "Kumamoto",
        "Oita",
        "Miyazaki",
        "Kagoshima",
        "Okinawa",
    ],
    cities: [
        "Tokyo",
        "Yokohama",
        "Osaka",
        "Nagoya",
        "Sapporo",
        "Fukuoka",
        "Kobe",
        "Kawasaki",
        "Kyoto",
        "Saitama",
        "Hiroshima",
        "Sendai",
        "Kitakyushu",
        "Chiba",
        "Sakai",
        "Niigata",
        "Hamamatsu",
        "Shizuoka",
        "Sagamihara",
        "Okayama",
        "Kumamoto",
        "Kagoshima",
        "Hachioji",
        "Funabashi",
        "Nara",
        "Matsuyama",
        "Toyama",
    ],
    postalPattern: "^[0-9]{3}-[0-9]{4}$",
    postalExample: "100-0001",
    streetTypes: ["丁目", "番地", "号"],
    timezones: ["Asia/Tokyo"],
    bounds: [24.208416, 122.9336, 45.5233, 153.9878],
};

/**
 * Registry of country data by ISO alpha-2 codes.
 */
const COUNTRY_REGISTRY: Map<string, CountryData> = new Map([
    ["US", US_DATA],
    ["GB", GB_DATA],
    ["DE", DE_DATA],
    ["FR", FR_DATA],
    ["JP", JP_DATA],
]);

/**
 * Address format templates for different regions.
 */
const ADDRESS_FORMATS: Map<string, AddressFormat> = new Map([
    [
        "us",
        {
            streetFormat: "{number} {street} {type}",
            cityFormat: "{city}, {region} {postal}",
            template: "{street}\\n{city}",
        },
    ],
    [
        "eu",
        {
            streetFormat: "{street} {number}",
            cityFormat: "{postal} {city}",
            template: "{street}\\n{city}",
        },
    ],
    [
        "asia",
        {
            streetFormat: "{region} {city} {street} {number}",
            cityFormat: "〒{postal}",
            template: "{city}\\n{street}",
        },
    ],
]);

/**
 * Provider for geographic data including countries, regions, cities, and coordinate information.
 *
 * This class manages geographic datasets for address generation, providing
 * locale-appropriate data for countries, postal codes, timezones, and coordinates.
 *
 * @example
 * ```typescript
 * const geoProvider = new GeoProvider();
 * const countryData = geoProvider.getCountryData('US');
 * console.log(countryData.cities); // ['New York', 'Los Angeles', ...]
 *
 * const coords = geoProvider.getRandomCoordinates('US');
 * console.log(coords); // { lat: 40.7128, lng: -74.0060 }
 * ```
 */
export class GeoProvider {
    /**
     * Gets country data by ISO alpha-2 code.
     *
     * @param countryCode - The ISO alpha-2 country code (e.g., 'US', 'GB').
     *
     * @returns Country data or undefined if not found.
     *
     * @example
     * ```typescript
     * const geoProvider = new GeoProvider();
     * const usData = geoProvider.getCountryData('US');
     * console.log(usData?.name); // "United States"
     * console.log(usData?.alpha3); // "USA"
     * ```
     */
    getCountryData(countryCode: string): CountryData | undefined {
        return COUNTRY_REGISTRY.get(countryCode.toUpperCase());
    }

    /**
     * Gets all available country codes.
     *
     * @returns Array of ISO alpha-2 country codes.
     *
     * @example
     * ```typescript
     * const geoProvider = new GeoProvider();
     * console.log(geoProvider.getCountryCodes()); // ['US', 'GB', 'DE', 'FR', 'JP']
     * ```
     */
    getCountryCodes(): string[] {
        return Array.from(COUNTRY_REGISTRY.keys()).sort();
    }

    /**
     * Gets all available countries.
     *
     * @returns Array of all country data objects.
     *
     * @example
     * ```typescript
     * const geoProvider = new GeoProvider();
     * const countries = geoProvider.getAllCountries();
     * console.log(countries.map(c => c.name)); // ['United States', 'United Kingdom', ...]
     * ```
     */
    getAllCountries(): CountryData[] {
        return Array.from(COUNTRY_REGISTRY.values()).sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    /**
     * Gets address format configuration for a region.
     *
     * @param format - The format type ('us', 'eu', 'asia').
     *
     * @returns Address format configuration or undefined if not found.
     *
     * @example
     * ```typescript
     * const geoProvider = new GeoProvider();
     * const usFormat = geoProvider.getAddressFormat('us');
     * console.log(usFormat?.template); // "{street}\\n{city}"
     * ```
     */
    getAddressFormat(format: string): AddressFormat | undefined {
        return ADDRESS_FORMATS.get(format.toLowerCase());
    }

    /**
     * Checks if a country code is supported.
     *
     * @param countryCode - The ISO alpha-2 country code to check.
     *
     * @returns True if the country is supported, false otherwise.
     *
     * @example
     * ```typescript
     * const geoProvider = new GeoProvider();
     * console.log(geoProvider.isCountrySupported('US')); // true
     * console.log(geoProvider.isCountrySupported('XX')); // false
     * ```
     */
    isCountrySupported(countryCode: string): boolean {
        return COUNTRY_REGISTRY.has(countryCode.toUpperCase());
    }

    /**
     * Gets random coordinates within a country's bounds.
     *
     * @param countryCode - The ISO alpha-2 country code.
     * @param rng - Random number generator function.
     *
     * @returns Random coordinates within the country or worldwide if country not found.
     *
     * @example
     * ```typescript
     * const geoProvider = new GeoProvider();
     * const rng = { float: (min, max) => Math.random() * (max - min) + min };
     * const coords = geoProvider.getRandomCoordinates('US', rng);
     * console.log(coords); // { lat: 40.7128, lng: -74.0060 } (within US bounds)
     * ```
     */
    getRandomCoordinates(
        countryCode: string,
        rng: { float(min: number, max: number): number }
    ): Coordinates {
        const countryData = this.getCountryData(countryCode);

        if (countryData) {
            const [minLat, minLng, maxLat, maxLng] = countryData.bounds;
            return {
                lat: rng.float(minLat, maxLat),
                lng: rng.float(minLng, maxLng),
            };
        }

        // Default to worldwide coordinates
        return {
            lat: rng.float(-90, 90),
            lng: rng.float(-180, 180),
        };
    }

    /**
     * Gets country data by locale code.
     *
     * @param locale - The locale code (e.g., 'en-US', 'en-GB').
     *
     * @returns Country data based on locale or US data as fallback.
     *
     * @example
     * ```typescript
     * const geoProvider = new GeoProvider();
     * const data = geoProvider.getCountryByLocale('en-GB');
     * console.log(data.name); // "United Kingdom"
     * ```
     */
    getCountryByLocale(locale: string): CountryData {
        const localeMap: Record<string, string> = {
            en: "US",
            "en-US": "US",
            "en-GB": "GB",
            de: "DE",
            "de-DE": "DE",
            fr: "FR",
            "fr-FR": "FR",
            ja: "JP",
            "ja-JP": "JP",
        };

        const countryCode = localeMap[locale] || "US";
        return this.getCountryData(countryCode) || US_DATA;
    }
}

export default GeoProvider;
