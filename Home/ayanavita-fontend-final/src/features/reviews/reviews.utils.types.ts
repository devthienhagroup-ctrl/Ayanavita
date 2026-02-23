export type ReturnTypeCalcStats = {
  count: number;
  avg: number;
  verified: number;
  helpful: number;
  dist: Record<1 | 2 | 3 | 4 | 5, number>;
};
