import AddressGenerator from "./src/generators/AddressGenerator";
import GeneratorContext from "./src/core/GeneratorContext";

/**
 * Demo script showing AddressGenerator functionality.
 */
function demonstrateAddressGenerator() {
    console.log("=== AddressGenerator Demo ===\n");

    // Create context and generator
    const context = new GeneratorContext();
    const generator = new AddressGenerator(context);

    console.log("1. Basic US Address (string format):");
    const usAddress = generator.generate({ country: "US", format: "string" });
    console.log(usAddress);
    console.log();

    console.log("2. UK Address with Object Format:");
    const ukAddress = generator.generate({
        country: "GB",
        format: "object",
        includeCoordinates: true,
    });
    console.log(JSON.stringify(ukAddress, null, 2));
    console.log();

    console.log("3. German Address with Secondary:");
    const deAddress = generator.generate({
        country: "DE",
        format: "string",
        includeSecondary: true,
    });
    console.log(deAddress);
    console.log();

    console.log("4. Individual Components:");
    console.log(`Street: ${generator.street()}`);
    console.log(`City: ${generator.city()}`);
    console.log(`Region: ${generator.region()}`);
    console.log(`Postal Code: ${generator.postalCode()}`);
    console.log(`Country: ${generator.country()}`);
    console.log(`Country Code: ${generator.countryCode()}`);
    console.log(`Coordinates: ${JSON.stringify(generator.coordinates())}`);
    console.log(`Timezone: ${generator.timezone()}`);
    console.log(`Secondary: ${generator.secondary()}`);
    console.log();

    console.log("5. Japanese Address:");
    const jpAddress = generator.generate({
        country: "JP",
        format: "object",
    });
    console.log(JSON.stringify(jpAddress, null, 2));
    console.log();

    console.log("6. Custom Template:");
    const customAddress = generator.generate({
        format: "string",
        template:
            "{streetNumber} {streetName} {streetType}\\n{city}, {region}\\n{country} {postalCode}",
    });
    console.log(customAddress);
    console.log();

    console.log("7. Different Countries:");
    ["US", "GB", "DE", "FR", "JP"].forEach((country) => {
        const address = generator.generate({
            country,
            format: "string",
        }) as string;
        console.log(`${country}: ${address.replace("\n", " | ")}`);
    });
}

// Run the demonstration
demonstrateAddressGenerator();
