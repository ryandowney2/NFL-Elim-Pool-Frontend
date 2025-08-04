import React, { useState, useEffect } from "react";
import API_BASE_URL from "../Config";

const Schedule = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/get_weekly_schedule`,)
            .then((response) => response.json())
            .then((data) => {
                if (data.schedule) {
                    setSchedule(data.schedule);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching schedule:", error);
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>🏈 NFL Week Schedule</h2>
            {loading ? <p>Loading schedule...</p> : (
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    {schedule.map((game, index) => (
                        <li key={index} style={{ margin: "10px 0", padding: "10px", borderBottom: "1px solid #ccc" }}>
                            <strong>{game.away_team} @ {game.home_team}</strong>
                            <br />
                            📅 {game.kickoff_est} 
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Schedule;
