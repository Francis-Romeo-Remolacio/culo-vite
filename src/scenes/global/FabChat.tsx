import React, { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Fab,
  IconButton,
  Paper,
  Popper,
  Stack,
  TextField,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";
import { Tokens } from "../../theme";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import * as signalR from "@microsoft/signalr";
import Cookies from "js-cookie";

// Message interface from the schema
export interface Message {
  text: string;
  sender: string;
  sender_message_time_sent: Date;
}

// Props for MessageLeft and MessageRight
interface MessageProps {
  message: Message;
}

const MessageLeft: React.FC<MessageProps> = ({ message }) => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  return (
    <Stack direction="row" mt={2}>
      <Avatar>{message.sender.match(/\b\w/g)?.join("")}</Avatar>
      <Container sx={{ backgroundColor: colors.panel, borderRadius: 2 }}>
        {message.text}
      </Container>
    </Stack>
  );
};

const MessageRight: React.FC<MessageProps> = ({ message }) => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  return (
    <Stack direction="row" mt={2}>
      <Container sx={{ backgroundColor: colors.primary[400], borderRadius: 2 }}>
        {message.text}
      </Container>
      <Avatar>{message.sender.match(/\b\w/g)?.join("")}</Avatar>
    </Stack>
  );
};

const FabChat: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [message, setMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<
    { account_id: string; name: string; role: string }[]
  >([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [bearerToken, setBearerToken] = useState<string>("");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  // Start the SignalR connection
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setBearerToken(`Bearer ${token}`);
    }

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5155/live-chat/", {
        accessTokenFactory: () => bearerToken,
      })
      .build();

    setConnection(newConnection);

    if (newConnection) {
      newConnection.start().then(() => {
        console.log("Connected to SignalR!");
        newConnection.on("RecieveMessage", (parsed_message: Message) => {
          setChatMessages((prevMessages) => [
            ...prevMessages,
            {
              sender: parsed_message.sender,
              text: `${parsed_message.text}\n${parsed_message.sender_message_time_sent}`,
              sender_message_time_sent: new Date(
                parsed_message.sender_message_time_sent
              ),
            },
          ]);
        });
      });
    }
  }, [bearerToken]);

  // Fetch online users
  const refreshConnections = () => {
    fetch("http://localhost:5155/culo-api/v1/ui-helpers/live-chat/online-users")
      .then((response) => response.json())
      .then((jsonArray) => {
        setOnlineUsers(jsonArray);
      });
  };

  // Send message as a customer or admin
  const sendMessage = (role: "admin" | "customer") => {
    if (connection) {
      const sendMethod =
        role === "admin" ? "admin-send-message" : "customer-send-message";
      connection.invoke(sendMethod, message, selectedUser).then(() => {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: role === "admin" ? "Admin" : "Customer",
            text: message,
            sender_message_time_sent: new Date(),
          },
        ]);
        setMessage("");
      });
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ top: "auto", bottom: 0, background: "none", boxShadow: "none" }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <Fab
            onClick={handleClick}
            sx={{
              position: "sticky",
              bottom: 16,
              right: 16,
            }}
          >
            <ChatIcon />
          </Fab>
        </Toolbar>
      </AppBar>

      <Popper id={id} open={open} anchorEl={anchorEl} placement="top">
        <Paper
          sx={{
            position: "sticky",
            bottom: 0,
            right: 0,
            minWidth: "300px",
          }}
        >
          <IconButton onClick={() => setAnchorEl(null)}>
            <CloseIcon />
          </IconButton>

          <Stack spacing={2} padding={2}>
            <Box>
              <FormControl fullWidth>
                <InputLabel id="user-select-label">Select User</InputLabel>
                <Select
                  labelId="user-select-label"
                  id="connection-options"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  {onlineUsers.map((user) => (
                    <MenuItem key={user.account_id} value={user.account_id}>
                      {user.name} ({user.role})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button onClick={refreshConnections}>Refresh Connections</Button>
              {chatMessages.map((msg, index) =>
                msg.sender === "Admin" ? (
                  <MessageRight key={index} message={msg} />
                ) : (
                  <MessageLeft key={index} message={msg} />
                )
              )}
            </Box>

            <Box>
              <Stack direction="row">
                <TextField
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message"
                />
                <Button
                  variant="contained"
                  onClick={() => sendMessage("customer")}
                >
                  <SendIcon />
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => sendMessage("admin")}
                >
                  Send as Admin
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Popper>
    </>
  );
};

export default FabChat;
