import { useState, useEffect, useRef } from "react";
import { apiEndpoints, API_BASE_URL } from "../config/api";
import { useLanguage, useTheme } from "../App";

const Messages = ({ user }) => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
      const interval = setInterval(() => {
        fetchMessages(selectedConversation._id);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const res = await fetch(apiEndpoints.getConversations, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const res = await fetch(apiEndpoints.getMessages(conversationId), {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const otherParticipant = selectedConversation.participants.find(
      (p) => p.email !== user.email
    );

    try {
      const res = await fetch(apiEndpoints.sendMessage, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          conversationId: selectedConversation._id,
          receiverId: otherParticipant._id,
          content: newMessage,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessages([...messages, data.message]);
        setNewMessage("");
        fetchConversations(); // Update last message
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find((p) => p.email !== user.email);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark
            ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
            : "bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50"
        }`}
      >
        <div className={`text-xl ${isDark ? "text-white" : "text-gray-900"}`}>
          Please login to view messages
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-8 px-4 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <h1
          className={`text-3xl font-bold mb-6 flex items-center gap-3 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <span className="text-3xl">💬</span>
          {t("messages")}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[70vh]">
          {/* Conversations List */}
          <div
            className={`backdrop-blur-xl rounded-2xl border overflow-hidden ${
              isDark
                ? "bg-white/10 border-white/20"
                : "bg-white border-gray-200 shadow-lg"
            }`}
          >
            <div
              className={`p-4 border-b ${
                isDark ? "border-white/10" : "border-gray-200"
              }`}
            >
              <h2
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Conversations
              </h2>
            </div>
            <div className="overflow-y-auto h-[calc(100%-60px)]">
              {loading ? (
                <div className="p-4 text-gray-400 text-center">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-gray-400 text-center">
                  {t("noConversations")}
                </div>
              ) : (
                conversations.map((conversation) => {
                  const other = getOtherParticipant(conversation);
                  const isSelected =
                    selectedConversation?._id === conversation._id;

                  return (
                    <div
                      key={conversation._id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 border-b border-white/10 cursor-pointer transition-all hover:bg-white/5 ${
                        isSelected
                          ? "bg-purple-500/20 border-l-4 border-l-purple-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                          {other?.profilePicture ? (
                            <img
                              src={`${API_BASE_URL}/${other.profilePicture}`}
                              alt=""
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            other?.name?.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">
                            {other?.name}
                          </p>
                          <p className="text-gray-400 text-sm truncate">
                            {conversation.lastMessage || "No messages yet"}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {getOtherParticipant(selectedConversation)
                      ?.name?.charAt(0)
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {getOtherParticipant(selectedConversation)?.name}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {getOtherParticipant(selectedConversation)?.email}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">
                      {t("noMessages")}
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isMine =
                        message.sender?.email === user.email ||
                        message.sender?._id === user.id;
                      return (
                        <div
                          key={message._id}
                          className={`flex ${
                            isMine ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                              isMine
                                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                : "bg-white/20 text-white"
                            }`}
                          >
                            <p>{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isMine ? "text-white/70" : "text-gray-400"
                              }`}
                            >
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form
                  onSubmit={sendMessage}
                  className="p-4 border-t border-white/10"
                >
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={t("typeMessage")}
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t("send")}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <span className="text-6xl mb-4 block">💬</span>
                  <p>Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
