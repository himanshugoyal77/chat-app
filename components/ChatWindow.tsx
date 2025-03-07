import Image from "next/image";
import React, { useRef, useEffect } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  Search,
  MoreVertical,
  Paperclip,
  Mic,
  Send,
  Smile,
} from "lucide-react";

interface User extends SupabaseUser {
  avatar_url?: string;
  username: string;
}

interface ChatWindowProps {
  partner: { id: string; username: string; avatar_url?: string } | null;
  messages: Array<{
    id: string;
    content: string;
    created_at: string;
    sender: { id: string; username: string; avatar_url?: string };
  }>;
  loading: boolean;
  newMessage: string;
  setNewMessage: (message: string) => void;
  user: User;
  sendMessage: (e: React.FormEvent) => void;
}

const WhatsAppChatWindow = ({
  partner,
  messages,
  loading,
  newMessage,
  setNewMessage,
  user,
  sendMessage,
}: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      const messagesContainer = messagesEndRef.current.parentElement;
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Format date for message groups
  const formatMessageDate = (date: string) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return "TODAY";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "YESTERDAY";
    } else {
      return messageDate
        .toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
        .toUpperCase();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-100">
      {/* Chat Header */}
      {partner ? (
        <>
          <div className="px-4 h-16 border-b border-gray-200 flex items-center bg-white">
            <div className="relative w-8 h-8 md:w-10 md:h-10 mr-3">
              {partner.avatar_url ? (
                <Image
                  src={partner.avatar_url}
                  alt={partner.username}
                  className="rounded-full object-cover"
                  fill
                  sizes="40px"
                  priority
                />
              ) : (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-teal-600 text-lg">
                    {partner.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-sm md:text-base font-medium leading-5">
                {partner.username}
              </h2>
              <p className="text-xs">online</p>
            </div>

            <div className="flex items-center space-x-4">
              <Search className="h-4 w-4 md:h-5 md:w-5 cursor-pointer" />
              <MoreVertical className="h-4 w-4 md:h-5 md:w-5 cursor-pointer" />
            </div>
          </div>

          {/* Message Area with WhatsApp-style background */}

          <div
            className="h-[75vh] overflow-y-auto p-3 bg-[#e5ddd5] bg-opacity-90 bg-[url('https://web.whatsapp.com/img/bg-chat-tile-light_a4be512e.png')]"
            id="messages-container"
          >
            {loading ? (
              <div className="text-gray-500 text-center py-4">
                Loading messages...
              </div>
            ) : messages && messages.length > 0 ? (
              <div className="space-y-1">
                {/* Group messages by date */}
                {messages.length > 0 && (
                  <div className="flex justify-center my-2">
                    <div className="bg-white px-3 py-1 rounded-lg text-xs text-gray-500 shadow-sm">
                      {formatMessageDate(messages[0].created_at)}
                    </div>
                  </div>
                )}

                {messages.map((message, index) => {
                  const isCurrentUser = message.sender.id === user.id;
                  const showDateHeader =
                    index > 0 &&
                    new Date(message.created_at).toDateString() !==
                      new Date(messages[index - 1].created_at).toDateString();

                  return (
                    <React.Fragment key={message.id}>
                      {showDateHeader && (
                        <div className="flex justify-center my-2">
                          <div className="bg-white px-3 py-1 rounded-lg text-xs text-gray-500 shadow-sm">
                            {formatMessageDate(message.created_at)}
                          </div>
                        </div>
                      )}

                      <div
                        className={`w-full flex flex-row ${
                          isCurrentUser
                            ? "flex-row-reverse gap-2"
                            : "justify-start"
                        }`}
                      >
                        <div className="relative w-6 h-6 md:w-8 md:h-8 mr-3">
                          <Image
                            src={
                              isCurrentUser
                                ? user?.avatar_url || "/default-avatar.png"
                                : partner.avatar_url || "/default-avatar.png"
                            }
                            alt={partner.username}
                            className="rounded-full object-cover"
                            fill
                            sizes="40px"
                            priority
                          />
                        </div>
                        <div
                          className={`max-w-[70%] min-w-[15%] rounded-lg p-2 relative ${
                            isCurrentUser
                              ? "bg-[#dcf8c6] text-black rounded-tr-none"
                              : "bg-white text-black rounded-tl-none"
                          }`}
                        >
                          {
                            <div className="font-medium text-sm text-teal-600">
                              {message.sender.username}
                            </div>
                          }
                          <p className="text-sm">{message.content}</p>
                          <small className="block text-[10px] text-gray-500 text-right mt-1">
                            {new Date(message.created_at).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                            {isCurrentUser && (
                              <span className="ml-1 text-blue-500">✓✓</span>
                            )}
                          </small>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <p className="text-sm mb-1">No messages yet</p>
                  <p className="text-xs">
                    Send a message to start the conversation
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form
            onSubmit={sendMessage}
            className="p-2 bg-gray-100 border-t border-gray-200"
          >
            <div className="flex items-center gap-2 bg-white rounded-full p-1 pl-3">
              <div className="flex items-center gap-2">
                <Smile className="h-4 w-4 md:h-5 md:w-5 text-gray-500 cursor-pointer" />
                <Paperclip className="h-4 w-4 md:h-5 md:w-5 text-gray-500 cursor-pointer" />
              </div>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-1 py-2 px-2 focus:outline-none text-sm"
              />
              {newMessage.trim() ? (
                <button
                  type="submit"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-600 flex items-center justify-center"
                >
                  <Send className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </button>
              ) : (
                <button
                  type="button"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-600 flex items-center justify-center"
                >
                  <Mic className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </button>
              )}
            </div>
          </form>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#f0f2f5]">
          <h2 className="text-xl font-light text-gray-600 mb-2">
            Stay connected
          </h2>
          <p className="text-gray-500 text-sm text-center max-w-md px-4">
            Select a contact to start chatting
          </p>
        </div>
      )}
    </div>
  );
};

export default WhatsAppChatWindow;
