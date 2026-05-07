import { useEffect, useState } from "react";
import { getTrails } from "../services/trailService.js";
import TrailMaps from "../components/TrailMaps.jsx";

const TrailIndex = () => {
  const [trails, setTrails] = useState([]);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const data = await getTrails();
        setTrails(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTrails();
  }, []);

  const filteredTrails = trails.filter((trail) =>
    trail.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    console.log({
      trailId: selectedTrail._id,
      comment,
      rating,
    });

    setComment("");
    setRating(0);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "35%", overflowY: "auto", padding: "1rem" }}>
        <h2>Trails</h2>

        <input
          type="text"
          placeholder="Search for a trail..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        {filteredTrails.map((trail) => (
          <div
            key={trail._id}
            onClick={() => setSelectedTrail(trail)}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              cursor: "pointer",
              borderRadius: "8px",
              background: selectedTrail?._id === trail._id ? "#dff6e4" : "white",
            }}
          >
            <h3>{trail.name}</h3>
            <p>{trail.location}</p>
          </div>
        ))}

        {selectedTrail && (
          <section
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            <h2>{selectedTrail.name}</h2>
            <p>{selectedTrail.location}</p>
            <p>{selectedTrail.description}</p>

            <h3>Rate this trail</h3>

            <div style={{ marginBottom: "1rem" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    fontSize: "1.5rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: star <= rating ? "#f5b301" : "#ccc",
                  }}
                >
                  ★
                </button>
              ))}
            </div>

            <form onSubmit={handleCommentSubmit}>
              <textarea
                placeholder="Leave a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "90px",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  marginBottom: "1rem",
                }}
              />

              <button
                type="submit"
                disabled={!comment || rating === 0}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: !comment || rating === 0 ? "#999" : "#2e7d32",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Submit Review
              </button>
            </form>
          </section>
        )}
      </div>

      <TrailMaps trails={filteredTrails} setSelectedTrail={setSelectedTrail} />
    </div>
  );
};

export default TrailIndex;