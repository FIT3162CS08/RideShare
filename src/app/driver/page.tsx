"use client"

import ProtectedRoute from "@/component/ProtectedRoute";

// src/app/user/page.tsx
export default function UserPage() {
  

  return (
    <ProtectedRoute> 
      <main className="p-6">
        <h1 className="text-4xl font-extrabold">User Dashboard</h1>
        <p className="text-xl mt-4">Welcome to the user page.</p>
      </main>
    </ProtectedRoute>
  );
}
