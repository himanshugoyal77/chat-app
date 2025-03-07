import Image from "next/image";
import React from "react";
import { User } from "@supabase/supabase-js";

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

const ChatWindow = ({
  partner,
  messages,
  loading,
  newMessage,
  setNewMessage,
  user,
  sendMessage,
}: ChatWindowProps) => {
  return (
    <div className="flex-1 flex flex-col">
      {partner ? (
        <>
          <div className="px-4 h-14 border-b border-gray-200 flex items-center bg-white">
            <div className="relative w-10 h-10 mr-4">
              {partner.avatar_url ? (
                <Image
                  src={partner.avatar_url}
                  alt={partner.username}
                  className="rounded-full object-cover"
                  fill
                  sizes="48px"
                  priority
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 text-lg">
                    {partner.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold">{partner.username}</h2>
            
          </div>

          <div
            className="flex-1 overflow-auto p-4 bg-gray-100"
            id="messages-container"
          >
            {loading ? (
              <div className="text-gray-500">Loading messages...</div>
            ) : messages && messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.sender.id === user.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender.id === user.id
                        ? "bg-blue-500 text-white"
                        : "bg-white border"
                    }`}
                  >
                    <p>{message.content}</p>
                    <small className="block mt-1 text-xs opacity-70">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </small>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 mt-4">
                No messages yet. Send one to start the conversation!
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                disabled={!newMessage.trim()}
              >
                Send
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <p className="text-gray-500 text-lg">
            Select a user to start chatting
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
