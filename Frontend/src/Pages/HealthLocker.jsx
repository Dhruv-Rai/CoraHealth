import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./HealthLocker.css";
import Header from "../Components/FixedComponents/Header";
import Orb from "../Components/Backgrounds/Orb";

const API_BASE = import.meta.env.VITE_API_URL;

export default function HealthLocker() {
  const location = useLocation();
  const navigate = useNavigate();
  const member = location.state?.member;

  const [docs, setDocs] = useState({
    prescription: [],
    lab: [],
    insurance: []
  });

  const [loading, setLoading] = useState(false);
  const [openSections, setOpenSections] = useState({
    prescription: true,
    lab: false,
    insurance: false
  });

  const [preview, setPreview] = useState(null);

  // Load existing docs from member object
  useEffect(() => {
    if (member?.healthLocker) {
      const grouped = {
        prescription: member.healthLocker.filter(d => d.type === "prescription"),
        lab: member.healthLocker.filter(d => d.type === "lab"),
        insurance: member.healthLocker.filter(d => d.type === "insurance")
      };
      setDocs(grouped);
    }
  }, [member]);

  const toggleSection = (type) => {
    setOpenSections(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file || !member?._id) return;

    setLoading(true);
    const fd = new FormData();
    fd.append("document", file);
    fd.append("type", type);
    fd.append("name", file.name);

    try {
      const res = await fetch(`${API_BASE}/api/members/${member._id}/health-locker`, {
        method: "POST",
        body: fd
      });
      const json = await res.json();
      if (json.success) {
        // Backend returns the full updated healthLocker array
        const updated = {
          prescription: json.data.filter(d => d.type === "prescription"),
          lab: json.data.filter(d => d.type === "lab"),
          insurance: json.data.filter(d => d.type === "insurance")
        };
        setDocs(updated);
        alert("Document uploaded to Database!");
      } else {
        alert("Upload failed: " + json.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteDoc = async (doc) => {
    if (!window.confirm("Delete this document from Database? This action is permanent.")) return;
    if (!member?._id) return;

    // Use Doc ID if available, else index matching (Doc ID is safer)
    const identifier = doc._id || member.healthLocker.findIndex(d => d.link === doc.link);

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/members/${member._id}/health-locker/${identifier}`, {
        method: "DELETE"
      });
      const json = await res.json();
      if (json.success) {
        // Update local state with the returned new healthLocker list
        const updated = {
          prescription: json.data.filter(d => d.type === "prescription"),
          lab: json.data.filter(d => d.type === "lab"),
          insurance: json.data.filter(d => d.type === "insurance")
        };
        setDocs(updated);
        alert("Document deleted successfully!");
      } else {
        alert("Delete failed: " + json.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const Section = ({ title, type }) => (
    <>
      <div className="section-title" onClick={() => toggleSection(type)}>
        {title}
        <span>{openSections[type] ? "▲" : "▼"}</span>
      </div>

      {openSections[type] && (
        <div className="section-box">
          <label className={`upload-bar ${loading ? "loading" : ""}`}>
            {loading ? "UPLOADING..." : "+ UPLOAD NEW DOCUMENT"}
            <input
              type="file"
              hidden
              disabled={loading}
              onChange={(e) => handleUpload(e, type)}
            />
          </label>

          {docs[type].length === 0 ? (
            <div className="empty-message">No documents uploaded yet.</div>
          ) : (
            docs[type].map((doc, i) => (
              <div
                className="doc-row"
                key={i}
                onClick={() => setPreview(doc.link)}
              >
                <span>{doc.name}</span>
                <div className="buttons">
                  <button
                    className="download"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreview(doc.link);
                    }}
                  >
                    VIEW
                  </button>
                  <button
                    className="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDoc(doc);
                    }}
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );

  if (!member) {
    return (
      <div className="healthlocker-container page">
        <Header />
        <div className="content no-member-selected">
          <h2>Select a Family Member first</h2>
          <p>Go to your dashboard and click "Locker" on a member card.</p>
          <button onClick={() => navigate("/user")}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="healthlocker-container page">
      <Orb
        hoverIntensity={0.1}
        rotateOnHover
        hue={220}
        forceHoverState={false}
        backgroundColor="#03080f"
      />
      <Header />
      <div className="content">
        <div className="member-locker-header">
          <h1>Health Locker: {member.name}</h1>
          <p>All files are safely stored in Database: <code>{member.name}_Locker</code></p>
        </div>

        <Section title="PRESCRIPTION" type="prescription" />
        <Section title="LAB REPORTS" type="lab" />
        <Section title="INSURANCE DOCUMENTS" type="insurance" />
      </div>

      {preview && (
        <div className="preview-modal" onClick={() => setPreview(null)}>
          <div className="preview-content" onClick={e => e.stopPropagation()}>
            <button className="close-preview" onClick={() => setPreview(null)}>✕</button>
            <div className="preview-iframe-wrapper">
                <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(preview)}&embedded=true`}
                title="Document Preview"
                width="100%"
                height="100%"
                ></iframe>
            </div>
            <p className="preview-note">Tip: If the preview doesn't load, use the View/Download button.</p>
          </div>
        </div>
      )}
    </div>
  );
}