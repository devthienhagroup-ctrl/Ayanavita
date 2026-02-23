export function moneyVND(amount: number) {
  // NBSP giữa ký hiệu và số => không bị xuống dòng như ảnh bạn chụp
  const n = Number(amount || 0);
  return `₫\u00A0${new Intl.NumberFormat("vi-VN").format(n)}`;
}
