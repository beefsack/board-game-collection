# **Portfolio Project Plan: Board Game Catalogue**

## **1\. Project Overview**

A web application allowing users to register, log in, and manage a personal catalogue of their board game collection.  
**Primary Goal:** To serve as a comprehensive portfolio piece demonstrating a broad, production-ready skillset for job applications.

## **2\. Core Engineering Priorities**

* **Idiomatic & Unsurprising:** Favor simplicity and established conventions over novelty.  
* **Battle-Hardened Tooling:** Stick to popular, well-maintained frameworks and libraries.  
* **Enterprise Patterns:** Demonstrate architecture commonly observed in large, team-maintained software.  
* **Official Upstream Tooling (DX):** For the Developer Experience (DX), strictly prefer official, first-party tools provided by the framework creators (e.g., spring-boot-docker-compose, Vite) over custom bash scripts or third-party wrappers.  
* **Maintainability:** Prefer self-documenting code and clean architecture over heavy inline commenting.  
* **Full-Stack Breadth:** Showcase frontend (React/TS), backend (Kotlin), database, background workers, local dev environments, containerization (Docker), CI/CD, and orchestration (Linode Kubernetes).

## **3\. Non-Negotiable Technologies**

* **Frontend:** TypeScript \+ React  
* **Backend:** Kotlin  
* **Containerization:** Docker  
* **Deployment:** Linode Kubernetes Engine (LKE)

## **4\. Phase 1: Technology Selection (Finalized)**

### **4.1. Backend Framework**

* **Selection:** Kotlin \+ Spring Boot 4.x

### **4.2. Authentication Strategy**

* **Selection:** Stateless JWT (JSON Web Tokens) via Spring Security \+ Nimbus  
* **Implementation Note (Idiomatic Spring Security):** We will implement Spring Security's standard UserDetailsService interface to plug our custom user-loading logic into Spring Security's authentication pipeline, replacing its in-memory defaults with database-backed lookups.

### **4.3. API Contract & Type Safety**

* **Selection:** OpenAPI \+ Build-Time Generation \+ Orval

### **4.4. Database & ORM**

* **Selection:** PostgreSQL \+ Spring Data JDBC \+ Flyway

### **4.5. Frontend State & Data Fetching**

* **Selection:** React \+ TanStack Query \+ Zustand

### **4.6. CI/CD & Infrastructure**

* **Selection:** GitHub Actions \+ ArgoCD \+ Kustomize \+ LKE

### **4.7. Object Storage (File Uploads)**

* **Selection:** MinIO (Self-Hosted, S3-Compatible)  
* **Architecture Note (Portfolio vs. Enterprise):** In our final README, we will explicitly document that self-hosting stateful databases and object stores in Kubernetes is done here for cost-efficiency. In a real enterprise environment, these would be offloaded to managed cloud services.

### **4.8. CSS Framework & UI Library**

* **Selection:** Tailwind CSS \+ Tailwind UI (Headless UI)  
* **Justification:** Tailwind is the modern industry standard for utility-first styling. Because we have a Tailwind UI license, we will leverage its official React companion library, Headless UI, for complex interactive components. This perfectly satisfies our requirement for an accessible, Select2-style searchable dropdown (the Headless UI Combobox) without relying on third-party integrations.

## **5\. Phase 2: High-Level Architecture & Data Modeling**

### **5.1. Database Schema (PostgreSQL)**

The schema is highly normalized to handle games with multiple designers and publishers. All primary tables include standard audit timestamps (created\_at, updated\_at) managed automatically by Spring Data JDBC Auditing.  
**Table 1: users**

* id (UUID, Primary Key)  
* email (VARCHAR(255), Unique, Not Null)  
* password\_hash (VARCHAR(500), Not Null)  
* role (VARCHAR(50), Not Null)  
* created\_at (TIMESTAMP)  
* updated\_at (TIMESTAMP)

**Table 2: designers**

