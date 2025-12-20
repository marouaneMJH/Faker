// Core exports
export { default as RandomNumberGenerator } from "./core/RandomNumberGenerator";
export { default as GeneratorContext } from "./core/GeneratorContext";
export { default as GeneratorRegistry } from "./core/GeneratorRegistry";
export { default as LocaleProvider } from "./core/LocaleProvider";
export { default as GeoProvider } from "./core/GeoProvider";

// Type exports
export type { IGenerator } from "./types/IGenerator";
export type { Plugin } from "./types/Plugin";

// Generator exports
export { default as NameGenerator } from "./generators/NameGenerator";
export type { NameConfig } from "./generators/NameGenerator";

export { default as InternetGenerator } from "./generators/InternetGenerator";
export type { InternetConfig } from "./generators/InternetGenerator";

export { default as NumberGenerator } from "./generators/NumberGenerator";
export type { NumberConfig } from "./generators/NumberGenerator";

export { default as UuidGenerator } from "./generators/UuidGenerator";
export type { UuidConfig } from "./generators/UuidGenerator";

export { default as AddressGenerator } from "./generators/AddressGenerator";
export type { AddressConfig, AddressData } from "./generators/AddressGenerator";

// Main facade
export { default as Faker } from "./Faker";
export { default } from "./Faker";
