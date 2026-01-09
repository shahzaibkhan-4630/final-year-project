// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Send,
//   Plus,
//   Search,
//   MoreVertical,
//   Mic,
//   Check,
//   CheckCheck,
//   Edit2,
//   Trash2,
//   X,
// } from "lucide-react";
// import axios from "axios";
// import CompanySidebarLayout from "@/layout/CompanySidebarLayout";

// const BACKEND_URL =
//   process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
// const WS_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "ws://localhost:8000";

// // Configure axios defaults
// const api = axios.create({
//   baseURL: BACKEND_URL,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default function ChatApp() {
//   const [chats, setChats] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [messageInput, setMessageInput] = useState("");
//   const [currentUser, setCurrentUser] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [ws, setWs] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingMessage, setEditingMessage] = useState(null);
//   const [editContent, setEditContent] = useState("");
//   const [typingUsers, setTypingUsers] = useState(new Set());
//   const messagesEndRef = useRef(null);
//   const typingTimeoutRef = useRef(null);

//   // Get current user from getUserData API
//   useEffect(() => {
//     getCurrentUser();
//   }, []);

//   const getCurrentUser = async () => {
//     try {
//       setLoading(true);

//       // Get current user data
//       const userResponse = await api.get("/auth/users/getUserData");
//       console.log("📍 Current User Data:", userResponse.data);
//       setCurrentUser(userResponse.data.userData); // ✅ Extract from userData

//       // Get chats
//       const chatsResponse = await api.get("/chat");
//       setChats(chatsResponse.data);

//     } catch (err) {
//       if (err.response?.status === 404 || err.response?.status === 401) {
//         setError("Not authenticated. Please login first.");
//       } else if (err.response) {
//         setError(
//           `Error: ${err.response.data?.error || "Failed to load data"}`
//         );
//       } else if (err.request) {
//         setError("Connection error. Please check if backend is running.");
//       } else {
//         setError("An unexpected error occurred.");
//       }
//       console.error("Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Refresh chats list
//   const refreshChats = async () => {
//     try {
//       const response = await api.get("/chat");
//       setChats(response.data);
//     } catch (error) {
//       console.error("Failed to refresh chats:", error);
//     }
//   };

//   // Leave current room
//   const leaveCurrentRoom = () => {
//     if (ws && ws.readyState === WebSocket.OPEN) {
//       console.log("🚪 Leaving room:", selectedChat?.id);
//       ws.close();
//       setWs(null);
//     }
//   };

//   // Enter room (connect WebSocket)
//   const enterRoom = (roomId) => {
//     // Close existing connection if any
//     if (ws) {
//       ws.close();
//     }

//     console.log("🚪 Entering room:", roomId);

//     // WebSocket will automatically send cookies for authentication
//     const socket = new WebSocket(`${WS_URL}/ws/chat/${roomId}/`);

//     socket.onopen = () => {
//       console.log("✅ WebSocket connected to room", roomId);
//     };

//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log("📨 WebSocket message:", data);

//       if (data.type === "message") {
//         setMessages((prev) => [...prev, data.message]);
//         refreshChats(); // Update chat list with new last message
//       } else if (data.type === "message_edited") {
//         setMessages((prev) =>
//           prev.map((msg) => (msg.id === data.message.id ? data.message : msg))
//         );
//         refreshChats();
//       } else if (data.type === "message_deleted") {
//         setMessages((prev) => prev.filter((msg) => msg.id !== data.message_id));
//         refreshChats();
//       } else if (data.type === "typing") {
//         handleTypingIndicator(data.username, data.is_typing);
//       } else if (data.type === "user_joined") {
//         console.log(`👋 ${data.username} joined the chat`);
//       } else if (data.type === "user_left") {
//         console.log(`👋 ${data.username} left the chat`);
//         setTypingUsers((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(data.username);
//           return newSet;
//         });
//       }
//     };

//     socket.onerror = (error) => {
//       console.error("❌ WebSocket error:", error);
//     };

