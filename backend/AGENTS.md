# AGENTS.md — NestJS Backend Rules

## 🚀 Tech Stack

- NestJS (backend framework)
- TypeScript (lenguaje principal)
- PostgreSQL (database)
- TypeORM / Prisma (ORM recomendado)
- REST API architecture
- JWT Authentication

---

## 🧱 Project Architecture (NestJS Standard)

The project MUST follow NestJS modular architecture:

```text id="nest001"
src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── donors/
│   ├── donations/
│   ├── inventory/
│   └── reports/
│
├── common/
│   ├── guards/
│   ├── decorators/
│   ├── filters/
│   ├── interceptors/
│   └── pipes/
│
├── config/
├── database/
├── main.ts
└── app.module.ts
```

### Rules:

- Each feature MUST be a module
- Business logic goes in services only
- Controllers only handle HTTP requests
- Database logic handled via repositories or ORM services

---

## 🔌 API Design Rules

- Use REST conventions strictly
- Always return JSON responses
- Use DTOs for all inputs

### Standard endpoints example:

```text id="api001"
GET    /donors
POST   /donors
GET    /donors/:id
PATCH  /donors/:id
DELETE /donors/:id
```

---

## 📦 DTO & Validation Rules

- All inputs MUST use DTOs
- Use class-validator for validation

Example:

```ts id="dto001"
export class CreateDonorDto {
  @IsString()
  name: string;

  @IsString()
  bloodType: string;

  @IsDateString()
  birthDate: string;
}
```

---

## 🔐 Authentication & Authorization

- Use JWT strategy (Passport.js)
- Store tokens in HTTP-only cookies
- Implement role-based access control (RBAC)

### Roles:

- ADMIN → full system access
- MEDICO → manage donors and donations
- LABORATORISTA → manage tests and inventory
- RECEPCIONISTA → register donors

### Rules:

- Protect all routes using Guards
- Use `@Roles()` decorator for access control

Example:

```ts id="auth001"
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Get('admin')
```

---

## 🗄️ Database Rules (PostgreSQL)

- Use snake_case for tables and columns
- Define relationships explicitly
- Use migrations for schema changes

### Example entities:

```text id="db001"
users
roles
donors
donations
blood_inventory
```

### Rules:

- Avoid raw queries unless necessary
- Always use ORM relations instead of manual joins when possible
- Index frequently queried columns

---

## 🧪 Validation Rules

- Validate all requests using DTOs
- Never trust client input
- Sanitize and transform data using pipes

Example:

```ts id="val001"
@UsePipes(new ValidationPipe({ whitelist: true }))
```

---

## 🔐 Security Rules

- Hash passwords with bcrypt
- Never expose sensitive fields in responses
- Use environment variables for secrets
- Enable CORS properly
- Protect against injection attacks

---

## ⚙️ Performance Rules

- Use pagination for large datasets
- Avoid N+1 queries
- Use indexes for frequently filtered fields
- Cache heavy endpoints when needed

---

## 🌿 Git Workflow

- main → production
- develop → integration branch
- feature/\* → individual features

### Rules:

- All features must be developed in branches
- All merges must go through Pull Request
- Code review is mandatory

---

## 🧠 Code Style Rules

- Use camelCase for variables and methods
- Use PascalCase for classes, DTOs, modules
- Keep services small and focused
- Avoid logic inside controllers
- Follow NestJS conventions strictly

---

## 🧩 General Principles

- Follow modular architecture strictly
- Keep backend scalable and maintainable
- Prefer clean architecture principles
- Ensure separation of concerns at all times
- Keep APIs predictable and consistent
