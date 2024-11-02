import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSnackbar } from "notistack";

const Logout = () => {
  const { user, logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (user) {
      setTimeout(async () => handleLogout(), 500);
    }
  }, []);

  const handleLogout = async () => {
    logout();
    console.log("Logout successful.");
    enqueueSnackbar("Successfully logged out!", { variant: "success" });
  };

  return (
    <div className="bg-sky-700 text-slate-100">
      <Header />
      <div id="spacer" className="h-20"></div>
      <div className="min-h-screen">
        {/* {user} */}
        <div className="text-center">
          <div className="mb-5 font-display text-8xl">Quick Polls</div>
          <div>
            {user == null ? (
              <div className="font-display text-xl">
                You have been logged out. Thank you for visiting.
              </div>
            ) : (
              <div className="font-display text-xl">
                <p>
                  Thanks for your patronage. You will automatically be logged
                  out shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Logout;