* id (UUID, Primary Key)  
* name (VARCHAR(255), Not Null)  
* created\_at (TIMESTAMP)  
* updated\_at (TIMESTAMP)

**Table 3: publishers**

* id (UUID, Primary Key)  
* name (VARCHAR(255), Not Null)  
* created\_at (TIMESTAMP)  
* updated\_at (TIMESTAMP)

**Table 4: board\_games**

* id (UUID, Primary Key)  
* title (VARCHAR(255), Indexed for searching)  
* year\_published (INTEGER, Nullable)  
* min\_players (INTEGER, Nullable)  
* max\_players (INTEGER, Nullable)  
* play\_time\_minutes (INTEGER, Nullable)  
* weight (DECIMAL(3,2), Nullable) \- *Scale of 1.00 to 5.00*  
* *Note: Images are uploaded to our MinIO S3 bucket, keyed as {id}.jpg.*  
* created\_at (TIMESTAMP)  
* updated\_at (TIMESTAMP)

**Table 5: board\_game\_designers (Many-to-Many)**

* board\_game\_id (UUID, Foreign Key \-\> board\_games.id)  
* designer\_id (UUID, Foreign Key \-\> designers.id)  
* *Constraint:* Primary Key is the composite (board\_game\_id, designer\_id)

**Table 6: board\_game\_publishers (Many-to-Many)**

* board\_game\_id (UUID, Foreign Key \-\> board\_games.id)  
* publisher\_id (UUID, Foreign Key \-\> publishers.id)  
* *Constraint:* Primary Key is the composite (board\_game\_id, publisher\_id)

**Table 7: user\_board\_games (Many-to-Many User Collection)**

* id (UUID, Primary Key)  
* user\_id (UUID, Foreign Key \-\> users.id)  
* board\_game\_id (UUID, Foreign Key \-\> board\_games.id)  
* condition (VARCHAR(50), Nullable)  
* created\_at (TIMESTAMP)  
* updated\_at (TIMESTAMP)  
* *Constraint:* Unique composite key on (user\_id, board\_game\_id)

### **5.2. Core API Boundaries (REST CRUD)**

**Auth**

* POST /api/auth/register  
* POST /api/auth/login

**Entities (Standard CRUD)**

* GET, POST, PUT, DELETE for /api/users, /api/designers, /api/publishers, /api/board-games

**Relationships**

* POST /api/users/{id}/board-games \- Add game to a user's collection
* DELETE /api/users/{id}/board-games/{game\_id} \- Remove game from a user's collection

## **6\. Phase 3: Frontend Architecture & Routing**

**Core Philosophy:** Avoid over-engineering.

### **6.1. UI Components**

* **The "Game Grid":** Displays a responsive grid of board games (Image \+ Title, Year, Weight). Reused across User, Designer, and Publisher views.  
* **Forms:** Unified form layouts for creating/updating entities.  
  * Will utilize **Headless UI's Combobox** for searchable, Select2-style relational data assignment (e.g., attaching Designers to a Board Game).  
  * Includes file input fields for MinIO image uploads.

### **6.2. Application Routing**

* **Indexes:** /users, /designers, /publishers, /board-games  
* **Detail / Collection Views:** /users/:id, /designers/:id, /publishers/:id  
* **Management (CRUD Views):** Create/Edit pages mapped cleanly alongside delete actions.

## **7\. Phase 4: Testing Strategy**

### **7.1. Backend Testing (Kotlin / Spring Boot)**

* **Unit Testing:** **JUnit 5** \+ **MockK**.  
* **Integration Testing:** **Testcontainers** (Automated Docker-backed Postgres & MinIO).

### **7.2. Frontend Testing (React / TypeScript)**

* **Component Testing:** **Vitest** \+ **React Testing Library (RTL)**.  
* **End-to-End (E2E) Testing:** **Playwright**.

### **7.3. CI/CD Integration (GitHub Actions)**

