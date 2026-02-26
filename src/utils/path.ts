import type { Notification } from "@/types/notification.types";

const getPathByRole = (
  role: string,
  keyword: "service" | "request",
  id: string,
) => {
  console.log("vakidando datos", {
    role,
    keyword,
    id,
  });
  if (role === "CLIENT") {
    return `/${keyword === "service" ? "client/service" : "client/request"}/${id}`;
  } else {
    return `/professional/service/${id}`;
  }
};

function getNavigationPath(
  notification: Notification,
  role: string,
): string | null {
  const data = notification.data;

  if (!data) return null;
  const isClient = role === "CLIENT";
  const requestPath = isClient ? "request" : "service";
  const id = isClient ? data.requestId : data.executionId;

  switch (notification.type) {
    case "OFFER_RECEIVED":
    case "REQUEST_EXPIRED":
      return data.requestId
        ? getPathByRole(role, "request", data.requestId)
        : null;

    case "OFFER_ACCEPTED":
    case "OFFER_REJECTED":
    case "NEW_REQUEST_NEARBY":
      return data.requestId ? getPathByRole(role, requestPath, id) : null;

    case "SERVICE_IN_TRANSIT":
    case "SERVICE_ARRIVED":
    case "SERVICE_STARTED":
    case "SERVICE_COMPLETED":
    case "SERVICE_CANCELLED":
      if (data.executionId) {
        return role === "PROFESSIONAL"
          ? `/professional/service/${data.executionId}`
          : `/client/service/${data.executionId}`;
      }
      return null;

    case "NEW_MESSAGE":
      return data.conversationId ? `/chat/${data.conversationId}` : null;

    case "REVIEW_RECEIVED":
      return "/profile";

    default:
      return null;
  }
}

export { getNavigationPath };
