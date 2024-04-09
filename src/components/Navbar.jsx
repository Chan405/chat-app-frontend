import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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

      <div className="flex gap-4">
        {!user ? (
          <Link to="/login"> Login </Link>
        ) : (
          <Link to="/login" onClick={handleLogout}>
            {" "}
            Logout{" "}
          </Link>
        )}
        {!user ? (
          <Link to="/register"> Register </Link>
        ) : (
          <Link to="/"> {user?.name} </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
