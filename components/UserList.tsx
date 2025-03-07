import {
  Bell,
  Filter,
  FolderDown,
  FolderPlus,
  FolderPlusIcon,
  MessageSquare,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { i } from "@/components/ui/input";
import supabase from "@/utils/supabaseClient";

interface User {
  id: string;
  avatar_url?: string;
  username: string;
}

interface UserListProps {
  users: User[];
  loading: boolean;
  currentUser: User;
  onUserSelect: (user: User) => void;
  selectedUser: User;
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

  return (
    <div className="w-1/4 border-r bg-gray-50">
      <div className="w-full flex items-center p-2 border-b border-gray-200">
        <div className="w-full flex items-center flex-1">
          <button className="w-[100px] flex items-center gap-1">
            <FolderPlusIcon className="h-4 w-4 text-green-600" />
            <p className="font-semibold text-[12px] text-green-600">
              Custom filter
            </p>
          </button>
          <button className="cursor-pointer text-gray-600 font-medium bg-transparent hover:bg-gray-100 text-xs border rounded-sm px-2 py-[2px] shadow shadow-amber-50">
            Save
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-3 w-3 absolute left-2 top-2 text-gray-600" />
            <input
              placeholder="Search"
              className="h-6 pl-6 rounded-sm w-[70px] border shadow-amber-100 text-xs placeholder:text-xs placeholder:text-gray-600"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <button
            className={`h-[22px] rounded-sm p-[4px] text-xs flex items-center gap-1 border border-green-500 cursor-pointer shadow-amber-100 ${
              filtered ? "text-green-600" : ""
            }`}
            onClick={() => setFiltered(!filtered)}
          >
            <Filter className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="overflow-y-auto h-[calc(100vh-4rem)]">
          {loading ? (
            <div className="p-2 text-gray-500">Loading users...</div>
          ) : users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                onClick={() => onUserSelect(user)}
                className={`flex items-center justify-between p-2 pr-4 hover:bg-gray-100 cursor-pointer ${
                  user?.id === selectedUser?.id ? "bg-gray-100" : ""
                }`}
              >
                <div className="flex items-center">
                  <div className="relative w-8 h-8 mr-2">
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt={user.username}
                        className="rounded-full object-cover"
                        fill
                        sizes="35px"
                        priority={currentUser?.id === user.id}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600">
                          {user.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium">{user.username}</span>
                    <p className="text-sm text-gray-500 truncate">
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
                <div className="flex flex-col items-end space-x-2 gap-1">
                  {/* Tags */}
                  {
                    <div className="max-w-[120px] flex gap-1 items-center">
                      {["Demo", "internal", "signup"]
                        // if len > 2 then show 2 tags and a +1 tag
                        .slice(0, 2)
                        .map((tag, index) => (
                          <div
                            key={index}
                            className="text-xs text-red-400 px-2 py-1 bg-gray-100 font-semibold rounded-sm"
                          >
                            {tag}
                          </div>
                        ))}

                      {["Demo", "internal", "signup"].length > 2 && (
                        <div className="text-xs text-gray-500 font-semibold">
                          +1
                        </div>
                      )}
                    </div>
                  }

                  {/* Unread Message Count */}
                  {
                    <div className="w-3 h-3 flex items-center justify-center bg-green-600 text-center p-2 text-white text-xs rounded-full">
                      {4}
                    </div>
                  }
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-500">No users found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
