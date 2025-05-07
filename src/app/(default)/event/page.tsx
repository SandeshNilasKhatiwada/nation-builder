"use client";
import React, { useState } from "react";
import {
  FaPen,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaTag,
  FaLink,
  FaTrash,
} from "react-icons/fa";
import {
  createEvent,
  EventData,
  getAllEvents,
  deleteEvent,
  updateEvent,
} from "./eventApi";
import Layout from "@/components/Layout";

const EventCreationPage: React.FC = () => {
  const [event, setEvent] = useState({
    content: "",
    start_at: "",
    venue_name: "",
    contact_email: "",
    contact_name: "",
    contact_phone_number: "",
    user_ticket_price_in_cents: 100,
    user_ticket_purchase_url: "",
  });

  const [showDetails, setShowDetails] = useState(false);
  const [allEvents, setAllEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [editForm, setEditForm] = useState({
    content: "",
    start_at: "",
    venue_name: "",
    contact_email: "",
    contact_name: "",
    contact_phone_number: "",
    user_ticket_price_in_cents: 0,
    user_ticket_purchase_url: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setEvent((prevEvent) => ({
      ...prevEvent,
      [name]: name === "user_ticket_price_in_cents" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    try {
      const response = await createEvent(event);
    } catch (err) {
      setError("Error creating event. Please try again.");
    }
  };

  const handleShowDetails = async (): Promise<void> => {
    const toggling = !showDetails;
    setShowDetails(toggling);

    if (toggling && allEvents.length === 0) {
      setLoading(true);
      setError(null);
      try {
        const events = await getAllEvents();
        setAllEvents(events.data);
      } catch (err) {
        setError("Error fetching event details. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteEvent = async (id: string): Promise<void> => {
    try {
      await deleteEvent(id);
      setAllEvents((prev) => prev.filter((ev) => ev.id !== id));
    } catch (err) {
      setError("Error deleting event. Please try again.");
    }
  };

  const openEditModal = (event: EventData) => {
    setEditingEvent(event);
    setEditForm({
      content: event.attributes?.content || "",
      start_at: event.attributes?.start_at || "",
      venue_name: event.attributes?.venue_name || "",
      contact_email: event.attributes?.contact_email || "",
      contact_name: event.attributes?.contact_name || "",
      contact_phone_number: event.attributes?.contact_phone_number || "",
      user_ticket_price_in_cents:
        event.attributes?.user_ticket_price_in_cents || 0,
      user_ticket_purchase_url:
        event.attributes?.user_ticket_purchase_url || "",
    });
    setShowModal(true);
  };

  const handleModalInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prevForm) => ({
      ...prevForm,
      [name]: name === "user_ticket_price_in_cents" ? Number(value) : value,
    }));
  };

  const saveEdit = async () => {
    if (editingEvent) {
      await handleUpdateEvent(editingEvent.id, editForm);
      setShowModal(false);
      window.location.reload();
    }
  };

  const handleUpdateEvent = async (
    id: string,
    updatedData: typeof editForm
  ): Promise<void> => {
    try {
      const updated = await updateEvent(id, updatedData);
      setAllEvents((prev) => prev.map((ev) => (ev.id === id ? updated : ev)));
    } catch (err) {
      setError("Error updating event. Please try again.");
    }
  };

  const formFields = [
    { label: "Event content", name: "content", icon: <FaPen /> },
    {
      label: "Start Date",
      name: "start_at",
      type: "datetime-local",
      icon: <FaCalendarAlt />,
    },
    { label: "Venue Name", name: "venue_name", icon: <FaMapMarkerAlt /> },
    {
      label: "Contact Email",
      name: "contact_email",
      type: "email",
      icon: <FaEnvelope />,
    },
    { label: "Contact Name", name: "contact_name", icon: <FaPen /> },
    {
      label: "Contact Phone Number",
      name: "contact_phone_number",
      type: "tel",
      icon: <FaPhoneAlt />,
    },
    {
      label: "Ticket Price (in cents)",
      name: "user_ticket_price_in_cents",
      type: "number",
      icon: <FaTag />,
    },
    {
      label: "Ticket Purchase URL",
      name: "user_ticket_purchase_url",
      type: "url",
      icon: <FaLink />,
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            Create Event
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {formFields.map(({ label, name, icon, type = "text" }) => (
                <div key={name} className="flex flex-col">
                  <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    {label}
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                    <div className="mr-3">{icon}</div>
                    <input
                      id={name}
                      name={name}
                      type={type}
                      value={event[name as keyof typeof event]}
                      onChange={handleChange}
                      required
                      className="w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Create Event
            </button>
          </form>

          {error && (
            <p className="text-red-500 mt-4 text-center font-medium">{error}</p>
          )}

          <div className="mt-6">
            <button
              type="button"
              onClick={handleShowDetails}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {loading
                ? "Loading..."
                : showDetails
                ? "Hide Details"
                : "Get All Details"}
            </button>
          </div>

          {showDetails && (
            <div className="mt-6 space-y-6">
              {allEvents.length > 0 ? (
                allEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="bg-gray-100 p-4 rounded-md shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-700">
                      Event ID: {ev.id}
                    </h3>
                    <p className="text-gray-600">
                      content: {ev.attributes?.content || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      Venue: {ev.attributes?.venue_name || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      Contact Name: {ev.attributes?.contact_name || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      Contact Email: {ev.attributes?.contact_email || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      Start Date: {ev.attributes?.start_at || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      Ticket Price: $
                      {ev.attributes?.user_ticket_price_in_cents / 100 || 0}
                    </p>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => openEditModal(ev)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaPen />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">No events found</p>
              )}
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-semibold mb-6">Edit Event</h2>
              <form>
                <div className="space-y-4">
                  {Object.keys(editForm).map((key) => (
                    <div key={key} className="flex flex-col">
                      <label
                        htmlFor={key}
                        className="text-sm font-medium text-gray-600 mb-1"
                      >
                        {key.replace("_", " ").toUpperCase()}
                      </label>
                      <input
                        id={key}
                        name={key}
                        type="text"
                        value={editForm[key as keyof typeof editForm]}
                        onChange={handleModalInput}
                        className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={saveEdit}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-4"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EventCreationPage;
