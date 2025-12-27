import type { CountryPhoneData } from "../../core/CountryProvider";

/**
 * France phone number data.
 *
 * Contains phone number patterns, formats, and validation rules for France.
 * Mobile numbers start with 6 or 7.
 *
 * @example
 * ```typescript
 * import frPhoneData from './fr';
 * console.log(frPhoneData.callingCode); // "33"
 * console.log(frPhoneData.mobilePrefixes); // ["6", "7"]
 * ```
 */
const frPhoneData: CountryPhoneData = {
    name: "France",
    code: "FR",
    callingCode: "33",
    mobilePrefixes: ["6", "7"], // France mobile starts with 6 or 7
    landlinePrefixes: ["1", "2", "3", "4", "5", "8", "9"], // France landline
    nationalFormat: "XX XX XX XX XX",
    internationalFormat: "+33 X XX XX XX XX",
    e164Format: "+33XXXXXXXXX",
    totalLength: 11, // +33 + 9 digits
    nationalLength: 9,
};

export default frPhoneData;