//     socket.onclose = (event) => {
//       console.log("🔌 WebSocket disconnected:", event.code, event.reason);
//       setTypingUsers(new Set()); // Clear typing indicators on disconnect
//     };

//     setWs(socket);
//   };

//   // Select a chat and load messages
//   const selectChat = async (chat) => {
//     // Leave current room before entering new one
//     if (selectedChat && selectedChat.id !== chat.id) {
//       leaveCurrentRoom();
//     }

//     setSelectedChat(chat);
//     setMessages([]);
//     setEditingMessage(null);
//     setTypingUsers(new Set());

//     try {
//       const response = await api.get(`/chat/${chat.id}/messages`);
//       setMessages(response.data.messages.reverse());
//     } catch (error) {
//       console.error("Failed to load messages:", error);
//       if (error.response?.status === 403) {
//         setError("You don't have access to this chat");
//       }
//     }

//     // Enter the new room
//     enterRoom(chat.id);
//   };

//   // Cleanup WebSocket on unmount or when leaving chat
//   useEffect(() => {
//     return () => {
//       if (ws) {
//         ws.close();
//       }
//     };
//   }, [ws]);

//   // Send message
//   const sendMessage = () => {
//     if (!messageInput.trim() || !ws || ws.readyState !== WebSocket.OPEN) {
//       console.error("Cannot send message: WebSocket not connected");
//       return;
//     }

//     const message = {
//       type: "message",
//       content: messageInput.trim(),
//     };

//     console.log("📤 Sending message:", message);
//     ws.send(JSON.stringify(message));
//     setMessageInput("");

//     // Stop typing indicator
//     sendTypingIndicator(false);
//   };

//   // Send typing indicator
//   const sendTypingIndicator = (isTyping) => {
//     if (ws && ws.readyState === WebSocket.OPEN) {
//       ws.send(JSON.stringify({
//         type: "typing",
//         is_typing: isTyping,
//       }));
//     }
//   };

//   // Handle typing indicator from others
//   const handleTypingIndicator = (username, isTyping) => {
//     setTypingUsers((prev) => {
//       const newSet = new Set(prev);
//       if (isTyping) {
//         newSet.add(username);
//       } else {
//         newSet.delete(username);
//       }
//       return newSet;
//     });
//   };

//   // Handle input change with typing indicator
//   const handleMessageInputChange = (e) => {
//     setMessageInput(e.target.value);

//     // Send typing indicator
//     sendTypingIndicator(true);

//     // Clear existing timeout
//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//     }

//     // Set new timeout to stop typing indicator after 2 seconds of no typing
//     typingTimeoutRef.current = setTimeout(() => {
//       sendTypingIndicator(false);
//     }, 2000);
//   };

//   // Edit message
//   const startEditMessage = (message) => {
//     setEditingMessage(message);
//     setEditContent(message.content);
//   };

//   const cancelEdit = () => {
//     setEditingMessage(null);
//     setEditContent("");
//   };

//   const saveEdit = () => {
//     if (!editContent.trim() || !editingMessage) {
//       return;
//     }

//     if (ws && ws.readyState === WebSocket.OPEN) {
//       const editPayload = {
//         type: "edit",
//         message_id: editingMessage.id,
//         content: editContent.trim(),
//       };
//       console.log("✏️ Sending edit message:", editPayload);
//       ws.send(JSON.stringify(editPayload));

//       setEditingMessage(null);
//       setEditContent("");
//     } else {
//       console.error("❌ Cannot edit: WebSocket not connected");
//     }
//   };

//   // Delete message
//   const deleteMessage = (messageId) => {
//     if (window.confirm("Are you sure you want to delete this message?")) {
//       if (ws && ws.readyState === WebSocket.OPEN) {
//         const deletePayload = {
//           type: "delete",
//           message_id: messageId,
//         };
//         console.log("🗑️ Sending delete message:", deletePayload);
//         ws.send(JSON.stringify(deletePayload));
//       } else {
//         console.error("❌ Cannot delete: WebSocket not connected");
//       }
//     }
//   };

