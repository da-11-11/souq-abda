import type { Product } from "@/data";
export type SellerApplication = { id:string; fullName:string; projectName:string; whatsapp:string; category:string; description:string; createdAt:string; status:"pending"|"approved"|"rejected"; accessToken:string };
export type SellerProfile = { fullName:string; projectName:string; whatsapp:string; category:string; description:string; accessToken:string };
const keys={applications:"souq-abda-applications",products:"souq-abda-products",profile:"souq-abda-seller-profile"};
function read<T>(key:string,fallback:T):T { if(typeof window==="undefined") return fallback; try { const value=localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; } }
function write<T>(key:string,value:T){ if(typeof window!=="undefined") localStorage.setItem(key,JSON.stringify(value)); }
export const getApplications=()=>read<SellerApplication[]>(keys.applications,[]);
export function addApplication(value:Omit<SellerApplication,"id"|"createdAt"|"status"|"accessToken">){const item:SellerApplication={...value,id:crypto.randomUUID(),createdAt:new Date().toISOString(),status:"pending",accessToken:""};write(keys.applications,[item,...getApplications()]);return item;}
export function updateApplication(id:string,status:SellerApplication["status"]){const value=getApplications().map(item=>item.id===id?{...item,status,accessToken:status==="approved"?(item.accessToken||`AB${Math.random().toString(36).slice(2,7).toUpperCase()}`):item.accessToken}:item);write(keys.applications,value);return value;}
export const getProducts=()=>read<Product[]>(keys.products,[]);
export function addProduct(value:Product){write(keys.products,[value,...getProducts()]);}
export const getProfile=()=>read<SellerProfile|null>(keys.profile,null);
export const saveProfile=(value:SellerProfile)=>write(keys.profile,value);
export function clearProfile(){if(typeof window!=="undefined")localStorage.removeItem(keys.profile);}
