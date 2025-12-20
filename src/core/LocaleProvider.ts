/**
 * Interface for locale-specific data.
 */
export interface LocaleData {
    /** Male first names for the locale. */
    maleFirstNames: string[];
    /** Female first names for the locale. */
    femaleFirstNames: string[];
    /** Gender-neutral first names for the locale. */
    neutralFirstNames: string[];
    /** Last names for the locale. */
    lastNames: string[];
    /** Name titles/prefixes for the locale. */
    titles: string[];
    /** Name suffixes for the locale. */
    suffixes: string[];
    /** Common nicknames for the locale. */
    nicknames: string[];
}

const AR_LOCALE_DATA: LocaleData = {
    maleFirstNames: [
        "Marouane",
        "Mohammed",
        "Ahmed",
        "Ali",
        "Omar",
        "Youssef",
        "Hassan",
        "Khaled",
        "Zakaria",
        "Ayoub",
        "Salah",
        "Soufian",
        "Sohaile",
        "Taha",
        "Mouad",
        "Anas",
    ],
    femaleFirstNames: [
        "Fatima",
        "Aisha",
        "Khadija",
        "Zainab",
        "Maryam",
        "Sara",
    ],
    neutralFirstNames: ["Noor", "Iman", "Chams", "Chahd"],
    lastNames: ["Al-Farsi", "Al-Masri", "Al-Haddad", "Al-Amiri", "Ben Ali"],
    titles: ["Mr.", "Mrs.", "Dr.", "Sheikh"],
    suffixes: [],
    nicknames: ["Abu Ali", "Abd", "Zizo"],
};

/**
 * Default English locale data.
 */
const EN_LOCALE_DATA: LocaleData = {
    maleFirstNames: [
        "James",
        "Robert",
        "John",
        "Michael",
        "David",
        "William",
        "Richard",
        "Joseph",
        "Thomas",
        "Christopher",
        "Charles",
        "Daniel",
        "Matthew",
        "Anthony",
        "Mark",
        "Donald",
        "Steven",
        "Paul",
        "Andrew",
        "Kenneth",
        "Joshua",
        "Kevin",
        "Brian",
        "George",
        "Timothy",
        "Ronald",
        "Jason",
        "Edward",
        "Jeffrey",
        "Ryan",
    ],
    femaleFirstNames: [
        "Mary",
        "Patricia",
        "Jennifer",
        "Linda",
        "Elizabeth",
        "Barbara",
        "Susan",
        "Jessica",
        "Sarah",
        "Karen",
        "Lisa",
        "Nancy",
        "Betty",
        "Helen",
        "Sandra",
        "Donna",
        "Carol",
        "Ruth",
        "Sharon",
        "Michelle",
        "Laura",
        "Sarah",
        "Kimberly",
        "Deborah",
        "Dorothy",
        "Lisa",
        "Nancy",
        "Karen",
        "Betty",
        "Helen",
    ],
    neutralFirstNames: [
        "Alex",
        "Jordan",
        "Taylor",
        "Casey",
        "Riley",
        "Avery",
        "Quinn",
        "Blake",
        "Cameron",
        "Drew",
        "Sage",
        "River",
        "Rowan",
        "Skyler",
        "Morgan",
        "Reese",
        "Parker",
        "Hayden",
        "Emery",
        "Finley",
        "Dakota",
        "Phoenix",
        "Remy",
        "Stevie",
    ],
    lastNames: [
        "Smith",
        "Johnson",
        "Williams",
        "Brown",
        "Jones",
        "Garcia",
        "Miller",
        "Davis",
        "Rodriguez",
        "Martinez",
        "Hernandez",
        "Lopez",
        "Gonzalez",
        "Wilson",
        "Anderson",
        "Thomas",
        "Taylor",
        "Moore",
        "Jackson",
        "Martin",
        "Lee",
        "Perez",
        "Thompson",
        "White",
        "Harris",
        "Sanchez",
        "Clark",
        "Ramirez",
        "Lewis",
        "Robinson",
    ],
    titles: [
        "Mr.",
        "Mrs.",
        "Ms.",
        "Miss",
        "Dr.",
        "Prof.",
        "Rev.",
        "Hon.",
        "Sir",
        "Madam",
    ],
    suffixes: [
        "Jr.",
        "Sr.",
        "II",
        "III",
        "IV",
        "V",
        "PhD",
        "MD",
        "DDS",
        "Esq.",
    ],
    nicknames: [
        "Ace",
        "Bear",
        "Buddy",
        "Buzz",
        "Chief",
        "Doc",
        "Duke",
        "Flash",
        "Fox",
        "Hawk",
        "Jazz",
        "King",
        "Lucky",
        "Max",
        "Nova",
        "Pip",
        "Rebel",
        "Scout",
        "Shadow",
        "Spark",
        "Star",
        "Storm",
        "Tiger",
        "Wolf",
        "Zap",
        "Ziggy",
    ],
};

