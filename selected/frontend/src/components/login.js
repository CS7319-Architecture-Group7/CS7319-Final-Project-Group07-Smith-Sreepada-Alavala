import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

function Login() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

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

  return (
    <div>
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
      </div>
      <Footer />
    </div>
  );

  // return (
  //   <div className="min-h-full p-4 bg-white text-black">
  //     <Header />
  //     <div id="spacer" className="h-20"></div>
  //     <div className="min-h-screen">
  //       <div className="flex justify-center">
  //         {!oneFACompleted ? (
  //           <div className="bg-gray-500 shadow-2xl rounded px-8 pt-4 pb-4 mb-4">
  //             <form onSubmit={handleLogin}>
  //               <div className="mb-4">
  //                 <label
  //                   className="block text-black text-sm font-bold mb-2"
  //                   htmlFor="username"
  //                 >
  //                   Username
  //                 </label>
  //                 <input
  //                   className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-black mb-3 leading-tight focus:outline-none focus:shadow-outline"
  //                   id="username"
  //                   type="text"
  //                   value={username}
  //                   placeholder="Username"
  //                   tabIndex={0}
  //                   onChange={(e) => setUsername(e.target.value)}
  //                 />
  //                 <p className="text-black text-sm italic">
  //                   Please enter your username.
  //                 </p>
  //               </div>
  //               <div className="mb-6">
  //                 <label
  //                   className="block text-black text-sm font-bold mb-2"
  //                   htmlFor="password"
  //                 >
  //                   Password
  //                 </label>
  //                 <input
  //                   className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-black mb-3 leading-tight focus:outline-none focus:shadow-outline"
  //                   id="password"
  //                   type="password"
  //                   placeholder="******************"
  //                   tabIndex={0}
  //                   value={password}
  //                   onChange={(e) => setPassword(e.target.value)}
  //                 />
  //                 <p className="text-black text-xs italic">
  //                   <span>Please enter your password.</span>
  //                 </p>
  //               </div>
  //               <div className="flex items-center justify-between mb-5">
  //                 <button
  //                   className="inline-block align-baseline font-bold text-lg text-black hover:text-blue-800 border border-black p-1 rounded-md"
  //                   type="submit"
  //                   tabIndex={0}
  //                 >
  //                   Log In
  //                 </button>
  //                 {loading ? <Spinner /> : <></>}
  //               </div>
  //               <div className="text-center">
  //                 {" "}
  //                 <Link
  //                   to={"/forgot"}
  //                   className="m-1 inline-block align-baseline text-sm text-black font-bold hover:text-blue-800 border border-black p-1 rounded-md"
  //                 >
  //                   Forgot password
  //                 </Link>
  //               </div>
  //               <div className="text-center">
  //                 <Link
  //                   to={"/signup"}
  //                   className="inline-block align-baseline font-bold text-sm text-black hover:text-blue-800 border border-black p-1 rounded-md"
  //                 >
  //                   New user? - Sign up
  //                 </Link>
  //               </div>
  //             </form>
  //           </div>
  //         ) : (
  //           <div className="bg-gray-500 shadow-2xl rounded px-8 pt-4 pb-4 mb-4">
  //             <form onSubmit={handleVerify2FA}>
  //               <div className="mb-4">
  //                 <label
  //                   className="block text-black text-sm font-bold mb-2"
  //                   htmlFor="twoFACode"
  //                 >
  //                   Code
  //                 </label>
  //                 <input
  //                   className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-black mb-3 leading-tight focus:outline-none focus:shadow-outline"
  //                   id="twoFACode"
  //                   type="twoFACode"
  //                   value={twoFACode}
  //                   placeholder="Code"
  //                   tabIndex={0}
  //                   onChange={(e) => setTwoFACode(e.target.value)}
  //                 />
  //                 <p className="text-black text-sm italic">
  //                   Please enter the code sent to the email address associated
  //                   with your account.
  //                 </p>
  //               </div>

  //               <div className="flex items-center justify-between mb-5">
  //                 <button
  //                   className="inline-block align-baseline font-bold text-lg text-black hover:text-blue-800 border border-black p-1 rounded-md"
  //                   type="submit"
  //                   tabIndex={0}
  //                 >
  //                   Submit
  //                 </button>
  //                 {loading ? <Spinner /> : <></>}
  //               </div>
  //             </form>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //     <Footer />
  //   </div>
  // );
}

export default Login;
