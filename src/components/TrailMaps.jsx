import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

const TrailMaps = ({ trails, setSelectedTrail }) => {
  return (
    <div style={{ width: "70%", height: "100vh" }}>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        
        <Map
          mapId="5511fe0219cc1eaf544809fc"
          style={{ width: "143%", height: "33%" }}
          defaultCenter={{ lat: 45.52, lng: -122.67 }}
          defaultZoom={10}
        >
          {trails.map((trail) => (
            <Marker
              key={trail._id}
              position={{
                lat: trail.lat,
                lng: trail.lng,
              }}
              onClick={() => setSelectedTrail(trail)}
            />
          ))}
        </Map>

      </APIProvider>
    </div>
  );
};

export default TrailMaps;