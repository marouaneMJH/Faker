import type { LocaleData } from '../../core/LocaleProvider';

/**
 * Russian locale name data.
 * Contains common Russian names used in Russia and Russian-speaking countries.
 */
export const ruNames: LocaleData = {
    maleFirstNames: [
        "Ivan",
        "Dmitry",
        "Alexey",
        "Sergey",
        "Mikhail",
        "Vladimir",
        "Nikolai",
    ],
    femaleFirstNames: [
        "Anna",
        "Elena",
        "Olga",
        "Natalia",
        "Irina",
        "Tatiana",
        "Maria",
    ],
    neutralFirstNames: ["Sasha", "Valery"],
    lastNames: ["Ivanov", "Petrov", "Sidorov", "Smirnov", "Kuznetsov", "Popov"],
    titles: ["Mr.", "Ms.", "Dr."],
    suffixes: [],
    nicknames: ["Vanya", "Dima", "Seryozha"],
};

export default ruNames;