import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../services/authService";
import { UserContext } from "../context/UserContext";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConf: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const { username, password, passwordConf } = formData;

  const handleChange = (e) => {
    setMessage("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const user = await signUp(formData);
    setUser(user);

    navigate("/dashboard", {
      state: { message: "Account created successfully! Welcome to URateTrail." },
    });
  } catch (error) {
    console.error(error);
    setMessage(error.message);
  }
};

  const isFormInvalid = () => {
    return !(username && password && password === passwordConf);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f7f4",
        padding: "2rem",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        }}
      >
        <h1 style={{ color: "#1f4d2e", marginBottom: "0.5rem" }}>
          Join URateTrail
        </h1>

        <p style={{ marginBottom: "1.5rem", color: "#555" }}>
          Create an account to rate trails, leave comments, and share your hiking experiences.
        </p>

        {message && (
          <p style={{ color: "#b00020", fontWeight: "bold" }}>{message}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              name="username"
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              name="password"
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="passwordConf">Confirm Password:</label>
            <input
              type="password"
              id="passwordConf"
              value={passwordConf}
              name="passwordConf"
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              disabled={isFormInvalid()}
              style={{
                ...buttonStyle,
                backgroundColor: isFormInvalid() ? "#999" : "#2e7d32",
              }}
            >
              Sign Up
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                ...buttonStyle,
                backgroundColor: "white",
                color: "#2e7d32",
                border: "2px solid #2e7d32",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  marginTop: "0.35rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

const buttonStyle = {
  flex: 1,
  padding: "0.75rem",
  borderRadius: "8px",
  border: "none",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

export default SignUpForm;