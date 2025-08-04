import React, { createContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Pools from "./pages/Pools";
//import Schedule from "./pages/Schedule";  // Import Schedule page
import UserPicks from "./pages/UserPicks";
import PoolWeekPicks from "./pages/PoolWeekPicks";
import MakePick from "./pages/MakePick";


export const AuthContext = createContext();

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
        <Navigation user={user} />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pools" element={<Pools />} />
          {/* <Route path="/schedule" element={<Schedule />} /> */}
          <Route path="/user-picks" element={<UserPicks />} />
          <Route path="/pool-week-picks" element={<PoolWeekPicks />} />
          <Route path="/make-pick" element={<MakePick />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

const Navigation = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/dashboard" style={styles.navItem}>🏠 Home</Link>
      <Link to="/pools" style={styles.navItem}>🏈 Pools</Link>
      {/*<Link to="/schedule" style={styles.navItem}>📅 Schedule</Link>*/}
      <Link to="/user-picks" style={styles.navItem}>📋 Your Picks</Link>
      <Link to="/pool-week-picks" style={styles.navItem}>👥 Weekly Pool Picks</Link>
      <Link to="/make-pick" style={styles.navItem}>🟢 Make a Pick</Link>
      {user ? (
        <button style={styles.logoutButton} onClick={handleLogout}>🚪 Logout</button>
      ) : (
        <>
          <Link to="/" style={styles.navItem}>🔑 Login</Link>
          <Link to="/register" style={styles.navItem}>📝 Register</Link>
        </>
      )}
    </nav>
  );
};


const styles = {
  navbar: { display: "flex", justifyContent: "space-between", padding: "10px 20px", background: "#333", color: "white" },
  navItem: { color: "white", textDecoration: "none", padding: "10px" },
  logoutButton: { background: "red", color: "white", padding: "10px 15px", border: "none", cursor: "pointer" }
};

export default App;
