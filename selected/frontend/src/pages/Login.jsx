import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const [email, setEmail] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [codeSent, setCodeSent] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [privileges, setPrivileges] = useState("");
  const [loading, setLoading] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");
  const [oneFACompleted, setOneFACompleted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.status === 404) {
        navigate("/register", { state: { emailId: email } });
      } else {
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleValidateOTP = async () => {};

  const handleLogin = async (e) => {
    e.preventDefault();

    // let url = "http://localhost:3000";

    // // Request to your backend to authenticate the user
    // let headersList = {
    //   Accept: "*/*",
    //   "Content-Type": "application/x-www-form-urlencoded",
    // };

    // let bodyContent = `username=${username}&password=${password}`;
    // console.log("handlelogin sending :", bodyContent);
    // await fetch(`${url}/login`, {
    //   method: "POST",
    //   credentials: "include", // to send HTTP only cookies
    //   body: bodyContent,
    //   headers: headersList,
    // })
    //   .then((response) => response.json())
    //   .then((response) => {
    //     console.log(response);
    //     if (response.message == "fail") {
    //       console.log("login fail");
    //       //          enqueueSnackbar("Invalid username or password", { variant: "error" });
    //     } else {
    //       // setPrivileges(response.privileges.toString());
    //       // setOneFACompleted(true);
    //       handleSend2FA();
    //     }
    //   })
    //   .catch((error) => {
    //     console.log("error - ", error);
    //     //        enqueueSnackbar("An error occured during authentication", {
    //     //   variant: "error",
    //     // });
    //   });
  };

  const handleSend2FA = async () => {
    // let url = "http://localhost:3000";
    // // Request to your backend to send user a code
    // let headersList = {
    //   Accept: "*/*",
    //   "Content-Type": "application/x-www-form-urlencoded",
    // };
    // await fetch(`${url}/mail2fa`, {
    //   method: "POST",
    //   credentials: "include", // to send HTTP only cookies
    //   headers: headersList,
    // })
    //   .then((response) => response.json())
    //   .then((response) => {
    //     console.log(response);
    //     if (response.message == "fail") {
    //       console.log("login fail");
    //       // enqueueSnackbar(
    //       //   "There was a problem sending your two-factor authentication code.",
    //       //   { variant: "error" }
    //       // );
    //     } else {
    //       // enqueueSnackbar(
    //       //   "A two-factor authentication code will be sent shortly to the email associated with your account.",
    //       //   { variant: "success" }
    //       // );
    //     }
    //   })
    //   .catch((error) => {
    //     console.log("error - ", error.message);
    //     // enqueueSnackbar(
    //     //   "There was a problem sending your two-factor authentication code.",
    //     //   {
    //     //     variant: "error",
    //     //   }
    //     // );
    //   });
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    // let url = "http://localhost:3000";
    // console.log("From verify :", username, privileges);
    // // Request to your backend to authenticate the user
    // let headersList = {
    //   Accept: "*/*",
    //   "Content-Type": "application/x-www-form-urlencoded",
    // };

    // let bodyContent = `tfa=${twoFACode}`;
    // console.log("Entered code is ", twoFACode);
    // await fetch(`${url}/verify2FA`, {
    //   method: "POST",
    //   credentials: "include", // to send HTTP only cookies
    //   body: bodyContent,
    //   headers: headersList,
    // })
    //   .then((response) => response.json())
    //   .then((response) => {
    //     if (response.message == "fail") {
    //       console.log("login fail");
    //       setOneFACompleted(false);
    //       // enqueueSnackbar("Invalid authentication", { variant: "error" });
    //     } else {
    //       // enqueueSnackbar(`Successfully logged in!`, {
    //       //   variant: "success",
    //       // });
    //       login({
    //         username: { username }.username,
    //         privileges: { privileges }.privileges,
    //         twoFAVerified: true,
    //       });
    //     }
    //   })
    //   .catch((error) => {
    //     console.log("error - ", error);
    //     // enqueueSnackbar("An error occured during authentication", {
    //     //   variant: "error",
    //     // });
    //   });
  };

  useEffect(() => {
    if (user) navigate("/polls");
  }, []);

  return (
    // <div className="min-h-full p-4 bg-white text-black">
    //   <Header />
    //   <div id="spacer" className="h-20"></div>
    //   <div className="min-h-screen">
    //     <div className="flex justify-center">
    //       {/* {!codeSent ? ( */}
    //       <div className="bg-gray-500 shadow-2xl rounded px-8 pt-4 pb-4 mb-4">
    //         <form onSubmit={handleLogin}>
    //           <div className="mb-4">
    //             <label
    //               className="block text-black text-sm font-bold mb-2"
    //               htmlFor="email"
    //             >
    //               Email
    //             </label>
    //             <input
    //               className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-black mb-3 leading-tight focus:outline-none focus:shadow-outline"
    //               id="email"
    //               type="email"
    //               value={email}
    //               placeholder="Email address"
    //               tabIndex={0}
    //               onChange={(e) => setEmail(e.target.value)}
    //             />
    //             <p className="text-black text-sm italic">
    //               Please enter your email address.
    //             </p>
    //           </div>
    //           <div className="mb-6">
    //             <label
    //               className="block text-black text-sm font-bold mb-2"
    //               htmlFor="password"
    //             >
    //               Password
    //             </label>
    //             <input
    //               className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-black mb-3 leading-tight focus:outline-none focus:shadow-outline"
    //               id="password"
    //               type="password"
    //               placeholder="******************"
    //               tabIndex={0}
    //               value={password}
    //               onChange={(e) => setPassword(e.target.value)}
    //             />
    //             <p className="text-black text-xs italic">
    //               <span>Please enter your password.</span>
    //             </p>
    //           </div>
    //           <div className="flex items-center justify-between mb-5">
    //             <button
    //               className="inline-block align-baseline font-bold text-lg text-black hover:text-blue-800 border border-black p-1 rounded-md"
    //               type="submit"
    //               tabIndex={0}
    //             >
    //               Log In
    //             </button>
    //             {/* {loading ? <Spinner /> : <></>} */}
    //           </div>
    //           <div className="text-center">
    //             {" "}
    //             <Link
    //               to={"/forgot"}
    //               className="m-1 inline-block align-baseline text-sm text-black font-bold hover:text-blue-800 border border-black p-1 rounded-md"
    //             >
    //               Forgot password
    //             </Link>
    //           </div>
    //           <div className="text-center">
    //             <Link
    //               to={"/signup"}
    //               className="inline-block align-baseline font-bold text-sm text-black hover:text-blue-800 border border-black p-1 rounded-md"
    //             >
    //               New user? - Sign up
    //             </Link>
    //           </div>
    //         </form>
    //       </div>
    //       {/* ) : ( */}
    //       <div className="bg-gray-500 shadow-2xl rounded px-8 pt-4 pb-4 mb-4">
    //         <form onSubmit={handleVerify2FA}>
    //           <div className="mb-4">
    //             <label
    //               className="block text-black text-sm font-bold mb-2"
    //               htmlFor="twoFACode"
    //             >
    //               Code
    //             </label>
    //             <input
    //               className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-black mb-3 leading-tight focus:outline-none focus:shadow-outline"
    //               id="twoFACode"
    //               type="twoFACode"
    //               value={twoFACode}
    //               placeholder="Code"
    //               tabIndex={0}
    //               onChange={(e) => setTwoFACode(e.target.value)}
    //             />
    //             <p className="text-black text-sm italic">
    //               Please enter the code sent to the email address associated
    //               with your account.
    //             </p>
    //           </div>

    //           <div className="flex items-center justify-between mb-5">
    //             <button
    //               className="inline-block align-baseline font-bold text-lg text-black hover:text-blue-800 border border-black p-1 rounded-md"
    //               type="submit"
    //               tabIndex={0}
    //             >
    //               Submit
    //             </button>
    //             {/* {loading ? <Spinner /> : <></>} */}
    //           </div>
    //         </form>
    //       </div>
    //       {/* )} */}
    //     </div>
    //   </div>
    //   <Footer />
    // </div>

    <div className="bg-sky-700 text-slate-100">
      <Header />
      <div id="spacer" className="h-20"></div>
      <div className="container mx-auto min-h-screen">
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Login
          </button>
        </form>
        <form onSubmit={handleValidateOTP} className="max-w-sm mx-auto p-4">
          <label className="block mb-2">One-time Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
