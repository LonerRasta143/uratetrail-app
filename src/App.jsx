import { useContext } from "react";
import { UserContext } from "./context/UserContext";

import { Routes, Route, Navigate } from "react-router-dom";

import SignUpForm from "./components/SignUpForm.jsx";
import SignInForm from "./components/SignInForm.jsx";
import Navbar from "./components/Navbar.jsx";
import Landing from "./components/Landing.jsx";
import Dashboard from "./components/Dashboard.jsx";

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Landing />} />

        <Route
          path="/sign-up"
          element={user ? <Navigate to="/dashboard" /> : <SignUpForm />}
        />

        <Route
          path="/sign-in"
          element={user ? <Navigate to="/dashboard" /> : <SignInForm />}
        />

        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/sign-in" />}
        />
      </Routes>
    </div>
  );
};

export default App;