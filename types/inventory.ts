export type StorageCondition =
  | "room_temperature"
  | "cool"
  | "refrigerated"
  | "frozen"
  | "controlled";

export type AbcClass = "A" | "B" | "C";

export type SkuItem = {
  id: string;
  name: string;
  dosageForm: string;
  category: string;
  storageCondition: StorageCondition;
  shelfLifeDays: number;
  currentStock: number;
  unit: string;
  unitCost: number;
  orderCost: number;
  holdingCostRate: number;
  leadTimeDays: number;
  serviceLevel: number;
  supplier: string;
  createdAt: string;
};

export type InventoryLot = {
  id: string;
  skuId: string;
  lotNumber: string;
  quantity: number;
  receivedAt: string;
  expiresAt: string;
  createdAt: string;
};

export type InventoryMovement = {
  id: string;
  skuId: string;
  periodMonth: string;
  inboundQty: number;
  outboundQty: number;
  writeoffQty: number;
  endingStock: number;
  anomalyFlag: boolean;
  anomalyNote: string | null;
  createdAt: string;
};

export type AppUser = {
  id: string;
  username: string;
  displayName: string | null;
  createdAt: string;
};

export type AppUserAuthRecord = AppUser & {
  passwordHash: string;
};
