import { useMemo, useState } from "react";

type OrderStatus = "PENDING" | "PAID" | "CANCELED" | "EXPIRED";

type OrderItem = {
  sku: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
};

type CatalogOrder = {
  id: number;
  code: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  status: OrderStatus;
  paymentMethod: "Banking" | "COD" | "Momo";
  currency: "VND";
  notes?: string;
  items: OrderItem[];
};

const statusLabel: Record<OrderStatus, string> = {
  PENDING: "Chờ xử lý",
  PAID: "Đã thanh toán",
  CANCELED: "Đã hủy",
  EXPIRED: "Hết hạn",
};

const mockOrders: CatalogOrder[] = [
  {
    id: 101,
    code: "ORD-2026-000101",
    customerName: "Nguyễn Thảo Linh",
    customerEmail: "linh.nguyen@example.com",
    createdAt: "2026-02-12 09:40",
    status: "PAID",
    paymentMethod: "Banking",
    currency: "VND",
    notes: "Khách yêu cầu gói quà.",
    items: [
      {
        sku: "SPA-SERUM-001",
        productName: "Serum Spa Phục Hồi",
        category: "Chăm sóc da",
        quantity: 2,
        unitPrice: 489000,
      },
    ],
  },
  {
    id: 102,
    code: "ORD-2026-000102",
    customerName: "Anna Müller",
    customerEmail: "anna.mueller@example.de",
    createdAt: "2026-02-12 11:15",
    status: "PENDING",
    paymentMethod: "Momo",
    currency: "VND",
    items: [
      {
        sku: "SPA-SERUM-001",
        productName: "Spa Regenerationsserum",
        category: "Hautpflege",
        quantity: 1,
        unitPrice: 489000,
      },
    ],
  },
  {
    id: 103,
    code: "ORD-2026-000103",
    customerName: "James Carter",
    customerEmail: "j.carter@example.com",
    createdAt: "2026-02-13 14:05",
    status: "CANCELED",
    paymentMethod: "COD",
    currency: "VND",
    notes: "Sai thông tin số điện thoại.",
    items: [
      {
        sku: "SPA-SERUM-001",
        productName: "Spa Recovery Serum",
        category: "Skincare",
        quantity: 3,
        unitPrice: 489000,
      },
    ],
  },
  {
    id: 104,
    code: "ORD-2026-000104",
    customerName: "Lê Quang Huy",
    customerEmail: "huy.le@example.com",
    createdAt: "2026-02-14 08:20",
    status: "EXPIRED",
    paymentMethod: "Banking",
    currency: "VND",
    items: [
      {
        sku: "SPA-SERUM-001",
        productName: "Serum Spa Phục Hồi",
        category: "Chăm sóc da",
        quantity: 1,
        unitPrice: 489000,
      },
    ],
  },
];

function formatCurrency(value: number) {
  return `${value.toLocaleString("vi-VN")} ₫`;
}

