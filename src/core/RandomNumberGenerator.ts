/**
 * A seedable Pseudorandom Number Generator (PRNG) using the Mulberry32 algorithm.
 * Provides deterministic randomness for testing and reproducible results.
 */
export default class RandomNumberGenerator {
    private state: number;
    private readonly originalSeed: number;

    /**
     * Creates a new RandomNumberGenerator instance.
     * @param seed - The seed value for the generator. Defaults to current timestamp.
     */
    constructor(seed: number = Date.now()) {
        this.originalSeed = seed;
        this.state = seed;
    }

    /**
     * Generates the next random number using the Mulberry32 algorithm.
     * @returns A random float between 0 (inclusive) and 1 (exclusive).
     */
    next(): number {
        let t = (this.state += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    /**
     * Generates a random integer within the specified range.
     * @param min - The minimum value (inclusive).
     * @param max - The maximum value (inclusive).
     * @returns A random integer between min and max (both inclusive).
     */
    int(min: number, max: number): number {
        if (min > max) {
            throw new Error("Min value cannot be greater than max value");
        }
        return Math.floor(this.next() * (max - min + 1)) + min;
    }

    /**
     * Generates a random float within the specified range.
     * @param min - The minimum value (inclusive).
     * @param max - The maximum value (exclusive).
     * @param precision - The number of decimal places to round to (optional).
     * @returns A random float between min and max.
     */
    float(min: number, max: number, precision?: number): number {
        if (min > max) {
            throw new Error("Min value cannot be greater than max value");
        }

        const value = this.next() * (max - min) + min;

        if (precision !== undefined && precision >= 0) {
            return Number(value.toFixed(precision));
        }

        return value;
    }

    /**
     * Generates a random boolean value based on the given probability.
     * @param probability - The probability of returning true (0.0 to 1.0). Defaults to 0.5.
     * @returns True or false based on the probability.
     */
    boolean(probability: number = 0.5): boolean {
        if (probability < 0 || probability > 1) {
            throw new Error("Probability must be between 0 and 1");
        }
        return this.next() < probability;
    }

    /**
     * Picks a random element from the given array.
     * @param array - The array to pick from.
     * @returns A random element from the array.
     * @throws Error if the array is empty.
     */
    pick<T>(array: T[]): T {
        if (array.length === 0) {
            throw new Error("Cannot pick from an empty array");
        }
        const index = this.int(0, array.length - 1);
        return array[index];
    }

    /**
     * Returns a shuffled copy of the given array using the Fisher-Yates algorithm.
     * @param array - The array to shuffle.
     * @returns A new array with the elements shuffled.
     */
    shuffle<T>(array: T[]): T[] {
        const shuffled = [...array];

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = this.int(0, i);
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled;
    }

    /**
     * Resets the generator with a new seed value.
     * @param seed - The new seed value to use.
     */
    setSeed(seed: number): void {
        this.state = seed;
    }

    /**
     * Gets the original seed value used to initialize this generator.
     * @returns The original seed value.
     */
    getSeed(): number {
        return this.originalSeed;
    }

    /**
     * Gets the current internal state of the generator.
     * @returns The current state value.
     */
    getState(): number {
        return this.state;
    }
}
