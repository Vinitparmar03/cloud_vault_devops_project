import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {

        setLoading(true);

        try {

            const response = await getCurrentUser();

            setUser(response.data);

        } catch (error) {


            setUser(null);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                loadUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);