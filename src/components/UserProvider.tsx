import { createContext, ReactNode, useEffect, useState } from "react";
import { User } from "./../utils/Schemas";
import api from "../api/axiosConfig";
import Cookies from "js-cookie";
import dayjs from "dayjs";

export const UserContext = createContext<User | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  useEffect(() => {
    const fetchUserData = async () => {
      const authToken = Cookies.get("authToken");
      const authExpiry = dayjs(Cookies.get("authExpiry"));

      if (authToken) {
        if (dayjs().isBefore(authExpiry)) {
          try {
            const response = await api.get("current-user", {
              headers: { Authorization: `Bearer ${authToken}` },
            });
            setCurrentUser(response.data);
          } catch (error) {
            console.error("Failed to fetch user data from server:", error);
            setCurrentUser(undefined);
          }
        }
        console.error("Expiration date passed or is invalid.");
      } else {
        setCurrentUser(undefined);
      }
      setCurrentUser(undefined);
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={currentUser}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