export function OrdersAdminPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [keyword, setKeyword] = useState("");
  const [selectedId, setSelectedId] = useState<number>(mockOrders[0]?.id || 0);

  const filteredOrders = useMemo(() => {
    const keywordLower = keyword.trim().toLowerCase();
    return mockOrders.filter((order) => {
      const matchStatus = statusFilter === "ALL" || order.status === statusFilter;
      const matchKeyword =
        !keywordLower ||
        [order.code, order.customerName, order.customerEmail].some((field) =>
          field.toLowerCase().includes(keywordLower),
        );
      return matchStatus && matchKeyword;
    });
  }, [statusFilter, keyword]);

  const selectedOrder = filteredOrders.find((order) => order.id === selectedId) || filteredOrders[0] || null;

  const stats = useMemo(() => {
    const pending = mockOrders.filter((x) => x.status === "PENDING").length;
    const paid = mockOrders.filter((x) => x.status === "PAID").length;
    const canceled = mockOrders.filter((x) => x.status === "CANCELED").length;
    const totalRevenue = mockOrders
      .filter((x) => x.status === "PAID")
      .flatMap((x) => x.items)
      .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    return { pending, paid, canceled, totalRevenue };
  }, []);

  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="card hero-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 className="h1">Quản lý đơn hàng</h1>
            <div className="muted" style={{ marginTop: 6 }}>
              Giao diện demo dùng dữ liệu mẫu từ catalog (SKU <b>SPA-SERUM-001</b>) để theo dõi vòng đời đơn hàng.
            </div>
          </div>
          <button className="btn btn-primary" type="button">+ Tạo đơn nháp</button>
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: 14 }}>
        <div className="card">
          <div className="muted" style={{ fontWeight: 700 }}>Tổng đơn</div>
          <div style={{ fontSize: 28, fontWeight: 900, marginTop: 6 }}>{mockOrders.length}</div>
        </div>
        <div className="card">
          <div className="muted" style={{ fontWeight: 700 }}>Doanh thu đã thanh toán</div>
          <div style={{ fontSize: 28, fontWeight: 900, marginTop: 6 }}>{formatCurrency(stats.totalRevenue)}</div>
        </div>
      </div>

      <div className="grid grid-3" style={{ gap: 14 }}>
        <div className="card"><b>{stats.pending}</b> đơn chờ xử lý</div>
        <div className="card"><b>{stats.paid}</b> đơn thành công</div>
        <div className="card"><b>{stats.canceled}</b> đơn đã hủy</div>
      </div>

      <div className="card">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
          <input
            className="input"
            placeholder="Tìm theo mã đơn, tên khách hoặc email..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "ALL") }>
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="PAID">Đã thanh toán</option>
            <option value="CANCELED">Đã hủy</option>
            <option value="EXPIRED">Hết hạn</option>
          </select>
        </div>
      </div>

      <div className="grid" style={{ gap: 14, gridTemplateColumns: "1.2fr .8fr" }}>
        <div className="card" style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Ngày tạo</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const total = order.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
                return (
                  <tr
                    key={order.id}
                    style={{ cursor: "pointer", outline: selectedOrder?.id === order.id ? "2px solid #c7d2fe" : "none" }}
                    onClick={() => setSelectedId(order.id)}
                  >
                    <td><b>{order.code}</b></td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{order.customerName}</div>
                      <div className="muted">{order.customerEmail}</div>
                    </td>
                    <td className="muted">{order.createdAt}</td>
                    <td>{formatCurrency(total)}</td>
                    <td>{statusLabel[order.status]}</td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="muted">Không có đơn hàng phù hợp.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ minHeight: 280 }}>
          {selectedOrder ? (
            <>
              <h2 className="h2">Chi tiết đơn</h2>
              <div className="sep" />
              <div><b>{selectedOrder.code}</b></div>
              <div className="muted" style={{ marginBottom: 8 }}>{selectedOrder.customerName} · {selectedOrder.customerEmail}</div>
              <div style={{ display: "grid", gap: 8 }}>
                <div>Trạng thái: <b>{statusLabel[selectedOrder.status]}</b></div>
                <div>Thanh toán: <b>{selectedOrder.paymentMethod}</b></div>
                <div>Ngày tạo: <b>{selectedOrder.createdAt}</b></div>
                <div>
                  Sản phẩm:
                  <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
                    {selectedOrder.items.map((item) => (
                      <li key={`${selectedOrder.id}-${item.sku}`}>
                        {item.productName} ({item.sku}) · {item.quantity} x {formatCurrency(item.unitPrice)}
                      </li>
                    ))}
                  </ul>
                </div>
                {selectedOrder.notes ? <div className="muted">Ghi chú: {selectedOrder.notes}</div> : null}
              </div>
            </>
          ) : (
            <div className="muted">Chọn một đơn hàng để xem chi tiết.</div>
          )}
        </div>
      </div>
    </div>
  );
}
