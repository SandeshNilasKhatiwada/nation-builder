"use client";

import { useRouter } from "next/navigation";
import { UserForm } from "@/components/UserForm";
import { createPeople } from "@/services/people";

export default function AddUserPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    await createPeople(data);
    router.push("/people/list");
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Add New User</h1>
      <UserForm onSubmit={handleSubmit} />
    </div>
  );
}
