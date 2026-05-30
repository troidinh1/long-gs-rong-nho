import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type CustomerSyncInput = {
  name: string;
  phone: string;
  address?: string | null;
  customer_type?: "retail" | "dealer" | string;
};

export function normalizePhone(phone: string) {
  return String(phone || "").replace(/\D/g, "");
}

export async function syncCustomerFromOrder(input: CustomerSyncInput) {
  const normalizedPhone = normalizePhone(input.phone);

  if (!normalizedPhone) {
    return null;
  }

  const name = String(input.name || "").trim() || "Khách hàng";
  const phone = String(input.phone || "").trim();
  const address = input.address ? String(input.address).trim() : null;
  const customerType = input.customer_type === "dealer" ? "dealer" : "retail";

  const { data: existingCustomer, error: findError } = await supabaseAdmin
    .from("customers")
    .select("*")
    .eq("normalized_phone", normalizedPhone)
    .maybeSingle();

  if (findError) {
    console.error("Find customer error:", findError);
    throw findError;
  }

  let customerId = existingCustomer?.id as string | undefined;

  if (!customerId) {
    const { data: newCustomer, error: createError } = await supabaseAdmin
      .from("customers")
      .insert({
        name,
        phone,
        normalized_phone: normalizedPhone,
        address,
        customer_type: customerType,
        last_order_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error("Create customer error:", createError);
      throw createError;
    }

    customerId = newCustomer.id;
  } else {
    const { error: updateError } = await supabaseAdmin
      .from("customers")
      .update({
        name,
        phone,
        address,
        customer_type: customerType,
        updated_at: new Date().toISOString(),
      })
      .eq("id", customerId);

    if (updateError) {
      console.error("Update customer info error:", updateError);
      throw updateError;
    }
  }

  await recalculateCustomerStats(normalizedPhone);

  const { data: finalCustomer, error: finalError } = await supabaseAdmin
    .from("customers")
    .select("*")
    .eq("normalized_phone", normalizedPhone)
    .single();

  if (finalError) {
    console.error("Get final customer error:", finalError);
    throw finalError;
  }

  return finalCustomer;
}

export async function recalculateCustomerStats(normalizedPhone: string) {
  const phoneKey = normalizePhone(normalizedPhone);

  if (!phoneKey) return null;

  const { data: customer, error: customerError } = await supabaseAdmin
    .from("customers")
    .select("*")
    .eq("normalized_phone", phoneKey)
    .maybeSingle();

  if (customerError) {
    console.error("Find customer for stats error:", customerError);
    throw customerError;
  }

  if (!customer) return null;

  const { data: orders, error: ordersError } = await supabaseAdmin
    .from("orders")
    .select(
      `
      id,
      name,
      phone,
      address,
      customer_type,
      status,
      total_price,
      created_at
    `
    )
    .eq("normalized_phone", phoneKey)
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Get customer orders error:", ordersError);
    throw ordersError;
  }

  const orderList = orders || [];

  const totalOrders = orderList.length;

  const completedOrders = orderList.filter(
    (order) => order.status === "completed"
  ).length;

  const cancelledOrders = orderList.filter(
    (order) => order.status === "cancelled"
  ).length;

  const totalSpent = orderList
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + Number(order.total_price || 0), 0);

  const latestOrder = orderList[0];

  const { data: updatedCustomer, error: updateError } = await supabaseAdmin
    .from("customers")
    .update({
      name: latestOrder?.name || customer.name,
      phone: latestOrder?.phone || customer.phone,
      address: latestOrder?.address || customer.address,
      customer_type: latestOrder?.customer_type || customer.customer_type,
      total_orders: totalOrders,

      // Giữ tên cột confirmed_orders để không cần đổi database.
      // Nhưng từ bây giờ cột này hiểu là số đơn completed / hoàn tất.
      confirmed_orders: completedOrders,

      cancelled_orders: cancelledOrders,
      total_spent: totalSpent,
      last_order_at: latestOrder?.created_at || customer.last_order_at,
      updated_at: new Date().toISOString(),
    })
    .eq("id", customer.id)
    .select()
    .single();

  if (updateError) {
    console.error("Update customer stats error:", updateError);
    throw updateError;
  }

  await supabaseAdmin
    .from("orders")
    .update({
      customer_id: customer.id,
      normalized_phone: phoneKey,
    })
    .eq("normalized_phone", phoneKey);

  return updatedCustomer;
}

export async function syncAllCustomersFromOrders() {
  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select("name, phone, address, customer_type")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Get orders for sync all error:", error);
    throw error;
  }

  const phoneSet = new Set<string>();

  for (const order of orders || []) {
    const normalizedPhone = normalizePhone(order.phone);

    if (!normalizedPhone || phoneSet.has(normalizedPhone)) continue;

    phoneSet.add(normalizedPhone);

    await syncCustomerFromOrder({
      name: order.name,
      phone: order.phone,
      address: order.address,
      customer_type: order.customer_type,
    });
  }

  return {
    success: true,
    synced: phoneSet.size,
  };
}