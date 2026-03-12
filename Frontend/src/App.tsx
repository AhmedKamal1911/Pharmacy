import { Routes, Route } from "react-router";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import CustomersPage from "@/pages/customers-page";
import SalesPage from "@/pages/sales-page";
import SuppliersPage from "./pages/suppliers-page";
import PurchasesPage from "./pages/purchases-page";
import PurchaseInvoicePage from "./pages/purchase-invoice-page";
import AddPurchasePage from "./pages/add-purchase-page";
import EditPurchasePage from "./pages/edit-purchase-page";
import SupplierTransactionsPage from "./pages/supplier-transactions-page";
import SupplierPurchasesPage from "./pages/supplier-purchases-page";
import BestSellingPage from "@/features/sales/pages/best-selling-page";
import LowStockPage from "@/pages/low-stock-page";
import ExpiringPage from "@/pages/expiring-page";
import StockPage from "@/pages/stock-page";
import InvoicesPage from "@/features/sales/pages/invoices-page";
import { ReturnsPage } from "@/pages/returns-page";
import CategoriesPage from "@/pages/categories-page";
import { MedicinesPage } from "@/pages/medicines-page";

// Placeholder components
const About = () => <div className=" text-lg">عن نظام إدارة الصيدلية v1.0</div>;
const Settings = () => <div className=" text-lg">إعدادات الحساب والنظام</div>;
const Inventory = () => <div className=" text-lg">قائمة الأدوية والمخزون</div>; // Added

function App() {
  return (
    <Routes>
      {/* Dashboard Protected Area */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<SalesPage />} />{" "}
        {/* Changed to SalesPage as home */}
        <Route path="/categories" element={<CategoriesPage />} />{" "}
        {/* Added categories route */}
        <Route path="/medicines" element={<MedicinesPage />} />{" "}
        {/* Added medicines route */}
        <Route path="/inventory" element={<Inventory />} />{" "}
        {/* Matches Sidebar */}
        <Route path="/sales" element={<InvoicesPage />} />{" "}
        {/* Added sales route */}
        <Route path="/sales/best-selling" element={<BestSellingPage />} />{" "}
        <Route path="/low-stock" element={<LowStockPage />} />{" "}
        <Route path="/expiring-stock" element={<ExpiringPage />} />{" "}
        <Route path="/stock" element={<StockPage />} />{" "}
        <Route path="/sales/invoices" element={<InvoicesPage />} />{" "}
        <Route path="/customers" element={<CustomersPage />} />{" "}
        <Route path="/suppliers" element={<SuppliersPage />} />{" "}
        <Route
          path="/suppliers/:supplierId/purchases"
          element={<SupplierPurchasesPage />}
        />{" "}
        {/* مسارات المعاملات المالية */}
        <Route
          path="/suppliers/:supplierId/transactions"
          element={<SupplierTransactionsPage />}
        />{" "}
        {/* مسارات المشتريات */}
        <Route path="/purchases" element={<PurchasesPage />} />{" "}
        <Route path="/purchases/new" element={<AddPurchasePage />} />{" "}
        <Route path="/purchases/:id" element={<PurchaseInvoicePage />} />{" "}
        <Route path="/purchases/:id/edit" element={<EditPurchasePage />} />{" "}
        <Route path="/returns" element={<ReturnsPage />} />{" "}
        {/* Matches Sidebar */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
      </Route>

      {/* Public Routes */}
      <Route path="/login" element={<div>صفحة تسجيل الدخول</div>} />

      {/* Catch-all 404 */}
      <Route
        path="*"
        element={<h1 className="text-center p-10">404 - الصفحة غير موجودة</h1>}
      />
    </Routes>
  );
}

export default App;
