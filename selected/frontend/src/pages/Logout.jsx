import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/Header";
import Footer from "../components/Footer";
//import { useSnackbar } from "notistack";

const Logout = () => {
  const { user, logout } = useAuth();
  //  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (user) {
      setTimeout(async () => handleLogout(), 500);
    }
  }, []);

  // api call to handle session?
  const handleLogout = async () => {
    logout();
    console.log("Logout successful.");
    //          enqueueSnackbar("Successfully logged out!", { variant: "success" });
  };

  return (
    <div className="p-4 bg-white text-black">
      <Header />
      <div id="spacer" className="h-20"></div>
      <div className="min-h-screen">
        <div className="flex justify-center text-center">
          {user == null ? (
            <div>You have been logged out. Thank you for visiting.</div>
          ) : (
            <div>
              <p>
                Thanks for your patronage. You will automatically be logged out
                shortly.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Logout;
