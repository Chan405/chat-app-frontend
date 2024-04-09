import React, { useContext, useState } from "react";
import { json, useNavigate } from "react-router-dom";
import { userConst } from "./../utils/constants";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${userConst}/login`, formData);

      if (data) {
        navigate("/");
        localStorage.setItem("USER", JSON.stringify(data.user));
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error registering user:", error.response.data);
    }
  };
  return (
    <div className="flex items-center justify-center">
      <form className="flex flex-col gap-4">
        <div>
          <label> Email </label>
          <input
            type="email"
            name="email"
            className="w-full h-8 border border-violet-900 pl-2"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label> Password </label>
          <input
            type="password"
            name="password"
            className="w-full h-8 border border-violet-900 pl-2"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <button
            onClick={handleSubmit}
            className="w-full bg-purple-400 hover:bg-purple-500 text-white font-bold py-3 px-6"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
