import { useEffect, useState } from "react";
import { getTrails } from "../services/trailService.js";
import TrailMaps from "./TrailMaps.jsx";

const Dashboard = () => {
  const [trails, setTrails] = useState([]);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const data = await getTrails();
        setTrails(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchTrails();
  }, []);

  const filteredTrails = trails.filter((trail) =>
    trail.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitReview = (e) => {
    e.preventDefault();

    console.log({
      trailId: selectedTrail?._id,
      rating,
      comment,
    });

    setRating(0);
    setComment("");
  };

  return (
    <main style={{ padding: "1.5rem", backgroundColor: "#f4f7f4" }}>
      {/* Search */}
      <section style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter Trail Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={inputStyle}
        />

        <button style={buttonStyle}>Search</button>
      </section>

 

      {/* Trail name above map */}
      <section style={cardStyle}>
        <h2>Trail Name: {selectedTrail?.name || "No trail selected yet"}</h2>
      </section>

      {/* Mmap section and information */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ height: "300px", border: "1px solid #999" }}>
          <TrailMaps
            trails={selectedTrail ? [selectedTrail] : filteredTrails}
            setSelectedTrail={setSelectedTrail}
          />
        </div>

        <div style={cardStyle}>
          <h2>Info</h2>
          <p>
            <strong>Location:</strong>{" "}
            {selectedTrail?.location || "No trail selected"}
          </p>
          <p>
            <strong>Description:</strong>{" "}
            {selectedTrail?.description || "Trail details will appear here."}
          </p>
        </div>
      </section>

      {/* PHOTOS */}
      <section style={{ ...cardStyle, minHeight: "180px", marginBottom: "1rem" }}>
        <h2>Photos</h2>
        <p>Trail photos will display here.</p>
      </section>

      {/* REVIEWS HEADER */}
      <section style={cardStyle}>
        <h2>Reviews / Comments</h2>
      </section>

      {/* Cmment section*/}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 1fr",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <form onSubmit={handleSubmitReview} style={cardStyle}>
          <div style={{ marginBottom: "1rem" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                style={{
                  fontSize: "1.7rem",
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

          <textarea
            placeholder="Leave your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              width: "100%",
              minHeight: "100px",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <button
            type="submit"
            disabled={!selectedTrail || !comment || rating === 0}
            style={{
              ...buttonStyle,
              marginTop: "1rem",
              width: "100%",
              backgroundColor:
                !selectedTrail || !comment || rating === 0 ? "#999" : "#2e7d32",
            }}
          >
            Leave a Review
          </button>
        </form>

        <aside style={cardStyle}>
          <div
            style={{
              height: "90px",
              border: "1px solid #999",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            User photos
          </div>

          <button style={{ ...buttonStyle, width: "100%" }}>
            Upload Photo
          </button>

          <button
            style={{
              ...buttonStyle,
              width: "100%",
              marginTop: "1rem",
              backgroundColor: "#b00020",
            }}
          >
            Delete Review
          </button>
        </aside>
      </section>
    </main>
  );
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #999",
};

const buttonStyle = {
  padding: "0.75rem 1rem",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#2e7d32",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const cardStyle = {
  backgroundColor: "white",
  padding: "1rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

export default Dashboard;