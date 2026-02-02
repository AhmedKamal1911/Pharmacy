---
trigger: always_on
---

# 📜 Ultra Pharma: Official Development Rules

## 🌍 Language & UI (Arabic/RTL Only)

- **Hard Rule:** ALL UI text, labels, buttons, and placeholders **MUST be in Arabic**.
- **Direction:** Layout is **RTL**. Use Tailwind logical properties:
- `ps-*` (padding-start) instead of `pl-*`
- `me-*` (margin-end) instead of `mr-*`
- `start-0` instead of `left-0`

- **Componentry:** Never use native HTML tags (`input`, `button`). Always use **shadcn/ui** primitives from `@/components/ui/` and the tables wants dynamic data with data table component.

## 🏗️ Architecture & Clean Code

- **Separation of Concerns:** Components handle "Display" only. Business logic and data fetching must be abstracted.
- **Single Responsibility:** One component = one job.
- **Clean Code:** Use the existing `cn()` utility in `src/lib/utils.ts` for all conditional class merging.
- **No Browser APIs:** Avoid direct use of `window`, `localStorage`, or `document` to maintain **Electron-readiness**.

## 📁 Strict Folder Structure

```text
src/
 ├─ app/                 # Providers and Global Layout
 ├─ components/
 │   ├─ ui/              # shadcn primitives (Input, Button, etc.)
 │   └─ shared/          # Reusable UI across multiple features
 ├─ features/            # Domain-driven modules (e.g., sales, inventory)
 │   └─ {feature}/
 │       ├─ api/         # Facade Layer (Services, Hooks, Query Keys)
 │       ├─ components/  # Feature-specific UI
 │       ├─ types/       # Domain-specific TS interfaces
 │       └─ utils/       # Feature-specific logic
 ├─ lib/                 # Core configs & api-client.ts
 ├─ routes/              # Routed views we use tanstack router
 └─ types/               # Centralized global types

```

## 🌉 The Data Facade (Electron-Ready)

All data operations must use a transport abstraction to allow seamless migration to Electron IPC.

**1. The Transport (`src/lib/api-client.ts`):**

```typescript
export const apiClient = async <T>(channel: string, data?: any): Promise<T> => {
  // Current: Web Fetch | Future: window.electron.ipcRenderer.invoke(channel, data)
  const response = await fetch(`/api/${channel}`, {
    method: data ? "POST" : "GET",
    body: JSON.stringify(data),
  });
  return response.json();
};
```

**2. Feature Service (`src/features/{name}/api/{name}.service.ts`):**

```typescript
import { apiClient } from "@/lib/api-client";
export const getProducts = () => apiClient<Product[]>("get-products");
```

## 🔑 Scalable Query Keys

Each feature must use a **Query Key Factory** to prevent typos and manage cache effectively.

**Example (`src/features/inventory/api/query-keys.ts`):**

```typescript
export const inventoryKeys = {
  all: ["inventory"] as const,
  lists: () => [...inventoryKeys.all, "list"] as const,
  list: (filters: any) => [...inventoryKeys.lists(), { filters }] as const,
  details: () => [...inventoryKeys.all, "detail"] as const,
  detail: (id: string) => [...inventoryKeys.details(), id] as const,
};
```

## 🧩 Component Logic & Size

- **Hooks:** Wrap all `useQuery` and `useMutation` in custom hooks inside the feature's `api/` folder.
- **Complexity Rule:**
- If a component has >3 sub-parts or >200 lines, create a folder named after the component with an `index.tsx`.
- If a sub-component is only used within its parent, keep it in the same file or the component's folder.
