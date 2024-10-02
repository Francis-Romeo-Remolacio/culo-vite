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
  ILogger,
  LogLevel,
} from "@microsoft/signalr";
import Cookies from "js-cookie";
import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";
import { DirectMessage } from "../../utils/Schemas";
import api from "../../api/axiosConfig";

class CustomHttpClient extends DefaultHttpClient {
  private token: string;
  private bearer: string | null;

  constructor(logger: ILogger, token: string, bearer: string | null = null) {
    super(logger);
    this.token = token;
    this.bearer = bearer;
  }

  public send(request: HttpRequest): Promise<HttpResponse> {
    const baseAuth = `Basic MTExOTY5MTM6NjAtZGF5ZnJlZXRyaWFs`;
    let authHeader = baseAuth;

    if (this.bearer) {
      authHeader += `, Bearer ${this.bearer}`;
    }

    request.headers = {
      ...request.headers,
      Authorization: authHeader,
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
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<DirectMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [bearerToken, setBearerToken] = useState<string>("");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  // Start the SignalR connection
  useEffect(() => {
    let isMounted = true;

    const initializeConnection = async () => {
      try {
        const cookieToken = Cookies.get("token");
        if (cookieToken) {
          setBearerToken(`Bearer ${cookieToken}`);
        }

        const newConnection = new HubConnectionBuilder()
          .withUrl(
            "http://resentekaizen280-001-site1.etempurl.com/live-chat/",
            {
              httpClient: new CustomHttpClient(
                new ConsoleLogger(LogLevel.Information),
                "MTExOTY5MTM6NjAtZGF5ZnJlZXRyaWFs",
                cookieToken
              ),
            }
          )
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
                  message: `${parsed_message.senderMessage}\n${new Date(
                    parsed_message.senderMessageTimeSent
                  ).toLocaleString()}`,
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
    fetch("http://localhost:5155/culo-api/v1/ui-helpers/live-chat/online-users")
      .then((response) => response.json())
      .then((jsonArray) => {
        setOnlineUsers(jsonArray);
      });
  };

  // Send message as a customer or admin
  const sendMessage = (role: string) => {
    if (!connection || !message.trim()) return;

    const sendMethod =
      role === "admin" ? "admin-send-message" : "customer-send-message";

    connection
      .invoke(sendMethod, message.trim(), selectedUser)
      .then(() => {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: role === "admin" ? "Admin" : "Customer",
            message: message,
            timestamp: new Date(),
          },
        ]);
        setMessage("");
      })
      .catch((err) => console.error(`Error sending ${role} message:`, err));
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
              {chatMessages.map((msg, index) =>
                msg.sender === "Admin" ? (
                  <MessageRight key={index} directMessage={msg} />
                ) : (
                  <MessageLeft key={index} directMessage={msg} />
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