//   // Handle Enter key
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       if (editingMessage) {
//         saveEdit();
//       } else {
//         sendMessage();
//       }
//     }
//   };

//   // Scroll to bottom
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Filter chats
//   const filteredChats = chats.filter((chat) =>
//     chat.other_user.username.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Format time
//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // Format relative time
//   const formatRelativeTime = (timestamp) => {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diff = now - date;
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));

//     if (days === 0) return formatTime(timestamp);
//     if (days === 1) return "Yesterday";
//     if (days < 7) return `${days} days`;
//     return date.toLocaleDateString();
//   };

//   return (
//     <CompanySidebarLayout>
//       <div className="flex h-[95vh] bg-[#1a1a1a] text-white">
//         {loading ? (
//           <div className="flex-1 flex items-center justify-center">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//               <p className="text-gray-400">Loading chats...</p>
//             </div>
//           </div>
//         ) : error ? (
//           <div className="flex-1 flex items-center justify-center">
//             <div className="text-center">
//               <div className="text-red-500 text-5xl mb-4">⚠️</div>
//               <h3 className="text-xl font-medium text-gray-300 mb-2">
//                 {error}
//               </h3>
//               <button
//                 onClick={getCurrentUser}
//                 className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
//               >
//                 Retry
//               </button>
//             </div>
//           </div>
//         ) : (
//           <>
//             {/* Sidebar */}
//             <div className="w-[380px] border-r border-gray-800 flex flex-col">
//               {/* Header */}
//               <div className="p-6 border-b border-gray-800">
//                 <div className="flex items-center justify-between mb-4">
//                   <h1 className="text-2xl font-semibold">Chats</h1>
//                   <button className="w-10 h-10 rounded-full border border-gray-700 hover:bg-gray-800 flex items-center justify-center transition-colors">
//                     <Plus size={20} />
//                   </button>
//                 </div>

//                 {/* Search */}
//                 <div className="relative">
//                   <Search
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Chats search..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-gray-700"
//                   />
//                 </div>
//               </div>

//               {/* Chat List */}
//               <div className="flex-1 overflow-y-auto">
//                 {filteredChats.length === 0 ? (
//                   <div className="p-8 text-center text-gray-500">
//                     <p>No chats yet</p>
//                     <p className="text-sm mt-2">Create a chat to get started</p>
//                   </div>
//                 ) : (
//                   filteredChats.map((chat) => (
//                     <button
//                       key={chat.id}
//                       onClick={() => selectChat(chat)}
//                       className={`w-full p-4 flex items-start gap-3 hover:bg-gray-900 transition-colors border-b border-gray-800/50 ${
//                         selectedChat?.id === chat.id ? "bg-gray-900" : ""
//                       }`}
//                     >
//                       {/* Avatar */}
//                       <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 relative">
//                         <span className="text-lg font-semibold">
//                           {chat.other_user.username[0].toUpperCase()}
//                         </span>
//                         <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a1a]"></div>
//                       </div>

//                       {/* Chat Info */}
//                       <div className="flex-1 min-w-0 text-left">
//                         <div className="flex items-center justify-between mb-1">
//                           <h3 className="font-medium truncate">
//                             {chat.other_user.username}
//                           </h3>
//                           <span className="text-xs text-gray-500">
//                             {chat.last_message_at
//                               ? formatRelativeTime(chat.last_message_at)
//                               : "New"}
//                           </span>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <p className="text-sm text-gray-400 truncate flex items-center gap-1">
//                             <Check
//                               size={14}
//                               className="text-green-500 flex-shrink-0"
//                             />
//                             {chat.last_message?.content || "Start chatting..."}
//                           </p>
//                           {chat.unread_count > 0 && (
//                             <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
//                               {chat.unread_count}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </button>
//                   ))
//                 )}
//               </div>
//             </div>

