/**
 * Formatting and utility helpers for currency, dates, icons, and auth tokens.
 */

export function formatMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

export function formatDate(date) {
  if (!date) return "";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getCategoryIcon(category) {
  const value = category?.toLowerCase() || "";

  if (value.includes("food") || value.includes("grocery")) return "🍔";
  if (value.includes("transport") || value.includes("travel")) return "🚗";
  if (value.includes("shop")) return "🛍️";
  if (value.includes("bill") || value.includes("utility")) return "💡";
  if (value.includes("health")) return "❤️";
  if (value.includes("entertain")) return "🎬";
  if (value.includes("education")) return "📚";
  if (value.includes("rent")) return "🏠";
  if (!value) return "🗂️";

  return "💳";
}

export function getNameFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.username || payload.sub?.split("@")[0] || "there";
  } catch {
    return "there";
  }
}

export function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
