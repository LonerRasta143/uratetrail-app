import photo from "../assets/hiking.jpg";

const Landing = () => {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "2rem",
        background: "linear-gradient(to bottom, #dff6e4, #ffffff)",
      }}
    ><h1
        style={{
          fontSize: "4rem",
          marginBottom: "1rem",
          color: "#1f4d2e",
        }}
      >
        URateTrail
      </h1>
      <img src={photo} alt=" a group of people hiking" style={{ width: "100%", maxWidth: "1000px", height: "auto" }} />
      

      <p
        style={{
          fontSize: "1.3rem",
          maxWidth: "700px",
          lineHeight: "1.6",
          marginBottom: "2rem",
          color: "#333",
        }}
      >
        Discover hiking trails, explore interactive maps, and share your
        experiences with the community. Rate trails, leave a review, and help
        fellow hikers find their next adventure.
      </p>

      <div
        style={{
          display: "flex",
          gap: "1rem",
        }}
      >
        <a
          href="/sign-up"
          style={{
            padding: "0.9rem 1.5rem",
            backgroundColor: "#2e7d32",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          Get Started
        </a>

        <a
          href="/sign-in"
          style={{
            padding: "0.9rem 1.5rem",
            backgroundColor: "#ffffff",
            color: "#2e7d32",
            border: "2px solid #2e7d32",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          Sign In
        </a>
      </div>
    </main>
  );
};

export default Landing;