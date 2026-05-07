const API_BASE_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

export const getTrails = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/trails`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.err || "Failed to fetch trails");
    }

    return data;
  } catch (error) {
    console.error("Error fetching trails:", error.message);
    throw error;
  }
};

export const getTrailById = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/trails/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.err || "Failed to fetch trail");
    }

    return data;
  } catch (error) {
    console.error(`Error fetching trail with id ${id}:`, error.message);
    throw error;
  }
};