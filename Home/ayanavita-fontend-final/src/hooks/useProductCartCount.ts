// src/hooks/useProductCartCount.ts
import { useEffect, useState } from "react";
import { getProductCartQtySum, subscribeProductCart } from "../services/productCart.utils";

export function useProductCartQtySum() {
  const [qty, setQty] = useState(() => getProductCartQtySum());

  useEffect(() => {
    return subscribeProductCart((items) => {
      const sum = items.reduce((s, x) => s + Number(x.qty || 0), 0);
      setQty(sum);
    });
  }, []);

  return qty;
}
