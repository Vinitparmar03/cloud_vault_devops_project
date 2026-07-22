import { logout } from "../services/authApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        setUser(null);
        navigate("/");
    };

    return (
        <nav
            style={{
                height: "70px",
                background: "#111827",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 40px",
                boxShadow: "0 4px 12px rgba(0,0,0,.15)",
            }}
        >
            <h2>☁️ Cloud Vault</h2>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                }}
            >
                <img
                    src={user?.picture}
                    alt=""
                    width={45}
                    height={45}
                    style={{
                        borderRadius: "50%",
                        border: "2px solid white",
                    }}
                />

                <span>{user?.name}</span>

                <button
                    onClick={handleLogout}
                    style={{
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "10px 16px",
                        borderRadius: "8px",
                        cursor: "pointer",
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;