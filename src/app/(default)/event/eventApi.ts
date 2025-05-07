import axios from "axios";

export interface EventData {
  id?: string;
  content: string;
  start_at: string;
  venue_name: string;
  contact_email: string;
  contact_name: string;
  contact_phone_number: string;
  user_ticket_price_in_cents: number;
  user_ticket_purchase_url: string;
  attending_count?: number;
  capacity_count?: number;
  private?: boolean;
  time_zone?: string;
  auto_response_subject?: string;
  auto_response_content?: string;
  auto_response_broadcaster_id?: number;
}

export const createEvent = async (event: EventData) => {
  try {
    const formattedStartAt = new Date(event.start_at).toISOString();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    const eventPayload = {
      data: {
        type: "events",
        attributes: {
          content: event.content,
          start_at: formattedStartAt,
          venue_name: event.venue_name,
          contact_email: event.contact_email,
          contact_name: event.contact_name,
          contact_phone_number: event.contact_phone_number,
          user_ticket_price_in_cents: Number(event.user_ticket_price_in_cents),
          user_ticket_purchase_url: event.user_ticket_purchase_url,
          attending_count: event.attending_count ?? 0,
          capacity_count: event.capacity_count ?? 100,
          private: event.private ?? false,
          time_zone: event.time_zone ?? "UTC",
          auto_response_subject:
            event.auto_response_subject ?? "Thank you for RSVP-ing.",
          auto_response_content:
            event.auto_response_content ??
            "We are excited to have you join us!",
          auto_response_broadcaster_id:
            event.auto_response_broadcaster_id ?? 123,
        },
        relationships: {
          page: {
            data: {
              type: "pages",
              "temp-id": "new-id",
              method: "create",
            },
          },
        },
      },
      included: [
        {
          type: "pages",
          "temp-id": "new-id",
          attributes: {
            site_id: "1",
            author_id: "1",
            external_id: `event-${timestamp}`,
            slug: `event-${timestamp}`,
            status: "unlisted",
            name: "Page Name",
            headline: "Page headline",
            title: "Page Title",
            excerpt: "Page excerpt...",
            page_type_name: "Basic",
          },
        },
      ],
    };

    console.log("Sending payload:", JSON.stringify(eventPayload, null, 2));

    const response = await axios.post(
      "/api/nationbuilder/events",
      eventPayload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Event creation failed:", error);
    throw error;
  }
};

export const getAllEvents = async () => {
  try {
    const response = await axios.get("/api/nationbuilder/events", {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Fetching all events failed:", error);
    throw error;
  }
};

export const getEventById = async (id: string) => {
  try {
    const response = await axios.get(`/api/nationbuilder/events/${id}`, {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Fetching event with ID ${id} failed:`, error);
    throw error;
  }
};

export const deleteEvent = async (id: string) => {
  try {
    const response = await axios.delete(`/api/nationbuilder/events/${id}`, {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Deleting event with ID ${id} failed:`, error);
    throw error;
  }
};

export const updateEvent = async (
  id: string,
  updatedData: Partial<EventData>
) => {
  try {
    const payload = {
      data: {
        type: "events",
        id,
        attributes: {
          ...(updatedData.content && { content: updatedData.content }),
          ...(updatedData.start_at && {
            start_at: new Date(updatedData.start_at).toISOString(),
          }),
          ...(updatedData.venue_name && { venue_name: updatedData.venue_name }),
          ...(updatedData.contact_email && {
            contact_email: updatedData.contact_email,
          }),
          ...(updatedData.contact_name && {
            contact_name: updatedData.contact_name,
          }),
          ...(updatedData.contact_phone_number && {
            contact_phone_number: updatedData.contact_phone_number,
          }),
          ...(updatedData.user_ticket_price_in_cents !== undefined && {
            user_ticket_price_in_cents: Number(
              updatedData.user_ticket_price_in_cents
            ),
          }),
          ...(updatedData.user_ticket_purchase_url && {
            user_ticket_purchase_url: updatedData.user_ticket_purchase_url,
          }),
        },
      },
    };

    const response = await axios.patch(
      `/api/nationbuilder/events/${id}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Updating event with ID ${id} failed:`, error);
    throw error;
  }
};
