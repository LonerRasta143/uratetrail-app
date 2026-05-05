import { useEffect, useState } from "react";
import { getTrails } from "../services/trailService.js";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

const TrailIndex = () => {
  const [trails, setTrails] = useState([]);
  const [selectedTrail, setSelectedTrail] = useState(null);
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

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      
      <div style={{ width: "30%", overflowY: "auto", padding: "1rem" }}>
        <h2>Trails</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {trails.map((trail) => (
          <div
            key={trail._id}
            onClick={() => setSelectedTrail(trail)}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              cursor: "pointer",
              background:
                selectedTrail?._id === trail._id ? "#eee" : "white",
            }}
          >
            <h3>{trail.name}</h3>
            <p>{trail.location}</p>
          </div>
        ))}
      </div>

      
      <div style={{ width: "70%" }}>
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <Map
            style={{ width: "100%", height: "100%" }}
            defaultCenter={{ lat: 45.52, lng: -122.67 }} // Portland
            defaultZoom={10}
          >
            {trails.map((trail) => (
              <Marker
                key={trail._id}
                position={{ lat: trail.lat, lng: trail.lng }}
                onClick={() => setSelectedTrail(trail)}
              />
            ))}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
};

export default TrailIndex;