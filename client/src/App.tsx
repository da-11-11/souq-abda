import { Route,Switch } from "wouter";
import Home from "@/pages/Home";
import AddProduct from "@/pages/AddProduct";
import SellerLogin from "@/pages/SellerLogin";
import SellerRegister from "@/pages/SellerRegister";
import SellerDashboard from "@/pages/SellerDashboard";
import AdminSellerApplications from "@/pages/AdminSellerApplications";
import NotFound from "@/pages/NotFound";
export default function App(){return <Switch><Route path="/" component={Home}/><Route path="/add-product" component={AddProduct}/><Route path="/register-seller" component={SellerRegister}/><Route path="/seller/login" component={SellerLogin}/><Route path="/seller-login" component={SellerLogin}/><Route path="/seller-dashboard" component={SellerDashboard}/><Route path="/admin/seller-applications" component={AdminSellerApplications}/><Route component={NotFound}/></Switch>}
