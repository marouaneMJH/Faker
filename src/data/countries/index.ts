/**
 * Centralized exports for all country phone data.
 *
 * This index file provides a single point of access to all supported countries,
 * making it easy to import and use phone data throughout the application.
 *
 * @example
 * ```typescript
 * import { MA_PHONE_DATA, US_PHONE_DATA, FR_PHONE_DATA } from './data/countries';
 *
 * // Use specific country data
 * console.log(MA_PHONE_DATA.callingCode); // "212"
 * console.log(US_PHONE_DATA.nationalFormat); // "(XXX) XXX-XXXX"
 * ```
 */

// Import all country phone data
import maPhoneData from "./ma";
import usPhoneData from "./us";
import frPhoneData from "./fr";
import gbPhoneData from "./gb";
import dePhoneData from "./de";
import jpPhoneData from "./jp";
import { CountryPhoneData } from "../../core/CountryProvider";

// Export with consistent naming
export const MA_PHONE_DATA = maPhoneData;
export const US_PHONE_DATA = usPhoneData;
export const FR_PHONE_DATA = frPhoneData;
export const GB_PHONE_DATA = gbPhoneData;
export const DE_PHONE_DATA = dePhoneData;
export const JP_PHONE_DATA = jpPhoneData;

/**
 * Array of all available country codes for easy iteration and validation.
 *
 * @example
 * ```typescript
 * import { AVAILABLE_COUNTRIES } from './data/countries';
 *
 * AVAILABLE_COUNTRIES.forEach(country => {
 *   console.log(`Supported country: ${country}`);
 * });
 * ```
 */
export const AVAILABLE_COUNTRIES = [
    "MA",
    "US",
    "FR",
    "GB",
    "DE",
    "JP",
] as const;

/**
 * Array of all available calling codes for validation and iteration.
 *
 * @example
 * ```typescript
 * import { AVAILABLE_CALLING_CODE } from './data/countries';
 *
 * AVAILABLE_CALLING_CODE.forEach(code => {
 *   console.log(`Supported calling code: +${code}`);
 * });
 * ```
 */
export const AVAILABLE_CALLING_CODE = [
    "212",
    "1",
    "33",
    "44",
    "49",
    "81",
] as const;

/**
 * Map of country codes to calling codes.
 */
export const CALLING_CODE_MAP = {
    MA: "212",
    US: "1",
    FR: "33",
    GB: "44",
    DE: "49",
    JP: "81",
} as const;

/**
 * Type representing all available country codes.
 */
export type AvailableCountry = (typeof AVAILABLE_COUNTRIES)[number];

/**
 * Type representing all available calling codes.
 */
export type AvailableCallingCode = (typeof AVAILABLE_CALLING_CODE)[number];

/**
 * Calling code to country code mapping.
 */
export const CALLING_CODE_MAPPING: Map<AvailableCallingCode, AvailableCountry> =
    new Map([
        ["212", "MA"], // Morocco
        ["1", "US"], // US/Canada
        ["33", "FR"], // France
        ["44", "GB"], // UK
        ["49", "DE"], // Germany
        ["81", "JP"], // Japan
    ]);

/**
 * Registry of country phone data, with Morocco prioritized first.
 */
export const COUNTRY_PHONE_REGISTRY: Map<AvailableCountry, CountryPhoneData> =
    new Map([
        // Morocco first (prioritized)
        ["MA", MA_PHONE_DATA],
        ["US", US_PHONE_DATA],
        ["FR", FR_PHONE_DATA],
        ["GB", GB_PHONE_DATA],
        ["DE", DE_PHONE_DATA],
        ["JP", JP_PHONE_DATA],
    ]);
