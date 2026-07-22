import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import { googleLogin } from "../services/authApi";
import { useAuth } from "../context/AuthContext";

const Login = () => {

    const navigate = useNavigate();

    const { loadUser } = useAuth();

    const handleSuccess = async (credentialResponse) => {

        try {

            await googleLogin(
                credentialResponse.credential
            );

            await loadUser();

            navigate("/dashboard");

        } catch (error) {

            alert("Login Failed");

        }

    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => alert("Google Login Failed")}
            />
        </div>
    );
};

export default Login;