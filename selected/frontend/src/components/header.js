import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <div
      className="flex justify-between px-20 py-5 items-center bg-white text-black"
      id="top"
    >
      <div>
        <NavLink
          to={"/"}
          className="m-2 inline-block align-baseline font-bold text-sm text-black hover:text-blue-800 border border-black p-1 rounded-md"
        >
          <h1 className="text-xl text-black font-bold">Quick Polls Home</h1>
        </NavLink>
      </div>
      <div>
        <nav className="flex justify-end px-20 py-5 items-center bg-white text-black-700">
          <div>
            <NavLink
              to={"/login"}
              className="m-2 inline-block align-baseline font-bold text-sm text-black hover:text-blue-800 border border-black p-1 rounded-md"
            >
              <h1 className="text-xl text-black font-bold">Log in</h1>
            </NavLink>
          </div>
          <div>
            <NavLink
              to={"/polls"}
              className="m-2 inline-block align-baseline font-bold text-sm text-black hover:text-blue-800 border border-black p-1 rounded-md"
            >
              <h1 className="text-xl text-black font-bold">
                {/* Profile: {user ? user.username : "not logged in"} */}
                Polls
              </h1>
            </NavLink>
          </div>
          <div>
            <NavLink
              to={"/create-poll"}
              className="m-2 inline-block align-baseline font-bold text-sm text-black hover:text-blue-800 border border-black p-1 rounded-md"
            >
              <h1 className="text-xl text-black font-bold">Create</h1>
            </NavLink>
          </div>
          <div>
            <NavLink
              to={"/about"}
              className="m-2 inline-block align-baseline font-bold text-sm text-black hover:text-blue-800 border border-black p-1 rounded-md"
            >
              <h1 className="text-xl text-black font-bold">About</h1>
            </NavLink>
          </div>
          {/* <div>
            <NavLink
              to={"/logout"}
              className="m-2 inline-block align-baseline font-bold text-sm text-black hover:text-blue-800 border border-black p-1 rounded-md"
            >
              <h1 className="text-xl text-black font-bold">Log out</h1>
            </NavLink>
          </div> */}
        </nav>
      </div>
    </div>
  );
};

export default Header;
