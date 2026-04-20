import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { BaseResultDTO } from '../models/user.model';
import {
  UserVoucher,
  Voucher,
  CreateVoucherRequest,
  AssignVoucherRequest,
  PreviewVoucherResponse
} from '../models/voucher.model';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VoucherService {
  private api = inject(ApiService);

  async getMyVouchers(): Promise<UserVoucher[]> {
    try {
      const res = await firstValueFrom(
        this.api.get<BaseResultDTO<UserVoucher[]>>('/vouchers/my')
      );
      return res.data ?? [];
    } catch (err) {
      console.error('Không thể tải danh sách voucher của tôi', err);
      return [];
    }
  }

  async getAllVoucherTemplates(): Promise<Voucher[]> {
    try {
      const res = await firstValueFrom(
        this.api.get<BaseResultDTO<Voucher[]>>('/admin/vouchers')
      );
      return res.data ?? [];
    } catch (err) {
      console.error('Không thể tải danh sách mẫu voucher', err);
      return [];
    }
  }

  async createVoucherTemplate(request: CreateVoucherRequest): Promise<{ success: boolean; message: string }> {
    try {
      const res = await firstValueFrom(
        this.api.post<BaseResultDTO<any>>('/admin/vouchers', request)
      );
      return { success: res.success, message: res.message };
    } catch (err: any) {
      return { success: false, message: err?.error?.message || 'Tạo voucher thất bại' };
    }
  }

  async updateVoucherTemplate(id: number, request: CreateVoucherRequest): Promise<{ success: boolean; message: string }> {
    try {
      const res = await firstValueFrom(
        this.api.put<BaseResultDTO<any>>(`/admin/vouchers/${id}`, request)
      );
      return { success: res.success, message: res.message };
    } catch (err: any) {
      return { success: false, message: err?.error?.message || 'Cập nhật voucher thất bại' };
    }
  }

  async deleteVoucherTemplate(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const res = await firstValueFrom(
        this.api.delete<BaseResultDTO<any>>(`/admin/vouchers/${id}`)
      );
      return { success: res.success, message: res.message };
    } catch (err: any) {
      return { success: false, message: err?.error?.message || 'Xóa voucher thất bại' };
    }
  }

  async preview(userVoucherId: number, orderTotal: number): Promise<PreviewVoucherResponse> {
    try {
      const res = await firstValueFrom(
        this.api.post<BaseResultDTO<PreviewVoucherResponse>>('/vouchers/preview', {
          userVoucherId,
          orderTotal
        })
      );
      return (
        res.data ?? {
          eligible: false,
          discountAmount: 0,
          reasonCode: res.errorCode
        }
      );
    } catch {
      return { eligible: false, discountAmount: 0, reasonCode: 'PREVIEW_FAILED' };
    }
  }

  async assignVoucher(request: AssignVoucherRequest): Promise<{ success: boolean; message: string }> {
    try {
      const res = await firstValueFrom(
        this.api.post<BaseResultDTO<any>>('/admin/vouchers/assign', request)
      );
      return { success: res.success, message: res.message };
    } catch (err: any) {
      return { success: false, message: err?.error?.message || 'Gán voucher thất bại' };
    }
  }
}
