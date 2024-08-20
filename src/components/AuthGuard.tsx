import { ReactNode, useEffect, useState } from "react";
import Cookies from "js-cookie";
import FullscreenThrobber from "./FullscreenThrobber.tsx";

interface AuthGuardProps {
  children: ReactNode;
  role: string;
}

const AuthGuard = ({ children, role }: AuthGuardProps) => {
  const [currentRole, setCurrentRole] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRoles = async () => {
      try {
        const currentUserCookie = Cookies.get("currentUser");

        if (currentUserCookie) {
          const currentUser = JSON.parse(decodeURIComponent(currentUserCookie));

          if (currentUser.roles && currentUser.roles.length > 0) {
            setCurrentRole(currentUser.roles[0]);
          } else {
            setCurrentRole("Guest");
          }
        } else {
          setCurrentRole("Guest");
        }
      } catch (error) {
        console.error("Error parsing currentUser cookie:", error);
        setCurrentRole("Guest");
      } finally {
        setLoading(false);
      }
    };
    checkRoles();
  }, []);

  if (loading) {
    return <FullscreenThrobber />;
  }

  if (currentRole === role) {
    return <>{children}</>;
  }

  return null; // or render an unauthorized message/component
};

export default AuthGuard;
