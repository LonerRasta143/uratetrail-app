import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import { getTrails } from "../services/trailService";

const Trails = () => {
  const { user } = useContext(UserContext);

  const [trails, setTrails] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const data = await getTrails();
        setTrails(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTrails();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
        <p>Welcome, {user ? user.username || user.name : "Guest"}!</p>
      <h1>Trails Page</h1>

      


      {error && <p style={{ color: "red" }}>{error}</p>}

      {trails.length === 0 ? (
        <p>No trails found.</p>
      ) : (
        trails.map((trail) => (
          <div
            key={trail._id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
            }}
          >
            <h3>{trail.name}</h3>
            <p>{trail.description}</p>
            <p>{trail.location}</p>
            
            {trail.imageUrl && (
              <img
                src={trail.imageUrl}
                alt={trail.name}
                style={{
                  width: "250px",
                  borderRadius: "8px",
                }}
            


              />
            )}
          </div>
        ))
      )}

      <Link to="/dashboard" style={{ color: "#1f4d2e", textDecoration: "none" }}>
        Back to Dashboard
      </Link>
    </div>
  );
};

export default Trails;