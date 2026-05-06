const API_BASE_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

const commentService = {
    getCommentsByTrailId: async (trailId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/trails/${trailId}/comments`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.err || "Failed to fetch comments");
            }

            return data;
        } catch (error) {
            console.error(`Error fetching comments for trail ${trailId}:`, error.message);
            throw error;
        }
    },
    createComment: async (trailId, commentData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/trails/${trailId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(commentData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.err || "Failed to create comment");
            }

            return data;
        } catch (error) {
            console.error(`Error creating comment for trail ${trailId}:`, error.message);
            throw error;
        }
    }
};

export default commentService;