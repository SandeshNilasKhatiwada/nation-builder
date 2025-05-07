"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPerson, updatePeople } from "@/services/people";
import { UserForm } from "@/components/UserForm";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getPerson(id as string);
      setUser(res.data.attributes);
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (data: any) => {
    await updatePeople(id as string, data);
    router.push("/people/list");
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <UserForm initialData={user} onSubmit={handleSubmit} />
    </div>
  );
}
