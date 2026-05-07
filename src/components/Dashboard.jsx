import { useEffect, useState } from "react";
import { getTrails } from "../services/trailService.js";
import TrailMaps from "./TrailMaps.jsx";
import commentService from "../services/commentService.js";
const Dashboard = () => {
const [trails, setTrails] = useState([]);
const [selectedTrail, setSelectedTrail] = useState(null);
const [searchQuery, setSearchQuery] = useState("");
const [rating, setRating] = useState(0);
const [comment, setComment] = useState("");
const [comments, setComments] = useState([]);
const [googlePhotos, setGooglePhotos] = useState([]);
{/* FetchTrail Function*/}
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

{/* FetchComments Function*/}
  useEffect(() => {
  const fetchComments = async () => {
    if (!selectedTrail?._id) return;

    try {
      const data = await commentService.getCommentsByTrailId(selectedTrail._id);
      setComments(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  fetchComments();
}, [selectedTrail]);

  const filteredTrails = trails.filter((trail) =>
    trail.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const fetchGoogleTrailPhotos = async (trailName) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  try {
    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "places.displayName,places.photos",
        },
        body: JSON.stringify({
          textQuery: `${trailName} hiking trail`,
        }),
      }
    );

    const data = await response.json();

    const place = data.places?.[0];

    if (!place?.photos) {
      setGooglePhotos([]);
      return;
    }

    const photoUrls = place.photos.slice(0, 4).map((photo) => {
      return `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=600&key=${apiKey}`;
    });

    setGooglePhotos(photoUrls);
  } catch (error) {
    console.error("Error fetching Google trail photos:", error);
    setGooglePhotos([]);
  }
};

const handleSearch = () => {
  const foundTrail = trails.find((trail) =>
    trail.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (foundTrail) {
    setSelectedTrail(foundTrail);
    fetchGoogleTrailPhotos(foundTrail.name);
  } else {
    setGooglePhotos([]);
    alert("No trail found. Make sure this trail exists in the database.");
  }
};

 const handleSubmitReview = async (e) => {
  e.preventDefault();

  if (!selectedTrail) {
    alert("Please select a trail first.");
    return;
  }

  try {
    const newComment = await commentService.createComment(selectedTrail._id, {
      text: comment,
      rating: rating,
    });

    setComments([newComment, ...comments]);

    setRating(0);
    setComment("");
  } catch (err) {
    console.error(err.message);
    alert("Could not save comment.");
  }
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

        <button type="button" style={buttonStyle} onClick={handleSearch}>
          Search
        </button>
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
          <h2>Info:</h2>
          <p>
            <strong>Location:</strong>{" "}
            {selectedTrail?.address || "No trail selected"}
          </p>
          <p>
            <strong>Description:</strong>{" "}
            {selectedTrail?.description || "Trail details will appear here."}
          </p>
        </div>
      </section>

      {/* PHOTOS */}
<section style={{ marginTop: "1rem" }}>
  <h3>Photos</h3>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1rem",
      alignItems: "start",
    }}
  >
    {/* Database photo */}
    <div>
      <h4>Database Photo</h4>

      {selectedTrail?.imageUrl ? (
        <img
          src={selectedTrail.imageUrl}
          alt={selectedTrail.name}
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            objectFit: "cover",
            borderRadius: "12px",
            display: "block",
          }}
        />
      ) : (
        <p>No database photo available</p>
      )}
    </div>

    {/* Google photos */}
    <div>
      <h4>Google Photos</h4>

      {googlePhotos.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
          }}
        >
          {googlePhotos.map((photoUrl, index) => (
            <img
              key={index}
              src={photoUrl}
              alt={`${selectedTrail?.name || "Trail"} Google photo ${index + 1}`}
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                objectFit: "cover",
                borderRadius: "12px",
                display: "block",
              }}
            />
          ))}
        </div>
      ) : (
        <p>No Google photos found</p>
      )}
    </div>
  </div>
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
          <div style={{ marginTop: "1.5rem" }}>
  <h3>Saved Comments</h3>

  {comments.length > 0 ? (
    comments.map((savedComment) => (
      <div
        key={savedComment._id}
        style={{
          borderTop: "1px solid #ddd",
          paddingTop: "0.75rem",
          marginTop: "0.75rem",
        }}
      >
        <p>
          <strong>Rating:</strong> {"★".repeat(savedComment.rating)}
        </p>

        <p>{savedComment.text}</p>

        {savedComment.user?.username && (
          <p style={{ fontSize: "0.85rem", color: "#666" }}>
            By: {savedComment.user.username}
          </p>
        )}
      </div>
    ))
  ) : (
    <p>No comments yet.</p>
  )}
</div>
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