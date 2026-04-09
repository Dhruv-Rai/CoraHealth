import React, { useState, useEffect } from "react"
import "./Header.css"
import { Link, useNavigate } from "react-router-dom"
import { auth, onAuthStateChanged, signOut } from "../../firebase"
import logo from "../../assets/Samarkan.png"

export default function Header() {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // Check if we have additional info in localStorage (for form logins)
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    setUser({
                        name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
                        email: firebaseUser.email,
                        picture: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.email}&background=random`
                    });
                }
            } else {
                setUser(null);
                localStorage.removeItem("user");
            }
        });

        return () => unsubscribe();
    }, [])

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem("user");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div className="Header_container">

            <Link to="/" className="logo-container list_item">
                <img src={logo} alt="ARTIKA Logo" className="logo-img" />
            </Link>

            <Link to="/" className="type2 list_item">Home</Link>

            <div className="nav_item">
                <div className="type2 list_item">Care</div>

                <div className="mega_menu">
                    <div className="mega_card">

                        <Link to="/mb" style={{ textDecoration: "none" }}>
                            <h4>MediBot</h4>
                            <p>Ask health questions in any language. Get instant guidance anytime.</p>
                        </Link>

                        <Link to="/dm" style={{ textDecoration: "none" }}>
                            <h4>DocMap</h4>
                            <p>Find the nearest doctor instantly using your location or pin code.</p>
                        </Link>

                    </div>
                </div>
            </div>

            <div className="nav_item">
                <div className="type2 list_item">Reminder</div>

                <div className="mega_menu">
                    <div className="mega_card">

                        <Link to="/add" style={{ textDecoration: "none" }}>
                            <h4>Add Members</h4>
                            <p>Add family members to manage their health from one place.</p>
                        </Link>

                        <Link to="/user" style={{ textDecoration: "none" }}>
                            <h4>User Dashboard</h4>
                            <p>Track, remind and care for your entire family effortlessly.</p>
                        </Link>

                    </div>
                </div>
            </div>

            <div className="nav_item">
                <div className="type2 list_item">Kids</div>

                <div className="mega_menu">
                    <div className="mega_card">

                        <Link to="/vaccine" style={{ textDecoration: "none" }}>
                            <h4>Vaccination Tracker</h4>
                            <p>Never miss a vaccine with smart schedules and reminders.</p>
                        </Link>

                        <Link to="/growth" style={{ textDecoration: "none" }}>
                            <h4>Growth Tracker</h4>
                            <p>Track height and weight with smart charts.</p>
                        </Link>

                        <Link to="/mp" style={{ textDecoration: "none" }}>
                            <h4>MediPlay</h4>
                            <p>Fun educational games supporting healthy habits.</p>
                        </Link>

                    </div>
                </div>
            </div>

            <Link to="/hl" className="type2 list_item">Health Locker</Link>

            <div className="hamburger">☰</div>

            {user ? (
                <div className="user_profile_section">
                    <Link to="/user" className="type1 list_item profile-link">
                        <img 
                            src={user.picture} 
                            alt={user.name} 
                            className="user-avatar-header" 
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=random`;
                            }}
                        />
                    </Link>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            ) : (
                <Link to="/login" className="type1 list_item login-link">Login</Link>
            )}

        </div>
    )
}
