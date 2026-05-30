import { Resend } from "resend";

type OrderEmailData = {
  name: string;
  phone: string;
  product: string;
  note?: string;
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

  const subject = `LONG GS có đơn hàng mới từ ${order.name}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #ffffff; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #047857, #0891b2); color: white; padding: 24px;">
        <h1 style="margin: 0; font-size: 24px;">LONG GS - Đơn hàng mới</h1>
        <p style="margin: 8px 0 0; opacity: 0.9;">Có khách vừa gửi form đặt hàng trên website.</p>
      </div>

      <div style="padding: 24px;">
        <div style="background: #ecfdf5; border-radius: 14px; padding: 18px; margin-bottom: 18px;">
          <p style="margin: 0; font-size: 14px; color: #047857; font-weight: 700;">Thông tin khách hàng</p>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 700;">Họ tên</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${escapeHtml(
              order.name
            )}</td>
          </tr>

          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 700;">Số điện thoại</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
              <a href="tel:${escapeHtml(
                order.phone
              )}" style="color: #047857; font-weight: 700;">${escapeHtml(
    order.phone
  )}</a>
            </td>
          </tr>

          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 700;">Sản phẩm</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${escapeHtml(
              order.product
            )}</td>
          </tr>

          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 700;">Ghi chú</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${escapeHtml(
              order.note || "Không có"
            )}</td>
          </tr>
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
Sản phẩm: ${order.product}
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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}