* **Execution:** All tests run on push and pull\_request. GitHub Actions' native Docker support handles Testcontainers seamlessly.

## **8\. Phase 5: Environments & Infrastructure Strategy**

To demonstrate mature deployment architecture, the project utilizes distinctly different configurations for local development versus remote production, reflecting standard enterprise workflows.

### **8.1. Local Development Loop (Official Upstream Tooling)**

* **Strategy:** Lightweight, rapid feedback loop relying exclusively on first-party framework integrations rather than custom bash scripts.  
* **Backend (Spring Boot 4 \+ Docker Compose):** We will use a docker-compose.yml file to define our stateful dependencies (PostgreSQL and MinIO). By utilizing the official spring-boot-docker-compose module, Spring Boot will automatically manage the lifecycle of these local containers and auto-inject the connection strings, providing a zero-configuration developer experience.  
* **Frontend (Vite):** We will use **Vite** as our frontend build tool and local dev server. As the official successor to Create React App, it provides instant server start times, blazing-fast Hot Module Replacement (HMR), and out-of-the-box native TypeScript support without complex webpack scaffolding.

### **8.2. Process Architecture (Spring Profiles \+ Kubernetes Primitives)**

All process types are packaged into a **single Docker image** and differentiated via Spring profiles, avoiding the need to maintain separate codebases or build artifacts. The `SPRING_PROFILES_ACTIVE` environment variable selects the behaviour at runtime.

| Process Type | Spring Profile | K8s Primitive | Description |
|---|---|---|---|
| Web | `web` (default) | `Deployment` + `Service` + `Ingress` | Serves HTTP traffic; multiple replicas with rolling updates |
| Long-running worker | `worker` | `Deployment` (no `Service`) | Polls a queue or data source indefinitely; K8s manages restarts |
| Cron job | `cron-*` (e.g. `cron-stats`) | `CronJob` | Runs an `ApplicationRunner` to completion and exits 0; K8s owns the schedule, retry policy, and job history |

**Spring Boot idiom:** Each process type is implemented as an `ApplicationRunner` (or equivalent) bean annotated with `@Profile`, ensuring only the relevant bean activates for a given profile. Cron processes return from `run()` to exit cleanly; long-running workers loop indefinitely.

**Local Development:** All process types share the same `docker-compose.yml`-managed stateful dependencies (Postgres, MinIO). Each process is run in a separate terminal with the appropriate profile:

```
# Web (default)
./gradlew bootRun

# Long-running worker
./gradlew bootRun --args='--spring.profiles.active=worker'

# Cron job (triggered manually on demand)
./gradlew bootRun --args='--spring.profiles.active=cron-stats'
```

### **8.3. Remote Production Loop (Kubernetes \+ GitOps)**

* **Strategy:** Scalable, declarative container orchestration.  
* **Implementation:** The CI/CD pipeline packages the Kotlin API and React UI into distinct Docker images.  
* **Manifest Management:** We will use **Kustomize** to manage the Kubernetes YAML manifests, injecting configuration specific to the LKE cluster.  
* **Deployment:** **ArgoCD** acts as the GitOps agent inside the cluster, pulling the Kustomize manifests from GitHub and applying the desired state to the Linode Kubernetes Engine.  
* **Resource Note:** We will actively monitor ArgoCD's memory footprint on the personal LKE cluster. If the resource overhead becomes disproportionate to the project's needs, we maintain a pragmatic fallback plan to pivot to a direct GitHub Actions "Push" deployment.

## **9\. Phase 6: Potential Enhancements (Post-MVP)**

To further demonstrate breadth of skill, the following enhancements are planned for implementation after the core CRUD functionality is stable.

### **9.1. Background Workers & Time-Series Data**

**Objective:** Showcase the ability to write scheduled backend processes, handle time-series data storage, and render interactive data visualizations on the frontend by tracking the "Popularity Over Time" (owner count) for each board game.

