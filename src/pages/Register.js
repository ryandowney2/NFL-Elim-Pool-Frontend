import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../Config";

const Register = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post(`${API_BASE_URL}/register`, {
        email,
        username,
        password,
      });

      // ✅ Automatically log in after registration
      const loginResponse = await axios.post(`${API_BASE_URL}/login`, {
        username,
        password,
      });

      const { token } = loginResponse.data;

      // Store the token & user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ username }));

      // Update global auth state
      setUser({ username });

      // Redirect to Dashboard
      navigate("/dashboard");
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.error || "Registration failed."}`);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      <p style={{ color: message.startsWith("✅") ? "green" : "red" }}>{message}</p>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button style={styles.button} onClick={handleRegister}>Register</button>
    </div>
  );
};

const styles = {
  container: { textAlign: "center", padding: "20px" },
  button: { padding: "10px 20px", marginTop: "10px", cursor: "pointer", backgroundColor: "blue", color: "white", border: "none", borderRadius: "5px" },
};

export default Register;
