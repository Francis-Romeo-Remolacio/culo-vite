import { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";

interface OnlineUser {
  name: string;
  role: string;
  account_id: string;
}

type ChatProps = {
  userType?: "customer" | "manager";
};
const Chat = ({ userType }: ChatProps) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [bearerToken, setBearerToken] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [selectedUser, setSelectedUser] = useState("");

  // Initialize SignalR connection
  const initializeConnection = () => {
    if (!bearerToken) {
      alert("Please enter a Bearer Token");
      return;
    }

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://resentekaizen280-001-site1.etempurl.com/live-chat/", {
        accessTokenFactory: () => bearerToken,
      })
      .build();

    setConnection(newConnection);

    newConnection.on("RecieveMessage", (parsed_message: any) => {
      const chatBox = document.getElementById("chatBox");
      if (chatBox) {
        chatBox.innerHTML += `<p><strong>${parsed_message.sender_name}</strong>: ${parsed_message.sender_message} ${parsed_message.sender_message_time_sent}</p>`;
      }
    });
  };

  // Start the connection
  const startConnection = () => {
    if (connection) {
      connection
        .start()
        .then(() => console.log("Connected!"))
        .catch((err) => console.error("Connection failed: ", err));
    }
  };

  // Send message as Customer
  const sendMessageCustomer = () => {
    if (connection) {
      connection.invoke("customer-send-message", message, selectedUser);
      setMessage("");
    }
  };

  // Send message as Admin
  const sendMessageAdmin = () => {
    if (connection) {
      connection.invoke("admin-send-message", message, selectedUser);
      setMessage("");
    }
  };

  // Refresh online users list
  const refreshConnections = async () => {
    try {
      const response = await fetch(
        `http://resentekaizen280-001-site1.etempurl.com/culo-api/v1/ui-helpers/live-chat/online-${
          userType === "customer" ? "admins" : "users"
        }`
      );
      const data: OnlineUser[] = await response.json();
      setOnlineUsers(data);
    } catch (error) {
      console.error("Error fetching online users: ", error);
    }
  };

  // Handle component unmount
  useEffect(() => {
    return () => {
      connection?.stop();
    };
  }, [connection]);

  return (
    <div>
      <div>
        <input
          type="text"
          id="message"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type="text"
          id="bearer-token"
          placeholder="Bearer token"
          value={bearerToken}
          onChange={(e) => setBearerToken(e.target.value)}
        />
        <select
          id="connection-options"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          {onlineUsers.map((user) => (
            <option key={user.account_id} value={user.account_id}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>
        <button onClick={refreshConnections}>Refresh connections</button>
        <br />
        {userType === "manager" ? (
          <button onClick={sendMessageAdmin}>Send: Admin</button>
        ) : (
          <button onClick={sendMessageCustomer}>Send: Customer</button>
        )}
        <button
          onClick={() => {
            initializeConnection();
            startConnection();
          }}
        >
          Start Connection
        </button>
      </div>
      <div id="chatBox"></div>
    </div>
  );
};

export default Chat;
