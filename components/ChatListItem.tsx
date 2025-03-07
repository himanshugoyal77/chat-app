import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";
import Image from "next/image";

export default function ChatListItem({
  chat,
  isActive,
  onClick,
  user,
}: {
  chat: any;
  isActive: boolean;
  onClick: () => void;
  user?: any;
}) {
  return (
    <div
      className={`flex items-start p-3 border-l-4 cursor-pointer hover:bg-gray-50 ${
        isActive ? "border-l-green-500 bg-gray-50" : "border-l-transparent"
      }`}
      onClick={onClick}
    >
      <Avatar className="h-12 w-12 mr-3">
        <Image
          src={chat.avatar_url}
          alt={chat.username}
          width={40}
          height={40}
          className="h-full w-full object-cover"
        />
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <div className="font-medium text-sm truncate">
            {chat.id === user?.id ? "(You)" : chat.username}
          </div>
          <div className="text-xs text-gray-500">
            {formatDate(chat.createdAt)}
          </div>
        </div>
        <div className="flex items-center mt-1">
          {chat.status === "read" ? (
            <CheckCheck className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
          ) : chat.status === "sent" ? (
            <Check className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" />
          ) : null}
          <div className="text-xs text-gray-500 truncate">
            {chat.lastMessage}
          </div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1">
            {chat.email && (
              <div className="text-xs text-gray-400">{chat.email}</div>
            )}
          </div>
          <div className="flex items-center gap-1">
            {/* {chat.labels?.map((label, index) => (
              <Badge
                key={index}
                variant={
                  label === "Demo"
                    ? "outline"
                    : label === "Internal"
                      ? "default"
                      : label === "Signup"
                        ? "destructive"
                        : "secondary"
                }
                className={`text-[10px] h-5 ${
                  label === "Internal"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : label === "Signup"
                      ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                      : label === "Demo"
                        ? "border-gray-200 text-gray-500"
                        : ""
                }`}
              >
                {label}
              </Badge>
            ))} */}
            {/* {chat.unreadCount > 0 && (
              <Badge className="bg-green-500 text-[10px] h-5 w-5 flex items-center justify-center p-0">
                {chat.unreadCount}
              </Badge>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
