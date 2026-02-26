export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, string> | null;
  isRead: boolean;
  createdAt: string;
}

export type NotificationType =
  | "OFFER_RECEIVED"
  | "OFFER_ACCEPTED"
  | "OFFER_REJECTED"
  | "SERVICE_IN_TRANSIT"
  | "SERVICE_ARRIVED"
  | "SERVICE_STARTED"
  | "SERVICE_COMPLETED"
  | "SERVICE_CANCELLED"
  | "NEW_MESSAGE"
  | "NEW_REQUEST_NEARBY"
  | "REQUEST_EXPIRED"
  | "REVIEW_RECEIVED";
