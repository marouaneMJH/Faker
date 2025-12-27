import type { CountryPhoneData } from "../../core/CountryProvider";

/**
 * United States phone number data.
 *
 * Contains phone number patterns, formats, and validation rules for the US.
 * Uses the NANP (North American Numbering Plan) format.
 *
 * @example
 * ```typescript
 * import usPhoneData from './us';
 * console.log(usPhoneData.callingCode); // "1"
 * console.log(usPhoneData.nationalFormat); // "(XXX) XXX-XXXX"
 * ```
 */
const usPhoneData: CountryPhoneData = {
    name: "United States",
    code: "US",
    callingCode: "1",
    mobilePrefixes: ["2", "3", "4", "5", "6", "7", "8", "9"], // US mobile/landline same prefixes
    landlinePrefixes: ["2", "3", "4", "5", "6", "7", "8", "9"],
    nationalFormat: "(XXX) XXX-XXXX",
    internationalFormat: "+1 (XXX) XXX-XXXX",
    e164Format: "+1XXXXXXXXXX",
    totalLength: 11, // +1 + 10 digits
    nationalLength: 10,
};

export default usPhoneData;
