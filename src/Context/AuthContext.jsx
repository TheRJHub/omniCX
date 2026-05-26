import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("loanagent_user");
        return saved ? JSON.parse(saved) : null;
    });

    const login = (apiResponse) => {
        if (apiResponse?.token) {
            const userData = {
                name: `${apiResponse.first_name} ${apiResponse.last_name}`.trim(),
                email: apiResponse.email,
                role: apiResponse.role,
                avatar: apiResponse.first_name?.[0]?.toUpperCase() ?? "U",
                token: apiResponse.token,
                user_id: apiResponse.user_id,
                organisation_id: apiResponse.organisation_id,
                organisation_name: apiResponse.organisation_name,
                customer_id: apiResponse.customer_id,
                customer_name: apiResponse.customer_name,
                is_admin: apiResponse.is_admin,
                menus: apiResponse.Menus,
                submenus: apiResponse.Submenus,
            };
            setUser(userData);
            localStorage.setItem("loanagent_user", JSON.stringify(userData));
            return { success: true };
        }
        return { success: false, message: apiResponse?.message || "Login failed" };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("loanagent_user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}