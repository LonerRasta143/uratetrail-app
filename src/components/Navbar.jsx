import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav
      style={{
        backgroundColor: "#1f4d2e",
        padding: "1rem 2rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <ul
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {/* LOGO */}
        <li>
          <Link
            to="/"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            🌲 URateTrail
          </Link>
        </li>

        {/* RIGHT SIDE NAV */}
        <li
          style={{
            display: "flex",
            gap: "1.5rem",
            alignItems: "center",
            listStyle: "none",
          }}
        >
          {user ? (
            <>
              <Link to="/dashboard" style={linkStyle}>
                Dashboard
              </Link>

              
              <span
                style={{
                  color: "#d7f5dd",
                  fontWeight: "bold",
                }}
              >
                Hi, {user.username}
              </span>

              <button
                onClick={handleLogOut}
                style={{
                  backgroundColor: "#ffffff",
                  color: "#1f4d2e",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/" style={linkStyle}>
                Home
              </Link>

              <Link to="/sign-up" style={linkStyle}>
                Sign Up
              </Link>

              <Link to="/sign-in" style={linkStyle}>
                Sign In
              </Link>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500",
};

export default Navbar;