import { useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import { CircularProgress, Container } from "@mui/material";

interface AuthGuardProps {
  children: ReactNode;
  role: string;
}

const AuthGuard = ({ children, role }: AuthGuardProps) => {
  const [currentRole, setCurrentRole] = useState("");
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("token");

  useEffect(() => {
    const checkRoles = () => {
      try {
        if (!token) {
          // If no token is present, user is unauthenticated
          setCurrentRole("Guest");
        } else {
          // Token exists, check user role
          const currentUserStored = localStorage.getItem("currentUser");

          if (currentUserStored) {
            const currentUser = JSON.parse(
              decodeURIComponent(currentUserStored)
            );

            if (currentUser.roles) {
              setCurrentRole(currentUser.roles[0]);
            } else {
              setCurrentRole("Guest");
            }
          } else {
            setCurrentRole("Guest");
          }
        }
      } catch (error) {
        console.error("Error checking authentication and roles:", error);
        setCurrentRole("Guest");
      } finally {
        setLoading(false);
      }
    };

    checkRoles();
  }, [token]);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    ); // or a loading spinner
  }

  if (currentRole === role) {
    return children;
  }
};

export default AuthGuard;
