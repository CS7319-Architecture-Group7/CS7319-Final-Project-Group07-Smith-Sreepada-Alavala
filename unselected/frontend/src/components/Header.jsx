import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const { user } = useAuth();

  return (
    <div
      className="flex justify-between px-20 py-5 items-center bg-sky-700 text-slate-100"
      id="top"
    >
      <div>
        <NavLink
          to={"/top-polls"}
          className="m-2 inline-block align-baseline font-bold text-sm hover:text-slate-300 border border-black p-1 rounded-md"
        >
          <h1 className="text-xl font-bold">
            Quick Polls Home - Client-Server Architecture
          </h1>
        </NavLink>
      </div>
      <div>
        <nav className="flex justify-end px-20 py-5 items-center bg-sky-700 text-slate-100">
          {/* <div>
            <NavLink
              to={"/login"}
              className="m-2 inline-block align-baseline font-bold text-sm hover:text-slate-300 border border-black p-1 rounded-md"
            >
              <h1 className="text-xl font-bold">Log in</h1>
            </NavLink>
          </div> */}
          <div className="m-2 inline-block align-baseline font-bold text-xl font-bold">
            {user ? <div>User ID: {user.id}</div> : <div>Not logged in</div>}
          </div>
          <div>
            <NavLink
              to={"/top-polls"}
              className="m-2 inline-block align-baseline font-bold text-sm hover:text-slate-300 border border-black p-1 rounded-md"
            >
              <h1 className="text-xl font-bold">Top 10 Polls</h1>
            </NavLink>
          </div>
          <div>
            <NavLink
              to={"/polls"}
              className="m-2 inline-block align-baseline font-bold text-sm hover:text-slate-300 border border-black p-1 rounded-md"
            >
              <h1 className="text-xl font-bold">
                {/* Profile: {user ? user.username : "not logged in"} */}
                My Polls
              </h1>
            </NavLink>
          </div>
          <div>
            <NavLink
              to={"/create-poll"}
              className="m-2 inline-block align-baseline font-bold text-sm hover:text-slate-300 border border-black p-1 rounded-md"
            >
              <h1 className="text-xl font-bold">Create</h1>
            </NavLink>
          </div>
          <div>
            <NavLink
              to={"/about"}
              className="m-2 inline-block align-baseline font-bold text-sm hover:text-slate-300 border border-black p-1 rounded-md"
            >
              <h1 className="text-xl font-bold">About</h1>
            </NavLink>
          </div>
          <div>
            {user ? (
              <NavLink
                to={"/logout"}
                className="m-2 inline-block align-baseline font-bold text-sm hover:text-slate-300 border border-black p-1 rounded-md"
              >
                <h1 className="text-xl font-bold">Log out</h1>
              </NavLink>
            ) : (
              <NavLink
                to={"/login"}
                className="m-2 inline-block align-baseline font-bold text-sm hover:text-slate-300 border border-black p-1 rounded-md"
              >
                <h1 className="text-xl font-bold">Log in</h1>
              </NavLink>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
