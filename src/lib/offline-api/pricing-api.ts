/**
 * Local Offline Pricing API
 * Menyediakan data master harga, material, dan spesifikasi tanpa koneksi internet.
 */

import {
  REGIONS,
  KITCHEN_ITEMS,
  OTHER_CATEGORIES,
  FurnitureItemConfig,
  Region,
} from "@/data/pricing-calculator";
import type { ApiResponse, PricingApiInterface } from "./types";

class LocalPricingApi implements PricingApiInterface {
  async getRegions(): Promise<ApiResponse<{ id: Region; label: string; note: string }[]>> {
    return {
      success: true,
      data: REGIONS,
      timestamp: Date.now(),
    };
  }

  async getItemsByCategory(category: string): Promise<ApiResponse<FurnitureItemConfig[]>> {
    if (category === "kitchen") {
      return {
        success: true,
        data: KITCHEN_ITEMS,
        timestamp: Date.now(),
      };
    }

    const items = OTHER_CATEGORIES.filter((item) => item.category === category);
    return {
      success: true,
      data: items,
      timestamp: Date.now(),
    };
  }

  async getItemById(id: string): Promise<ApiResponse<FurnitureItemConfig | null>> {
    const all = [...KITCHEN_ITEMS, ...OTHER_CATEGORIES];
    const found = all.find((item) => item.id === id) || null;
    return {
      success: true,
      data: found,
      timestamp: Date.now(),
    };
  }
}

export const localPricingApi = new LocalPricingApi();
