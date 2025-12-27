import type { CountryPhoneData } from "../../core/CountryProvider";

/**
 * Germany phone number data.
 *
 * Contains phone number patterns, formats, and validation rules for Germany.
 * Mobile numbers start with 15, 16, or 17.
 *
 * @example
 * ```typescript
 * import dePhoneData from './de';
 * console.log(dePhoneData.callingCode); // "49"
 * console.log(dePhoneData.mobilePrefixes); // ["15", "16", "17"]
 * ```
 */
const dePhoneData: CountryPhoneData = {
    name: "Germany",
    code: "DE",
    callingCode: "49",
    mobilePrefixes: ["15", "16", "17"], // Germany mobile prefixes
    landlinePrefixes: ["2", "3", "4", "5", "6", "7", "8", "9"], // Germany landline
    nationalFormat: "XXX XXXXXXXX",
    internationalFormat: "+49 XXX XXXXXXXX",
    e164Format: "+49XXXXXXXXXXX",
    totalLength: 13, // +49 + 11 digits
    nationalLength: 11,
};

export default dePhoneData;
