import React from "react";
import {
  BellOff,
  CircleHelp,
  List,
  MessageCircleMore,
  RefreshCcwDot,
  ScreenShare,
} from "lucide-react";

const Topbar = () => {
  return (
    <div className="top_bar w-full h-10 flex items-center justify-between px-2  border-b border-gray-200">
      <div className="left_icon w-full flex items-center gap-1">
        <MessageCircleMore
          className="h-4 w-4 cursor-pointer text-white"
          fill="gray"
        />
        <p className="text-xs font-semibold text-gray-400">Chats</p>
      </div>
      <div className="right_buttons flex items-center gap-3">
        <button className="flex items-center gap-2 text-gray-600 bg-transparent hover:bg-gray-100 text-xs border rounded-sm px-3 py-1 shadow shadow-amber-50">
          <RefreshCcwDot className="h-3 w-3" /> Refresh
        </button>
        <button className="flex items-center gap-2 text-gray-600 bg-transparent hover:bg-gray-100 text-xs border rounded-sm px-3 py-1 shadow shadow-amber-50">
          <CircleHelp className="h-3 w-3" /> Help
        </button>

        <button className="flex items-center gap-2 text-gray-600 bg-transparent hover:bg-gray-100 text-xs border rounded-sm px-3 py-1 shadow shadow-amber-50">
          <ScreenShare className="h-3 w-3" />
        </button>

        <button className="flex items-center gap-2 text-gray-600 bg-transparent hover:bg-gray-100 text-xs border rounded-sm px-3 py-1 shadow shadow-amber-50">
          <BellOff className="h-3 w-3" fill="grey" />
        </button>

        <button className="flex items-center gap-1 text-gray-600 bg-transparent hover:bg-gray-100 text-xs border rounded-sm px-2 py-1 shadow shadow-amber-50">
          ✨<List className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
