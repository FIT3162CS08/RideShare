"use client";

import { useUser } from "@/context/UserContext";
import Link from "next/link";
import Loading from "./Loading";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();

  if (loading) return Loading();

  if (!user) {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">You need to log in</h1>
        <Link href="/login" className="px-4 py-2 bg-black text-white rounded">
          Go to Login
        </Link>
      </section>
    );
  }

  return <>{children}</>;
}