* **Backend Execution (Kubernetes CronJob \+ Spring Profile):**
  * We will implement the worker as a `cron-stats` Spring profile, activating an `ApplicationRunner` bean that executes an aggregate COUNT query on the `user_board_games` table grouped by `board_game_id`, then exits cleanly.
  * In Kubernetes, a `CronJob` runs the shared Docker image with `SPRING_PROFILES_ACTIVE=cron-stats` on a schedule (e.g. every 5 minutes for demonstration purposes, or nightly in a real-world scenario).
  * This avoids the duplicate-execution problem inherent in `@Scheduled` under multi-replica deployments, as Kubernetes owns the schedule, retry policy, and job history. Locally, the job is triggered on demand via `./gradlew bootRun --args='--spring.profiles.active=cron-stats'`.  
* **Data Storage (PostgreSQL Time-Series):**  
  * Instead of introducing a completely separate database (like InfluxDB), we will create a dedicated time-series table in our existing PostgreSQL database. This demonstrates pragmatic infrastructure management.  
  * **Table Concept: board\_game\_owner\_stats**
    * board\_game\_id (UUID, Foreign Key)
    * owner\_count (INTEGER)
    * recorded\_at (TIMESTAMP)
    * *Constraint:* Primary Key is the composite (board\_game\_id, recorded\_at), which also serves as the index for time-range queries and satisfies TimescaleDB's requirement for the time column to be part of the primary key.  
  * *Enterprise Talking Point:* In a real-world scenario handling millions of rows, this standard table could be seamlessly converted into a **TimescaleDB** hypertable (a Postgres extension), offering massive performance gains for time-series data without changing our tech stack.  
* **Frontend Visualization (Recharts / D3.js):**
  * The Board Game Detail view will feature a historical popularity graph.
  * We will fetch the time-series data via a new endpoint (e.g., GET /api/board-games/{id}/stats).
  * We will render the data using **Recharts**, passing Tailwind utility classes into its SVG stroke/fill properties to match the Tailwind UI aesthetic seamlessly.

### **9.2. TLS / SSL via cert-manager (Let's Encrypt)**

**Objective:** Terminate HTTPS at the nginx ingress controller using a Let's Encrypt certificate managed automatically by cert-manager, so the production site is served over `https://board-game-collection.beefsack.com`.

**Implementation:**

* **Install cert-manager** into the cluster (standard `kubectl apply` of the upstream release manifest). cert-manager runs as a set of controllers in the `cert-manager` namespace and requires no application-level changes.

* **Create a `ClusterIssuer`** (cluster-scoped, so it can issue certificates for any namespace) configured for the Let's Encrypt ACME HTTP-01 challenge. HTTP-01 is the correct choice here because the nginx ingress already handles all inbound HTTP traffic — cert-manager's ACME solver creates a temporary `Ingress` rule to serve the challenge token, then removes it once the certificate is issued. DNS-01 is not needed and would require provider-specific API credentials.

* **Annotate the Ingress** with `cert-manager.io/cluster-issuer: letsencrypt-prod` and add a `tls:` block specifying the `secretName` where the issued certificate will be stored and the hostname. cert-manager watches for this annotation and triggers certificate issuance automatically.

* **TLS termination** is handled entirely by the nginx ingress controller once the `Secret` containing the certificate and private key is populated by cert-manager. No changes to the API or UI pods are needed.

* **Manifest placement:** The `ClusterIssuer` manifest lives in `k8s/overlays/production/` (it is production-only; local dev does not use it). The ingress `tls:` block and annotation are added via a Kustomize patch in the production overlay, keeping the base ingress free of environment-specific config — consistent with the existing `ingress-host-patch.yaml` pattern.

