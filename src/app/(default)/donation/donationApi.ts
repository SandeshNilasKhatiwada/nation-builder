import axios from "axios";

export interface DonationData {
  id?: string;
  actblue_order_number?: string;
  amount_in_cents: number;
  canceled_at?: string;
  check_number?: string;
  donation_tracking_code_id?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  is_private?: boolean;
  is_corporate_contribution?: boolean;
  email: string;
  employer?: string;
  failed_at?: string;
  mailing_id?: string;
  membership_id?: string;
  note?: string;
  occupation?: string;
  page_id?: string;
  payment_type_id?: string;
  payment_type_name?: string;
  pledge_id?: string;
  signup_id?: string;
  send_donor_receipt?: boolean;
  billing_address_attributes?: any;
  work_address_attributes?: any;
}

// CREATE Donation
export const createDonation = async (donation: DonationData) => {
  try {
    const donationPayload = {
      data: {
        type: "donations",
        attributes: {
          actblue_order_number: donation.actblue_order_number,
          amount_in_cents: donation.amount_in_cents,
          canceled_at: donation.canceled_at,
          check_number: donation.check_number,
          donation_tracking_code_id: donation.donation_tracking_code_id,
          first_name: donation.first_name,
          middle_name: donation.middle_name,
          last_name: donation.last_name,
          is_private: donation.is_private ?? false,
          is_corporate_contribution:
            donation.is_corporate_contribution ?? false,
          email: donation.email,
          employer: donation.employer,
          failed_at: donation.failed_at,
          mailing_id: donation.mailing_id,
          membership_id: donation.membership_id,
          note: donation.note,
          occupation: donation.occupation,
          page_id: donation.page_id,
          payment_type_id: donation.payment_type_id,
          payment_type_name: donation.payment_type_name,
          pledge_id: donation.pledge_id,
          signup_id: donation.signup_id,
          send_donor_receipt: donation.send_donor_receipt ?? false,
          billing_address_attributes: donation.billing_address_attributes,
          work_address_attributes: donation.work_address_attributes,
        },
        relationships: {
          payment_type: {
            data: {
              type: "payment_types",
              id: "1",
            },
          },
        },
      },
    };

    const response = await axios.post(
      "/api/nationbuilder/donations",
      donationPayload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const { id, attributes } = response.data.data;
    return { id, ...attributes };
  } catch (error) {
    console.error("Donation creation failed:", error);
    throw error;
  }
};

// GET ALL Donations
export const getAllDonations = async () => {
  try {
    const response = await axios.get("/api/nationbuilder/donations", {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Fetching all donations failed:", error);
    throw error;
  }
};

// GET Donation by ID
export const getDonationById = async (id: string) => {
  try {
    const response = await axios.get(`/api/nationbuilder/donations/${id}`, {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Fetching donation with ID ${id} failed:`, error);
    throw error;
  }
};

// UPDATE Donation
export const updateDonation = async (
  id: string,
  updatedData: Partial<DonationData>
) => {
  try {
    const payload = {
      data: {
        type: "donations",
        id,
        attributes: {
          ...(updatedData.actblue_order_number && {
            actblue_order_number: updatedData.actblue_order_number,
          }),
          ...(updatedData.amount_in_cents !== undefined && {
            amount_in_cents: updatedData.amount_in_cents,
          }),
          ...(updatedData.canceled_at && {
            canceled_at: updatedData.canceled_at,
          }),
          ...(updatedData.check_number && {
            check_number: updatedData.check_number,
          }),
          ...(updatedData.donation_tracking_code_id && {
            donation_tracking_code_id: updatedData.donation_tracking_code_id,
          }),
          ...(updatedData.first_name && { first_name: updatedData.first_name }),
          ...(updatedData.middle_name && {
            middle_name: updatedData.middle_name,
          }),
          ...(updatedData.last_name && { last_name: updatedData.last_name }),
          ...(updatedData.is_private !== undefined && {
            is_private: updatedData.is_private,
          }),
          ...(updatedData.is_corporate_contribution !== undefined && {
            is_corporate_contribution: updatedData.is_corporate_contribution,
          }),
          ...(updatedData.email && { email: updatedData.email }),
          ...(updatedData.employer && { employer: updatedData.employer }),
          ...(updatedData.failed_at && { failed_at: updatedData.failed_at }),
          ...(updatedData.mailing_id && { mailing_id: updatedData.mailing_id }),
          ...(updatedData.membership_id && {
            membership_id: updatedData.membership_id,
          }),
          ...(updatedData.note && { note: updatedData.note }),
          ...(updatedData.occupation && { occupation: updatedData.occupation }),
          ...(updatedData.page_id && { page_id: updatedData.page_id }),
          ...(updatedData.payment_type_id && {
            payment_type_id: updatedData.payment_type_id,
          }),
          ...(updatedData.payment_type_name && {
            payment_type_name: updatedData.payment_type_name,
          }),
          ...(updatedData.pledge_id && { pledge_id: updatedData.pledge_id }),
          ...(updatedData.signup_id && { signup_id: updatedData.signup_id }),
          ...(updatedData.send_donor_receipt !== undefined && {
            send_donor_receipt: updatedData.send_donor_receipt,
          }),
          ...(updatedData.billing_address_attributes && {
            billing_address_attributes: updatedData.billing_address_attributes,
          }),
          ...(updatedData.work_address_attributes && {
            work_address_attributes: updatedData.work_address_attributes,
          }),
        },
      },
    };

    const response = await axios.patch(
      `/api/nationbuilder/donations/${id}`,
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
    console.error(`Updating donation with ID ${id} failed:`, error);
    throw error;
  }
};

// DELETE Donation
export const deleteDonation = async (id: string) => {
  try {
    const response = await axios.delete(`/api/nationbuilder/donations/${id}`, {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Deleting donation with ID ${id} failed:`, error);
    throw error;
  }
};
