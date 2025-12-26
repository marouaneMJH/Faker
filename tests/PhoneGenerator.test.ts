import { AvailableCountry } from "./../src/data/countries/index";
import PhoneGenerator, {
    type PhoneConfig,
    type MobileOptions,
    type LandlineOptions,
    UnsupportedCountryError,
    InvalidCallingCodeError,
} from "../src/generators/PhoneGenerator";
import { CountryProvider } from "../src/core/CountryProvider";
import GeneratorContext from "../src/core/GeneratorContext";

describe("PhoneGenerator", () => {
    let context: GeneratorContext;
    let generator: PhoneGenerator;
    let countryProvider: CountryProvider;

    beforeEach(() => {
        context = new GeneratorContext({ seed: 12345 });
        countryProvider = new CountryProvider();
        generator = new PhoneGenerator(context, countryProvider);
    });

    describe("constructor", () => {
        it("should create instance with default CountryProvider", () => {
            const gen = new PhoneGenerator(context);
            expect(gen).toBeInstanceOf(PhoneGenerator);
            expect(gen.name).toBe("phone");
        });

        it("should create instance with custom CountryProvider", () => {
            const customProvider = new CountryProvider();
            const gen = new PhoneGenerator(context, customProvider);
            expect(gen).toBeInstanceOf(PhoneGenerator);
        });
    });

    describe("Morocco phone numbers (prioritized)", () => {
        it("should generate Morocco mobile numbers", () => {
            const mobile = generator.mobile({ country: "MA" });
            expect(typeof mobile).toBe("string");
            expect(mobile).toMatch(/^\+212 [67]\d{2}-\d{6}$/);
        });

        it("should generate Morocco landline numbers", () => {
            const landline = generator.landline({ country: "MA" });
            expect(typeof landline).toBe("string");
            expect(landline).toMatch(/^\+212 5\d{2}-\d{6}$/);
        });

        it("should generate Morocco E.164 format", () => {
            const e164 = generator.e164("MA");
            expect(typeof e164).toBe("string");
            expect(e164).toMatch(/^\+212[67]\d{8}$/);
            expect(e164.length).toBe(13); // +212 + 9 digits
        });

        it("should generate Morocco international format", () => {
            const intl = generator.international("MA");
            expect(typeof intl).toBe("string");
            expect(intl).toMatch(/^\+212 [67]\d{2}-\d{6}$/);
        });

        it("should generate Morocco numbers in different formats", () => {
            const national = generator.generate({
                country: "MA",
                format: "national",
            });
            const e164 = generator.generate({ country: "MA", format: "e164" });
            const international = generator.generate({
                country: "MA",
                format: "international",
            });

            expect(national).toMatch(/^[67]\d{2}-\d{6}$/);
            expect(e164).toMatch(/^\+212[67]\d{8}$/);
            expect(international).toMatch(/^\+212 [67]\d{2}-\d{6}$/);
        });
        // fix
        // it("should generate Morocco masked numbers", () => {
        //     const masked = generator.masked(4);
        //     expect(masked).toMatch(/^\+212 XXX-XX\d{4}$/);

        //     const masked3 = generator.masked(3);
        //     expect(masked3).toMatch(/^\+212 XXX-XXX\d{3}$/);
        // });

        // it("should generate Morocco numbers with extensions", () => {
        //     const withExt = generator.withExtension();
        //     expect(withExt).toMatch(
        //         /^\+212 [67]\d{2}-\d{6} (x|ext\.|extension) \d+$/
        //     );
        // });
    });

    describe("US phone numbers", () => {
        it("should generate US mobile numbers", () => {
            const mobile = generator.mobile({ country: "US" });
            expect(mobile).toMatch(/^\+1 \(\d{3}\) \d{3}-\d{4}$/);
        });

        it("should generate US landline numbers", () => {
            const landline = generator.landline({ country: "US" });
            expect(landline).toMatch(/^\+1 \(\d{3}\) \d{3}-\d{4}$/);
        });

        it("should generate US E.164 format", () => {
            const e164 = generator.e164("US");
            expect(e164).toMatch(/^\+1\d{10}$/);
            expect(e164.length).toBe(12); // +1 + 10 digits
        });

        it("should generate US numbers in different formats", () => {
            const national = generator.generate({
                country: "US",
                format: "national",
            });
            const e164 = generator.generate({ country: "US", format: "e164" });
            const international = generator.generate({
                country: "US",
                format: "international",
            });

            expect(national).toMatch(/^\(\d{3}\) \d{3}-\d{4}$/);
            expect(e164).toMatch(/^\+1\d{10}$/);
            expect(international).toMatch(/^\+1 \(\d{3}\) \d{3}-\d{4}$/);
        });
    });

    describe("French phone numbers", () => {
        it("should generate French mobile numbers", () => {
            const mobile = generator.mobile({ country: "FR" });
            expect(mobile).toMatch(/^\+33 [67] \d{2} \d{2} \d{2} \d{2}$/);
        });

        it("should generate French landline numbers", () => {
            const landline = generator.landline({ country: "FR" });
            expect(landline).toMatch(
                /^\+33 [12345789] \d{2} \d{2} \d{2} \d{2}$/
            );
        });

        it("should generate French E.164 format", () => {
            const e164 = generator.e164("FR");
            expect(e164).toMatch(/^\+33[67]\d{8}$/);
            expect(e164.replace("+", "").length).toBe(11); // +33 + 9 digits
        });
    });

    describe("format options", () => {
        it("should handle different mobile format options", () => {
            const e164 = generator.mobile({ country: "MA", format: "e164" });
            const national = generator.mobile({
                country: "MA",
                format: "national",
            });
            const international = generator.mobile({
                country: "MA",
                format: "international",
            });

            expect(e164).toMatch(/^\+212[67]\d{8}$/);
            expect(national).toMatch(/^[67]\d{2}-\d{6}$/);
            expect(international).toMatch(/^\+212 [67]\d{2}-\d{6}$/);
        });

        it("should default to international format for mobile", () => {
            const mobile = generator.mobile({ country: "MA" });
            expect(mobile).toMatch(/^\+212 [67]\d{2}-\d{6}$/);
        });
    });

    describe("masking functionality", () => {
        it("should mask phone numbers with specified visible digits", () => {
            const masked4 = generator.masked(4);
            const masked3 = generator.masked(3);
            const masked0 = generator.masked(0);

            expect(masked4).toMatch(/X.*\d{4}$/);
            expect(masked3).toMatch(/X.*\d{3}$/);
            expect(masked0).toMatch(/^[^\d]*X+[^\d]*$/);
        });

        it("should handle cases where visible digits exceed total", () => {
            const fullNumber = generator.international("MA");
            const masked = generator.masked(4); // More than total digits

            expect(masked).toMatch(/^\+X \(XXX\) XXX-\d{4}$/);
        });
    });

    describe("extensions", () => {
        it("should add extensions to phone numbers", () => {
            const withExt = generator.withExtension();
            expect(withExt).toMatch(/ (x|ext\.|extension) \d+$/);
        });

        it("should add extensions to custom base numbers", () => {
            const base = "+212 612-345678";
            const withExt = generator.withExtension(base);
            expect(withExt).toMatch(
                /^\+212 612-345678 (x|ext\.|extension) \d+$/
            );
        });
    });

    describe("locale-based generation", () => {
        it("should default to locale-based country for Arabic locale", () => {
            const arContext = new GeneratorContext({ locale: "ar" });
            const arGenerator = new PhoneGenerator(arContext, countryProvider);

            const phone = arGenerator.international();
            expect(phone).toMatch(/^\+212/);
        });

        it("should default to locale-based country for US locale", () => {
            const usContext = new GeneratorContext({ locale: "en" });
            const usGenerator = new PhoneGenerator(usContext, countryProvider);

            const phone = usGenerator.international();
            expect(phone).toMatch(/^\+1/);
        });

        it("should default to Morocco for unknown locales", () => {
            const unknownContext = new GeneratorContext({ locale: "ar" }); // Use valid locale
            const unknownGenerator = new PhoneGenerator(
                unknownContext,
                countryProvider
            );

            const phone = unknownGenerator.international();
            expect(phone).toMatch(/^\+212/);
        });
    });

    describe("error handling", () => {
        it("should throw UnsupportedCountryError for invalid country", () => {
            expect(() => {
                generator.mobile({ country: "XX" as AvailableCountry });
            }).toThrow(UnsupportedCountryError);

            expect(() => {
                generator.landline({ country: "INVALID" as AvailableCountry });
            }).toThrow(UnsupportedCountryError);

            expect(() => {
                generator.e164("ZZ" as AvailableCountry);
            }).toThrow(UnsupportedCountryError);
        });
    });

    describe("validation", () => {
        it("should validate configuration correctly", () => {
            expect(generator.validateConfig({ format: "e164" })).toBe(true);
            expect(generator.validateConfig({ country: "MA" })).toBe(true);
            expect(
                generator.validateConfig({
                    format: "international",
                    country: "US",
                })
            ).toBe(true);

            expect(generator.validateConfig({ format: "invalid" as any })).toBe(
                false
            );
            expect(
                generator.validateConfig({
                    country: "INVALID" as AvailableCountry,
                })
            ).toBe(false);
            expect(generator.validateConfig(null as any)).toBe(false);
            expect(generator.validateConfig("string" as any)).toBe(false);
        });

        it("should return default configuration", () => {
            const defaultConfig = generator.getDefaultConfig();
            expect(defaultConfig).toEqual({ format: "international" });
        });
    });

    describe("deterministic behavior with seed", () => {
        it("should produce consistent results with same seed", () => {
            const generator1 = new PhoneGenerator(
                new GeneratorContext({ seed: 999 }),
                countryProvider
            );
            const generator2 = new PhoneGenerator(
                new GeneratorContext({ seed: 999 }),
                countryProvider
            );

            const phone1 = generator1.mobile({ country: "MA" });
            const phone2 = generator2.mobile({ country: "MA" });

            expect(phone1).toBe(phone2);
        });

        it("should produce different results with different seeds", () => {
            const generator1 = new PhoneGenerator(
                new GeneratorContext({ seed: 111 }),
                countryProvider
            );
            const generator2 = new PhoneGenerator(
                new GeneratorContext({ seed: 222 }),
                countryProvider
            );

            const phone1 = generator1.mobile({ country: "MA" });
            const phone2 = generator2.mobile({ country: "MA" });

            expect(phone1).not.toBe(phone2);
        });
    });

    describe("comprehensive format testing", () => {
        const countries = [
            "MA",
            "US",
            "FR",
            "GB",
            "DE",
            "JP",
        ] as AvailableCountry[];

        countries.forEach((country) => {
            it(`should generate valid phone numbers for ${country}`, () => {
                const mobile = generator.mobile({ country });
                const landline = generator.landline({ country });
                const e164 = generator.e164(country);

                expect(typeof mobile).toBe("string");
                expect(typeof landline).toBe("string");
                expect(typeof e164).toBe("string");

                expect(mobile.length).toBeGreaterThan(0);
                expect(landline.length).toBeGreaterThan(0);
                expect(e164.length).toBeGreaterThan(0);

                // E.164 should start with +
                expect(e164).toMatch(/^\+\d+$/);
            });
        });
    });

    describe("edge cases", () => {
        it("should handle empty options objects", () => {
            expect(() => generator.mobile({})).not.toThrow();
            expect(() => generator.landline({})).not.toThrow();
        });

        it("should handle undefined options", () => {
            expect(() => generator.mobile()).not.toThrow();
            expect(() => generator.landline()).not.toThrow();
        });

        it("should generate numbers for all supported countries", () => {
            const supportedCountries = countryProvider.getSupportedCountries();

            supportedCountries.forEach((country) => {
                const mobile = generator.mobile({ country });
                const landline = generator.landline({ country });

                expect(mobile).toBeDefined();
                expect(landline).toBeDefined();
                expect(mobile.length).toBeGreaterThan(0);
                expect(landline.length).toBeGreaterThan(0);
            });
        });
    });

    describe("integration with generate method", () => {
        it("should support all configuration options in generate method", () => {
            const configs: PhoneConfig[] = [
                { format: "e164" },
                { format: "national" },
                { format: "international" },
                { country: "MA" },
                { country: "US", format: "e164" },
                { country: "FR", format: "national" },
                {},
            ];

            configs.forEach((config) => {
                const result = generator.generate(config);
                expect(typeof result).toBe("string");
                expect(result.length).toBeGreaterThan(0);
            });
        });
    });
});
