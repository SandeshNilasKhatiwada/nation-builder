// /api/v2/pages
import axios from "axios";

export const getAllPages = async () => {
    try {
        const response = await axios.get(
            "/api/nationbuilder/pages"
        );
        const data = response.data

        return data;

    } catch (error) {
        console.log(error);
    }
}