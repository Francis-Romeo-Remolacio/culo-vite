// /src/components/AuthGuard.tsx

import { ReactNode, useContext, useEffect, useState } from "react";
import { Center, Loader } from "@mantine/core";
import { UserContext } from "./UserProvider";
import FullscreenThrobber from "./FullscreenThrobber.tsx";

interface AuthGuardProps {
  children: ReactNode;
  role: string;
}

const AuthGuard = ({ children, role }: AuthGuardProps) => {
  const currentUser = useContext(UserContext);
  const [currentRole, setCurrentRole] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRoles = async () => {
      try {
        if (currentUser) {
          setCurrentRole(currentUser.roles?.[0]);
        } else {
          setCurrentRole("Guest");
        }
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
    return children;
  }
};

export default AuthGuard;
