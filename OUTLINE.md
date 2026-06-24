# Project Outline: AI Lifecycle Control Plane (ALCP)

## 🎯 Vision
The ALCP is not just a monitoring dashboard; it is an **operational control layer** designed to track the end-to-end lifecycle of AI projects. It bridges the gap between business inception (Sales/CRM) and technical deployment (Engineering/MLOps).

The primary goal is to provide **high-level visibility** into the "velocity" of projects by visualizing the progress of organizational milestones as they move through predefined roles and responsibilities.

---

## 🏗️ Core Architectural Pillars

### 1. The "Progress" Dashboard (Executive View)
*   **Objective**: High-level visibility for CEOs, Stakeholders, and Super Admins.
*   **Key Metric**: **Stage Completion Percentage**. 
*   **Visuals**: 
    *   Progress bars representing the "Project Lifecycle" (Sales $\rightarrow$ Product $\rightarrow$ Engineering $\rightarrow$ Deployment).
    *   Identification of "bottleneck" stages (e.g., projects stalling in the "Domain Expert" phase).
    *   Aggregated system health (System-wide error rates, cost tracking).

### 2. The "Wizard" (Project Inception & Integration)
*   **Objective**: The entry point for new business opportunities.
*   **Functionality**: A guided workflow to "spawn" a new project into the system.
*   **Key Inputs**:
    *   Project/Deal Name.
    **CRM Integration**: Field to link the project to external sources (e.g., **HubSpot/Salesforce** links).
    *   Initial Scope/Type (e.g., Databricks Workspace, RAG Implementation, Agentic Workflow).
*   **Outcome**: Creation of a new "Project Object" with an initialized set of lifecycle tasks.

### 3. The "Task Engine" (Execution View)
*   **Objective**: The granular, role-based execution layer.
*   **Functionality**: Translates the "Roles & Responsibilities" (Sales, PM, Data Eng, ML Eng) into actionable checklists.
*   **Mechanism**: As tasks within a stage are completed, the global Project Progress Bar moves forward.

---

## 🛠️ Technical Stack
*   **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS.
*   **Containerization**: Docker & Docker-Compose (for multi-service orchestration: Next.js + Python backend).
*   **Data Structure**: JSON-based "Project Registry" and "Task Manifests."
*   **Infrastructure Context**: Support for tracking Databricks workspace provisioning and lifecycle.

---

## 🚀 Development Roadmap

### Phase 1: Foundation (Current)
- [x] Project Scaffolding (Next.js + Docker).
- [x] Define Project & Task Data Schemas.
- [ ] Build the **Wizard** (Project Creation with CRM linking).
- [ ] Build the **Dashboard** (Progress Bar visualization).

### Phase 2: Task Integration
- [ ] Implement the "Task Engine" to populate stages with specific role-based checklists.
- [ ] Create the "Registry" view (the inventory of all active/completed projects).

### Phase 3: Advanced Observability
- [ ] Integration of "System Health" metrics (Latency, Error Rates, Cost).
- [ ] Real-time Alerting (Drift detection, deployment failures).

---

## 🧠 Key Design Principles
*   **Data-Driven Progress**: Progress is measured by task completion, not just time elapsed.
*   **Role-Centric**: The UI must represent the different lenses of the organization (Business $\rightarrow$ Engineer).
*   **Operational Control**: The system must be "actionable"—not just showing status, but enabling the next step in the workflow.
