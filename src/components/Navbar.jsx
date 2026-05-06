import { useContext } from "react";
import { UserContext } from "../context/UserContext";

import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, setUser} = useContext(UserContext);

  const handleLogOut = ()=>{
    localStorage.removeItem('token')
    setUser(null)
  }
  return (
    <nav>
      <ul>
        {user ? (
          <>
            <>
  <li>
    <Link to="/">Welcome Back {user.username}</Link>
  </li>

  <li>
    <Link to="/">Dashboard</Link>
  </li>

  <li>
    <Link to="/sign-in" onClick={handleLogOut}>
      Sign Out
    </Link>
  </li>
</>
          </>
        ) : (
          <>
            <li>
              <Link to="/">Home</Link>
              <Link to="/sign-up">Sign Up</Link>
              <Link to="/sign-in">Sign In</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;