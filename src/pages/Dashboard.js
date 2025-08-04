import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";
import API_BASE_URL from "../Config";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");

  const handleEvaluateWeek = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/evaluate_week`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ week: null }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ ${data.message}`);
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage("❌ Error evaluating week.");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div style={styles.container}>
      <h1>Welcome to FBGM Fantasy Sports!</h1>
      <p>Select an option below:</p>

      <div style={styles.buttonContainer}>
        <Link to="/pools">
          <button style={styles.button}>🏈 View Your Pools</button>
        </Link>
        <Link to="/user-picks">
          <button style={styles.button}>📋 View Your Picks</button>
        </Link>
        <Link to="/make-pick">
          <button style={styles.button}>📝 Make a Pick</button>
        </Link>
        <Link to="/pool-week-picks">
          <button style={styles.button}>👥 Weekly Pool Picks</button>
        </Link>

        {user === "help12" && (
          <div style={styles.adminSection}>
            <h3>⚙️ Admin Controls</h3>
            <p style={{ color: "red" }}>⚠️ Only click after all games are final!</p>
            <button style={styles.adminButton} onClick={handleEvaluateWeek}>
              🚀 Run Week Evaluation
            </button>
            {message && <p>{message}</p>}
          </div>
        )}

        <button style={styles.logoutButton} onClick={logout}>
          🚪 Logout
        </button>

        {/* Social Media Links */}
        <div style={styles.socialSection}>
          <h3>Connect with Us</h3>
          <p>
            Subscribe to us on Youtube: <a href="https://www.youtube.com/@FBGMFantasySports" target="_blank" rel="noopener noreferrer">https://www.youtube.com/@FBGMFantasySports</a>
          </p>
          <p>
            Follow us on Instagram: <a href="https://www.instagram.com/f_b_g_m/" target="_blank" rel="noopener noreferrer">https://www.instagram.com/f_b_g_m/</a>
          </p>
          <p>
            Follow us on TikTok: <a href="https://www.tiktok.com/@fbgm.fntsy.football" target="_blank" rel="noopener noreferrer">https://www.tiktok.com/@fbgm.fntsy.football</a>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { textAlign: "center", padding: "30px" },
  buttonContainer: { marginTop: "20px" },
  button: { padding: "10px 20px", fontSize: "18px", margin: "10px", cursor: "pointer" },
  logoutButton: { padding: "10px 20px", fontSize: "18px", margin: "10px", backgroundColor: "red", color: "white", cursor: "pointer" },
  adminSection: { marginTop: "30px", padding: "15px", border: "2px solid red", borderRadius: "8px" },
  adminButton: { padding: "10px 20px", fontSize: "18px", marginTop: "10px", backgroundColor: "orange", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
  socialSection: { marginTop: "30px", fontSize: "16px" },
};

export default Dashboard;
