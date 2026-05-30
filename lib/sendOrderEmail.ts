import { Resend } from "resend";
import { formatVND } from "@/lib/money";

type OrderEmailData = {
  name: string;
  phone: string;
  product: string;
  note?: string;
  quantity?: number;
  address?: string;
  customer_type?: string;
  total_price?: number;
};

const resendApiKey = process.env.RESEND_API_KEY;
const orderNotifyEmail = process.env.ORDER_NOTIFY_EMAIL;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;

export async function sendOrderEmail(order: OrderEmailData) {
  if (!resendApiKey) {
    console.warn("Missing RESEND_API_KEY. Skip sending order email.");
    return;
  }

  if (!orderNotifyEmail) {
    console.warn("Missing ORDER_NOTIFY_EMAIL. Skip sending order email.");
    return;
  }

  if (!resendFromEmail) {
    console.warn("Missing RESEND_FROM_EMAIL. Skip sending order email.");
    return;
  }

  const resend = new Resend(resendApiKey);

  const quantity = order.quantity || 1;
  const totalPrice = order.total_price || 0;
  const customerType =
    order.customer_type === "dealer" ? "Đại lý / nhập sỉ" : "Khách lẻ";

  const subject = `LONG GS có đơn hàng mới từ ${order.name}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; background: #ffffff; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #047857, #0891b2); color: white; padding: 24px;">
        <h1 style="margin: 0; font-size: 24px;">LONG GS - Đơn hàng mới</h1>
        <p style="margin: 8px 0 0; opacity: 0.9;">Có khách vừa gửi form đặt hàng trên website.</p>
      </div>

      <div style="padding: 24px;">
        <div style="background: #ecfdf5; border-radius: 14px; padding: 18px; margin-bottom: 18px;">
          <p style="margin: 0; font-size: 14px; color: #047857; font-weight: 700;">Thông tin đơn hàng</p>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          ${emailRow("Họ tên", escapeHtml(order.name))}
          ${emailRow(
            "Số điện thoại",
            `<a href="tel:${escapeHtml(
              order.phone
            )}" style="color: #047857; font-weight: 700;">${escapeHtml(
              order.phone
            )}</a>`
          )}
          ${emailRow("Loại khách", escapeHtml(customerType))}
          ${emailRow("Sản phẩm", escapeHtml(order.product))}
          ${emailRow("Số lượng", String(quantity))}
          ${emailRow("Tổng tiền tạm tính", formatVND(totalPrice))}
          ${emailRow("Địa chỉ", escapeHtml(order.address || "Chưa có"))}
          ${emailRow("Ghi chú", escapeHtml(order.note || "Không có"))}
        </table>

        <div style="margin-top: 24px;">
          <a href="https://zalo.me/0896456068" style="display: inline-block; background: #047857; color: white; text-decoration: none; padding: 14px 18px; border-radius: 12px; font-weight: 700;">
            Mở Zalo tư vấn khách
          </a>
        </div>

        <p style="margin-top: 24px; color: #64748b; font-size: 14px;">
          Bạn có thể vào trang admin để xem, cập nhật trạng thái và quản lý đơn hàng.
        </p>
      </div>
    </div>
  `;

  const text = `
LONG GS - Có đơn hàng mới

Họ tên: ${order.name}
Số điện thoại: ${order.phone}
Loại khách: ${customerType}
Sản phẩm: ${order.product}
Số lượng: ${quantity}
Tổng tiền tạm tính: ${formatVND(totalPrice)}
Địa chỉ: ${order.address || "Chưa có"}
Ghi chú: ${order.note || "Không có"}

Vào admin để xử lý đơn hàng.
  `;

  const { error } = await resend.emails.send({
    from: resendFromEmail,
    to: [orderNotifyEmail],
    subject,
    html,
    text,
  });

  if (error) {
    console.error("Send order email error:", error);
  }
}

function emailRow(label: string, value: string) {
  return `
    <tr>
      <td style="width: 190px; padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 700;">${label}</td>
      <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${value}</td>
    </tr>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}