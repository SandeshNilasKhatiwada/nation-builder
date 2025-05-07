import axios from "axios";

interface UserData {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    sex: string;
    is_volunteer: boolean;
}

export const createPeople = async (user: UserData) => {
    try {
        const response = await axios.post(
            "/api/nationbuilder/signups",
            {
                data: {
                    type: "signups",
                    attributes: {
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        phone_number: user.phone_number,
                        sex: user.sex,
                        is_volunteer: user.is_volunteer,
                    },
                },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Create failed", error);
    }
};

export const listPeople = async () => {
    try {
        const response = await axios.get("/api/nationbuilder/signups");
        return response.data;
    } catch (error) {
        console.error("Fetch failed", error);
    }
};

export const updatePeople = async (id: string, user: Partial<UserData>) => {
    try {
        const response = await axios.put(
            `/api/nationbuilder/signups/${id}`,
            {
                data: {
                    type: "signups",
                    id: id,
                    attributes: user,
                },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Update failed", error);
    }
};

export const deletePeople = async (id: string) => {
    try {
        const response = await axios.delete(`/api/nationbuilder/signups/${id}`);
        return response.data;
    } catch (error) {
        console.error("Delete failed", error);
    }
};

export const getPerson = async (id: string) => {
    try {
        const response = await axios.get(`/api/nationbuilder/signups/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
    }
};