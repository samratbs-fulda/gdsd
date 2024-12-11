import React from "react";

export const AuthContext = React.createContext({
  user: null,
  setUser: () => {},
});

export const useAuth = () => React.useContext(AuthContext);
