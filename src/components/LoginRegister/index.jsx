import React, { useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";

import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

const emptyRegisterData = {
  login_name: "",
  password: "",
  rePassword: "",
  first_name: "",
  last_name: "",
  location: "",
  description: "",
  occupation: "",
};

function getErrorMessage(error, fallbackMessage) {
  const data = error.response?.data;

  if (typeof data === "string") {
    return data;
  }

  return data?.message || fallbackMessage;
}

function LoginRegister({ onLoginSuccess }) {
  const [isLoginView, setIsLoginView] = useState(true);

  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [regData, setRegData] = useState(emptyRegisterData);
  const [regMessage, setRegMessage] = useState({
    text: "",
    isError: false,
  });

  const switchView = (showLogin) => {
    setIsLoginView(showLogin);
    setLoginError("");
    setRegMessage({
      text: "",
      isError: false,
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError("");

    if (!loginName.trim() || !loginPassword) {
      setLoginError("Please enter your username and password.");
      return;
    }

    try {
      const response = await fetchModel("/admin/login", {
        method: "POST",
        data: {
          login_name: loginName.trim(),
          password: loginPassword,
        },
      });

      onLoginSuccess(response.data);
    } catch (error) {
      setLoginError(getErrorMessage(error, "Login failed. Please try again."));
    }
  };

  const handleRegChange = (event) => {
    const { name, value } = event.target;

    setRegData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    setRegMessage({
      text: "",
      isError: false,
    });

    const requiredFields = [
      regData.login_name,
      regData.password,
      regData.rePassword,
      regData.first_name,
      regData.last_name,
    ];

    if (requiredFields.some((value) => !value.trim())) {
      setRegMessage({
        text: "Please fill in all required fields.",
        isError: true,
      });
      return;
    }

    if (regData.password !== regData.rePassword) {
      setRegMessage({
        text: "Passwords do not match.",
        isError: true,
      });
      return;
    }

    const registerPayload = {
      login_name: regData.login_name.trim(),
      password: regData.password,
      first_name: regData.first_name.trim(),
      last_name: regData.last_name.trim(),
      location: regData.location.trim(),
      description: regData.description.trim(),
      occupation: regData.occupation.trim(),
    };

    try {
      await fetchModel("/user", {
        method: "POST",
        data: registerPayload,
      });

      setRegMessage({
        text: "Registration successful.",
        isError: false,
      });

      setRegData(emptyRegisterData);
    } catch (error) {
      setRegMessage({
        text: getErrorMessage(error, "Registration failed. Please try again."),
        isError: true,
      });
    }
  };

  return (
    <Box className="auth-container">
      <Paper className="auth-paper" elevation={1}>
        {isLoginView ? (
          <>
            <Typography variant="h5" className="auth-title">
              Login
            </Typography>

            <form className="auth-form" onSubmit={handleLogin}>
              <TextField
                placeholder="Username"
                value={loginName}
                onChange={(event) => setLoginName(event.target.value)}
                autoComplete="username"
                fullWidth
                required
              />

              <TextField
                placeholder="Password"
                type="password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                autoComplete="current-password"
                fullWidth
                required
              />

              {loginError && (
                <Typography color="error" variant="body2">
                  {loginError}
                </Typography>
              )}

              <Button type="submit" variant="contained" fullWidth>
                Login
              </Button>
            </form>

            <Button
              className="auth-switch-button"
              onClick={() => switchView(false)}
            >
              Create account
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h5" className="auth-title">
              Register
            </Typography>

            <form className="auth-form" onSubmit={handleRegister}>
              <TextField
                placeholder="Username"
                name="login_name"
                value={regData.login_name}
                onChange={handleRegChange}
                fullWidth
                required
              />

              <TextField
                placeholder="Password"
                type="password"
                name="password"
                value={regData.password}
                onChange={handleRegChange}
                fullWidth
                required
              />

              <TextField
                placeholder="Confirm password"
                type="password"
                name="rePassword"
                value={regData.rePassword}
                onChange={handleRegChange}
                fullWidth
                required
              />

              <TextField
                placeholder="First name"
                name="first_name"
                value={regData.first_name}
                onChange={handleRegChange}
                fullWidth
                required
              />

              <TextField
                placeholder="Last name"
                name="last_name"
                value={regData.last_name}
                onChange={handleRegChange}
                fullWidth
                required
              />

              <TextField
                placeholder="Location"
                name="location"
                value={regData.location}
                onChange={handleRegChange}
                fullWidth
              />

              <TextField
                placeholder="Occupation"
                name="occupation"
                value={regData.occupation}
                onChange={handleRegChange}
                fullWidth
              />

              <TextField
                placeholder="Description"
                name="description"
                value={regData.description}
                onChange={handleRegChange}
                multiline
                rows={2}
                fullWidth
              />

              {regMessage.text && (
                <Typography
                  color={regMessage.isError ? "error" : "success.main"}
                  variant="body2"
                >
                  {regMessage.text}
                </Typography>
              )}

              <Button type="submit" variant="contained" fullWidth>
                Register
              </Button>
            </form>

            <Button
              className="auth-switch-button"
              onClick={() => switchView(true)}
            >
              Back to login
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}

export default LoginRegister;
