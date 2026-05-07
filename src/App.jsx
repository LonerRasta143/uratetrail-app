import { useContext } from "react";
import { UserContext } from "./context/UserContext";

import { Routes, Route } from "react-router-dom";

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
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trails" element={<Trails />} />
      </Routes>
    </div>
  );
};

export default App;