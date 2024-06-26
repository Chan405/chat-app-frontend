import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./components/Navbar";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <ChatContextProvider>
      <BrowserRouter>
        <div className="bg-fuchsia-200 h-screen">
          <Navbar />

          <Routes>
            <Route path="/" element={user ? <ChatPage /> : <LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<ChatPage />} />
          </Routes>

          <ToastContainer />

        </div>
      </BrowserRouter>
    </ChatContextProvider>
  );
}

export default App;
