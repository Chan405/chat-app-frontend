import React, { useState } from "react";
import axios from "axios";
import { userConst } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";

function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewPic(reader.result);
      };
      reader.readAsDataURL(file);
    }

    setProfilePic(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDatatoSubmit = new FormData();
    formDatatoSubmit.append("name", formData.name);
    formDatatoSubmit.append("email", formData.email);
    formDatatoSubmit.append("password", formData.password);
    formDatatoSubmit.append("img", profilePic);

    try {
      const { data } = await axios.post(userConst, formDatatoSubmit);

      if (data) navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error.response.data);
    }
  };

  const disabled =
    formData.name.trim().length === 0 ||
    formData.email.trim().length === 0 ||
    formData.password.trim().length === 0 ||
    profilePic === null;

  return (
    <div className="flex items-center justify-center mt-24">
      <form className="flex flex-col gap-4">
        <div>
          <label for="fileInput" className="flex items-center cursor-pointer">
            {profilePic ? (
              <img
                src={previewPic}
                alt="Profile Preview"
                className="w-20 h-20 rounded-full object-cover mx-auto"
              />
            ) : (
              <div className="bg-purple-400 w-16 h-16 rounded-full flex justify-center items-center mx-auto">
                <FaUserEdit class="text-white text-3xl" />
              </div>
            )}

            <input
              id="fileInput"
              type="file"
              style={{ display: "none", zIndex: 3 }}
              onChange={handleFileChange}
            />
          </label>
        </div>
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
            disabled={disabled}
            style={{ opacity: disabled ? 0.7 : 1 }}
            className={`w-full bg-purple-400 hover:bg-purple-500 text-white font-bold py-3 px-6 `}
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
