import { Routes, Route } from "react-router";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import CustomersPage from "@/pages/customers-page";

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
