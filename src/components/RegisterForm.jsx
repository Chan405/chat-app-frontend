import React, { useState } from "react";
import axios from "axios";
import { userConst } from "../utils/constants";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(userConst, formData);

      if (data) navigate("/login");
      // Redirect the user or show a success message
    } catch (error) {
      console.error("Error registering user:", error.response.data);
      // Handle registration error
    }
  };

  return (
    <div className="flex items-center justify-center mt-24">
      <form className="flex flex-col gap-4">
        <div>
          <label> Name </label>
          <input
            type="text"
            name="name"
            className="w-full h-8 border border-violet-900 pl-2"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

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
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
