"use client";
import { useState, useEffect } from "react";
import { createDonation, DonationData } from "./donationApi";
import axios from "axios";
import Layout from "@/components/Layout";

export default function DonationForm() {
  const generateRandomOrderId = () => {
    return "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const [formData, setFormData] = useState<DonationData>({
    actblue_order_number: generateRandomOrderId(),
    amount_in_cents: 100,
    first_name: "",
    last_name: "",
    email: "",
    is_private: false,
    is_corporate_contribution: false,
    send_donor_receipt: true,
  });

  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      actblue_order_number: generateRandomOrderId(),
      amount_in_cents: 100,
      first_name: "",
      last_name: "",
      email: "",
      is_private: false,
      is_corporate_contribution: false,
      send_donor_receipt: true,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "amount_in_cents"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newDonation = await createDonation(formData);
      setDonations((prev) => [...prev, newDonation]);
      resetForm();
      window.location.reload();
    } catch (error: any) {
      console.error(
        "Error creating donation:",
        error?.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      await axios.delete(`/api/nationbuilder/donations/${id}`);
      setDonations((prev) => prev.filter((donation) => donation.id !== id));
    } catch (error) {
      console.error("Error deleting donation:", error);
    }
  };

  const handleUpdate = async (id: string, updatedData: DonationData) => {
    if (!id) return;
    try {
      const response = await axios.patch(`/api/nationbuilder/donations/${id}`, {
        data: {
          type: "donations",
          id: id,
          attributes: updatedData,
        },
      });
      const updatedDonation = response.data.data;
      setDonations((prev) =>
        prev.map((donation) =>
          donation.id === updatedDonation.id ? updatedDonation : donation
        )
      );
    } catch (error) {
      console.error("Error updating donation:", error);
    }
  };

  const handleGetAll = async () => {
    try {
      const response = await axios.get("/api/nationbuilder/donations");
      setDonations(response.data.data || []);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const handleGetById = async (id: string) => {
    if (!id) return;
    try {
      const response = await axios.get(`/api/nationbuilder/donations/${id}`);
      const donation = response.data.data;
      setFormData(donation.attributes || {});
    } catch (error) {
      console.error("Error fetching donation:", error);
    }
  };

  useEffect(() => {
    handleGetAll();
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Create Donation</h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 border p-4 rounded shadow"
        >
          <input
            name="actblue_order_number"
            placeholder="Order Number"
            value={formData.actblue_order_number}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            name="amount_in_cents"
            placeholder="Amount in cents"
            type="number"
            value={formData.amount_in_cents}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            name="email"
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        <div className="mt-8">
          <button
            onClick={handleGetAll}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Get All Details
          </button>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Donations List</h2>
        <ul className="space-y-2">
          {Array.isArray(donations) &&
            donations.map((donation) => {
              const attributes = donation.attributes || {};
              return (
                <li key={donation.id} className="border p-4 rounded shadow">
                  <p>
                    <strong>Name:</strong> {attributes.first_name || "N/A"}{" "}
                    {attributes.last_name || ""}
                  </p>
                  <p>
                    <strong>Email:</strong> {attributes.email || "N/A"}
                  </p>
                  <p>
                    <strong>Amount:</strong> $
                    {attributes.amount_in_cents
                      ? (attributes.amount_in_cents / 100).toFixed(2)
                      : "0.00"}
                  </p>
                  <button
                    onClick={() => handleGetById(donation.id)}
                    className="text-blue-600 hover:underline mt-2"
                  >
                    Get By ID
                  </button>
                  <button
                    onClick={() => handleDelete(donation.id)}
                    className="text-red-600 hover:underline mt-2 ml-2"
                  >
                    Delete
                  </button>
                  {/* <button
                    onClick={() =>
                      handleUpdate(donation.id, {
                        ...attributes,
                        amount_in_cents: 5000,
                      })
                    }
                    className="text-yellow-600 hover:underline mt-2 ml-2"
                  >
                    Update
                  </button> */}
                </li>
              );
            })}
        </ul>
      </div>
    </Layout>
  );
}
