import type { LocaleData } from "../../core/LocaleProvider";

/**
 * Chinese locale data for name generation.
 *
 * Contains traditional and common Chinese names for various demographics,
 * including both traditional Chinese naming patterns and modern variations.
 *
 * @example
 * ```typescript
 * import zhNames from './zh';
 * console.log(zhNames.maleFirstNames); // ["Wei", "Jun", "Ming", "Lei", "Hao"]
 * ```
 */
const zhNames: LocaleData = {
    maleFirstNames: ["Wei", "Jun", "Ming", "Lei", "Hao"],
    femaleFirstNames: ["Li", "Mei", "Xiu", "Yan", "Jing"],
    neutralFirstNames: ["Lin", "Yu"],
    lastNames: ["Wang", "Li", "Zhang", "Liu", "Chen"],
    titles: ["Mr.", "Ms."],
    suffixes: [],
    nicknames: ["Xiao Ming", "Ah Wei"],
};

export default zhNames;
