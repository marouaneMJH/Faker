import type { CountryPhoneData } from "../../core/CountryProvider";

/**
 * Japan phone number data.
 *
 * Contains phone number patterns, formats, and validation rules for Japan.
 * Mobile numbers start with 70, 80, or 90.
 *
 * @example
 * ```typescript
 * import jpPhoneData from './jp';
 * console.log(jpPhoneData.callingCode); // "81"
 * console.log(jpPhoneData.mobilePrefixes); // ["70", "80", "90"]
 * ```
 */
const jpPhoneData: CountryPhoneData = {
    name: "Japan",
    code: "JP",
    callingCode: "81",
    mobilePrefixes: ["70", "80", "90"], // Japan mobile prefixes
    landlinePrefixes: ["3", "4", "5", "6"], // Japan landline prefixes
    nationalFormat: "XX-XXXX-XXXX",
    internationalFormat: "+81 XX-XXXX-XXXX",
    e164Format: "+81XXXXXXXXXX",
    totalLength: 12, // +81 + 10 digits
    nationalLength: 10,
};

export default jpPhoneData;
