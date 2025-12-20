import Faker from "../src/Faker";

describe("Basic Faker Tests", () => {
    it("should create faker instance", () => {
        const faker = new Faker();
        expect(faker).toBeDefined();
    });

    it("should have getter methods", () => {
        const faker = new Faker({ seed: 123, locale: "en" });
        expect(faker.getSeed()).toBe(123);
        expect(faker.getLocale()).toBe("en");
    });

    it("should have reset method", () => {
        const faker = new Faker({ seed: 123, locale: "es" });
        faker.reset();
        expect(faker.getLocale()).toBe("en");
        expect(faker.getSeed()).not.toBe(123);
    });

    it("should generate address as string", () => {
        const faker = new Faker();
        const address = faker.address.generate({ format: "string" });
        expect(typeof address).toBe("string");
        expect((address as string).length).toBeGreaterThan(0);
    });

    it("should generate address as object", () => {
        const faker = new Faker();
        const address = faker.address.generate({ format: "object" });
        expect(typeof address).toBe("object");
        expect(address).toHaveProperty("streetNumber");
        expect(address).toHaveProperty("city");
    });
});
