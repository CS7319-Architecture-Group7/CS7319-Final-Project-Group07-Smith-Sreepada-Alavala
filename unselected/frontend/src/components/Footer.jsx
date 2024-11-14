import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <div className="pb-10 text-center text-lg bg-sky-700 text-slate-100">
        <p>
          CS 7319 - Software Architecture - Group 7 - Sreepada, Alavala, Smith
        </p>
        <p>
          <a href="#top">Back to top</a>
        </p>
        <div>
          {" "}
          <NavLink
            to={"/performance"}
            className="m-2 inline-block align-baseline font-bold text-sm hover:text-slate-300 border border-black p-1 rounded-md"
          >
            <h1 className="text-xl font-bold">Performance Comparison</h1>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Footer;
