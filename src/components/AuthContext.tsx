import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import api from "./../api/axiosConfig";
import { User } from "./../utils/Schemas";
import { useAlert } from "./CuloAlert";
import { getImageType } from "./Base64Image";

interface AuthContextType {
  currentUser: User | null;
  userPicture: string | null;
  imageType: string | null;
  isAuthenticated: boolean;
  authError: string;
  register: (
    username: string,
    email: string,
    contactNumber: string,
    password: string
  ) => Promise<void>;
  login: (email: string, password: string, fromLink?: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  logout: () => void;
  role: string | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userPicture, setUserPicture] = useState("");
  const [imageType, setImageType] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | undefined>(undefined);
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();
  const { makeAlert } = useAlert();

  const fetchCurrentUser = async () => {
    try {
      await api.get("current-user").then((response) => {
        const parsedUser: User = {
          id: response.data.user_id,
          email: response.data.email,
          username: response.data.username,
          roles: response.data.roles,
          phoneNumber: response.data.phoneNumber,
          isEmailConfirmed: response.data.isEmailConfirmed,
          joinDate: new Date(response.data.joinDate),
        };
        setIsAuthenticated(true);
        setCurrentUser(parsedUser);
        setRole(parsedUser.roles[0] || "Guest");
        localStorage.setItem("currentUser", JSON.stringify(parsedUser));
      });
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      logout(); // If the token is invalid or expired, log out
    }
  };
  const register = async (
    username: string,
    email: string,
    contactNumber: string,
    password: string
  ) => {
    const trimmedContactNumber = contactNumber.replace(/^0+/, "");
    await api.post("users/register-customer", {
      username: username,
      email: email,
      contactNumber: trimmedContactNumber,
      password: password,
    });
    makeAlert(
      "success",
      "Registration successful! Please check your email for verification."
    );
    navigate("/login");
  };

  const login = async (email: string, password: string, fromLink?: string) => {
    function navigate(destination: string, subdomain = "") {
      const { protocol, hostname, port } = window.location;

      // Construct the base URL with protocol, subdomain (if provided), hostname, and port (if present)
      const baseURL = subdomain
        ? `${protocol}//${subdomain}.${hostname}`
        : `${protocol}//${hostname}`;

      // Include the port if it's not the default port (80 for HTTP, 443 for HTTPS)
      const fullURL =
        port && port !== "80" && port !== "443"
          ? `${baseURL}:${port}${destination}`
          : `${baseURL}${destination}`;

      window.location.href = fullURL;
    }

    const response = await api
      .post("users/login", { email, password })
      .catch(function (error) {
        if (error.status === 401) {
          setAuthError(`Error: ${error.response.data.message}`);
        } else if (error.status >= 500) {
          setAuthError("Server-side error occurred. Please try again later.");
        } else {
          setAuthError("Unknown error occurred. Please try again.");
        }
      });

    if (response && response.status === 200) {
      // Save token as a cookie
      const { token, expiration } = response.data;
      Cookies.set("token", token, { expires: new Date(expiration) });

      // Fetch user data
      try {
        fetchCurrentUser();
        navigate(fromLink || "/");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getUserPicture = async () => {
    try {
      const response = await api.get("current-user/profile-picture");
      setUserPicture(response.data);
      setImageType(getImageType(response.data));
    } catch (error) {
      console.error("Error fetching user picture:", error);
      return null; // Handle error appropriately
    }
  };

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setIsAuthenticated(false);
    setRole("Guest");
    makeAlert("info", "You have been logged out.");
    navigate("/");
  };

  const relogin = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setIsAuthenticated(false);
    makeAlert("info", "Your token has expired. Please log in again");
    navigate("/login");
  };

  const forgotPassword = async (email: string) => {
    try {
      await api.post("users/send-forgot-password-email", email, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      makeAlert("success", "Email sent! Please check your inbox.");
      navigate("/login");
    } catch (error) {
      console.error("Failed to send forgot password email", error);
      setAuthError(String(error));
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      await api.post("current-user/reset-password", {
        resetPasswordToken: token,
        newPassword: password,
      });
      makeAlert("success", "Password reset successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Failed to reset password", error);
      setAuthError(String(error));
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      fetchCurrentUser();
      getUserPicture();
    } else {
      if (localStorage.getItem("currentUser")) {
        relogin();
      }
      setRole("Guest");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userPicture,
        imageType,
        isAuthenticated,
        authError,
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
