import "@/styles/notificationBell.css";
import { useNavigate } from "react-router-dom";
import { useUnreadCount } from "@/hooks/useNotification";

export function NotificationBell() {
  const navigate = useNavigate();
  const { data } = useUnreadCount();

  const count = data?.unreadCount || 0;

  return (
    <button
      className="notification-bell"
      onClick={() => navigate("/notifications")}
    >
      🔔
      {count > 0 && (
        <span className="notification-bell-badge">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
