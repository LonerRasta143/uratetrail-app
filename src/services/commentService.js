const API_BASE_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

const commentService = {
  getCommentsByTrailId: async (trailId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/trail/${trailId}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.err || "Failed to fetch comments");
      }

      return data;
    } catch (error) {
      console.error(`Error fetching comments for trail ${trailId}:`,
        error.message
      );
      throw error;
    }
  },
  deleteComment: async (commentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.err || "Failed to delete comment");
      }

      return data;
    } catch (error) {
      console.error(`Error deleting comment ${commentId}:`, error.message);
      throw error;
    }
  },


  createComment: async (trailId, commentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          trail: trailId,
          ...commentData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.err || "Failed to create comment");
      }

      return data;
    } catch (error) {
      console.error(
        `Error creating comment for trail ${trailId}:`,
        error.message
      );
      throw error;
    }
  },
  updateComment: async (commentId, commentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(commentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.err || "Failed to update comment");
      }

      return data;
    } catch (error) {
      console.error(
        `Error updating comment ${commentId}:`,
        error.message
      );
      throw error;
    }
  },
};

export default commentService;