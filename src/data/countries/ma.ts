import type { CountryPhoneData } from "../../core/CountryProvider";

/**
 * Morocco phone number data.
 *
 * Contains phone number patterns, formats, and validation rules for Morocco.
 * Mobile numbers start with 6 or 7, landlines with 5.
 *
 * @example
 * ```typescript
 * import maPhoneData from './ma';
 * console.log(maPhoneData.callingCode); // "212"
 * console.log(maPhoneData.mobilePrefixes); // ["6", "7"]
 * ```
 */
const maPhoneData: CountryPhoneData = {
    name: "Morocco",
    code: "MA",
    callingCode: "212",
    mobilePrefixes: ["6", "7"], // Morocco mobile starts with 6 or 7
    landlinePrefixes: ["5"], // Morocco landline starts with 5
    nationalFormat: "XXX-XXXXXX", // 6XX-XXXXXX or 7XX-XXXXXX
    internationalFormat: "+212 XXX-XXXXXX",
    e164Format: "+212XXXXXXXXX",
    totalLength: 12, // +212 + 9 digits
    nationalLength: 9,
};

export default maPhoneData;