//             {/* Main Chat Area */}
//             <div className="flex-1 flex flex-col">
//               {selectedChat ? (
//                 <>
//                   {/* Chat Header */}
//                   <div className="h-20 border-b border-gray-800 px-6 flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center relative">
//                         <span className="text-lg font-semibold">
//                           {selectedChat.other_user.username[0].toUpperCase()}
//                         </span>
//                         <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a1a]"></div>
//                       </div>
//                       <div>
//                         <h2 className="font-semibold">
//                           {selectedChat.other_user.username}
//                         </h2>
//                         <p className="text-sm text-green-500">
//                           {typingUsers.size > 0
//                             ? `${Array.from(typingUsers).join(", ")} typing...`
//                             : "Online"}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-2">
//                       <button className="w-10 h-10 rounded-lg hover:bg-gray-800 flex items-center justify-center transition-colors">
//                         <MoreVertical size={20} />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Messages */}
//                   <div className="flex-1 overflow-y-auto p-6 space-y-4">
//                     {messages.length === 0 ? (
//                       <div className="flex items-center justify-center h-full">
//                         <p className="text-gray-500">
//                           No messages yet. Start the conversation!
//                         </p>
//                       </div>
//                     ) : (
//                       messages.map((message) => {
//                         const isOwnMessage =
//                           String(message.sender.id) === String(currentUser?.id);

//                         console.log("💬 Message:", {
//                           messageId: message.id,
//                           senderId: message.sender.id,
//                           currentUserId: currentUser?.id,
//                           isOwnMessage: isOwnMessage
//                         });

//                         return (
//                           <div
//                             key={message.id}
//                             className={`flex ${
//                               isOwnMessage ? "justify-end" : "justify-start"
//                             } group`}
//                           >
//                             <div
//                               className={`max-w-[70%] ${
//                                 isOwnMessage ? "items-end" : "items-start"
//                               } flex flex-col gap-1`}
//                             >
//                               <div className="flex items-center gap-2">
//                                 {isOwnMessage && (
//                                   <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                     <button
//                                       onClick={() => startEditMessage(message)}
//                                       className="p-1 hover:bg-gray-700 rounded"
//                                       title="Edit message"
//                                     >
//                                       <Edit2 size={14} className="text-gray-400" />
//                                     </button>
//                                     <button
//                                       onClick={() => deleteMessage(message.id)}
//                                       className="p-1 hover:bg-gray-700 rounded"
//                                       title="Delete message"
//                                     >
//                                       <Trash2 size={14} className="text-gray-400" />
//                                     </button>
//                                   </div>
//                                 )}
//                                 <div
//                                   className={`px-4 py-2.5 rounded-2xl ${
//                                     isOwnMessage
//                                       ? "bg-blue-600 text-white rounded-br-sm"
//                                       : "bg-gray-800 text-white rounded-bl-sm"
//                                   }`}
//                                 >
//                                   <p className="text-sm leading-relaxed">
//                                     {message.content}
//                                   </p>
//                                   {message.is_edited && (
//                                     <p className="text-xs text-gray-300 mt-1 opacity-70">
//                                       (edited)
//                                     </p>
//                                   )}
//                                 </div>
//                               </div>
//                               <div className="flex items-center gap-1 px-2">
//                                 <span className="text-xs text-gray-500">
//                                   {formatTime(message.created_at)}
//                                 </span>
//                                 {isOwnMessage && (
//                                   <CheckCheck
//                                     size={14}
//                                     className="text-blue-500"
//                                   />
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })
//                     )}
//                     <div ref={messagesEndRef} />
//                   </div>

//                   {/* Edit Message Bar */}
//                   {editingMessage && (
//                     <div className="border-t border-gray-800 p-3 bg-gray-900/50 flex items-center gap-3">
//                       <Edit2 size={16} className="text-blue-500" />
//                       <div className="flex-1">
//                         <p className="text-xs text-gray-400 mb-1">
//                           Edit message
//                         </p>
//                         <p className="text-sm text-gray-300 truncate">
//                           {editingMessage.content}
//                         </p>
//                       </div>
//                       <button
//                         onClick={cancelEdit}
//                         className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
//                       >
//                         <X size={16} className="text-gray-400" />
//                       </button>
//                     </div>
//                   )}

