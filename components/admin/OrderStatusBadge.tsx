import { OrderStatus } from "@/types/order";

const statusMap: Record<
  OrderStatus,
  {
    label: string;
    className: string;
  }
> = {
  new: {
    label: "Đơn mới",
    className: "bg-blue-50 text-blue-700",
  },
  contacted: {
    label: "Đã liên hệ",
    className: "bg-amber-50 text-amber-700",
  },
  confirmed: {
    label: "Đã chốt",
    className: "bg-emerald-50 text-emerald-700",
  },
  cancelled: {
    label: "Đã hủy",
    className: "bg-red-50 text-red-700",
  },
};

export default function OrderStatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  const currentStatus = statusMap[status] || statusMap.new;

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${currentStatus.className}`}
    >
      {currentStatus.label}
    </span>
  );
}