/**
 * Spanish locale data.
 */
const ES_LOCALE_DATA: LocaleData = {
    maleFirstNames: [
        "Antonio",
        "Manuel",
        "José",
        "Francisco",
        "David",
        "Juan",
        "Javier",
        "José Antonio",
        "Daniel",
        "José Luis",
        "Jesús",
        "Carlos",
        "Alejandro",
        "Miguel",
        "Rafael",
        "Pedro",
        "Ángel",
        "José Manuel",
        "Fernando",
        "Luis",
        "Sergio",
        "Pablo",
        "Jorge",
        "Alberto",
        "Juan Carlos",
        "Adrián",
        "Diego",
        "Rubén",
        "Iván",
        "Óscar",
    ],
    femaleFirstNames: [
        "María Carmen",
        "María",
        "Carmen",
        "Josefa",
        "Isabel",
        "Ana María",
        "María Dolores",
        "María Pilar",
        "María Teresa",
        "Ana",
        "Francisca",
        "Laura",
        "Antonia",
        "Dolores",
        "María Ángeles",
        "Cristina",
        "Marta",
        "María José",
        "María Isabel",
        "Pilar",
        "Concepción",
        "Mercedes",
        "Manuela",
        "Elena",
        "Rosa",
        "Lucía",
        "María Jesús",
        "Montserrat",
        "Encarnación",
        "Rosario",
    ],
    neutralFirstNames: [
        "Alex",
        "Cris",
        "Dani",
        "Gabi",
        "Izan",
        "Noa",
        "Pau",
        "Unai",
        "Valen",
        "Yael",
    ],
    lastNames: [
        "García",
        "González",
        "Rodríguez",
        "Fernández",
        "López",
        "Martínez",
        "Sánchez",
        "Pérez",
        "Gómez",
        "Martín",
        "Jiménez",
        "Ruiz",
        "Hernández",
        "Díaz",
        "Moreno",
        "Álvarez",
        "Muñoz",
        "Romero",
        "Alonso",
        "Gutiérrez",
        "Navarro",
        "Torres",
        "Domínguez",
        "Vázquez",
        "Ramos",
        "Gil",
        "Ramírez",
        "Serrano",
        "Blanco",
        "Suárez",
    ],
    titles: [
        "Sr.",
        "Sra.",
        "Srta.",
        "Dr.",
        "Dra.",
        "Prof.",
        "Don",
        "Doña",
        "Ing.",
    ],
    suffixes: ["Jr.", "Sr.", "II", "III", "Dr.", "Ing."],
    nicknames: [
        "Chico",
        "Chica",
        "Pepe",
        "Lola",
        "Paco",
        "Nacho",
        "Kike",
        "Toni",
        "Dani",
        "Santi",
    ],
};

/**
 * French locale data.
 */
const FR_LOCALE_DATA: LocaleData = {
    maleFirstNames: [
        "Jean",
        "Pierre",
        "Michel",
        "André",
        "Philippe",
        "Alain",
        "Bernard",
        "Christophe",
        "Daniel",
        "Éric",
        "François",
        "Gérard",
        "Henri",
        "Jacques",
        "Laurent",
        "Louis",
        "Marcel",
        "Nicolas",
        "Olivier",
        "Patrick",
        "Paul",
        "Robert",
        "Stéphane",
        "Thierry",
        "Vincent",
        "Yves",
        "Antoine",
        "Claude",
        "Denis",
        "Didier",
    ],
    femaleFirstNames: [
        "Marie",
        "Monique",
        "Françoise",
        "Catherine",
        "Nathalie",
        "Isabelle",
        "Sylvie",
        "Christine",
        "Martine",
        "Nicole",
        "Brigitte",
        "Valérie",
        "Chantal",
        "Dominique",
        "Véronique",
        "Anne",
        "Sandrine",
        "Céline",
        "Sophie",
        "Stéphanie",
        "Patricia",
        "Laurence",
        "Corinne",
        "Karine",
        "Pascale",
        "Caroline",
        "Hélène",
        "Delphine",
        "Nadine",
        "Michèle",
    ],
    neutralFirstNames: [
        "Claude",
        "Dominique",
        "Camille",
        "Maxime",
        "Morgan",
        "Sacha",
        "Lou",
        "Charlie",
    ],
    lastNames: [
        "Martin",
        "Bernard",
        "Dubois",
        "Thomas",
        "Robert",
        "Petit",
        "Durand",
        "Leroy",
        "Moreau",
        "Simon",
        "Laurent",
        "Lefebvre",
        "Michel",
        "Garcia",
        "David",
        "Bertrand",
        "Roux",
        "Vincent",
        "Fournier",
        "Morel",
        "Girard",
        "André",
        "Lefevre",
        "Mercier",
        "Dupont",
        "Lambert",
        "Bonnet",
        "François",
        "Martinez",
        "Legrand",
    ],
    titles: ["M.", "Mme", "Mlle", "Dr", "Prof.", "Me", "Mgr"],
    suffixes: ["Jr", "Sr", "II", "III", "Dr", "Prof"],
    nicknames: [
        "Lulu",
        "Mimi",
        "Doudou",
        "Coco",
        "Nono",
        "Titi",
        "Lolo",
        "Fifi",
        "Kiki",
        "Bibi",
    ],
};