//                   {/* Message Input */}
//                   <div className="border-t border-gray-800 p-4">
//                     <div className="flex items-center gap-3">
//                       <input
//                         type="text"
//                         placeholder={
//                           editingMessage
//                             ? "Edit your message..."
//                             : "Enter message..."
//                         }
//                         value={editingMessage ? editContent : messageInput}
//                         onChange={(e) =>
//                           editingMessage
//                             ? setEditContent(e.target.value)
//                             : handleMessageInputChange(e)
//                         }
//                         onKeyPress={handleKeyPress}
//                         className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-700"
//                       />

//                       <button className="w-10 h-10 rounded-lg hover:bg-gray-800 flex items-center justify-center transition-colors">
//                         <Mic size={20} className="text-gray-400" />
//                       </button>

//                       <button
//                         onClick={editingMessage ? saveEdit : sendMessage}
//                         className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
//                       >
//                         {editingMessage ? "Save" : "Send"}
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <div className="flex-1 flex items-center justify-center">
//                   <div className="text-center">
//                     <div className="w-32 h-32 mx-auto mb-6 opacity-20">
//                       <svg viewBox="0 0 200 200" fill="currentColor">
//                         <path d="M100 20c-44.1 0-80 35.9-80 80 0 14.8 4 28.6 11.1 40.5L20 180l40.5-11.1C72.4 176 86.2 180 100 180c44.1 0 80-35.9 80-80s-35.9-80-80-80zm0 140c-11.8 0-23.1-3.4-32.7-9.8l-2.3-1.5-23.8 6.2 6.3-23.3-1.6-2.4c-6.9-10.3-10.6-22.3-10.6-34.7 0-33.1 26.9-60 60-60s60 26.9 60 60-26.9 60-60 60z" />
//                       </svg>
//                     </div>
//                     <h3 className="text-xl font-medium text-gray-400 mb-2">
//                       Select a chat to start messaging
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       Choose from your existing conversations on the left
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </CompanySidebarLayout>
//   );
// }

"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Plus,
  Search,
  MoreVertical,
  Mic,
  Check,
  CheckCheck,
  Edit2,
  Trash2,
  X,
  Menu,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import CompanySidebarLayout from "@/layout/CompanySidebarLayout";
import ApplicantSidebarLayout from "@/layout/ApplicantSidebarLayout";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
const WS_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "ws://localhost:8000";

