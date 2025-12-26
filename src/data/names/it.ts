import type { LocaleData } from '../../core/LocaleProvider';

/**
 * Italian locale name data.
 * Contains common Italian names used in Italy and Italian-speaking regions.
 */
export const itNames: LocaleData = {
    maleFirstNames: [
        "Marco",
        "Luca",
        "Giovanni",
        "Francesco",
        "Alessandro",
        "Matteo",
        "Antonio",
        "Roberto",
    ],
    femaleFirstNames: [
        "Maria",
        "Anna",
        "Giulia",
        "Francesca",
        "Elena",
        "Laura",
        "Chiara",
        "Sara",
    ],
    neutralFirstNames: ["Alex", "Andrea", "Gabriele"],
    lastNames: [
        "Rossi",
        "Russo",
        "Ferrari",
        "Esposito",
        "Bianchi",
        "Romano",
        "Colombo",
    ],
    titles: ["Sig.", "Sig.ra", "Dott.", "Prof."],
    suffixes: ["Jr.", "Sr."],
    nicknames: ["Lucho", "Fra", "Ale", "Gio"],
};

export default itNames;