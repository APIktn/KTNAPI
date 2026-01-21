import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    error: null,
    user: null,
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userDataFromToken = jwtDecode(token);
        setState((prevState) => ({
          ...prevState,
          user: userDataFromToken,
          error: null,
        }));
      } catch (error) {
        console.error("Token decoding failed", error);
        localStorage.removeItem("token");
        setState((prevState) => ({
          ...prevState,
          user: null,
          error: "Invalid token",
        }));
      }
    }
  }, []);

  useEffect(() => {
    setState((prevState) => ({ ...prevState, error: null }));
  }, [location.pathname]);

  const register = async (data) => {
    try {
      await axios.post("http://localhost:4000/auth/register", data);
      navigate("/login");
    } catch (error) {
      setState({
        ...state,
        error: error.response?.data?.error || "การลงทะเบียนล้มเหลว",
      });
    }
  };

  const login = async (data) => {
    try {
      const result = await axios.post(
        "http://localhost:4000/auth/login/user",
        data
      );
      const token = result.data.token;
      localStorage.setItem("token", token);
      const userDataFromToken = jwtDecode(token);
      setState({ ...state, user: userDataFromToken, error: null });
      navigate("/");
    } catch (error) {
      setState({
        ...state,
        error: error.response?.data?.error || "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setState({ ...state, user: null, error: null });
  };

  const isAuthenticated = Boolean(state.user);

  return (
    <AuthContext.Provider
      value={{ state, login, logout, register, isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
