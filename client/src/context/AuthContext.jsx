import { createContext, useContext, useState, useEffect } from "react";
import { useServices } from "../context/ServiceContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { auth } = useServices(); 
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

const logout = async () => {
  try {
    await auth.logout();
  } catch (err) {
    console.log("logout fail");
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }
};

  useEffect(() => {
    const handleExpired = () => {
      logout();
    };

    window.addEventListener("auth-expired", handleExpired);

    return () => {
      window.removeEventListener("auth-expired", handleExpired);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
