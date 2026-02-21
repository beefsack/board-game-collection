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