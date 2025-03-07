import React, { useEffect } from "react";
import {
  Bell,
  House,
  Images,
  List,
  LogOut,
  MessageCircleMore,
  MessageSquare,
  Settings,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import supabase from "@/utils/supabaseClient";

const LeftSidebar = () => {
  const router = useRouter();

  return (
    <div className="left_sidebar flex flex-col items-center w-12 h-screen border-r border-gray-200 py-2">
      <Image src="/logo.png" width={28} height={28} alt="logo_image" />
      <div className="sidebar_icons flex-1 mt-8 flex flex-col gap-4 items-center">
        <House className="h-4 w-4 text-gray-500 cursor-pointer" />

        <div className="active_icon bg-gray-100 p-1 rounded-sm">
          <MessageCircleMore
            className="h-4 w-4 cursor-pointer text-white"
            fill="green"
          />
        </div>
        <List className="h-4 w-4 text-gray-500 cursor-pointer" />
        <Bell className="h-4 w-4 text-gray-500 cursor-pointer" />
        <Images className="h-4 w-4 text-gray-500 cursor-pointer" />

        <Settings
          onClick={async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
              console.error("Logout error:", error.message);
            }
          }}
          className="h-4 w-4 text-gray-500"
        />
      </div>

      <LogOut
        onClick={async () => {
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error("Logout error:", error.message);
          }

          toast.success("Logged out successfully");
          router.push("/");
        }}
        className="h-4 w-4 text-gray-500 cursor-pointer mb-2"
      />
    </div>
  );
};

export default LeftSidebar;
