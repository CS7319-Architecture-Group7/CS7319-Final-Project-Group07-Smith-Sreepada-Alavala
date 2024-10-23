import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async (data) => {
    //console.log("from ua, data: ", data);
    setUser(data);
    navigate("/polls", { push: true });
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    navigate("/logout", { push: true }, { replace: true });
  };

  // const set2fa = (isVerified) => {
  //   if (isVerified == true) console.log("Yes indeed");
  //   setUser({
  //     twoFAVerified: isVerified,
  //   });
  // };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      // set2fa,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
