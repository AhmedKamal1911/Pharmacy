import { Routes, Route } from "react-router";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import CustomersPage from "@/pages/customers-page";
import SuppliersPage from "./pages/suppliers-page";
import PurchasesPage from "./pages/purchases-page";
import PurchaseInvoicePage from "./pages/purchase-invoice-page";
import AddPurchasePage from "./pages/add-purchase-page";
import EditPurchasePage from "./pages/edit-purchase-page";
import SupplierPurchasesPage from "./pages/supplier-purchases-page";

// Placeholder components
const Home = () => (
  <div className=" text-lg">مرحباً بك في الصيدلية - نظرة عامة</div>
);
const About = () => <div className=" text-lg">عن نظام إدارة الصيدلية v1.0</div>;
const Settings = () => <div className=" text-lg">إعدادات الحساب والنظام</div>;
const Inventory = () => <div className=" text-lg">قائمة الأدوية والمخزون</div>; // Added

function App() {
  return (
    <Routes>
      {/* Dashboard Protected Area */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />{" "}
        {/* Matches Sidebar */}
        <Route path="/customers" element={<CustomersPage />} />{" "}
        <Route path="/suppliers" element={<SuppliersPage />} />{" "}
        <Route
          path="/suppliers/:supplierId/purchases"
          element={<SupplierPurchasesPage />}
        />{" "}
        {/* مسارات المشتريات */}
        <Route path="/purchases" element={<PurchasesPage />} />{" "}
        <Route path="/purchases/new" element={<AddPurchasePage />} />{" "}
        <Route path="/purchases/:id" element={<PurchaseInvoicePage />} />{" "}
        <Route path="/purchases/:id/edit" element={<EditPurchasePage />} />{" "}
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
