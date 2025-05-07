"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listPeople, deletePeople } from "@/services/people";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await listPeople();
      const people = res?.data?.map((user: any) => ({
        id: user.id,
        ...user.attributes,
      }));
      setUsers(people);
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    await deletePeople(id);
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">User List</h1>
      <Link
        href="/people/add"
        className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Add User
      </Link>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center">
              <td className="border px-4 py-2">
                {user.first_name} {user.last_name}
              </td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.phone_number}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => router.push(`/people/edit?id=${user.id}`)}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
