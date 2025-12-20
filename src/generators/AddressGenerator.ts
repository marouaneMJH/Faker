import type { IGenerator } from "../types/IGenerator";
import type GeneratorContext from "../core/GeneratorContext";
import GeoProvider, {
    type CountryData,
    type Coordinates,
} from "../core/GeoProvider";

/**
 * Configuration options for address generation.
 */
export interface AddressConfig {
    /** Output format: 'string' for formatted address or 'object' for structured data. */
    format?: "string" | "object";
    /** Country code for locale-specific addresses (ISO 3166-1 alpha-2). */
    country?: string;
    /** Include secondary address line (apartment, suite, etc.). */
    includeSecondary?: boolean;
    /** Include coordinates in object format. */
    includeCoordinates?: boolean;
    /** Address template override. */
    template?: string;
}

/**
 * Structured address data when format is 'object'.
 */
export interface AddressData {
    /** Street number. */
    streetNumber: string;
    /** Street name. */
    streetName: string;
    /** Street type/suffix (e.g., 'St', 'Ave'). */
    streetType: string;
    /** Secondary address line (optional). */
    secondary?: string;
    /** City name. */
    city: string;
    /** State/region/province. */
    region: string;
    /** Postal/ZIP code. */
    postalCode: string;
    /** Country name. */
    country: string;
    /** Country code (ISO 3166-1 alpha-2). */
    countryCode: string;
    /** Geographic coordinates (optional). */
    coordinates?: Coordinates;
    /** Timezone identifier (optional). */
    timezone?: string;
}

/**
 * Custom error for invalid country codes.
 */
export class UnsupportedCountryError extends Error {
    constructor(countryCode: string) {
        super(`Unsupported country code: ${countryCode}`);
        this.name = "UnsupportedCountryError";
    }
}

/**
 * Custom error for invalid postal code patterns.
 */
export class InvalidPostalCodeError extends Error {
    constructor(postalCode: string, pattern: string) {
        super(`Invalid postal code "${postalCode}" for pattern: ${pattern}`);
        this.name = "InvalidPostalCodeError";
    }
}

/**
 * Address generator for creating realistic postal addresses with international support.
 *
 * Generates addresses in various formats and locales, supporting both
 * formatted string output and structured object data. Uses GeoProvider
 * for authentic geographic data including postal codes, timezones, and coordinates.
 *
 * Features:
 * - International address formats (US, European, Asian)
 * - Authentic postal code patterns by country
 * - Geographic coordinates within country bounds
 * - Timezone support
 * - Secondary address lines (apartments, suites)
 * - Validation and error handling
 *
 * @example
 * ```typescript
 * const generator = new AddressGenerator(context);
 *
 * // Generate US address
 * const usAddress = generator.generate({ country: 'US', format: 'string' });
 * console.log(usAddress); // "123 Oak St, Springfield, IL 62701"
 *
 * // Generate structured UK address with coordinates
 * const ukAddress = generator.generate({
 *   country: 'GB',
 *   format: 'object',
 *   includeCoordinates: true
 * });
 * console.log(ukAddress.postalCode); // "SW1A 1AA"
 * console.log(ukAddress.coordinates); // { lat: 51.5074, lng: -0.1278 }
 *
 * // Generate specific components
 * console.log(generator.street()); // "456 Pine Ave"
 * console.log(generator.city()); // "Denver"
 * console.log(generator.countryCode()); // "US"
 * console.log(generator.coordinates()); // { lat: 39.7392, lng: -104.9903 }
 * ```
 */
