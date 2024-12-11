import React from "react";
import { AuthContext } from "./authContext";
import { jwtDecode } from "jwt-decode";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const tokenData = jwtDecode(token);
    if (tokenData) {
      setUser({
        id: tokenData.id,
        role: tokenData.role,
      });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
