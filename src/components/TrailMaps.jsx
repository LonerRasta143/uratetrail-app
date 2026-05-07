import {
  APIProvider,
  Map,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";

const TrailMaps = ({ trails, setSelectedTrail }) => {
  const firstTrail = trails[0];

  const mapCenter = firstTrail
    ? {
        lat: Number(firstTrail.lat),
        lng: Number(firstTrail.lng),
      }
    : {
        lat: 45.52,
        lng: -122.67,
      };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map
          mapId="5511fe0219cc1eaf544809fc"
          style={{
            width: "100%",
            height: "100%",
          }}
          center={mapCenter}
          zoom={firstTrail ? 12 : 10}
        >
          {trails.map((trail) => (
            <AdvancedMarker
              key={trail._id}
              position={{
                lat: Number(trail.lat),
                lng: Number(trail.lng),
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