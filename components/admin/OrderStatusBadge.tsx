import { OrderStatus } from "@/types/order";

const statusMap: Record<
  OrderStatus,
  {
    label: string;
    className: string;
  }
> = {
  pending: {
    label: "Chờ xác nhận",
    className: "bg-blue-50 text-blue-700",
  },
  preparing: {
    label: "Chờ lấy hàng",
    className: "bg-amber-50 text-amber-700",
  },
  shipping: {
    label: "Chờ giao hàng",
    className: "bg-purple-50 text-purple-700",
  },
  completed: {
    label: "Đánh giá",
    className: "bg-emerald-50 text-emerald-700",
  },
  cancelled: {
    label: "Đã hủy",
    className: "bg-red-50 text-red-700",
  },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const statusInfo = statusMap[status] || statusMap.pending;

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${statusInfo.className}`}
    >
      {statusInfo.label}
    </span>
  );
}
