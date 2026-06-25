# AGENTS.md — Astro Project Rules

## 🚀 Development

When starting the development server, always use background mode:

```bash id="dev001"
astro dev --background
```

### Server Management

```bash id="dev002"
astro dev stop
astro dev status
astro dev logs
```

---

## 📚 Documentation

Official Astro documentation:
https://docs.astro.build

---

## 📖 Required Reading Before Implementation

Agents MUST consult relevant documentation before implementing features.

### Routing & Middleware

https://docs.astro.build/en/guides/routing/

### Astro Components

https://docs.astro.build/en/basics/astro-components/

### Framework Components (React, Vue, Svelte)

https://docs.astro.build/en/guides/framework-components/

### Content Collections

https://docs.astro.build/en/guides/content-collections/

### Styling

https://docs.astro.build/en/guides/styling/

### Internationalization (i18n)

https://docs.astro.build/en/guides/internationalization/

---

## 🧱 Project Structure

The project MUST follow this structure:

```text id="struct001"
src/
├── components/   # Reusable UI components
├── layouts/      # Page layouts (wrappers)
├── pages/        # Routes (Astro pages)
├── scripts/      # Client-side JavaScript logic
└── styles/       # Global and modular styles
```

---

## 🧠 Convenciones de código

The following naming conventions MUST be followed:

- **PascalCase** → Classes, DTOs, Components
- **camelCase** → Variables, functions, methods
- **kebab-case** → File names and folders
- **snake_case** → Database tables and columns
- **UPPER_SNAKE_CASE** → Global constants

---

## 🧠 General Rules

- Prefer Astro components when interactivity is not required
- Use React/Vue/Svelte only when client-side interactivity is needed
- Keep components small, reusable, and focused
- Avoid business logic inside UI components
- Separate concerns between UI and data logic
- Follow official Astro patterns

---

## ⚙️ Development Guidelines

- Use ES6+ JavaScript features
- Use async/await for asynchronous operations
- Use fetch for API communication
- Maintain separation between frontend and backend logic
- Write clean, modular, and maintainable code

---

## Frontend Data Model

The frontend data models are defined in:

/docs/data-model.ts

Always read this file before:

- creating components
- building pages
- implementing API calls
