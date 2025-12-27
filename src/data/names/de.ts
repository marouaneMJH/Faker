import type { LocaleData } from "../../core/LocaleProvider";

/**
 * German locale name data.
 * Contains common German names used in Germany, Austria, and German-speaking Switzerland.
 */
export const deNames: LocaleData = {
    maleFirstNames: [
        "Hans",
        "Peter",
        "Michael",
        "Thomas",
        "Andreas",
        "Stefan",
        "Jürgen",
        "Klaus",
        "Wolfgang",
        "Markus",
        "Sebastian",
        "Daniel",
    ],
    femaleFirstNames: [
        "Anna",
        "Maria",
        "Sabine",
        "Claudia",
        "Petra",
        "Monika",
        "Julia",
        "Laura",
        "Sarah",
        "Katharina",
    ],
    neutralFirstNames: ["Alex", "Chris", "Robin", "Sascha", "Kim"],
    lastNames: [
        "Müller",
        "Schmidt",
        "Schneider",
        "Fischer",
        "Weber",
        "Meyer",
        "Wagner",
        "Becker",
        "Hoffmann",
    ],
    titles: ["Herr", "Frau", "Dr.", "Prof."],
    suffixes: ["Jr.", "Sr.", "Dr."],
    nicknames: ["Hansi", "Michi", "Steffi", "Andi"],
};

export default deNames;
