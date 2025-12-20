import AddressGenerator from "../src/generators/AddressGenerator";
import GeneratorContext from "../src/core/GeneratorContext";
import GeoProvider from "../src/core/GeoProvider";
import {
    UnsupportedCountryError,
    InvalidPostalCodeError,
} from "../src/generators/AddressGenerator";

describe("AddressGenerator", () => {
    let context: GeneratorContext;
    let generator: AddressGenerator;
    let geoProvider: GeoProvider;

    beforeEach(() => {
        context = new GeneratorContext({ seed: 12345, locale: "en" });
        geoProvider = new GeoProvider();
        generator = new AddressGenerator(context, geoProvider);
    });

    describe("constructor", () => {
        it("should create instance with context and default GeoProvider", () => {
            const gen = new AddressGenerator(context);
            expect(gen).toBeInstanceOf(AddressGenerator);
            expect(gen.name).toBe("address");
        });

        it("should create instance with custom GeoProvider", () => {
            const customGeoProvider = new GeoProvider();
            const gen = new AddressGenerator(context, customGeoProvider);
            expect(gen).toBeInstanceOf(AddressGenerator);
        });
    });

    describe("generate method", () => {
        it("should generate string address by default", () => {
            const address = generator.generate();
            expect(typeof address).toBe("string");
            expect((address as string).length).toBeGreaterThan(0);
        });

        it("should generate string address with explicit format", () => {
            const address = generator.generate({ format: "string" });
            expect(typeof address).toBe("string");
            expect(address).toContain("\n"); // Should have multi-line format
        });

        it("should generate object address", () => {
            const address = generator.generate({ format: "object" });
            expect(typeof address).toBe("object");
            expect(address).toHaveProperty("streetNumber");
            expect(address).toHaveProperty("streetName");
            expect(address).toHaveProperty("streetType");
            expect(address).toHaveProperty("city");
            expect(address).toHaveProperty("region");
            expect(address).toHaveProperty("postalCode");
            expect(address).toHaveProperty("country");
            expect(address).toHaveProperty("countryCode");
        });

        it("should generate US address when specified", () => {
            const address = generator.generate({
                country: "US",
                format: "object",
            });
            expect(typeof address).toBe("object");
            if (typeof address === "object" && "countryCode" in address) {
                expect(address.countryCode).toBe("US");
                expect(address.country).toBe("United States");
            }
        });

        it("should generate UK address when specified", () => {
            const address = generator.generate({
                country: "GB",
                format: "object",
            });
            expect(typeof address).toBe("object");
            if (typeof address === "object" && "countryCode" in address) {
                expect(address.countryCode).toBe("GB");
                expect(address.country).toBe("United Kingdom");
            }
        });

        it("should include secondary address when requested", () => {
            // Generate multiple times to test probability
            let hasSecondary = false;
            for (let i = 0; i < 10; i++) {
                const address = generator.generate({
                    format: "object",
                    includeSecondary: true,
                });
                if (
                    typeof address === "object" &&
                    "secondary" in address &&
                    address.secondary
                ) {
                    hasSecondary = true;
                    break;
                }
            }
            expect(hasSecondary).toBe(true);
        });

        it("should include coordinates when requested", () => {
            const address = generator.generate({
                format: "object",
                includeCoordinates: true,
            });
            expect(typeof address).toBe("object");
            if (typeof address === "object" && "coordinates" in address) {
                expect(address.coordinates).toHaveProperty("lat");
                expect(address.coordinates).toHaveProperty("lng");
                expect(typeof address.coordinates?.lat).toBe("number");
                expect(typeof address.coordinates?.lng).toBe("number");
            }
        });

        it("should use custom template", () => {
            const template = "{streetNumber} {streetName} - {city}";
            const address = generator.generate({
                format: "string",
                template,
            });
            expect(typeof address).toBe("string");
            expect(address).toMatch(/^\d+ \w+ - \w+$/);
        });

        it("should throw error for unsupported country", () => {
            expect(() => {
                generator.generate({ country: "XX" });
            }).toThrow(UnsupportedCountryError);
        });
    });

    describe("individual component methods", () => {
        it("should generate country name", () => {
            const country = generator.country();
            expect(typeof country).toBe("string");
            expect(country.length).toBeGreaterThan(0);
        });

        it("should generate country code", () => {
            const countryCode = generator.countryCode();
            expect(typeof countryCode).toBe("string");
            expect(countryCode.length).toBe(2);
            expect(countryCode).toMatch(/^[A-Z]{2}$/);
        });

        it("should generate region for default locale", () => {
            const region = generator.region();
            expect(typeof region).toBe("string");
            expect(region.length).toBeGreaterThan(0);
        });

        it("should generate region for specific country", () => {
            const region = generator.region("DE");
            expect(typeof region).toBe("string");
            expect(region.length).toBeGreaterThan(0);
        });

        it("should generate city for default locale", () => {
            const city = generator.city();
            expect(typeof city).toBe("string");
            expect(city.length).toBeGreaterThan(0);
        });

        it("should generate city for specific country", () => {
            const city = generator.city("JP");
            expect(typeof city).toBe("string");
            expect(city.length).toBeGreaterThan(0);
        });

        it("should generate street address", () => {
            const street = generator.street();
            expect(typeof street).toBe("string");
            expect(street).toMatch(/^\d+\s+\w+\s+\w+$/); // Number + Name + Type
        });

        it("should generate street with country-specific format", () => {
            const usStreet = generator.street("US");
            const deStreet = generator.street("DE");

            expect(typeof usStreet).toBe("string");
            expect(typeof deStreet).toBe("string");
            expect(usStreet).not.toBe(deStreet);
        });

        it("should generate postal codes", () => {
            const usPostal = generator.postalCode("US");
            expect(usPostal).toMatch(/^\d{5}$/);

            const gbPostal = generator.postalCode("GB");
            expect(gbPostal).toMatch(/^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/);

            const jpPostal = generator.postalCode("JP");
            expect(jpPostal).toMatch(/^\d{3}-\d{4}$/);
        });

        it("should generate coordinates", () => {
            const coords = generator.coordinates();
            expect(coords).toHaveProperty("lat");
            expect(coords).toHaveProperty("lng");
            expect(typeof coords.lat).toBe("number");
            expect(typeof coords.lng).toBe("number");
            expect(coords.lat).toBeGreaterThanOrEqual(-90);
            expect(coords.lat).toBeLessThanOrEqual(90);
            expect(coords.lng).toBeGreaterThanOrEqual(-180);
            expect(coords.lng).toBeLessThanOrEqual(180);
        });

        it("should generate coordinates within country bounds", () => {
            const usCoords = generator.coordinates("US");
            expect(usCoords.lat).toBeGreaterThanOrEqual(24);
            expect(usCoords.lat).toBeLessThanOrEqual(50);
        });

        it("should generate timezone", () => {
            const timezone = generator.timezone();
            expect(typeof timezone).toBe("string");
            expect(timezone).toMatch(/^[A-Z][a-zA-Z_/]+$/);
        });

        it("should generate secondary address line", () => {
            const secondary = generator.secondary();
            expect(typeof secondary).toBe("string");
            expect(secondary).toMatch(
                /^(Apt|Suite|Unit|Building|Floor|#|Rm|Ste)\s?\d+$/
            );
        });
    });

    describe("deterministic behavior", () => {
        it("should generate consistent results with same seed", () => {
            const context1 = new GeneratorContext({ seed: 777 });
            const context2 = new GeneratorContext({ seed: 777 });
            const gen1 = new AddressGenerator(context1);
            const gen2 = new AddressGenerator(context2);

            const address1 = gen1.generate({ format: "object" });
            const address2 = gen2.generate({ format: "object" });

            expect(address1).toEqual(address2);
        });

        it("should generate different results with different seeds", () => {
            const context1 = new GeneratorContext({ seed: 111 });
            const context2 = new GeneratorContext({ seed: 222 });
            const gen1 = new AddressGenerator(context1);
            const gen2 = new AddressGenerator(context2);

            const address1 = gen1.generate();
            const address2 = gen2.generate();

            expect(address1).not.toBe(address2);
        });
    });

    describe("international address formats", () => {
        const countries = ["US", "GB", "DE", "FR", "JP"];

        it.each(countries)("should generate valid %s addresses", (country) => {
            const address = generator.generate({
                country,
                format: "object",
            });

            expect(typeof address).toBe("object");
            if (typeof address === "object" && "countryCode" in address) {
                expect(address.countryCode).toBe(country);
            }
        });

        it("should format addresses differently for different countries", () => {
            const usAddress = generator.generate({
                country: "US",
                format: "string",
            });
            const gbAddress = generator.generate({
                country: "GB",
                format: "string",
            });

            expect(typeof usAddress).toBe("string");
            expect(typeof gbAddress).toBe("string");
            // The format should be different due to different address conventions
            expect(usAddress).not.toBe(gbAddress);
        });
    });

    describe("configuration validation", () => {
        it("should validate valid configuration", () => {
            const validConfig = {
                format: "string" as const,
                country: "US",
                includeSecondary: true,
                includeCoordinates: false,
                template: "{street} {city}",
            };

            expect(generator.validateConfig(validConfig)).toBe(true);
        });

        it("should reject invalid format", () => {
            const invalidConfig = {
                format: "invalid" as any,
            };

            expect(generator.validateConfig(invalidConfig)).toBe(false);
        });

        it("should reject non-string country", () => {
            const invalidConfig = {
                country: 123 as any,
            };

            expect(generator.validateConfig(invalidConfig)).toBe(false);
        });

        it("should reject non-boolean flags", () => {
            const invalidConfig = {
                includeSecondary: "yes" as any,
            };

            expect(generator.validateConfig(invalidConfig)).toBe(false);
        });
    });

    describe("default configuration", () => {
        it("should return valid default configuration", () => {
            const defaultConfig = generator.getDefaultConfig();
            expect(defaultConfig).toEqual({
                format: "string",
                includeSecondary: false,
                includeCoordinates: false,
            });
        });

        it("should validate default configuration", () => {
            const defaultConfig = generator.getDefaultConfig();
            expect(generator.validateConfig(defaultConfig)).toBe(true);
        });
    });

    describe("error handling", () => {
        it("should handle null configuration gracefully", () => {
            expect(generator.validateConfig(null as any)).toBe(false);
        });

        it("should handle undefined configuration", () => {
            expect(generator.validateConfig(undefined as any)).toBe(false);
        });

        it("should throw for unsupported country in region method", () => {
            expect(() => {
                generator.region("XX");
            }).toThrow(UnsupportedCountryError);
        });

        it("should throw for unsupported country in city method", () => {
            expect(() => {
                generator.city("YY");
            }).toThrow(UnsupportedCountryError);
        });
    });

    describe("edge cases", () => {
        it("should handle empty template gracefully", () => {
            const address = generator.generate({
                format: "string",
                template: "",
            });
            expect(typeof address).toBe("string");
        });

        it("should handle template with missing placeholders", () => {
            const address = generator.generate({
                format: "string",
                template: "Static address text",
            });
            expect(address).toBe("Static address text");
        });

        it("should generate consistent postal codes for same country", () => {
            const postal1 = generator.postalCode("US");
            const postal2 = generator.postalCode("US");

            // Both should match US format
            expect(postal1).toMatch(/^\d{5}$/);
            expect(postal2).toMatch(/^\d{5}$/);
        });
    });
});
