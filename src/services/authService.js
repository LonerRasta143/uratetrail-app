const API_BASE_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

export const signUp = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/sign-up`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.err || "Failed to sign up");
        }

        localStorage.setItem("token", data.token);
        return data.user;
    } catch (error) {
        console.error("Error during sign-up:", error.message);
        throw error;
    }
};

export const signIn = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/sign-in`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.err || "Failed to sign in");
        }

        localStorage.setItem("token", data.token);
        return data.user;
    } catch (error) {
        console.error("Error during sign-in:", error.message);
        throw error;
    }
};

export const signOut = () => {
    localStorage.removeItem("token");
};

export const getCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.err || "Failed to fetch user");
        }

        return data.user;
    } catch (error) {
        console.error("Error fetching current user:", error.message);
        throw error;
    }
};