export class AddressGenerator
    implements IGenerator<AddressConfig, string | AddressData>
{
    /** Generator identifier. */
    readonly name = "address";

    private readonly geoProvider: GeoProvider;

    /**
     * Street name pool for generating realistic street names.
     */
    private readonly streetNames = [
        // English street names
        "Main",
        "Oak",
        "Pine",
        "Maple",
        "Cedar",
        "Elm",
        "Washington",
        "Park",
        "Lincoln",
        "Church",
        "Spring",
        "Hill",
        "River",
        "Lake",
        "Forest",
        "School",
        "First",
        "Second",
        "Third",
        "Fourth",
        "Fifth",
        "Sixth",
        "Seventh",
        "Eighth",
        "Ninth",
        "Tenth",
        "Mill",
        "Ridge",
        "Valley",
        "Garden",
        "Sunset",
        "Central",
        "Chestnut",
        "Walnut",

        // International variations
        "Victoria",
        "Oxford",
        "Cambridge",
        "Winchester",
        "Brighton",
        "Churchill",
        "Königstraße",
        "Hauptstraße",
        "Bahnhofstraße",
        "Gartenstraße",
        "Kirchstraße",
        "Rue de la Paix",
        "Avenue des Champs",
        "Boulevard Saint-Germain",
        "Place Vendôme",
        "Sakura",
        "Ginza",
        "Shibuya",
        "Asakusa",
        "Roppongi",
        "Shinjuku",
    ];

    /**
     * Secondary address descriptors for apartments, suites, etc.
     */
    private readonly secondaryTypes = [
        "Apt",
        "Suite",
        "Unit",
        "Building",
        "Floor",
        "#",
        "Rm",
        "Ste",
    ];

    constructor(
        public readonly context: GeneratorContext,
        geoProvider?: GeoProvider
    ) {
        this.geoProvider = geoProvider || new GeoProvider();
    }

    /**
     * Generates a complete address based on the provided configuration.
     *
     * @param config - Configuration options for address generation.
     *
     * @returns Generated address as string or structured object.
     *
     * @throws {UnsupportedCountryError} When the specified country code is not supported.
     *
     * @example
     * ```typescript
     * const generator = new AddressGenerator(context);
     *
     * // String format
     * const stringAddress = generator.generate({ format: 'string', country: 'US' });
     * console.log(stringAddress); // "123 Oak St, Denver, CO 80202"
     *
     * // Object format with coordinates
     * const objectAddress = generator.generate({
     *   format: 'object',
     *   country: 'GB',
     *   includeCoordinates: true
     * });
     * console.log(objectAddress);
     * // {
     * //   streetNumber: "42",
     * //   streetName: "Victoria",
     * //   streetType: "St",
     * //   city: "London",
     * //   region: "England",
     * //   postalCode: "SW1A 1AA",
     * //   country: "United Kingdom",
     * //   countryCode: "GB",
     * //   coordinates: { lat: 51.5074, lng: -0.1278 }
     * // }
     * ```
     */
    generate(config: AddressConfig = {}): string | AddressData {
        const {
            format = "string",
            country: requestedCountry,
            includeSecondary = false,
            includeCoordinates = false,
            template,
        } = config;

        const countryData = this.resolveCountryData(requestedCountry);
        const addressData = this.generateAddressData(
            countryData,
            includeSecondary,
            includeCoordinates
        );

        if (format === "object") {
            return addressData;
        }

        return this.formatAddressString(addressData, countryData, template);
    }

    /**
     * Generates a random country name.
     *
     * @returns Random country name.
     *
     * @example
     * ```typescript
     * const generator = new AddressGenerator(context);
     * console.log(generator.country()); // "United States"
     * console.log(generator.country()); // "France"
     * ```
     */
    country(): string {
        const countries = this.geoProvider.getAllCountries();
        return this.context.getRng().pick(countries).name;
    }

    /**
     * Generates a random country code (ISO 3166-1 alpha-2).
     *
     * @returns Random ISO alpha-2 country code.
     *
     * @example
     * ```typescript
     * const generator = new AddressGenerator(context);
     * console.log(generator.countryCode()); // "US"
     * console.log(generator.countryCode()); // "GB"
     * ```
     */
    countryCode(): string {
        const codes = this.geoProvider.getCountryCodes();
        return this.context.getRng().pick(codes);
    }

    /**
     * Generates a random state, province, or region for the current locale.
     *
     * @param countryCode - Optional country code. Uses locale if not specified.
     *
     * @returns Random region name.
     *
     * @example
     * ```typescript
     * const generator = new AddressGenerator(context);
     * console.log(generator.region()); // "California"
     * console.log(generator.region('DE')); // "Bavaria"
     * ```
     */
    region(countryCode?: string): string {
        const countryData = this.resolveCountryData(countryCode);
        return this.context.getRng().pick(countryData.regions);
    }

    /**
     * Generates a random city name for the current locale.
     *
     * @param countryCode - Optional country code. Uses locale if not specified.
     *
     * @returns Random city name.
     *
     * @example
     * ```typescript
     * const generator = new AddressGenerator(context);
     * console.log(generator.city()); // "New York"
     * console.log(generator.city('JP')); // "Tokyo"
     * ```
     */
    city(countryCode?: string): string {
        const countryData = this.resolveCountryData(countryCode);
        return this.context.getRng().pick(countryData.cities);
    }

    /**
     * Generates a random street address (number + name + type).
     *
     * @param countryCode - Optional country code for locale-specific formatting.
     *
     * @returns Random street address.
     *
     * @example
     * ```typescript
     * const generator = new AddressGenerator(context);
     * console.log(generator.street()); // "123 Oak St"
     * console.log(generator.street('DE')); // "Hauptstraße 45"
     * ```
     */
    street(countryCode?: string): string {
        const countryData = this.resolveCountryData(countryCode);
        const streetNumber = this.context.getRng().int(1, 9999).toString();
        const streetName = this.context.getRng().pick(this.streetNames);
        const streetType = this.context.getRng().pick(countryData.streetTypes);

        // Format varies by country
        if (countryCode === "DE" || countryCode === "FR") {
            return `${streetName}${streetType} ${streetNumber}`;
        }

        return `${streetNumber} ${streetName} ${streetType}`;
    }

    /**
     * Generates a random postal code following country-specific patterns.
     *
     * @param countryCode - Optional country code. Uses locale if not specified.
     *
     * @returns Random postal code matching the country's format.
     *
     * @throws {InvalidPostalCodeError} When generated code doesn't match expected pattern.
     *
     * @example
     * ```typescript
     * const generator = new AddressGenerator(context);
     * console.log(generator.postalCode()); // "12345"
     * console.log(generator.postalCode('GB')); // "SW1A 1AA"
     * console.log(generator.postalCode('JP')); // "100-0001"
     * ```
     */
    postalCode(countryCode?: string): string {
        const countryData = this.resolveCountryData(countryCode);
        const country = countryData.alpha2;

        let postalCode: string;

        switch (country) {
            case "US":
                postalCode = String(this.context.getRng().int(10000, 99999));
                break;

            case "GB":
                // UK postcodes: "SW1A 1AA" format
                const area = this.context
                    .getRng()
                    .pick(["SW", "NW", "SE", "NE", "W", "E", "N", "S"]);
                const district = this.context.getRng().int(1, 99);
                const sector = this.context.getRng().int(0, 9);
                const unit = this.generateRandomString(
                    2,
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                );
                postalCode = `${area}${district}${
                    this.context.getRng().boolean()
                        ? this.generateRandomString(
                              1,
                              "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                          )
                        : ""
                } ${sector}${unit}`;
                break;

            case "DE":
            case "FR":
                postalCode = String(this.context.getRng().int(10000, 99999));
                break;

            case "JP":
                // Japanese format: "100-0001"
                const prefix = String(this.context.getRng().int(100, 999));
                const suffix = String(this.context.getRng().int(1000, 9999));
                postalCode = `${prefix}-${suffix}`;
                break;

            default:
                postalCode = String(this.context.getRng().int(10000, 99999));
        }

        // Validate against pattern
        const pattern = new RegExp(countryData.postalPattern);
        if (!pattern.test(postalCode)) {
            throw new InvalidPostalCodeError(
                postalCode,
                countryData.postalPattern
            );
        }

        return postalCode;
    }

    /**
     * Generates random geographic coordinates.
     *
     * @param countryCode - Optional country code for country-specific bounds.
     *
     * @returns Random coordinates object with lat/lng.
     *
     * @example
     * ```typescript
     * const generator = new AddressGenerator(context);
     * console.log(generator.coordinates()); // { lat: 40.7128, lng: -74.0060 }
     * console.log(generator.coordinates('JP')); // { lat: 35.6762, lng: 139.6503 }
     * ```
     */
    coordinates(countryCode?: string): Coordinates {
        const resolvedCountryCode =
            countryCode || this.resolveCountryData().alpha2;
        return this.geoProvider.getRandomCoordinates(
            resolvedCountryCode,
            this.context.getRng()
        );
    }

    /**
     * Generates a random timezone identifier for a country.
     *
     * @param countryCode - Optional country code. Uses locale if not specified.
     *
     * @returns Random timezone identifier (IANA format).
     *
     * @example
     * ```typescript
     * const generator = new AddressGenerator(context);
     * console.log(generator.timezone()); // "America/New_York"
     * console.log(generator.timezone('GB')); // "Europe/London"
     * ```
     */
    timezone(countryCode?: string): string {
        const countryData = this.resolveCountryData(countryCode);
        return this.context.getRng().pick(countryData.timezones);
    }

    /**
     * Generates a secondary address line (apartment, suite, etc.).
     *
     * @returns Random secondary address line.
     *
     * @example
     * ```typescript
     * const generator = new AddressGenerator(context);
     * console.log(generator.secondary()); // "Apt 42"
     * console.log(generator.secondary()); // "Suite 101"
     * ```
     */
    secondary(): string {
        const type = this.context.getRng().pick(this.secondaryTypes);
        const number = this.context.getRng().int(1, 999);

        if (type === "#") {
            return `${type}${number}`;
        }

        return `${type} ${number}`;
    }

    /**
     * Resolves country data based on country code or current locale.
     *
     * @param countryCode - Optional country code to resolve.
     *
     * @returns Country data for the specified or locale-based country.
     *
     * @throws {UnsupportedCountryError} When the country code is not supported.
     *
     * @private
     */
    private resolveCountryData(countryCode?: string): CountryData {
        if (countryCode) {
            if (!this.geoProvider.isCountrySupported(countryCode)) {
                throw new UnsupportedCountryError(countryCode);
            }
            return this.geoProvider.getCountryData(countryCode)!;
        }

        return this.geoProvider.getCountryByLocale(this.context.getLocale());
    }

    /**
     * Generates complete address data structure.
     *
     * @param countryData - Country data for locale-specific generation.
     * @param includeSecondary - Whether to include secondary address line.
     * @param includeCoordinates - Whether to include geographic coordinates.
     *
     * @returns Complete address data object.
     *
     * @private
     */
    private generateAddressData(
        countryData: CountryData,
        includeSecondary: boolean,
        includeCoordinates: boolean
    ): AddressData {
        const streetNumber = this.context.getRng().int(1, 9999).toString();
        const streetName = this.context.getRng().pick(this.streetNames);
        const streetType = this.context.getRng().pick(countryData.streetTypes);
        const city = this.context.getRng().pick(countryData.cities);
        const region = this.context.getRng().pick(countryData.regions);
        const postalCode = this.postalCode(countryData.alpha2);

        const addressData: AddressData = {
            streetNumber,
            streetName,
            streetType,
            city,
            region,
            postalCode,
            country: countryData.name,
            countryCode: countryData.alpha2,
        };

        if (includeSecondary && this.context.getRng().boolean()) {
            addressData.secondary = this.secondary();
        }

        if (includeCoordinates) {
            addressData.coordinates = this.coordinates(countryData.alpha2);
        }

        if (countryData.timezones.length > 0) {
            addressData.timezone = this.context
                .getRng()
                .pick(countryData.timezones);
        }

        return addressData;
    }

    /**
     * Formats address data into a string representation.
     *
     * @param addressData - Structured address data.
     * @param countryData - Country data for formatting rules.
     * @param template - Optional custom template.
     *
     * @returns Formatted address string.
     *
     * @private
     */
    private formatAddressString(
        addressData: AddressData,
        countryData: CountryData,
        template?: string
    ): string {
        if (template) {
            return this.applyTemplate(template, addressData);
        }

        const {
            streetNumber,
            streetName,
            streetType,
            secondary,
            city,
            region,
            postalCode,
        } = addressData;

        // Different formats by country
        switch (countryData.alpha2) {
            case "GB":
                const street = `${streetNumber} ${streetName} ${streetType}`;
                const cityLine = `${city}, ${region} ${postalCode}`;
                return secondary
                    ? `${street}, ${secondary}\n${cityLine}`
                    : `${street}\n${cityLine}`;

            case "DE":
            case "FR":
                const germanStreet = `${streetName}${streetType} ${streetNumber}`;
                const germanCityLine = `${postalCode} ${city}`;
                return secondary
                    ? `${germanStreet}, ${secondary}\n${germanCityLine}`
                    : `${germanStreet}\n${germanCityLine}`;

            case "JP":
                const jpStreet = `${region} ${city} ${streetName}${streetType} ${streetNumber}`;
                const jpCityLine = `〒${postalCode}`;
                return secondary
                    ? `${jpCityLine}\n${jpStreet}, ${secondary}`
                    : `${jpCityLine}\n${jpStreet}`;

            default: // US format
                const usStreet = `${streetNumber} ${streetName} ${streetType}`;
                const usCityLine = `${city}, ${region} ${postalCode}`;
                return secondary
                    ? `${usStreet}, ${secondary}\n${usCityLine}`
                    : `${usStreet}\n${usCityLine}`;
        }
    }

    /**
     * Applies a custom template to address data.
     *
     * @param template - Template string with placeholders.
     * @param addressData - Address data to substitute.
     *
     * @returns Template with substituted values.
     *
     * @private
     */
    private applyTemplate(template: string, addressData: AddressData): string {
        return template
            .replace("{streetNumber}", addressData.streetNumber)
            .replace("{streetName}", addressData.streetName)
            .replace("{streetType}", addressData.streetType)
            .replace("{secondary}", addressData.secondary || "")
            .replace("{city}", addressData.city)
            .replace("{region}", addressData.region)
            .replace("{postalCode}", addressData.postalCode)
            .replace("{country}", addressData.country)
            .replace("{countryCode}", addressData.countryCode)
            .replace("\\n", "\n");
    }

    /**
     * Generates a random string from a character set.
     *
     * @param length - Length of the string to generate.
     * @param charset - Character set to choose from.
     *
     * @returns Random string of specified length.
     *
     * @private
     */
    private generateRandomString(length: number, charset: string): string {
        let result = "";
        for (let i = 0; i < length; i++) {
            result += charset.charAt(
                this.context.getRng().int(0, charset.length - 1)
            );
        }
        return result;
    }

    /**
     * Gets the default configuration for address generation.
     *
     * @returns Default configuration object.
     */
    getDefaultConfig(): AddressConfig {
        return {
            format: "string",
            includeSecondary: false,
            includeCoordinates: false,
        };
    }

    /**
     * Validates the provided configuration.
     *
     * @param config - Configuration to validate.
     *
     * @returns True if configuration is valid, false otherwise.
     */
    validateConfig(config: AddressConfig): boolean {
        if (!config || typeof config !== "object") {
            return false;
        }

        const {
            format,
            country,
            includeSecondary,
            includeCoordinates,
            template,
        } = config;

        // Validate format
        if (format !== undefined && !["string", "object"].includes(format)) {
            return false;
        }

        // Validate country code
        if (country !== undefined && typeof country !== "string") {
            return false;
        }

        // Validate boolean flags
        if (
            includeSecondary !== undefined &&
            typeof includeSecondary !== "boolean"
        ) {
            return false;
        }

        if (
            includeCoordinates !== undefined &&
            typeof includeCoordinates !== "boolean"
        ) {
            return false;
        }

        // Validate template
        if (template !== undefined && typeof template !== "string") {
            return false;
        }

        return true;
    }
}

export default AddressGenerator;
