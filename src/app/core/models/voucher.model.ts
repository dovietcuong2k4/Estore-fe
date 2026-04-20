export interface Voucher {
  id: number;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  quantity?: number;
  totalQuantity?: number;
  usedQuantity?: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface UserVoucher {
  id: number;
  voucher: Voucher;
  status: 'AVAILABLE' | 'USED' | 'EXPIRED';
  assignedAt: string;
  usedAt?: string;
}

export interface CreateVoucherRequest {
  code: string;
  discountType: string;
  discountValue: number;
  minOrderValue: number;
  quantity?: number;
  startDate: string;
  endDate: string;
}

export interface AssignVoucherRequest {
  voucherId: number;
  userId: number;
}

/** POST /api/vouchers/preview */
export interface PreviewVoucherResponse {
  eligible: boolean;
  discountAmount: number;
  reasonCode?: string | null;
}
