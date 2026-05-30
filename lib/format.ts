export function formatVND(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

export function formatDateTime(value: string) {
  if (!value) return "Không có thời gian";

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}