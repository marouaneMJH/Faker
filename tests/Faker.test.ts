import { FakerConfig } from "./../src/types/Plugin";
import { AvailableLocale } from "./../src/data/names/index";
import Faker from "../src/Faker";
import GeneratorContext from "../src/core/GeneratorContext";
import { Plugin } from "../src/types/Plugin";

describe("Faker", () => {
    let faker: Faker;

    beforeEach(() => {
        faker = new Faker();
    });

    describe("constructor", () => {
        it("should create instance with default configuration", () => {
            const faker = new Faker();
            expect(faker).toBeInstanceOf(Faker);
            expect(faker.getSeed()).toBeGreaterThanOrEqual(0);
            expect(faker.getLocale()).toBe("en");
        });

        it("should create instance with custom seed", () => {
            const seed = 12345;
            const faker = new Faker({ seed });
            expect(faker.getSeed()).toBe(seed);
        });

        it("should create instance with custom locale", () => {
            const locale = "es";
            const faker = new Faker({ locale });
            expect(faker.getLocale()).toBe(locale);
        });

        it("should create instance with both seed and locale", () => {
            const seed = 54321;
            const locale = "fr";
            const faker = new Faker({ seed, locale });
            expect(faker.getSeed()).toBe(seed);
            expect(faker.getLocale()).toBe(locale);
        });
    });

    describe("configuration management", () => {
        it("should get and set seed", () => {
            const newSeed = 99999;
            faker.setSeed(newSeed);
            expect(faker.getSeed()).toBe(newSeed);
        });

        it("should get and set locale", () => {
            const newLocale = "de";
            faker.setLocale(newLocale);
            expect(faker.getLocale()).toBe(newLocale);
        });

        it("should support method chaining", () => {
            const result = faker.setSeed(12345).setLocale("it");
            expect(result).toBe(faker);
            expect(faker.getSeed()).toBe(12345);
            expect(faker.getLocale()).toBe("it");
        });

        it("should reset to defaults", () => {
            faker.setSeed(12345).setLocale("es");
            const originalSeed = faker.getSeed();
            const originalLocale = faker.getLocale();

            faker.reset();

            expect(faker.getSeed()).not.toBe(originalSeed);
            expect(faker.getLocale()).toBe("en");
        });
    });

    describe("generator access", () => {
        it("should provide name generator", () => {
            const nameGenerator = faker.name;
            expect(nameGenerator).toBeDefined();
            expect(nameGenerator.name).toBe("name");
            expect(typeof nameGenerator.generate).toBe("function");
        });

        it("should provide internet generator", () => {
            const internetGenerator = faker.internet;
            expect(internetGenerator).toBeDefined();
            expect(internetGenerator.name).toBe("internet");
            expect(typeof internetGenerator.email).toBe("function");
        });

        it("should provide number generator", () => {
            const numberGenerator = faker.number;
            expect(numberGenerator).toBeDefined();
            expect(numberGenerator.name).toBe("number");
            expect(typeof numberGenerator.generate).toBe("function");
        });

        it("should provide uuid generator", () => {
            const uuidGenerator = faker.uuid;
            expect(uuidGenerator).toBeDefined();
            expect(uuidGenerator.name).toBe("uuid");
            expect(typeof uuidGenerator.generate).toBe("function");
        });

        it("should provide address generator", () => {
            const addressGenerator = faker.address;
            expect(addressGenerator).toBeDefined();
            expect(addressGenerator.name).toBe("address");
            expect(typeof addressGenerator.generate).toBe("function");
        });

        it("should return same generator instance on multiple accesses", () => {
            const name1 = faker.name;
            const name2 = faker.name;
            expect(name1).toBe(name2);
        });
    });

    describe("deterministic behavior with seed", () => {
        it("should produce consistent results with same seed", () => {
            const seed = 42;

            const faker1 = new Faker({ seed });
            const faker2 = new Faker({ seed });

            const name1 = faker1.name.generate();
            const name2 = faker2.name.generate();

            expect(name1).toBe(name2);
        });

        it("should produce different results with different seeds", () => {
            const faker1 = new Faker({ seed: 111 });
            const faker2 = new Faker({ seed: 222 });

            const name1 = faker1.name.generate();
            const name2 = faker2.name.generate();

            expect(name1).not.toBe(name2);
        });

        it("should maintain consistency after seed change", () => {
            const seed = 777;

            faker.setSeed(seed);
            const result1 = faker.name.generate();

            faker.setSeed(seed);
            const result2 = faker.name.generate();

            expect(result1).toBe(result2);
        });
    });

    describe("locale-specific behavior", () => {
        it("should use locale-specific data when available", () => {
            faker.setLocale("de");
            const address = faker.address.generate({ format: "object" });

            // Should use German country data
            expect(address).toBeDefined();
            if (typeof address === "object" && "countryCode" in address) {
                // German locale should prefer DE country data
                expect(["DE"].includes(address.countryCode)).toBeTruthy();
            }
        });

        it("should handle unsupported locales gracefully", () => {
            expect(() => {
                faker.setLocale("invalid-locale" as AvailableLocale);
            }).toThrow();
        });
    });

    describe("plugin system", () => {
        it("should support plugin installation", () => {
            const mockPlugin: Plugin = {
                name: "testPlugin",
                version: "1.0.0",
                install: jest.fn(),
                uninstall: jest.fn(),
            };

            const result = faker.use(mockPlugin);
            expect(result).toBe(faker); // Should return faker for chaining
            expect(mockPlugin.install).toHaveBeenCalledWith(expect.any(Object));
        });

        it("should handle multiple plugins", () => {
            const plugin1: Plugin = {
                name: "plugin1",
                version: "1.0.0",
                install: jest.fn(),
                uninstall: jest.fn(),
            };

            const plugin2: Plugin = {
                name: "plugin2",
                version: "1.0.0",
                install: jest.fn(),
                uninstall: jest.fn(),
            };

            faker.use(plugin1).use(plugin2);

            expect(plugin1.install).toHaveBeenCalled();
            expect(plugin2.install).toHaveBeenCalled();
        });
    });

    describe("error handling", () => {
        it("should handle invalid configuration gracefully", () => {
            expect(() => {
                new Faker({ seed: -1 });
            }).toThrow();
        });

        it("should validate locale codes", () => {
            expect(() => {
                faker.setLocale("" as AvailableLocale);
            }).toThrow();

            expect(() => {
                faker.setLocale("xyz" as AvailableLocale);
            }).toThrow();
        });
    });

    describe("integration tests", () => {
        it("should generate complete fake data sets", () => {
            faker.setSeed(12345);

            const person = {
                name: faker.name.generate(),
                email: faker.internet.email(),
                age: faker.number.generate({ min: 18, max: 80, precision: 0 }),
                id: faker.uuid.generate(),
                address: faker.address.generate({ format: "string" }),
            };

            expect(typeof person.name).toBe("string");
            expect(person.name.length).toBeGreaterThan(0);

            expect(typeof person.email).toBe("string");
            expect(person.email).toMatch(/\S+@\S+\.\S+/);

            expect(typeof person.age).toBe("number");
            expect(person.age).toBeGreaterThanOrEqual(18);
            expect(person.age).toBeLessThanOrEqual(80);

            expect(typeof person.id).toBe("string");
            expect(person.id).toMatch(
                /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            );

            expect(typeof person.address).toBe("string");
            expect((person.address as string).length).toBeGreaterThan(0);
        });

        it("should support complex address generation", () => {
            const address = faker.address.generate({
                format: "object",
                country: "US",
                includeCoordinates: true,
                includeSecondary: false,
            });

            expect(typeof address).toBe("object");
            expect(address).toHaveProperty("streetNumber");
            expect(address).toHaveProperty("streetName");
            expect(address).toHaveProperty("city");
            expect(address).toHaveProperty("region");
            expect(address).toHaveProperty("postalCode");
            expect(address).toHaveProperty("country");
            expect(address).toHaveProperty("countryCode", "US");
            expect(address).toHaveProperty("coordinates");

            if (
                typeof address === "object" &&
                address &&
                "coordinates" in address
            ) {
                expect(address.coordinates).toHaveProperty("lat");
                expect(address.coordinates).toHaveProperty("lng");
            }
        });

        it("should generate data consistently across multiple calls with same seed", () => {
            const seed = 555;

            // Generate first dataset
            faker.setSeed(seed);
            const data1 = {
                names: Array.from({ length: 5 }, () => faker.name.generate()),
                emails: Array.from({ length: 5 }, () => faker.internet.email()),
                numbers: Array.from({ length: 5 }, () =>
                    faker.number.generate()
                ),
            };

            // Generate second dataset with same seed
            faker.setSeed(seed);
            const data2 = {
                names: Array.from({ length: 5 }, () => faker.name.generate()),
                emails: Array.from({ length: 5 }, () => faker.internet.email()),
                numbers: Array.from({ length: 5 }, () =>
                    faker.number.generate()
                ),
            };

            expect(data1.names).toEqual(data2.names);
            expect(data1.emails).toEqual(data2.emails);
            expect(data1.numbers).toEqual(data2.numbers);
        });
    });

    describe("performance", () => {
        it("should handle rapid generator creation efficiently", () => {
            const start = Date.now();

            for (let i = 0; i < 1000; i++) {
                faker.name.generate();
                faker.internet.email();
                faker.number.generate();
            }

            const elapsed = Date.now() - start;
            expect(elapsed).toBeLessThan(5000); // Should complete within 5 seconds
        });

        it("should reuse generator instances for efficiency", () => {
            const generator1 = faker.name;
            const generator2 = faker.name;
            const generator3 = faker.name;

            expect(generator1).toBe(generator2);
            expect(generator2).toBe(generator3);
        });
    });

    describe("edge cases", () => {
        it("should handle edge case configurations", () => {
            const edgeCases: FakerConfig[] = [
                { seed: 0 },
                { seed: Number.MAX_SAFE_INTEGER },
                { locale: "en" },
                { locale: "zh" },
            ];

            edgeCases.forEach((config) => {
                expect(() => {
                    const edgeFaker = new Faker(config);
                    edgeFaker.name.generate();
                }).not.toThrow();
            });
        });

        it("should maintain state integrity after multiple operations", () => {
            const originalSeed = faker.getSeed();
            const originalLocale = faker.getLocale();

            // Perform multiple state changes
            faker
                .setSeed(111)
                .setLocale("fr")
                .setSeed(222)
                .setLocale("de")
                .reset();

            // Should be back to defaults after reset
            expect(faker.getLocale()).toBe("en");
            expect(faker.getSeed()).not.toBe(originalSeed); // New random seed
        });
    });
});
