# faker

**faker** is a lightweight, type-safe TypeScript library for generating realistic mock data and advanced mock structures with minimal complexity.

It is built for developers who value **strong typing**, **predictability**, and **clean architecture** over uncontrolled randomness.

⚠️ **This library is currently under active development and is not production-ready.**

---

## Why faker?

Most mock libraries focus on randomness.
**faker focuses on correctness, typing, and composability.**

Core principles:

-   Type-first API (TypeScript is the source of truth)
-   Fully typed object generation
-   Deterministic and seedable behavior
-   Stateless, O(1) generators
-   Explicit, predictable data generation
-   Easy to extend and maintain

---

## Features (In Progress)

-   Realistic data generation (names, emails, phones, addresses, finance, web, dates)
-   Strongly typed object mocking
-   Nested objects and collections
-   Seed-based reproducibility
-   Locale-aware generators
-   Lightweight, tree-shakable core

---

## Installation

> Not published yet.

```bash
npm install faker
```

---

## Basic usage (API draft)

```ts
import { faker } from "faker";

faker.name.first();
faker.internet.email();
faker.number.int({ min: 1, max: 100 });
```

---

## Typed object generation

```ts
type User = {
    id: string;
    name: string;
    email: string;
    age: number;
};

const user = faker.mock<User>({
    id: faker.uuid.v7,
    name: faker.name.full,
    email: faker.internet.email,
    age: faker.number.int({ min: 18, max: 65 }),
});
```

Type safety is enforced at compile time.

---

## Project status

-   🚧 Under active development
-   Public API is not stable yet
-   Breaking changes may occur before `v1.0`
-   Feedback and early contributions are welcome

---

## Philosophy

-   Explicit over implicit
-   Compile-time safety over runtime tricks
-   Simple API, powerful composition
-   Performance and clarity first

---

## License

MIT
