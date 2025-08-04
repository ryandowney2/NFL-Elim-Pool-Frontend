import React, { useEffect, useState } from "react";
import axios from "axios";

const MakePick = () => {
  const [schedule, setSchedule] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [pools, setPools] = useState([]);
  const [selectedPool, setSelectedPool] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSchedule();
    fetchPools();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/get_weekly_schedule");
      const sorted = response.data.schedule.sort((a, b) =>
        new Date(a.kickoff_est_raw) - new Date(b.kickoff_est_raw)
      );
      setSchedule(sorted);
      setCurrentWeek(response.data.week);
    } catch (err) {
      console.error("❌ Failed to fetch schedule:", err);
    }
  };

  const fetchPools = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://127.0.0.1:5000/get_pools", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPools(response.data.pools);
    } catch (err) {
      console.error("❌ Failed to fetch pools:", err);
    }
  };

  const handlePick = async (team) => {
    if (!selectedPool) {
      setMessage("❌ Please select a pool before making a pick.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/make_pick",
        { pool_name: selectedPool, team },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.error || "Failed to make pick."}`);
    }
  };

  const formatKickoff = (isoString) => {
    const date = new Date(isoString);
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>✅ Make a Pick - Week {currentWeek}</h2>
      <p style={{ color: "red", fontWeight: "bold", marginBottom: "20px" }}>
        ⏰ Picks are due before Sunday at 1:00 PM EST, or before your team's game starts — whichever comes first!
      </p>

      <p style={{ color: message.startsWith("✅") ? "green" : "red" }}>{message}</p>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="poolSelect"><strong>Select a Pool:</strong></label>
        <br />
        <select
          id="poolSelect"
          value={selectedPool}
          onChange={(e) => setSelectedPool(e.target.value)}
          style={{ padding: "8px", marginTop: "10px" }}
        >
          <option value="">-- Choose a pool --</option>
          {pools.map((pool, index) => (
            <option key={index} value={pool}>
              {pool}
            </option>
          ))}
        </select>
      </div>

      <div>
        {schedule.map((game, index) => {
          return (
            <div key={index} style={styles.gameBlock}>
              <div style={styles.teamRow}>
                <button style={styles.teamButton} onClick={() => handlePick(game.away_team)}>
                  {game.away_team}
                </button>
                <span style={{ margin: "0 10px" }}>@</span>
                <button style={styles.teamButton} onClick={() => handlePick(game.home_team)}>
                  {game.home_team}
                </button>
              </div>
              <p>Kickoff: {formatKickoff(game.kickoff_est_raw)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  gameBlock: {
    border: "1px solid #ccc",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "8px",
    maxWidth: "400px",
    margin: "15px auto",
    backgroundColor: "#f9f9f9",
  },
  teamRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "8px",
  },
  teamButton: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    margin: "0 5px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
  },
};

export default MakePick;
