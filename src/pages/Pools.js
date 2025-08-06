import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../App";
import API_BASE_URL from "../Config";

const Pools = () => {
  const { user } = useContext(AuthContext);
  const [pools, setPools] = useState([]);
  const [poolName, setPoolName] = useState("");
  const [poolPassword, setPoolPassword] = useState("");
  const [joinName, setJoinName] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [message, setMessage] = useState("");

  const [selectedPool, setSelectedPool] = useState("");
  const [poolUsers, setPoolUsers] = useState([]);

  useEffect(() => {
    if (!user) {
      setMessage("❌ You must be logged in to access pools.");
      return;
    }
    fetchPools();
  }, [user]);

  const fetchPools = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API_BASE_URL}/get_pools`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPools(response.data.pools || []);
    } catch (error) {
      setMessage("❌ Failed to fetch pools.");
    }
  };

  const handleCreatePool = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("❌ You must be logged in to create a pool.");
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/create_pool`,
        { name: poolName, password: poolPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`✅ ${response.data.message}`);
      fetchPools();
    } catch (error) {
      setMessage(
        `❌ ${error.response?.data?.error || "Failed to create pool."}`
      );
    }
  };

  const handleJoinPool = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("❌ You must be logged in to join a pool.");
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/join_pool`,
        { pool_name: joinName, password: joinPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`✅ ${response.data.message}`);
      fetchPools();
    } catch (error) {
      setMessage(
        `❌ ${error.response?.data?.error || "Failed to join pool."}`
      );
    }
  };

  const handleSelectPool = async (pool) => {
    const token = localStorage.getItem("token");
    if (selectedPool === pool) {
      setSelectedPool("");
      setPoolUsers([]);
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/get_pool_users`,
        { pool_name: pool },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedPool(pool);
      setPoolUsers(response.data.users || []);
    } catch (error) {
      setMessage(`❌ Failed to fetch users for pool: ${pool}`);
    }
  };

  return (
    <div style={styles.container}>
      <h2>🏈 Survivor Pools</h2>
      {message && (
        <p style={{ color: message.startsWith("✅") ? "green" : "red" }}>
          {message}
        </p>
      )}

      {/* Create Pool Section */}
      <div style={styles.section}>
        <h3>Create a New Pool</h3>
        <input
          type="text"
          placeholder="Pool Name"
          value={poolName}
          onChange={(e) => setPoolName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Pool Password"
          value={poolPassword}
          onChange={(e) => setPoolPassword(e.target.value)}
        />
        <button style={styles.button} onClick={handleCreatePool}>
          Create Pool
        </button>
      </div>

      {/* Join Pool Section */}
      <div style={styles.section}>
        <h3>Join a Pool</h3>
        <input
          type="text"
          placeholder="Pool Name"
          value={joinName}
          onChange={(e) => setJoinName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Pool Password"
          value={joinPassword}
          onChange={(e) => setJoinPassword(e.target.value)}
        />
        <button style={styles.button} onClick={handleJoinPool}>
          Join Pool
        </button>
      </div>

      {/* List of Joined Pools */}
      <div style={styles.section}>
        <h3>Your Pools</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {pools.length > 0 ? (
            pools.map((pool, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                <button
                  style={styles.poolButton}
                  onClick={() => handleSelectPool(pool)}
                >
                  {selectedPool === pool ? "🔽 " : "▶️ "} {pool}
                  {selectedPool === pool && (
                    <span
                      style={{
                        marginLeft: "8px",
                        fontSize: "14px",
                        color: "green",
                      }}
                    >
                      (
                      {
                        poolUsers.filter((u) => u.losses < 2).length
                      }{" "}
                      players remaining)
                    </span>
                  )}
                </button>

                {selectedPool === pool && (
                  <ul
                    style={{
                      marginTop: "10px",
                      paddingLeft: "20px",
                      textAlign: "left",
                    }}
                  >
                    {poolUsers.length > 0 ? (
                      poolUsers.map((user, idx) => (
                        <li key={idx}>
                          {user.username}{" "}
                          {user.losses === 1 && (
                            <span style={{ color: "red" }}>❌</span>
                          )}
                          {user.losses >= 2 && (
                            <span style={{ color: "red" }}>
                              🏴 Eliminated in Week {user.elimination_week}
                            </span>
                          )}
                        </li>
                      ))
                    ) : (
                      <li>No users found for this pool.</li>
                    )}
                  </ul>
                )}
              </li>
            ))
          ) : (
            <p>You have not joined any pools yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: { textAlign: "center", padding: "20px" },
  section: {
    margin: "20px auto",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    maxWidth: "400px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    marginTop: "10px",
    cursor: "pointer",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
  poolButton: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "lightgray",
    border: "1px solid #ccc",
    borderRadius: "5px",
    width: "100%",
    cursor: "pointer",
    textAlign: "left",
  },
};

export default Pools;
