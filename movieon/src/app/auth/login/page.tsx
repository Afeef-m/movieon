import { Suspense } from "react";
import LoginPageClient from "./loginClient";
export const dynamic = "force-dynamic";

export default function LoginPage(){
  return(
   <Suspense fallback={<div className="p-6 text-gray-400">Loading bookings...</div>}>
<LoginPageClient />
   </Suspense>
  )
}