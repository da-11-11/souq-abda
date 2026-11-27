import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import Home from "@/pages/Home";
import AddProduct from "@/pages/AddProduct";
import SellerLogin from "@/pages/SellerLogin";
import SellerRegister from "@/pages/SellerRegister";
import SellerDashboard from "@/pages/SellerDashboard";
import AdminSellerApplications from "@/pages/AdminSellerApplications";
import NotFound from "@/pages/NotFound";

const ADMIN_EMAIL = "dawoodrababh2008@gmail.com";

function AdminRoute() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/");
  }, [loading, isAdmin, navigate]);

  if (loading || !isAdmin) return <div className="flex min-h-screen items-center justify-center bg-orange-50 text-primary" dir="rtl">جارٍ التحقق من صلاحية المدير...</div>;
  return <AdminSellerApplications />;
}

export default function App() {
  return <Switch><Route path="/" component={Home}/><Route path="/add-product" component={AddProduct}/><Route path="/register-seller" component={SellerRegister}/><Route path="/seller/login" component={SellerLogin}/><Route path="/seller-login" component={SellerLogin}/><Route path="/seller/dashboard" component={SellerDashboard}/><Route path="/seller-dashboard" component={SellerDashboard}/><Route path="/admin/seller-applications" component={AdminRoute}/><Route path="/admin" component={AdminRoute}/><Route component={NotFound}/></Switch>;
}
