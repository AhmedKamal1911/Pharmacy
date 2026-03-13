📜 Ultra Pharma: Official Development Rules (v1.2)
🌍 1. UI, Language & Direction
Language: Arabic Only. All UI strings, toasts, and labels must be in Arabic.

Direction: RTL (Right-to-Left).
don't use mr-_ or ml-_ use me-_ or ms-_ instead also with padding
Tailwind Logical Properties: Do NOT use physical directions (left/right). Use logical properties:

ps-_ / pe-_ (Padding Start/End)

ms-_ / me-_ (Margin Start/End)

text-start / text-end

rounded-s-_ / rounded-e-_

inset-inline-start-0 or start-0

Components: Never use native HTML tags. Use shadcn/ui primitives exclusively.

🏗️ 2. Feature-Driven Architecture
We follow a domain-driven module pattern. Pages serve as route entry points, while features hold the logic.

Path Entry: src/pages/

Logic Hub: src/features/{feature-name}/

api/: Custom hooks (useQuery), Query Key factories, and services.

components/: Feature-specific UI components.

types/: Domain TypeScript interfaces.

utils/: Logic specific to the feature.

Shared Hub: src/components/shared/ for layouts and global UI elements.

🚦 3. Routing (React Router v7)
Layouts must use <Outlet /> and be wrapped in necessary Providers (e.g., SidebarProvider).

Navigation must use the Link component or useNavigate hook.

Define routes in App.tsx (or a centralized router file) mapping to components in src/pages/.

🌉 4. The Data Facade (Electron-Ready)
Zero Browser APIs: Do not use fetch or axios inside components.

Transport Layer: All I/O must pass through apiClient(channel, data) in src/lib/api-client.ts.

Query Management: - Wrap all TanStack Query logic in custom hooks.

Use Query Key Factories to manage cache keys.

🛠️ 5. Code Standards
Component Size: Keep components small (< 200 lines). Sub-components should be extracted to the feature's components/ folder.

Utility: Use the cn() utility from src/lib/utils.ts for all conditional class merging.

Strict Typing: No any. Use interfaces for all data structures and component props.

Folder Map Reference
Plaintext
src/
├─ app/ # Global Providers
├─ pages/ # Route entry points (E:\..\src\pages)
├─ features/ # Domain modules
│ └─ {inventory}/
│ ├─ api/ # useGetProducts, inventoryKeys
│ ├─ components/ # MedicineTable, StockAlerts
│ └─ types/ # Product, Category
├─ components/
│ ├─ ui/ # shadcn primitives
│ └─ shared/ # DashboardLayout, Sidebar
├─ lib/ # api-client.ts, utils.ts
└─ types/ # Global TS types
