import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getTrails } from "../services/trailService.js";
import TrailMaps from "./TrailMaps.jsx";
import commentService from "../services/commentService.js";

const Dashboard = () => {
  const location = useLocation();

  const [trails, setTrails] = useState([]);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [googlePhotos, setGooglePhotos] = useState([]);
  const [searchMessage, setSearchMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingComment, setEditingComment] = useState(null);

  useEffect(() => {
  const storedMessage = sessionStorage.getItem("statusMessage");

  if (storedMessage) {
    setStatusMessage(storedMessage);
    sessionStorage.removeItem("statusMessage");
  }
}, []);

  // Fetch trails
 useEffect(() => {
  const fetchTrails = async () => {
    try {
      const data = await getTrails();
      setTrails(data);

      const defaultTrail = data.find((trail) =>
  trail.name.toLowerCase().includes("vernal")
);

      if (defaultTrail) {
        setSelectedTrail(defaultTrail);
        setSearchQuery(defaultTrail.name);
        fetchGoogleTrailPhotos(defaultTrail.name);
      }
    } catch (err) {
      console.error(err.message);
      setErrorMessage("Could not load trails. Please try again.");
    }
  };

  
    fetchTrails();
  }, []);

  // Fetch comments when a trail is selected
  useEffect(() => {
    const fetchComments = async () => {
      if (!selectedTrail?._id) return;

      try {
        const data = await commentService.getCommentsByTrailId(
          selectedTrail._id
        );
        setComments(data);
      } catch (err) {
        console.error(err.message);
        setErrorMessage("Could not load comments for this trail.");
      }
    };

    fetchComments();
  }, [selectedTrail]);

  const filteredTrails = trails.filter((trail) =>
    trail.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchGoogleTrailPhotos = async (trailName) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
//Fetch google photos
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
            textQuery: `${trailName} hiking trails`,
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
    setStatusMessage("");
    setErrorMessage("");

    const foundTrail = trails.find((trail) =>
      trail.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (foundTrail) {
      setSelectedTrail(foundTrail);
      setSearchMessage("");
      fetchGoogleTrailPhotos(foundTrail.name);
    } else {
      setSelectedTrail(null);
      setSearchMessage("No trail found. Try another trail name.");
      setGooglePhotos([]);
    }
  };
const handleEditComment = (savedComment) => {
  setEditingComment(savedComment);
  setComment(savedComment.text);
  setRating(savedComment.rating);
  setStatusMessage("");
  setErrorMessage("");
};
  const handleSubmitReview = async (e) => {
  e.preventDefault();

  setStatusMessage("");
  setErrorMessage("");

  if (!selectedTrail) {
    setErrorMessage("Please select a trail before leaving a review.");
    return;
  }

  try {
    if (editingComment) {
      const updatedComment = await commentService.updateComment(
        editingComment._id,
        {
          text: comment,
          rating: rating,
        }
      );

      setComments((prevComments) =>
        prevComments.map((savedComment) =>
          savedComment._id === editingComment._id
            ? updatedComment
            : savedComment
        )
      );

      setEditingComment(null);
      setStatusMessage("Review updated successfully!");
    } else {
      const newComment = await commentService.createComment(selectedTrail._id, {
        text: comment,
        rating: rating,
      });

      setComments([newComment, ...comments]);
      setStatusMessage("Review submitted successfully!");
    }

    setRating(0);
    setComment("");
  } catch (err) {
    console.error(err.message);
    setErrorMessage("Could not save review. Please try again.");
  }
};
  const handleDeleteComment = async (commentId) => {
    setStatusMessage("");
    setErrorMessage("");

    try {
      await commentService.deleteComment(commentId);

      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );

      setStatusMessage("Review deleted successfully.");
    } catch (err) {
      console.error(err.message);
      setErrorMessage("Could not delete comment. Please try again.");
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
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSearchMessage("");
            setStatusMessage("");
            setErrorMessage("");
          }}
          style={inputStyle}
        />

        <button type="button" style={buttonStyle} onClick={handleSearch}>
          Search
        </button>
      </section>

      {/* Search message */}
      {searchMessage && (
        <p
          style={{
            color: "#b00020",
            fontWeight: "bold",
            marginBottom: "1rem",
            backgroundColor: "#fde7e7",
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid #b00020",
          }}
        >
          {searchMessage}
        </p>
      )}

      {/* Success message */}
      {statusMessage && (
        <p
          style={{
            color: "#1f4d2e",
            fontWeight: "bold",
            marginBottom: "1rem",
            backgroundColor: "#dff6e4",
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid #2e7d32",
          }}
        >
          {statusMessage}
        </p>
      )}

      {/* Error message */}
      {errorMessage && (
        <p
          style={{
            color: "#b00020",
            fontWeight: "bold",
            marginBottom: "1rem",
            backgroundColor: "#fde7e7",
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid #b00020",
          }}
        >
          {errorMessage}
        </p>
      )}

      {/* Trail name above map */}
      <section style={cardStyle}>
        <h2>Trail Name: {selectedTrail?.name || "No trail selected yet"}</h2>
      </section>

      {/* Map section and information */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            height: "300px",
            border: "1px solid #999",
            overflow: "hidden",
            borderRadius: "8px",
          }}
        >
          <TrailMaps
            trails={selectedTrail ? [selectedTrail] : filteredTrails}
            setSelectedTrail={setSelectedTrail}
          />
        </div>

        <div style={cardStyle}>
          <h2>Info:</h2>
          <p>
            <strong>Location:</strong>{" "}
            {selectedTrail
              ? selectedTrail.address ||
                selectedTrail.location ||
                `${selectedTrail.lat}, ${selectedTrail.lng}`
              : "No trail selected"}
          </p>
          <p>
            <strong>Description:</strong>{" "}
            {selectedTrail?.description || "Trail details will appear here."}
          </p>
        </div>
      </section>

      {/* Photos */}
      <section
        style={{ marginTop: "1rem", ...cardStyle, backgroundColor: "#ffffff" }}
      >
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
            <h4>Users Photo</h4>

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
                    alt={`${selectedTrail?.name || "Trail"} Google photo ${
                      index + 1
                    }`}
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

      {/* Reviews Header */}
      <section style={{ ...cardStyle, marginTop: "1rem" }}>
        <h2>Reviews</h2>
      </section>

      {/* Reviews section */}
      <section
        style={{
          display: "",
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
                onClick={() => {
                  setRating(star);
                  setStatusMessage("");
                  setErrorMessage("");
                }}
                style={{
                  fontSize: "1.7rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: star <= rating ? "#117019" : "#ccc",
                }}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            placeholder="Leave your review..."
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setStatusMessage("");
              setErrorMessage("");
            }}
            style={{
              width: "100%",
              minHeight: "100px",
              padding: "0.75rem",
              borderRadius: "25px",
              border: "1px solid #08552f",
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
                !selectedTrail || !comment || rating === 0
                  ? "#0b381e"
                  : "#2e7d32",
            }}
          >
            {editingComment ? "Update Review" : "Submit Review"}
          </button>

          <div style={{ marginTop: "1.5rem" }}>
            <h3>Reviews:</h3>

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

                  <button
                    type="button"
                    onClick={() => handleDeleteComment(savedComment._id)}
                    style={{
                      ...buttonStyle,
                      backgroundColor: "#b00020",
                      marginTop: "0.5rem",
                    }}
                  >
                    Delete
                  </button>

                  <button
                    type="button"
                    onClick={() => {handleEditComment(savedComment)}}
                    style={{
                      ...buttonStyle,
                      backgroundColor: "#117019",
                      marginTop: "0.5rem",
                      marginLeft: "0.5rem",
                    }}
                  >
                    Edit
                  </button>

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