import {
  Bell,
  Filter,
  FolderPlusIcon,
  Menu,
  MessageSquare,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import supabase from "@/utils/supabaseClient";

interface User {
  id: string;
  avatar_url?: string;
  username: string;
  last_message?: string;
  last_message_created_at?: string;
}

interface UserListProps {
  users: User[];
  loading: boolean;
  currentUser: User;
  onUserSelect: (user: User) => void;
  selectedUser: User;
  searchQuery: string;
  onSearch: (query: string) => void;
  filtered: boolean;
  setFiltered: (filtered: boolean) => void;
}

const UserList = ({
  users,
  loading,
  currentUser,
  onUserSelect,
  selectedUser,
  searchQuery,
  onSearch,
  filtered,
  setFiltered,
}: UserListProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    // Get the start of today (midnight)
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    // Get the start of yesterday (midnight of the previous day)
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfToday.getDate() - 1);
    // Get the start of the week (7 days ago)
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - 7);

    // Check if the date is today
    if (date >= startOfToday) {
      return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true, // This ensures 12-hour format with AM/PM
      });
    }
    // Check if the date is yesterday
    if (date >= startOfYesterday && date < startOfToday) {
      return "Yesterday";
    }
    // Check if the date is within the last 7 days
    if (date >= startOfWeek) {
      return date.toLocaleDateString([], { weekday: "long" }); // e.g., "Monday"
    }
    // For older dates, return the full date
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Toggle sidebar for mobile view
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Mobile menu toggle - visible only on small screens */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-md"
      >
        {sidebarOpen ? (
          <X className="h-5 w-5 text-gray-700" />
        ) : (
          <Menu className="h-5 w-5 text-gray-700" />
        )}
      </button>

      {/* User list sidebar */}
      <div
        className={`
            w-full md:w-80 lg:w-96 border-r bg-gray-50 flex-shrink-0
            ${
              sidebarOpen ? "fixed md:relative inset-0 z-40" : "hidden md:block"
            }
            transition-all duration-300 ease-in-out
          `}
      >
        <div className="sticky top-0 bg-gray-50 z-10">
          <div className="w-full p-2 border-b border-gray-200">
            <div className="flex flex-row items-center gap-2 w-full">
              {/* Custom filter section */}
              <div className="flex-1 flex items-center gap-1">
                <button className="flex items-center gap-1">
                  <FolderPlusIcon className="h-5 w-5 text-green-600" />
                  <p className="font-semibold text-sm text-green-600">
                    Custom filter
                  </p>
                </button>
                <button className="cursor-pointer ml-1 text-gray-600 font-medium bg-transparent hover:bg-gray-100 text-xs border rounded-sm px-2 py-1 shadow shadow-amber-50">
                  Save
                </button>
              </div>

              {/* Search section */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-2 top-[9px] text-gray-600" />
                  <input
                    placeholder="Search"
                    className="h-8 pl-8 pr-2 rounded-sm w-24 sm:w-32 md:w-40 border shadow-amber-100 placeholder:text-gray-600"
                    value={searchQuery}
                    onChange={(e) => onSearch(e.target.value)}
                  />
                </div>
                <button
                  className={`h-8 w-8 rounded-sm flex items-center justify-center gap-1 border ${
                    filtered
                      ? "border-green-500 text-green-600"
                      : "border-gray-300"
                  } cursor-pointer shadow-amber-100`}
                  onClick={() => setFiltered(!filtered)}
                >
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User list */}
        <div className="w-full">
          <div className="overflow-y-auto h-[calc(100vh-120px)] md:h-[calc(100vh-86px)]">
            {loading ? (
              <div className="p-4 text-gray-500 text-center">
                Loading users...
              </div>
            ) : users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    onUserSelect(user);
                    // On mobile, close sidebar after selecting user
                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${
                    user?.id === selectedUser?.id ? "bg-gray-100" : ""
                  }`}
                >
                  <div className="flex items-center min-w-0">
                    <div className="relative w-10 h-10 md:w-10 md:h-10 flex-shrink-0 mr-3">
                      {user.avatar_url ? (
                        <Image
                          src={user.avatar_url}
                          alt={user.username}
                          className="rounded-full object-cover"
                          fill
                          sizes="(max-width: 768px) 40px, 48px"
                          priority={currentUser?.id === user.id}
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600">
                            {user.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium block truncate">
                        {user.username}
                      </span>
                      <p className="text-xs text-gray-500 truncate">
                        {user.last_message_created_at ? (
                          <>
                            <span className="text-gray-400 mr-1">
                              {formatTimestamp(user.last_message_created_at)} :
                            </span>
                            {user.last_message}
                          </>
                        ) : (
                          "No messages yet"
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Tags and Unread Message Count */}
                  <div className="flex flex-col items-end space-y-1 ml-2 flex-shrink-0">
                    {/* Tags */}
                    <div className="flex gap-1 items-center">
                      {["Demo", "internal", "signup"]
                        .slice(0, 1)
                        .map((tag, index) => (
                          <div
                            key={index}
                            className="text-xs text-red-400 px-2 py-1 bg-gray-100 font-semibold rounded-sm hidden sm:block"
                          >
                            {tag}
                          </div>
                        ))}

                      {["Demo", "internal", "signup"].length > 1 && (
                        <div className="text-xs text-gray-500 font-semibold hidden sm:block">
                          +{["Demo", "internal", "signup"].length - 1}
                        </div>
                      )}
                    </div>

                    {/* Unread Message Count */}
                    <div className="w-5 h-5 flex items-center justify-center bg-green-600 text-white text-xs rounded-full">
                      4
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-gray-500 text-center">
                No users found
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserList;
