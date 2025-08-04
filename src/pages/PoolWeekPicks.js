import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../App";

const PoolWeekPicks = () => {
  const { user } = useContext(AuthContext);
  const [poolPicks, setPoolPicks] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPicks();
  }, []);

  const fetchPicks = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://127.0.0.1:5000/get_current_pool_picks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPoolPicks(response.data.results);
    } catch (error) {
      setMessage("❌ Failed to fetch weekly picks.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>👥 Weekly Pool Picks</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}

      {poolPicks.length > 0 ? (
        poolPicks.map((pool, idx) => (
          <div key={idx} style={styles.poolBox}>
            <h3>{pool.pool} — Week {pool.week}</h3>
            {pool.picks.length > 0 ? (
              <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                {pool.picks.map((p, i) => (
                  <li key={i} style={p.losses >= 2 ? styles.eliminated : {}}>
                    {p.username}:{" "}
                    {p.team === "❌ No pick made" ? (
                      <span style={{ color: "red" }}>No Pick Made ❌</span>
                    ) : (
                      <>
                        {p.team}
                        {p.outcome === "LOSS" && <span style={{ color: "red" }}> ❌</span>}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No picks to display yet.</p>
            )}
          </div>
        ))
      ) : (
        <p>Loading weekly picks...</p>
      )}
    </div>
  );
};

const styles = {
  container: { textAlign: "center", padding: "20px" },
  poolBox: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px",
    maxWidth: "500px",
    margin: "0 auto 20px auto",
    backgroundColor: "#f9f9f9",
  },
  eliminated: {
    color: "gray",
    textDecoration: "line-through",
  },
};

export default PoolWeekPicks;
