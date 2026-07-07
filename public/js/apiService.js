const SERVER_URL = "https://dfxstudio-backend-api-v2-1.onrender.com";
const API_BASE_URL = `${SERVER_URL}/api`;

const ApiService = {

    async getStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/Stats`);

            if (!response.ok) {
                throw new Error("Failed to load stats");
            }

            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async getServices() {
        try {
            const response = await fetch(`${API_BASE_URL}/Service`);

            if (!response.ok) {
                throw new Error("Failed to load services");
            }

            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    async getGallery() {
        const response = await fetch(`${API_BASE_URL}/Gallery`);
        return await response.json();
    },
    async getReviews() {
    try {

        const response = await fetch(`${API_BASE_URL}/Review`);

        if (!response.ok)
            throw new Error("Failed to load reviews");

        return await response.json();

    } catch (err) {

        console.error(err);
        return null;

    }
    
},
async postBooking(data) {
    try {

        const response = await fetch(`${API_BASE_URL}/Booking`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Booking submission failed");
        }

        return await response.json();

    } catch (error) {

        console.error(error);
        return null;

    }
}
};