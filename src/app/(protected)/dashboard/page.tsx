"use client";
import { useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const user = useUser();
  return (
    <>
      <h1>{user.user?.firstName}</h1>
    </>
  );
}