const DE_LOCALE_DATA: LocaleData = {
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

const IT_LOCALE_DATA: LocaleData = {
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

const RU_LOCALE_DATA: LocaleData = {
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

const ZH_LOCALE_DATA: LocaleData = {
    maleFirstNames: ["Wei", "Jun", "Ming", "Lei", "Hao"],
    femaleFirstNames: ["Li", "Mei", "Xiu", "Yan", "Jing"],
    neutralFirstNames: ["Lin", "Yu"],
    lastNames: ["Wang", "Li", "Zhang", "Liu", "Chen"],
    titles: ["Mr.", "Ms."],
    suffixes: [],
    nicknames: ["Xiao Ming", "Ah Wei"],
};

/**
 * Registry of locale data by locale code.
 */
const LOCALE_REGISTRY: Map<string, LocaleData> = new Map([
    ["en", EN_LOCALE_DATA],
    ["es", ES_LOCALE_DATA],
    ["fr", FR_LOCALE_DATA],
    ["de", DE_LOCALE_DATA],
    ["it", IT_LOCALE_DATA],
    ["ru", RU_LOCALE_DATA],
    ["ar", AR_LOCALE_DATA],
    ["zh", ZH_LOCALE_DATA],
]);

/**
 * Provider for locale-specific name data.
 *
 * This class manages locale-specific datasets for name generation,
 * providing fallback mechanisms for unsupported locales.
 *
 * @example
 * ```typescript
 * const provider = new LocaleProvider();
 * const data = provider.getLocaleData('es');
 * console.log(data.maleFirstNames); // Spanish male names
 *
 * // Fallback for unsupported locale
 * const fallback = provider.getLocaleData('xyz');
 * console.log(fallback === provider.getLocaleData('en')); // true
 * ```
 */
export class LocaleProvider {
    /**
     * Gets locale data for the specified locale code.
     *
     * @param locale - The locale code (e.g., 'en', 'es', 'fr').
     *
     * @returns Locale data for the specified locale, or English data as fallback.
     *
     * @example
     * ```typescript
     * const provider = new LocaleProvider();
     *
     * // Get Spanish locale data
     * const esData = provider.getLocaleData('es');
     * console.log(esData.maleFirstNames[0]); // "Antonio"
     *
     * // Fallback to English for unsupported locale
     * const unknownData = provider.getLocaleData('unknown');
     * console.log(unknownData.maleFirstNames[0]); // "James"
     * ```
     */
    getLocaleData(locale: string): LocaleData {
        return LOCALE_REGISTRY.get(locale) || LOCALE_REGISTRY.get("en")!;
    }

    /**
     * Checks if a locale is supported.
     *
     * @param locale - The locale code to check.
     *
     * @returns True if the locale is supported, false otherwise.
     *
     * @example
     * ```typescript
     * const provider = new LocaleProvider();
     * console.log(provider.isLocaleSupported('en')); // true
     * console.log(provider.isLocaleSupported('xyz')); // false
     * ```
     */
    isLocaleSupported(locale: string): boolean {
        return LOCALE_REGISTRY.has(locale);
    }

    /**
     * Gets a list of all supported locale codes.
     *
     * @returns An array of supported locale codes.
     *
     * @example
     * ```typescript
     * const provider = new LocaleProvider();
     * console.log(provider.getSupportedLocales()); // ['en', 'es', 'fr']
     * ```
     */
    getSupportedLocales(): string[] {
        return Array.from(LOCALE_REGISTRY.keys()).sort();
    }
}

export default LocaleProvider;
