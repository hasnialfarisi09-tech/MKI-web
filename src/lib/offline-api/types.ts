/**
 * Local Offline API Types
 * Arsitektur API Lokal untuk Aplikasi Android Tanpa Internet
 */

import type { FurnitureItemConfig, Region } from "@/data/pricing-calculator";
import type { SavedSimulation } from "@/components/calculator/cost-calculator";
import type { SimulationExportData } from "@/lib/export-simulation";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: number;
}

export interface PricingApiInterface {
  getRegions(): Promise<ApiResponse<{ id: Region; label: string; note: string }[]>>;
  getItemsByCategory(category: string): Promise<ApiResponse<FurnitureItemConfig[]>>;
  getItemById(id: string): Promise<ApiResponse<FurnitureItemConfig | null>>;
}

export interface SimulationApiInterface {
  getAll(): Promise<ApiResponse<SavedSimulation[]>>;
  getById(id: string): Promise<ApiResponse<SavedSimulation | null>>;
  save(simulation: SavedSimulation): Promise<ApiResponse<SavedSimulation>>;
  delete(id: string): Promise<ApiResponse<boolean>>;
  exportBackupJson(): Promise<ApiResponse<string>>;
  importBackupJson(jsonString: string): Promise<ApiResponse<number>>;
}

export interface NativeExportResult {
  filePath?: string;
  shared: boolean;
  format: "jpg" | "pdf";
}

export interface ExportApiInterface {
  saveAndShare(
    format: "jpg" | "pdf",
    data: SimulationExportData,
    options?: { shareDirectly?: boolean }
  ): Promise<ApiResponse<NativeExportResult>>;
}
