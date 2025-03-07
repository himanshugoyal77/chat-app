"use client";
import { useState, useEffect, FormEvent } from "react";
import { createClient, User } from "@supabase/supabase-js";
import UsersList from "@/components/UserList";
import ChatWindow from "@/components/ChatWindow";
import { toast } from "sonner";
import supabase from "@/utils/supabaseClient";
import Image from "next/image";

import { redirect, useRouter } from "next/navigation";
import LeftSidebar from "@/components/LeftSidebar";
import Topbar from "@/components/Topbar";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const onSearch = (query: string) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      if (data.user) {
        // Get additional user info from the users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (!userError && userData) {
          setUser(userData as User);
        } else {
          console.error("Error fetching user data:", userError);
          redirect("/");
        }
      }
    };

    fetchUser();
  }, []);

  // Fetch all users except current user
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;

      try {
        // Fetch all users except the current user
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("*")
          .neq("id", user.id);

        if (usersError) throw usersError;

        // Fetch the last message for each user
        const usersWithLastMessage = await Promise.all(
          usersData.map(async (userItem) => {
            const { data: lastMessage, error: lastMessageError } =
              await supabase
                .from("messages")
                .select("content, created_at")
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
                .or(`sender_id.eq.${userItem.id},receiver_id.eq.${userItem.id}`)
                .order("created_at", { ascending: false })
                .limit(1)
                .single();

            if (lastMessageError) {
              console.log("Error fetching last message:", lastMessageError);
              return { ...userItem, last_message: null };
            }

            return {
              ...userItem,
              last_message: lastMessage?.content || null,
              last_message_created_at: lastMessage?.created_at || null,
            };
          })
        );

        console.log("Fetched users:", usersWithLastMessage); // Debug log

        setUsers(usersWithLastMessage);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (user) fetchUsers();
  }, [user]);

  // Handle message subscription
  useEffect(() => {
    if (!selectedChat) return;

    const channel = supabase
      .channel(`messages:${selectedChat}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${selectedChat}`,
        },
        (payload) => {
          // Fetch the complete message with sender info to match existing message format
          const fetchNewMessage = async () => {
            const { data, error } = await supabase
              .from("messages")
              .select(
                `
                id, 
                content, 
                created_at,
                sender:users!sender_id(id, username, avatar_url)
              `
              )
              .eq("id", payload.new.id)
              .single();

            if (!error && data) {
              setMessages((prev) => [...prev, data as Message]);
            }
          };

          fetchNewMessage();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChat]);

  // Fetch messages when chat is selected
  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const { data, error } = await supabase
          .from("messages")
          .select(
            `
            id,
            content,
            created_at,
            sender:users!sender_id(id, username, avatar_url)
          `
          )
          .eq("chat_id", selectedChat)
          .order("created_at", { ascending: true });

        if (error) throw error;
        console.log("Fetched messages:", data); // Debug log
        setMessages((data as Message[]) || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    const messagesContainer = document.getElementById("messages-container");
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  const createChat = async (partnerId: string): Promise<string | null> => {
    if (!user) return null;

    try {
      // Check for existing chat
      const { data: existingChat, error: existingChatError } = await supabase
        .from("chats")
        .select("id")
        .or(
          `and(user1.eq.${user.id},user2.eq.${partnerId}),and(user1.eq.${partnerId},user2.eq.${user.id})`
        )
        .maybeSingle();

      if (existingChatError) throw existingChatError;

      if (existingChat) return existingChat.id;

      // Create new chat
      const { data: newChat, error: newChatError } = await supabase
        .from("chats")
        .insert({ user1: user.id, user2: partnerId })
        .select("id")
        .single();

      if (newChatError) throw newChatError;
      return newChat.id;
    } catch (error) {
      console.error("Error with chat creation:", error);
      return null;
    }
  };

  const handleUserSelect = async (partner: User) => {
    // Clear previous messages when selecting a new user
    setMessages([]);
    setSelectedPartner(partner);

    try {
      const chatId = await createChat(partner.id);
      if (chatId) {
        setSelectedChat(chatId);
      }
    } catch (error) {
      console.error("Error selecting user:", error);
    }
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedChat || !user || !selectedPartner)
      return;

    try {
      const { error } = await supabase.from("messages").insert({
        chat_id: selectedChat,
        sender_id: user.id,
        receiver_id: selectedPartner.id,
        content: newMessage,
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="wrapper w-full flex">
      <LeftSidebar />

      <div className="center_content w-full flex flex-col items-start">
        <Topbar />

        {/* Chat window */}
        <div className="w-full flex h-screen bg-white">
          <UsersList
            users={
              searchQuery
                ? users.filter((user) =>
                    user.username
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                : users
            }
            loading={loadingUsers}
            currentUser={user}
            selectedUser={selectedPartner}
            onUserSelect={handleUserSelect}
            searchQuery={searchQuery}
            onSearch={onSearch}
            filtered={false}
            setFiltered={() => {}}
          />

          <ChatWindow
            partner={selectedPartner}
            messages={messages}
            loading={loadingMessages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            user={user}
            sendMessage={sendMessage}
          />
        </div>
      </div>

      {/* right sidebar */}
      <div className="right_sidebar"></div>
    </div>
  );
}
