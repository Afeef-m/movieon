"use client";

import { useEffect, useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function ProtectedRoute({
  children,
  allowedRoles = ["user", "admin", "manager"],
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { isAuthenticated, user, hydrated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const redirectTo = useMemo(() => {
    const q = searchParams.toString();
    return pathname + (q ? `?${q}` : "");
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!hydrated) return;

    if (!isAuthenticated || !user) {
      router.replace(
        `/auth/login?redirect=${encodeURIComponent(redirectTo)}`
      );
      return;
    }

    if (user.blocked) {
      router.replace("/");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.replace("/");
    }
  }, [hydrated, isAuthenticated, user, router, redirectTo, allowedRoles]);

  if (!hydrated) return null;
  if (!isAuthenticated || !user) return null;
  if (!allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
