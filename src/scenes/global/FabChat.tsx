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
import { Tokens } from "../../Theme";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import {
  DefaultHttpClient,
  HttpRequest,
  HttpResponse,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import Cookies from "js-cookie";
import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";
import { DirectMessage, User } from "../../utils/Schemas";
import api from "../../api/axiosConfig";

// class CustomHttpClient extends DefaultHttpClient {
//   private bearer: string | null;

//   constructor(logger: ILogger, bearer: string | null = null) {
//     super(logger);
//     this.bearer = bearer;
//   }

//   public async send(request: HttpRequest): Promise<HttpResponse> {
//     const baseAuth = `Basic MTExOTY5MTM6NjAtZGF5ZnJlZXRyaWFs`;
//     let authHeader = baseAuth;

//     if (this.bearer) {
//       authHeader += `, Bearer ${this.bearer}`;
//     }

//     request.headers = {
//       ...request.headers,
//       Authorization: authHeader,
//     };

//     return await super.send(request);
//   }
// }

class CustomHttpClient extends DefaultHttpClient {
  cookieToken = Cookies.get("token");

  public send(request: HttpRequest): Promise<HttpResponse> {
    request.headers = {
      ...request.headers,
      Authorization: `Basic MTExOTY5MTM6NjAtZGF5ZnJlZXRyaWFs, Bearer ${this.cookieToken}`,
    };
    return super.send(request);
  }
}

interface OnlineUser {
  connection_id: string;
  account_id: string;
  name: string;
  role: string;
}

type MessageProps = {
  directMessage: DirectMessage;
};

const MessageLeft = ({ directMessage }: MessageProps) => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  return (
    <Stack direction="row" mt={2}>
      <Avatar>{directMessage.sender.match(/\b\w/g)?.join("")}</Avatar>
      <Container
        sx={{
          backgroundColor: colors.panel,
          borderRadius: 2,
          p: 1,
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          maxWidth: "70%",
        }}
      >
        <Box fontSize="smaller" color="grey.600">
          {directMessage.sender} -{" "}
          {directMessage.timestamp.toLocaleTimeString()}
        </Box>
        {directMessage.message}
      </Container>
    </Stack>
  );
};

const MessageRight = ({ directMessage }: MessageProps) => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  return (
    <Stack direction="row" mt={2}>
      <Container
        sx={{
          backgroundColor: colors.panel,
          borderRadius: 2,
          p: 1,
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          maxWidth: "70%",
        }}
      >
        <Box fontSize="smaller" color="grey.600">
          {directMessage.sender} -{" "}
          {directMessage.timestamp.toLocaleTimeString()}
        </Box>
        {directMessage.message}
      </Container>
      <Avatar>{directMessage.sender.match(/\b\w/g)?.join("")}</Avatar>
    </Stack>
  );
};

const FabChat = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );

  const [currentUser, setCurrentUser] = useState<User>();
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<DirectMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  useEffect(() => {
    api.get("current-user").then((response) => {
      const parsedUser: User = {
        id: response.data.id,
        email: response.data.email,
        username: response.data.username,
        roles: response.data.roles,
        phoneNumber: response.data.phoneNumber,
        isEmailConfirmed: response.data.isEmailConfirmed,
        joinDate: response.data.joinDate,
      };
      setCurrentUser(parsedUser);
    });
  }, []);

  // Start the SignalR connection
  useEffect(() => {
    let isMounted = true;

    const initializeConnection = async () => {
      try {
        const cookieToken = Cookies.get("token");
        if (cookieToken) {
          const bearerToken = `${cookieToken}, Basic MTExOTY5MTM6NjAtZGF5ZnJlZXRyaWFs`;

          const fullUrl = `https://resentekaizen280-001-site1.etempurl.com/live-chat?access_token=${encodeURIComponent(
            bearerToken
          )}`;

          const newConnection = new HubConnectionBuilder()
            .withUrl(fullUrl, { accessTokenFactory: () => bearerToken })
            .withAutomaticReconnect()
            .build();

          if (isMounted) {
            setConnection(newConnection);

            newConnection
              .start()
              .then(() => {
                console.log("Connected to SignalR!");

                // Handle receiving messages
                newConnection.on("RecieveMessage", (parsed_message) => {
                  const formattedMessage = {
                    sender: parsed_message.senderName || "Unknown",
                    message: `${parsed_message.senderMessage}`,
                    timestamp: new Date(parsed_message.senderMessageTimeSent),
                  };
                  setChatMessages((prevMessages) => [
                    ...prevMessages,
                    formattedMessage,
                  ]);
                });
              })
              .catch((err) => console.error("SignalR Connection Error: ", err));
          }
        }
      } catch (error) {
        console.error("Error initializing connection:", error);
      }
    };

    initializeConnection();

    return () => {
      isMounted = false;
      if (connection) connection.stop();
    };
  }, []);

  // Autoscroll
  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatMessages]);

  // Error Handling and Connection Management
  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => console.log("Connected"))
        .catch((err) => console.error("Failed to connect", err));
    }
  }, [connection]);

  // Fetch online users
  const refreshConnections = () => {
    api
      .get(
        `ui-helpers/live-chat/online-${
          currentUser?.roles[0] === "Admin" ? "users" : "admins"
        }`
      )
      .then((response) => {
        setOnlineUsers(response.data);
      });
  };

  // Send message as a customer or admin
  const sendMessage = (role?: string) => {
    if (!connection || !message.trim()) return;

    if (currentUser) {
      var sendMethod: string = "customer-send-message";
      switch (role) {
        case "Admin":
          sendMethod = "admin-send-message";
          break;
        case "Artist":
          sendMethod = "artist-send-message";
          break;
        case "Manager":
          sendMethod = "manager-send-message";
          break;
      }
      connection
        .invoke(sendMethod, message.trim(), selectedUser)
        .catch((err) => console.error(`Error sending ${role} message:`, err));
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
              backgroundColor: colors.analogous1[300],
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
                  label="Select User"
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  {onlineUsers.map((user) => (
                    <MenuItem key={user.account_id} value={user.account_id}>
                      {`${user.name} (${user.role})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button onClick={refreshConnections}>Refresh Connections</Button>

              <Box id="chat-container" sx={{ height: 400, overflowY: "auto" }}>
                {chatMessages.map((msg, index) =>
                  msg.sender === "Admin" ? (
                    <MessageRight key={index} directMessage={msg} />
                  ) : (
                    <MessageLeft key={index} directMessage={msg} />
                  )
                )}
              </Box>
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
                  onClick={() => sendMessage(currentUser?.roles[0])}
                >
                  <SendIcon />
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
