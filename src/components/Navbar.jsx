import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Notification from "./Notification";
import { profileConst } from "../utils/constants";

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("USER");
  };

  return (
    <div className="bg-purple-400 text-white font-bold py-3 px-6 shadow-md flex items-center justify-between">
      <Link to="/" className="logo">
        <h2 className="text-xl"> Channie Chat </h2>
      </Link>

      <div className="flex items-center gap-4">
        {user && <Notification />}
        {!user ? (
          <Link to="/login"> Login </Link>
        ) : (
          <Link to="/login" onClick={handleLogout}>
            Logout
          </Link>
        )}
        {!user ? (
          <Link to="/register"> Register </Link>
        ) : (
          <Link to="/" className="flex items-center gap-4">
            <img
              src={`${profileConst}/${user.profilePic}`}
              className="w-10 h-10 rounded-full object-cover"
            />
            {user?.name}
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
