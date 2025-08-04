import React, { useEffect, useState } from "react";
import API_BASE_URL from "../Config";

const UserPicks = () => {
  const [picks, setPicks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(null);

  useEffect(() => {
    fetchCurrentWeek();
    fetchUserPicks();
  }, []);

  const fetchCurrentWeek = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/get_current_week`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load week");
      setCurrentWeek(data.current_week);
    } catch (e) {
      console.error("Error loading current week:", e);
      setCurrentWeek(0);
    }
  };

  const fetchUserPicks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/get_user_picks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { user_picks } = await response.json();
      setPicks(user_picks);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>🏈 Your Picks by Pool</h2>
      {loading && <p>Loading your picks...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && currentWeek != null && (
        <div>
          {Object.keys(picks).length === 0 ? (
            <p>No picks made yet.</p>
          ) : (
            Object.entries(picks).map(([poolName, pickList]) => (
              <div key={poolName} style={{ marginBottom: "20px" }}>
                <h3>📌 Pool: {poolName}</h3>
                <ul>
                  {pickList
                    .filter((pick) => pick.week <= currentWeek)
                    .map((pick, index) => {
                      const isMissed = pick.team === "❌ No pick made";
                      const isLoss = pick.outcome === "LOSS";
                      return (
                        <li key={index}>
                          <strong>Week {pick.week}:</strong>{" "}
                          {isMissed ? (
                            <span style={{ color: "red" }}>❌ No pick made</span>
                          ) : (
                            <>
                              {pick.team}
                              {isLoss && (
                                <span style={{ color: "red" }}> ❌</span>
                              )}
                            </>
                          )}
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UserPicks;
