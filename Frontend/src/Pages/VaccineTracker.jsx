import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./VaccineTracker.css";
import Header from "../Components/FixedComponents/Header";
import DarkVeil from "../Components/Backgrounds/DarkVeil";

const API_BASE = import.meta.env.VITE_API_URL;

export default function VaccineTracker() {
  const location = useLocation();
  const navigate = useNavigate();
  const [member, setMember] = useState(location.state?.member || null);
  const [vaccines, setVaccines] = useState(member?.vaccinations || []);

  // Helper to add days/months to a date
  const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d.toDateString();
  };
  const addMonths = (date, months) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d.toDateString();
  };

  const birthDate = member?.dob ? new Date(member.dob) : new Date();

  const updateStatus = async (index, newStatus) => {
    if (!member?._id) return;

    try {
      const res = await fetch(`${API_BASE}/api/members/${member._id}/vaccines/${index}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        // Update local state
        const newList = [...vaccines];
        newList[index].status = newStatus;
        newList[index].isDone = (newStatus === "Done");
        setVaccines(newList);
      } else {
        alert("Failed to update status: " + json.message);
      }
    } catch (err) {
      console.error("Error updating vaccine status:", err);
    }
  };

  const getVaccineDate = (recommendedTime) => {
    if (recommendedTime === "At Birth") return addDays(birthDate, 0);
    if (recommendedTime === "Within 24 hours") return addDays(birthDate, 0);
    if (recommendedTime === "Within 15 days") return addDays(birthDate, 15);
    if (recommendedTime.includes("6 weeks")) return addDays(birthDate, 42);
    if (recommendedTime.includes("10 weeks")) return addDays(birthDate, 70);
    if (recommendedTime.includes("14 weeks")) return addDays(birthDate, 98);
    if (recommendedTime.includes("9 months")) return addMonths(birthDate, 9);
    if (recommendedTime.includes("16-24 months")) return addMonths(birthDate, 18);
    if (recommendedTime.includes("16-18 months")) return addMonths(birthDate, 17);
    return recommendedTime;
  };

  const getRowClass = (status) => {
    switch (status) {
      case "Done": return "row-done";
      case "Scheduled": return "row-scheduled";
      case "Not Done": return "row-missed";
      default: return "";
    }
  };

  return (
    <div className="vaccine-container page">
      <DarkVeil
        hueShift={0}
        noiseIntensity={0}
        scanlineIntensity={0}
        speed={1}
        scanlineFrequency={0}
        warpAmount={0}
      />

      <Header />
      <div className="content">
        {!member ? (
          <div className="tracker-card" style={{ textAlign: 'center' }}>
            <h2>Please select a member from the dashboard to track vaccinations.</h2>
            <button className="back-btn" onClick={() => navigate("/user")} style={{ marginTop: '20px' }}>
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="tracker-card">
            <div className="tracker-header">
              <h1>Vaccination Tracker</h1>
              <div className="child-profile-mini">
                <span className="mini-photo">{member.photoLink ? <img src={member.photoLink} alt="" /> : "👶"}</span>
                <div className="mini-info">
                  <h3>{member.name}</h3>
                  <p>DOB: {new Date(member.dob).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <p className="sub-header-text">Track your essential immunizations below</p>

            <table className="med-table">
              <thead>
                <tr>
                  <th>Medication</th>
                  <th>Recommended Time</th>
                  <th>Scheduled Date</th>
                  <th>Status Management</th>
                </tr>
              </thead>
              <tbody>
                {vaccines.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                      No vaccination data available for this member. 
                      You can initialize it by updating the member in the dashboard.
                    </td>
                  </tr>
                ) : (
                  vaccines.map((v, idx) => (
                    <tr key={idx} className={getRowClass(v.status)}>
                      <td>
                        <strong>{v.vaccineName}</strong>
                      </td>
                      <td>{v.recommendedTime}</td>
                      <td>{getVaccineDate(v.recommendedTime)}</td>
                      <td>
                        <div className="row-status-grp">
                          <label>
                            <input
                              type="radio"
                              name={`status-${idx}`}
                              value="Done"
                              checked={v.status === "Done"}
                              onChange={() => updateStatus(idx, "Done")}
                            /> Done
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`status-${idx}`}
                              value="Scheduled"
                              checked={v.status === "Scheduled"}
                              onChange={() => updateStatus(idx, "Scheduled")}
                            /> Scheduled
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`status-${idx}`}
                              value="Not Done"
                              checked={v.status === "Not Done"}
                              onChange={() => updateStatus(idx, "Not Done")}
                            /> Not Done
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
