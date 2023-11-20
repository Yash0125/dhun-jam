import React, { useState } from "react";
import axios from "axios";
import "./login.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://stg.dhunjam.in/account/admin/login",
        {
          username: username,
          password: password,
        }
      );
      console.log("login response", response);
      if (response.data.status === 200) {
        const token = response.data.data.token;
        onLogin(token);
      } else {
        // Handle login error
        console.error(
          "Login failed. Server error:",
          response.data.server_err_msg
        );
      }
    } catch (error) {
      // Handle network error
      console.error("Network error:", error.message);
    }
  };

  return (
    <div className="login-container">
      <h1>Venue Admin Login</h1>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button onClick={handleLogin}>Sign In</button>
    </div>
  );
};

export default Login;
