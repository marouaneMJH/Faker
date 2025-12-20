import {
    CountryProvider,
    type CountryPhoneData,
    InvalidPhoneNumberError,
} from "../src/core/CountryProvider";

describe("CountryProvider", () => {
    let provider: CountryProvider;

    beforeEach(() => {
        provider = new CountryProvider();
    });

    describe("getCountryData", () => {
        it("should return Morocco data for MA country code", () => {
            const data = provider.getCountryData("MA");
            expect(data).toBeDefined();
            expect(data?.name).toBe("Morocco");
            expect(data?.code).toBe("MA");
            expect(data?.callingCode).toBe("212");
            expect(data?.mobilePrefixes).toEqual(["6", "7"]);
            expect(data?.landlinePrefixes).toEqual(["5"]);
        });

        it("should return US data for US country code", () => {
            const data = provider.getCountryData("US");
            expect(data).toBeDefined();
            expect(data?.name).toBe("United States");
            expect(data?.code).toBe("US");
            expect(data?.callingCode).toBe("1");
        });

        it("should return France data for FR country code", () => {
            const data = provider.getCountryData("FR");
            expect(data).toBeDefined();
            expect(data?.name).toBe("France");
            expect(data?.code).toBe("FR");
            expect(data?.callingCode).toBe("33");
            expect(data?.mobilePrefixes).toEqual(["6", "7"]);
        });

        it("should handle case-insensitive country codes", () => {
            const dataUppercase = provider.getCountryData("MA");
            const dataLowercase = provider.getCountryData("ma");
            expect(dataUppercase).toEqual(dataLowercase);
        });

        it("should return undefined for unsupported country codes", () => {
            expect(provider.getCountryData("XX")).toBeUndefined();
            expect(provider.getCountryData("INVALID")).toBeUndefined();
        });
    });

    describe("getCountryByCallingCode", () => {
        it("should return Morocco data for calling code 212", () => {
            const data = provider.getCountryByCallingCode("212");
            expect(data).toBeDefined();
            expect(data?.name).toBe("Morocco");
            expect(data?.code).toBe("MA");
        });

        it("should return US data for calling code 1", () => {
            const data = provider.getCountryByCallingCode("1");
            expect(data).toBeDefined();
            expect(data?.name).toBe("United States");
            expect(data?.code).toBe("US");
        });

        it("should return France data for calling code 33", () => {
            const data = provider.getCountryByCallingCode("33");
            expect(data).toBeDefined();
            expect(data?.name).toBe("France");
            expect(data?.code).toBe("FR");
        });

        it("should return undefined for invalid calling codes", () => {
            expect(provider.getCountryByCallingCode("999")).toBeUndefined();
            expect(provider.getCountryByCallingCode("0")).toBeUndefined();
        });
    });

    describe("getSupportedCountries", () => {
        it("should return array of supported country codes", () => {
            const countries = provider.getSupportedCountries();
            expect(Array.isArray(countries)).toBe(true);
            expect(countries.length).toBeGreaterThan(0);
            expect(countries).toContain("MA");
            expect(countries).toContain("US");
            expect(countries).toContain("FR");
        });

        it("should prioritize Morocco first", () => {
            const countries = provider.getSupportedCountries();
            expect(countries[0]).toBe("MA");
        });
    });

    describe("getSupportedCallingCodes", () => {
        it("should return array of supported calling codes", () => {
            const codes = provider.getSupportedCallingCodes();
            expect(Array.isArray(codes)).toBe(true);
            expect(codes.length).toBeGreaterThan(0);
            expect(codes).toContain("212");
            expect(codes).toContain("1");
            expect(codes).toContain("33");
        });
    });

    describe("getCountryByLocale", () => {
        it("should return Morocco for Arabic locale", () => {
            const data = provider.getCountryByLocale("ar");
            expect(data.name).toBe("Morocco");
            expect(data.code).toBe("MA");
        });

        it("should return Morocco for Arabic Morocco locale", () => {
            const data = provider.getCountryByLocale("ar-MA");
            expect(data.name).toBe("Morocco");
            expect(data.code).toBe("MA");
        });

        it("should return Morocco for French Morocco locale", () => {
            const data = provider.getCountryByLocale("fr-MA");
            expect(data.name).toBe("Morocco");
            expect(data.code).toBe("MA");
        });

        it("should return US for English locale", () => {
            const data = provider.getCountryByLocale("en");
            expect(data.name).toBe("United States");
            expect(data.code).toBe("US");
        });

        it("should return US for English US locale", () => {
            const data = provider.getCountryByLocale("en-US");
            expect(data.name).toBe("United States");
            expect(data.code).toBe("US");
        });

        it("should return UK for English GB locale", () => {
            const data = provider.getCountryByLocale("en-GB");
            expect(data.name).toBe("United Kingdom");
            expect(data.code).toBe("GB");
        });

        it("should return France for French locale", () => {
            const data = provider.getCountryByLocale("fr");
            expect(data.name).toBe("France");
            expect(data.code).toBe("FR");
        });

        it("should return Germany for German locale", () => {
            const data = provider.getCountryByLocale("de");
            expect(data.name).toBe("Germany");
            expect(data.code).toBe("DE");
        });

        it("should return Japan for Japanese locale", () => {
            const data = provider.getCountryByLocale("ja");
            expect(data.name).toBe("Japan");
            expect(data.code).toBe("JP");
        });

        it("should default to Morocco for unknown locales", () => {
            const data = provider.getCountryByLocale("unknown");
            expect(data.name).toBe("Morocco");
            expect(data.code).toBe("MA");
        });

        it("should default to Morocco for empty locale", () => {
            const data = provider.getCountryByLocale("");
            expect(data.name).toBe("Morocco");
            expect(data.code).toBe("MA");
        });
    });

    describe("isValidCallingCode", () => {
        it("should validate supported calling codes", () => {
            expect(provider.isValidCallingCode("212")).toBe(true);
            expect(provider.isValidCallingCode("1")).toBe(true);
            expect(provider.isValidCallingCode("33")).toBe(true);
            expect(provider.isValidCallingCode("44")).toBe(true);
            expect(provider.isValidCallingCode("49")).toBe(true);
            expect(provider.isValidCallingCode("81")).toBe(true);
        });

        it("should reject unsupported calling codes", () => {
            expect(provider.isValidCallingCode("999")).toBe(false);
            expect(provider.isValidCallingCode("0")).toBe(false);
            expect(provider.isValidCallingCode("1000")).toBe(false);
        });

        it("should reject invalid calling codes", () => {
            expect(provider.isValidCallingCode("")).toBe(false);
            expect(provider.isValidCallingCode("abc")).toBe(false);
            expect(provider.isValidCallingCode("-1")).toBe(false);
        });
    });

    describe("isCountrySupported", () => {
        it("should validate supported country codes", () => {
            expect(provider.isCountrySupported("MA")).toBe(true);
            expect(provider.isCountrySupported("US")).toBe(true);
            expect(provider.isCountrySupported("FR")).toBe(true);
            expect(provider.isCountrySupported("GB")).toBe(true);
            expect(provider.isCountrySupported("DE")).toBe(true);
            expect(provider.isCountrySupported("JP")).toBe(true);
        });

        it("should handle case-insensitive validation", () => {
            expect(provider.isCountrySupported("ma")).toBe(true);
            expect(provider.isCountrySupported("us")).toBe(true);
            expect(provider.isCountrySupported("fr")).toBe(true);
        });

        it("should reject unsupported country codes", () => {
            expect(provider.isCountrySupported("XX")).toBe(false);
            expect(provider.isCountrySupported("INVALID")).toBe(false);
            expect(provider.isCountrySupported("")).toBe(false);
        });
    });

    describe("data integrity", () => {
        const countries = ["MA", "US", "FR", "GB", "DE", "JP"];

        countries.forEach((country) => {
            describe(`${country} data integrity`, () => {
                let data: CountryPhoneData;

                beforeEach(() => {
                    data = provider.getCountryData(country)!;
                });

                it("should have complete data structure", () => {
                    expect(data.name).toBeDefined();
                    expect(data.code).toBe(country);
                    expect(data.callingCode).toBeDefined();
                    expect(Array.isArray(data.mobilePrefixes)).toBe(true);
                    expect(Array.isArray(data.landlinePrefixes)).toBe(true);
                    expect(data.nationalFormat).toBeDefined();
                    expect(data.internationalFormat).toBeDefined();
                    expect(data.e164Format).toBeDefined();
                    expect(typeof data.totalLength).toBe("number");
                    expect(typeof data.nationalLength).toBe("number");
                });

                it("should have non-empty prefixes", () => {
                    expect(data.mobilePrefixes.length).toBeGreaterThan(0);
                    expect(data.landlinePrefixes.length).toBeGreaterThan(0);
                });

                it("should have valid numeric calling code", () => {
                    const code = parseInt(data.callingCode, 10);
                    expect(code).toBeGreaterThan(0);
                    expect(code).toBeLessThan(1000);
                });

                it("should have consistent length data", () => {
                    expect(data.totalLength).toBeGreaterThan(
                        data.nationalLength
                    );
                    expect(data.nationalLength).toBeGreaterThan(0);
                });

                it("should have format patterns with X placeholders", () => {
                    expect(data.nationalFormat).toMatch(/X/);
                    expect(data.internationalFormat).toMatch(/X/);
                    expect(data.e164Format).toMatch(/X/);
                });
            });
        });
    });

    describe("Morocco specific data (prioritized)", () => {
        let moroccoData: CountryPhoneData;

        beforeEach(() => {
            moroccoData = provider.getCountryData("MA")!;
        });

        it("should have correct Morocco-specific data", () => {
            expect(moroccoData.name).toBe("Morocco");
            expect(moroccoData.code).toBe("MA");
            expect(moroccoData.callingCode).toBe("212");
            expect(moroccoData.mobilePrefixes).toEqual(["6", "7"]);
            expect(moroccoData.landlinePrefixes).toEqual(["5"]);
            expect(moroccoData.nationalLength).toBe(9);
            expect(moroccoData.totalLength).toBe(12);
        });

        it("should have correct Morocco format patterns", () => {
            expect(moroccoData.nationalFormat).toBe("XXX-XXXXXX");
            expect(moroccoData.internationalFormat).toBe("+212 XXX-XXXXXX");
            expect(moroccoData.e164Format).toBe("+212XXXXXXXXX");
        });

        it("should be accessible through Arabic locales", () => {
            expect(provider.getCountryByLocale("ar").code).toBe("MA");
            expect(provider.getCountryByLocale("ar-MA").code).toBe("MA");
            expect(provider.getCountryByLocale("fr-MA").code).toBe("MA");
        });

        it("should be first in supported countries list", () => {
            const countries = provider.getSupportedCountries();
            expect(countries[0]).toBe("MA");
        });
    });

    describe("error classes", () => {
        it("should create InvalidPhoneNumberError correctly", () => {
            const error = new InvalidPhoneNumberError("123", "MA");
            expect(error).toBeInstanceOf(Error);
            expect(error.name).toBe("InvalidPhoneNumberError");
            expect(error.message).toBe(
                'Invalid phone number "123" for country: MA'
            );
        });
    });
});
