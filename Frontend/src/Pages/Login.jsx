import React, { useState } from "react";
import { auth, googleProvider, signInWithPopup } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Orb from "../Components/Backgrounds/Orb";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Firebase Login Success:", user);

      const userData = {
        name: user.displayName,
        email: user.email,
        picture: user.photoURL,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/");
    } catch (error) {
      console.error("Google Login Failed:", error.message);
      alert("Login Failed: " + error.message);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const userData = {
        name: email.split("@")[0],
        email: user.email,
        picture: `https://ui-avatars.com/api/?name=${email}&background=random`,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/");
    } catch (error) {
      console.error("Form Login Failed:", error.message);
      alert("Invalid credentials or user not found.");
    }
  };

  return (
    <div className="login-container">
      <Orb
        hoverIntensity={0.1}
        rotateOnHover
        hue={220}
        backgroundColor="#03080f"
      />
      <div className="login-card">
        <h1 className="login-heading">Welcome To ARTIKA.life</h1>
        <p className="login-subtext">Sign in to access your family health records</p>
        
        <form className="login-form" onSubmit={handleFormSubmit}>
          <div className="input-field">
            <input 
              type="email" 
              placeholder="Email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-field">
            <input 
              type="password" 
              placeholder="Password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-btn">Log In</button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="google-auth">
          <button className="google-btn" onClick={handleGoogleLogin}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