// Configure axios defaults
const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default function ChatApp() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [ws, setWs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Get current user from getUserData API
  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      setLoading(true);

      // Get current user data
      const userResponse = await api.get("/auth/users/getUserData");
      console.log("📍 Current User Data:", userResponse.data);
      setCurrentUser(userResponse.data.userData); // ✅ Extract from userData

      // Get chats
      const chatsResponse = await api.get("/chat");
      setChats(chatsResponse.data);
    } catch (err) {
      if (err.response?.status === 404 || err.response?.status === 401) {
        setError("Not authenticated. Please login first.");
      } else if (err.response) {
        setError(`Error: ${err.response.data?.error || "Failed to load data"}`);
      } else if (err.request) {
        setError("Connection error. Please check if backend is running.");
      } else {
        setError("An unexpected error occurred.");
      }
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh chats list
  const refreshChats = async () => {
    try {
      const response = await api.get("/chat");
      setChats(response.data);
    } catch (error) {
      console.error("Failed to refresh chats:", error);
    }
  };

  // Leave current room
  const leaveCurrentRoom = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log("🚪 Leaving room:", selectedChat?.id);
      ws.close();
      setWs(null);
    }
  };

  // Enter room (connect WebSocket)
  const enterRoom = (roomId) => {
    // Close existing connection if any
    if (ws) {
      ws.close();
    }

    console.log("🚪 Entering room:", roomId);

    // WebSocket will automatically send cookies for authentication
    const socket = new WebSocket(`${WS_URL}/ws/chat/${roomId}/`);

    socket.onopen = () => {
      console.log("✅ WebSocket connected to room", roomId);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📨 WebSocket message:", data);

      if (data.type === "message") {
        setMessages((prev) => [...prev, data.message]);
        refreshChats(); // Update chat list with new last message
      } else if (data.type === "message_edited") {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === data.message.id ? data.message : msg))
        );
        refreshChats();
      } else if (data.type === "message_deleted") {
        setMessages((prev) => prev.filter((msg) => msg.id !== data.message_id));
        refreshChats();
      } else if (data.type === "typing") {
        handleTypingIndicator(data.username, data.is_typing);
      } else if (data.type === "user_joined") {
        console.log(`👋 ${data.username} joined the chat`);
      } else if (data.type === "user_left") {
        console.log(`👋 ${data.username} left the chat`);
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(data.username);
          return newSet;
        });
      }
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    socket.onclose = (event) => {
      console.log("🔌 WebSocket disconnected:", event.code, event.reason);
      setTypingUsers(new Set()); // Clear typing indicators on disconnect
    };

    setWs(socket);
  };

  // Select a chat and load messages
  const selectChat = async (chat) => {
    // Leave current room before entering new one
    if (selectedChat && selectedChat.id !== chat.id) {
      leaveCurrentRoom();
    }

    setSelectedChat(chat);
    setMessages([]);
    setEditingMessage(null);
    setTypingUsers(new Set());

    // Hide sidebar on mobile when chat is selected
    if (window.innerWidth < 1024) {
      setShowSidebar(false);
    }

    try {
      const response = await api.get(`/chat/${chat.id}/messages`);
      setMessages(response.data.messages.reverse());
    } catch (error) {
      console.error("Failed to load messages:", error);
      if (error.response?.status === 403) {
        setError("You don't have access to this chat");
      }
    }

    // Enter the new room
    enterRoom(chat.id);
  };

  // Back to chat list (mobile)
  const backToChatList = () => {
    setShowSidebar(true);
    setSelectedChat(null);
    leaveCurrentRoom();
  };

  // Cleanup WebSocket on unmount or when leaving chat
  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  // Send message
  const sendMessage = () => {
    if (!messageInput.trim() || !ws || ws.readyState !== WebSocket.OPEN) {
      console.error("Cannot send message: WebSocket not connected");
      return;
    }

    const message = {
      type: "message",
      content: messageInput.trim(),
    };

    console.log("📤 Sending message:", message);
    ws.send(JSON.stringify(message));
    setMessageInput("");

    // Stop typing indicator
    sendTypingIndicator(false);
  };

  // Send typing indicator
  const sendTypingIndicator = (isTyping) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "typing",
          is_typing: isTyping,
        })
      );
    }
  };

  // Handle typing indicator from others
  const handleTypingIndicator = (username, isTyping) => {
    setTypingUsers((prev) => {
      const newSet = new Set(prev);
      if (isTyping) {
        newSet.add(username);
      } else {
        newSet.delete(username);
      }
      return newSet;
    });
  };

  // Handle input change with typing indicator
  const handleMessageInputChange = (e) => {
    setMessageInput(e.target.value);

    // Send typing indicator
    sendTypingIndicator(true);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator after 2 seconds of no typing
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(false);
    }, 2000);
  };

  // Edit message
  const startEditMessage = (message) => {
    setEditingMessage(message);
    setEditContent(message.content);
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setEditContent("");
  };

  const saveEdit = () => {
    if (!editContent.trim() || !editingMessage) {
      return;
    }

    if (ws && ws.readyState === WebSocket.OPEN) {
      const editPayload = {
        type: "edit",
        message_id: editingMessage.id,
        content: editContent.trim(),
      };
      console.log("✏️ Sending edit message:", editPayload);
      ws.send(JSON.stringify(editPayload));

      setEditingMessage(null);
      setEditContent("");
    } else {
      console.error("❌ Cannot edit: WebSocket not connected");
    }
  };

  // Delete message
  const deleteMessage = (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      if (ws && ws.readyState === WebSocket.OPEN) {
        const deletePayload = {
          type: "delete",
          message_id: messageId,
        };
        console.log("🗑️ Sending delete message:", deletePayload);
        ws.send(JSON.stringify(deletePayload));
      } else {
        console.error("❌ Cannot delete: WebSocket not connected");
      }
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (editingMessage) {
        saveEdit();
      } else {
        sendMessage();
      }
    }
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Filter chats
  const filteredChats = chats.filter((chat) =>
    chat.other_user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format relative time
  const formatRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return formatTime(timestamp);
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days`;
    return date.toLocaleDateString();
  };

  return (
    <ApplicantSidebarLayout>
      <div className="flex h-[95vh] bg-[#1a1a1a] text-white overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading chats...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center px-4">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-medium text-gray-300 mb-2">
                {error}
              </h3>
              <button
                onClick={getCurrentUser}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Sidebar - Hidden on mobile when chat is selected */}
            <div
              className={`
              ${showSidebar ? "flex" : "hidden lg:flex"}
              w-full lg:w-[380px] border-r border-gray-800 flex-col
            `}
            >
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl sm:text-2xl font-semibold">Chats</h1>
                  <button className="w-10 h-10 rounded-full border border-gray-700 hover:bg-gray-800 flex items-center justify-center transition-colors">
                    <Plus size={20} />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Chats search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-gray-700"
                  />
                </div>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                {filteredChats.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p>No chats yet</p>
                    <p className="text-sm mt-2">Create a chat to get started</p>
                  </div>
                ) : (
                  filteredChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => selectChat(chat)}
                      className={`w-full p-4 flex items-start gap-3 hover:bg-gray-900 transition-colors border-b border-gray-800/50 ${
                        selectedChat?.id === chat.id ? "bg-gray-900" : ""
                      }`}
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 relative">
                        <span className="text-base sm:text-lg font-semibold">
                          {chat.other_user.username[0].toUpperCase()}
                        </span>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a1a]"></div>
                      </div>

                      {/* Chat Info */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium truncate text-sm sm:text-base">
                            {chat.other_user.username}
                          </h3>
                          <span className="text-xs text-gray-500 ml-2">
                            {chat.last_message_at
                              ? formatRelativeTime(chat.last_message_at)
                              : "New"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs sm:text-sm text-gray-400 truncate flex items-center gap-1">
                            <Check
                              size={14}
                              className="text-green-500 flex-shrink-0"
                            />
                            {chat.last_message?.content || "Start chatting..."}
                          </p>
                          {chat.unread_count > 0 && (
                            <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ml-2">
                              {chat.unread_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Main Chat Area - Hidden on mobile when no chat selected */}
            <div
              className={`
              ${!showSidebar || selectedChat ? "flex" : "hidden lg:flex"}
              flex-1 flex-col min-w-0
            `}
            >
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="h-16 sm:h-20 border-b border-gray-800 px-3 sm:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      {/* Back button for mobile */}
                      <button
                        onClick={backToChatList}
                        className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
                      >
                        <ArrowLeft size={20} />
                      </button>

                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-600 flex items-center justify-center relative flex-shrink-0">
                        <span className="text-base sm:text-lg font-semibold">
                          {selectedChat.other_user.username[0].toUpperCase()}
                        </span>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a1a]"></div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-semibold text-sm sm:text-base truncate">
                          {selectedChat.other_user.username}
                        </h2>
                        <p className="text-xs sm:text-sm text-green-500 truncate">
                          {typingUsers.size > 0
                            ? `${Array.from(typingUsers).join(", ")} typing...`
                            : "Online"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg hover:bg-gray-800 flex items-center justify-center transition-colors">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-sm sm:text-base px-4 text-center">
                          No messages yet. Start the conversation!
                        </p>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isOwnMessage =
                          String(message.sender.id) === String(currentUser?.id);

                        console.log("💬 Message:", {
                          messageId: message.id,
                          senderId: message.sender.id,
                          currentUserId: currentUser?.id,
                          isOwnMessage: isOwnMessage,
                        });

                        return (
                          <div
                            key={message.id}
                            className={`flex ${
                              isOwnMessage ? "justify-end" : "justify-start"
                            } group`}
                          >
                            <div
                              className={`max-w-[85%] sm:max-w-[70%] ${
                                isOwnMessage ? "items-end" : "items-start"
                              } flex flex-col gap-1`}
                            >
                              <div className="flex items-center gap-2">
                                {isOwnMessage && (
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => startEditMessage(message)}
                                      className="p-1 hover:bg-gray-700 rounded"
                                      title="Edit message"
                                    >
                                      <Edit2
                                        size={14}
                                        className="text-gray-400"
                                      />
                                    </button>
                                    <button
                                      onClick={() => deleteMessage(message.id)}
                                      className="p-1 hover:bg-gray-700 rounded"
                                      title="Delete message"
                                    >
                                      <Trash2
                                        size={14}
                                        className="text-gray-400"
                                      />
                                    </button>
                                  </div>
                                )}
                                <div
                                  className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl break-words ${
                                    isOwnMessage
                                      ? "bg-blue-600 text-white rounded-br-sm"
                                      : "bg-gray-800 text-white rounded-bl-sm"
                                  }`}
                                >
                                  <p className="text-sm leading-relaxed break-words">
                                    {message.content}
                                  </p>
                                  {message.is_edited && (
                                    <p className="text-xs text-gray-300 mt-1 opacity-70">
                                      (edited)
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 px-2">
                                <span className="text-xs text-gray-500">
                                  {formatTime(message.created_at)}
                                </span>
                                {isOwnMessage && (
                                  <CheckCheck
                                    size={14}
                                    className="text-blue-500"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Edit Message Bar */}
                  {editingMessage && (
                    <div className="border-t border-gray-800 p-3 bg-gray-900/50 flex items-center gap-3">
                      <Edit2
                        size={16}
                        className="text-blue-500 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 mb-1">
                          Edit message
                        </p>
                        <p className="text-sm text-gray-300 truncate">
                          {editingMessage.content}
                        </p>
                      </div>
                      <button
                        onClick={cancelEdit}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
                      >
                        <X size={16} className="text-gray-400" />
                      </button>
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="border-t border-gray-800 p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <input
                        type="text"
                        placeholder={
                          editingMessage
                            ? "Edit your message..."
                            : "Enter message..."
                        }
                        value={editingMessage ? editContent : messageInput}
                        onChange={(e) =>
                          editingMessage
                            ? setEditContent(e.target.value)
                            : handleMessageInputChange(e)
                        }
                        onKeyPress={handleKeyPress}
                        className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:outline-none focus:border-gray-700"
                      />

                      <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg hover:bg-gray-800 flex items-center justify-center transition-colors flex-shrink-0">
                        <Mic size={18} className="text-gray-400" />
                      </button>

                      <button
                        onClick={editingMessage ? saveEdit : sendMessage}
                        className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors text-sm sm:text-base flex-shrink-0"
                      >
                        {editingMessage ? "Save" : "Send"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-4">
                  <div className="text-center max-w-md">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 opacity-20">
                      <svg viewBox="0 0 200 200" fill="currentColor">
                        <path d="M100 20c-44.1 0-80 35.9-80 80 0 14.8 4 28.6 11.1 40.5L20 180l40.5-11.1C72.4 176 86.2 180 100 180c44.1 0 80-35.9 80-80s-35.9-80-80-80zm0 140c-11.8 0-23.1-3.4-32.7-9.8l-2.3-1.5-23.8 6.2 6.3-23.3-1.6-2.4c-6.9-10.3-10.6-22.3-10.6-34.7 0-33.1 26.9-60 60-60s60 26.9 60 60-26.9 60-60 60z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-medium text-gray-400 mb-2">
                      Select a chat to start messaging
                    </h3>
                    <p className="text-sm text-gray-600">
                      Choose from your existing conversations on the left
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </ApplicantSidebarLayout>
  );
}
