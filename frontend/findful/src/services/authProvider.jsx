import React from "react";
import { AuthContext } from "./authContext";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token){
      setLoading(false);
      return;
    };
    const tokenData = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (tokenData && tokenData.exp > currentTime) {
      setUser({
        id: tokenData["id"],
        role: tokenData["role"],
      });
    } else {
      localStorage.removeItem("token");
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        // @ts-ignore
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
