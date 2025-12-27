import type { CountryPhoneData } from "../../core/CountryProvider";

/**
 * United Kingdom phone number data.
 *
 * Contains phone number patterns, formats, and validation rules for the UK.
 * Mobile numbers start with 7.
 *
 * @example
 * ```typescript
 * import gbPhoneData from './gb';
 * console.log(gbPhoneData.callingCode); // "44"
 * console.log(gbPhoneData.mobilePrefixes); // ["7"]
 * ```
 */
const gbPhoneData: CountryPhoneData = {
    name: "United Kingdom",
    code: "GB",
    callingCode: "44",
    mobilePrefixes: ["7"], // UK mobile starts with 7
    landlinePrefixes: ["1", "2"], // UK landline starts with 1 or 2
    nationalFormat: "XXXX XXXXXX",
    internationalFormat: "+44 XXXX XXXXXX",
    e164Format: "+44XXXXXXXXXX",
    totalLength: 13, // +44 + 10 digits
    nationalLength: 10,
};

export default gbPhoneData;
