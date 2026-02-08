import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DirectionProvider } from "./components/ui/direction.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <DirectionProvider dir="rtl">
        <BrowserRouter>
          <App />
          <Toaster richColors />
        </BrowserRouter>
      </DirectionProvider>
    </QueryClientProvider>
  </StrictMode>,
);
