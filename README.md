# Full-Stack Next.js Application with Custom Domain-Driven Design

---

This repository houses a full-stack web application built with **Next.js**, leveraging its capabilities for both frontend and backend (API routes). The project is meticulously structured following a **custom Domain-Driven Design (DDD)** approach, emphasizing a clear separation of concerns, maintainability, and scalability through a robust domain model.

## Project Overview

This application demonstrates a modern web development workflow where the frontend is rendered by Next.js, interacting with a backend powered by Next.js API routes. The core innovation lies in its architectural foundation: a tailored DDD implementation that organizes the codebase around business domains rather than technical layers. This approach promotes a deeper understanding of the problem space, leading to a more expressive and adaptable design.

## Key Features

* **Full-Stack Next.js:** Unified development experience for both user interface and API endpoints.
* **Custom Domain-Driven Design (DDD):**
    * **Explicit Domain Model:** Business logic is encapsulated within well-defined **entities**, **value objects**, and **aggregates**.
    * **Bounded Contexts (Implicit/Explicit):** The application is structured with an eye towards potential bounded contexts, ensuring domain isolation and clarity.
    * **Application Services:** Orchestrate domain operations and interact with infrastructure layers.
    * **Infrastructure Abstraction:** Database interactions, external API calls, and other technical concerns are handled through dedicated infrastructure modules, allowing the domain to remain pure.
* **Optimized Performance:** Leverages Next.js features like server-side rendering (SSR) and static site generation (SSG) where appropriate for fast load times and improved SEO.
* **Scalable Architecture:** The DDD principles pave the way for easier expansion and modification of features without introducing significant technical debt.
* **Type Safety:** Built with TypeScript for enhanced code quality and fewer runtime errors.

## Technologies Used

* **Next.js** (React Framework for Frontend & API Routes)
* **React**
* **TypeScript**
* MySQL
* Tailwind

## Getting Started

To get a copy of the project up and running on your local machine, follow these steps:

### Prerequisites

* Node.js (v24 or higher recommended)
* npm or yarn

### Installation

- npm install

### Running :
- npm run dev

### Build on Docker:
- make deploy

### .env file Type : 
- .env.production
- .env.development
- .env.local

### create migration :
  db-migrate create add_email_on_FUser_Android
### run migration :
  make ENV=test migrate
#### roolback migration
  make ENV=test roolBack

Note :
- Eksekusi menggunakan bash script (git terminal kalau di windows)
