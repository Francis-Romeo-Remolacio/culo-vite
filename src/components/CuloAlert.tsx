import { createContext, useContext, useState, ReactNode } from "react";
import { Alert, Snackbar } from "@mui/material";

// Define the context type
type AlertContextType = {
  makeAlert: (severity: AlertColor, message: string) => void;
};

// Define MUI's AlertColor type for severity levels
type AlertColor = "error" | "warning" | "info" | "success";

// Create the context with a default value
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Hook to use the alert context
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

// Alert Provider component to wrap the app
export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor | undefined>(undefined);

  // Function to show the alert
  const makeAlert = (severity: AlertColor, message: string) => {
    setSeverity(severity);
    setMessage(message);
    setOpen(true);
  };

  // Function to close the alert
  const handleClose = () => {
    setOpen(false);
    setMessage("");
    setSeverity(undefined);
  };

  return (
    <AlertContext.Provider value={{ makeAlert }}>
      {children}
      <Snackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={2500}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={severity} onClose={handleClose}>
          {message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};
