import axios from "axios";

export default async function handler(req, res) {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: "Missing authorization code" });
    }

    try {
        const response = await axios.post(
            `https://${process.env.NB_SLUG}.nationbuilder.com/oauth/token`,
            {
                grant_type: "authorization_code",
                client_id: process.env.NEXT_PUBLIC_NB_CLIENT_ID,
                client_secret: process.env.NB_CLIENT_SECRET,
                redirect_uri: process.env.NEXT_PUBLIC_CALLBACKS,
                code: code,
            },
            { headers: { "Content-Type": "application/json" } }
        );

        // Save token in session (or use NextAuth)
        res.setHeader(
            "Set-Cookie",
            `access_token=${response.data.access_token}; Path=/; HttpOnly`
        );
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "OAuth authentication failed" });
    }
}
