import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
//import { useSnackbar } from "notistack";

// eslint-disable-next-line react/prop-types
const UserRoute = ({ children }) => {
  const { user } = useAuth();
  //  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // user is not authenticated
      // enqueueSnackbar("Basic - You don't have access privileges", {
      //   variant: "error",
      // });
      navigate("/login", { push: true });
    }
  }, []);

  if (!user) {
    return <></>;
  } else {
    // user is authenticated
    return children;
  }
};

export default UserRoute;