* **Auto-renewal:** cert-manager automatically renews certificates before expiry (Let's Encrypt certificates are valid for 90 days; renewal is triggered at 60 days). No manual intervention required.

### **9.3. Authorization (Role-Based Access Control)**

**Objective:** Restrict write operations so that regular users can only modify their own data, and introduce an `ADMIN` role for privileged operations (managing the board game catalogue, designers, publishers, and all users).

**Current State:** The `users` table already has a `role` column (`VARCHAR(50)`). The JWT is issued at login. No authorization rules are enforced yet — any authenticated user can call any endpoint.

**Proposed Implementation (Idiomatic Spring Security):**

* **Enable method-level security** by adding `@EnableMethodSecurity` to `SecurityConfiguration`. This unlocks Spring Security's `@PreAuthorize` annotation, which is the idiomatic, declarative way to express authorization rules directly on service or controller methods — no custom filter chains or interceptors required.

* **Embed the role in the JWT** at login time as a claim (e.g. `"role": "ADMIN"`). The resource server already validates and parses the JWT, so the role claim is available on the `Authentication` object without an additional database lookup per request.

* **Apply `@PreAuthorize` rules at the service layer:**
  * Admin-only operations (create/update/delete board games, designers, publishers; manage any user):
    `@PreAuthorize("hasRole('ADMIN')")`
  * User-scoped operations (update own collection, own profile):
    `@PreAuthorize("#id.toString() == authentication.name")` — where `authentication.name` is the user's UUID (the JWT `sub` claim).
  * Read operations remain open to any authenticated user.

* **No new dependencies required** — `@EnableMethodSecurity` and `@PreAuthorize` are part of `spring-boot-starter-security`, already on the classpath.

* **Restrict image upload** (`POST /api/board-games/{id}/image`) to `ADMIN` only using the same `@PreAuthorize("hasRole('ADMIN')")` annotation. This also addresses the image upload security concern: by limiting who can upload, the attack surface is reduced to trusted users, making magic-byte content validation unnecessary for this project.

* **Promote a user to admin** via a direct SQL update (no admin UI needed initially):
  `UPDATE users SET role = 'ADMIN' WHERE email = 'you@example.com';`

### **9.4. Public Browsing (Unauthenticated Read Access)**

**Objective:** Allow anyone to browse the catalogue — board games, designers, publishers, and user collection pages — without needing an account. Authentication is only required to perform write operations or manage a collection.

**Current State:** All API endpoints require a valid JWT (`authenticated()` rule in `SecurityConfiguration`). The frontend wraps all routes in `ProtectedRoute`, which redirects unauthenticated visitors to `/login` immediately.

**Proposed Backend Changes (Spring Security):**

* **Open all GET endpoints to anonymous access** by updating the `SecurityConfiguration` `authorizeHttpRequests` rules:
  * `GET /api/**` → `permitAll()`
  * `POST /api/auth/**` → `permitAll()` (already the case)
  * All other methods (`POST`, `PUT`, `DELETE` on non-auth paths) → `authenticated()`
* The existing `@PreAuthorize("hasRole('ADMIN')")` annotations on write service methods remain unchanged — they provide the finer-grained checks once a request is authenticated.

**Proposed Frontend Changes:**

* **Remove `ProtectedRoute`** from all browse/read routes: board games (list + detail), designers (list + detail), publishers (list + detail), users (list + detail).
* **Keep `ProtectedRoute`** only on write routes: create/edit form pages (`/board-games/new`, `/board-games/:id/edit`, etc.) and any user collection management views.
* **Update `AppShell`** to handle the unauthenticated state gracefully: when no token is present, show "Sign in / Register" links in the nav instead of the display name and sign-out button.
* The `mutator.ts` API client omits the `Authorization` header when no token is stored in Zustand — this already works correctly and requires no change.

### **9.5. UI Polish & Navigation Improvements**

**Objective:** Improve navigation clarity and make the collection-management experience first-class.

#### **9.5.1. Navigation Bar**

* **"Board Games" heading is a link:** The `AppShell` title text ("Board Games") becomes a `<Link to="/board-games">` so clicking the logo/heading navigates to the index.
* **"My Collection" link (auth-gated):** A "My Collection" link is added as the first nav item after the heading. It links to `/users/{userId}` (the currently logged-in user's detail page). Only rendered when a token is present in the auth store.
* **Replace "Users" with "Collections":** The "Users" nav link is removed. A "Collections" link is added at the *end* of the nav bar, linking to `/users`. This is always visible (public browsing, per 9.4).

#### **9.5.2. Collections Index Page (`/users`)**

* The page currently shows a plain list of users. It should be updated to display each user's game count alongside their name.
* **Backend:** Add a `gameCount` field to the `UserResponse` DTO, populated by a `COUNT` on `user_board_games` grouped by `user_id`. This can be a single query joining `users` with an aggregate subquery — no new endpoint needed.
* **Frontend:** Sort users by `gameCount` descending client-side (the list is small). Display the count next to each user's name (e.g. "Alice — 12 games").

#### **9.5.3. Designers & Publishers Index Pages**

* Same pattern as Collections: each designer/publisher row shows the number of board games associated with them, sorted by count descending.
* **Backend:** Add a `gameCount` field to `DesignerResponse` and `PublisherResponse` DTOs, populated from `COUNT` aggregates on `board_game_designers` / `board_game_publishers`. No new endpoints.
* **Frontend:** Sort by `gameCount` descending client-side.

#### **9.5.4. "Own" Indicator on Game Grid Cards**

* When a game grid card is rendered and the viewer is logged in, a small icon (e.g. a checkmark badge or shelf icon) is overlaid on the card if the game is in the logged-in user's collection.
* **Data source:** Fetch `GET /api/users/{userId}` (the logged-in user's detail, which returns their `boardGames` list) and keep the result in a TanStack Query cache entry keyed by `userId`. The `GameGrid` component (or its parent) passes down a `Set<string>` of owned game IDs. No new backend endpoint needed.
* Only rendered when a `userId` is present in the auth store; unauthenticated visitors see no indicator.

#### **9.5.5. Add / Remove from Collection on Board Game Detail**

* The board game detail page gains an "Add to my collection" / "Remove from my collection" toggle button, visible only when logged in.
* **Logic:** If the game's ID appears in the logged-in user's `boardGames` list (same cached query as 9.5.4), show "Remove from my collection" (calls `DELETE /api/users/{userId}/board-games/{gameId}`); otherwise show "Add to my collection" (calls `POST /api/users/{userId}/board-games`).
* On success, invalidate the user detail query so the indicator and collection page update automatically.

#### **9.5.6. "My Collection" Page — Add Game UI**

* The user detail page (when viewing your own collection) gains a searchable select box to add a game directly from the page, without navigating to the board game detail first.
* **Component:** Reuse the existing `MultiCombobox` pattern (Headless UI Combobox) already used in `BoardGameFormPage`. The input searches the full `GET /api/board-games` list and filters out games already owned.
* On selection, call `POST /api/users/{userId}/board-games` and invalidate the user detail query. The grid updates immediately.
* The add-game combobox is only rendered when `userId === authStore.userId` (viewing your own page).

---

## **10\. Out of Scope: Known Production Gaps**

This section documents deliberate shortcuts taken to keep the project focused as a portfolio piece. Each item describes what was omitted, what a full production implementation would require, and why it was descoped.

### **10.1. JWT Refresh Tokens**

**Gap:** The API issues short-lived access tokens (1-hour expiry) with no refresh mechanism. When a token expires, the client receives a 401, clears the stored token, and redirects the user to the login page.

**Production requirement:** A refresh token system — a long-lived, opaque token stored server-side (in a `refresh_tokens` table or Redis), issued alongside the access token, and exchanged for a new access token without re-authentication. Refresh tokens require rotation on use, revocation endpoints (logout, "sign out all devices"), and coordinated expiry logic on the client.

**Why descoped:** The implementation surface is large and spans both the backend (new table, new endpoints, revocation logic) and the frontend (silent refresh flow, retry-after-refresh interceptor). The complexity is disproportionate to the value in a single-user portfolio demo with a 1-hour access window.

### **10.2. Auth Rate Limiting & Brute-Force Protection**

**Gap:** The `/api/auth/login` and `/api/auth/register` endpoints have no rate limiting. A client can make unlimited requests without restriction.

**Production requirement:** Rate limiting on authentication endpoints to prevent credential stuffing and brute-force attacks. Options include nginx/ingress-level rate limiting (`limit_req`), a Spring filter backed by a distributed counter (e.g. `bucket4j` with Redis), or a WAF in front of the cluster.

**Why descoped:** Requires either a distributed counter (adding Redis as another stateful dependency) or ingress-level configuration work that adds operational complexity without meaningfully demonstrating additional engineering skill for this project.

### **10.3. Image Delivery via CDN**

**Gap:** Board game images are proxied through the API pods on every request (`GET /api/board-games/{id}/image` reads from MinIO and returns the bytes). This routes all image traffic through the application tier.

**Production requirement:** Images should be served directly from a CDN or from object storage with a public endpoint, bypassing the API pods entirely. This eliminates unnecessary bandwidth and CPU load on application pods and provides global edge caching.

**Why descoped:** Requires either exposing MinIO publicly through the ingress (and managing a public bucket policy) or integrating a CDN provider — both add infrastructure complexity without demonstrating additional application engineering skill.

### **10.4. Kubernetes Pod Resource Requests & Limits**

**Gap:** No CPU or memory `requests`/`limits` are defined on any pod. Pods are unconstrained and rely on the cluster scheduler's best-effort placement.

**Production requirement:** All pods should declare `resources.requests` (for scheduling) and `resources.limits` (for isolation). Without limits, a misbehaving pod can starve other workloads on the same node. Requests are also required for the Horizontal Pod Autoscaler to function.

**Why descoped:** Setting accurate values requires profiling under realistic load. On this 3-node personal cluster the current memory headroom is sufficient, and adding speculative limits without profiling data risks incorrect throttling.

### **10.5. Structured Logging & Observability**

**Gap:** The application emits unstructured log lines to stdout with no log aggregation, no metrics collection, and no distributed tracing.

**Production requirement:** Structured JSON logging (Logback with `logstash-logback-encoder`), a metrics pipeline (Micrometer → Prometheus → Grafana), and distributed tracing (OpenTelemetry). These are essential for diagnosing latency, errors, and resource usage in production.

**Why descoped:** Each of these is a substantial integration in its own right. The project already demonstrates CI/CD, Kubernetes, and GitOps; adding a full observability stack would expand scope significantly without adding to the core portfolio narrative.

### **10.6. Admin Promotion via Direct SQL**

**Gap:** Elevating a user to the `ADMIN` role requires running a raw SQL statement directly against the production database (`UPDATE users SET role = 'ADMIN' ...`). There is no privileged management interface.

**Production requirement:** A secure out-of-band mechanism for privilege escalation — either a protected admin API endpoint, a CLI tool that runs with elevated database credentials, or a seed/migration-based bootstrap for the initial admin user.

**Why descoped:** The RBAC feature itself (Phase 6, section 9.3) is not yet implemented. The promotion mechanism is a follow-on to that work and is deliberately simple for now.

### **10.7. Image Processing (Resizing & Thumbnails)**

**Gap:** Images are stored and served at their original resolution. There is no server-side resizing, thumbnail generation, or format normalisation.

**Production requirement:** An image processing pipeline (e.g. ImageMagick, Sharp, or a managed service like Imgix/Cloudinary) that produces multiple resolutions — at minimum a thumbnail for grid views and a display-size variant for detail views. Serving full-resolution originals as grid thumbnails wastes bandwidth and degrades page load performance at scale.

**Why descoped:** Image processing adds a non-trivial dependency (a native library or third-party service) and a more complex upload flow. For a portfolio demo with a small number of games, the performance impact is negligible.