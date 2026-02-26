import "@/styles/notification.css";
import { useNavigate } from "react-router-dom";
import type { Notification } from "@/types/notification.types";
import { useAuth } from "@/context/auth";
import {
  useMarkAllAsRead,
  useMarkAsRead,
  useNotifications,
} from "@/hooks/useNotification";
import { NotificationBell } from "@/components/notification/notificationBell";
import { ICON_MAP } from "@/utils/constants";
import { timeAgo } from "@/utils/time";
import { getNavigationPath } from "@/utils/path";

export default function Notifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  const handleClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead.mutate(notification.id);
    }

    const path = getNavigationPath(notification, user?.role || "CLIENT");
    if (path) {
      navigate(path);
    }
  };

  const handleMarkAll = () => {
    markAllAsRead.mutate();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="notifications-loading">
          <div className="notifications-spinner" />
          <p>Cargando notificaciones...</p>
        </div>
      );
    }

    if (!notifications || notifications.length === 0) {
      return (
        <div className="notifications-empty">
          <NotificationBell />
          <h3>Sin notificaciones</h3>
          <p>Cuando algo importante pase, te lo mostraremos acá</p>
        </div>
      );
    }

    return (
      <div className="notifications-list">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-item ${notification.isRead ? "" : "unread"}`}
            onClick={() => handleClick(notification)}
          >
            <div className="notification-icon">
              {ICON_MAP[notification.type] || "📢"}
            </div>
            <div className="notification-content">
              <span className="notification-item-title">
                {notification.title}
              </span>
              <p className="notification-message">{notification.message}</p>
              <span className="notification-time">
                {timeAgo(notification.createdAt)}
              </span>
            </div>
            {!notification.isRead && <div className="notification-dot" />}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="notifications-page">
      <header className="notifications-header">
        <div>
          <button className="notifications-back" onClick={() => navigate(-1)}>
            ← Volver
          </button>
          <h1 className="notifications-title">Notificaciones</h1>
        </div>
        {unreadCount > 0 && (
          <button
            className="notifications-mark-all"
            onClick={handleMarkAll}
            disabled={markAllAsRead.isPending}
          >
            Marcar todas como leídas
          </button>
        )}
      </header>

      {renderContent()}
    </div>
  );
}
