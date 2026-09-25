/**
 * Local Offline Simulation API
 * Menyimpan dan mengelola riwayat proyek secara offline di memori internal perangkat.
 */

import type { SavedSimulation } from "@/components/calculator/cost-calculator";
import type { ApiResponse, SimulationApiInterface } from "./types";

const STORAGE_KEY = "mki_saved_simulations_v1";

class LocalSimulationApi implements SimulationApiInterface {
  private getStorage(): SavedSimulation[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("[LocalSimulationApi] Error reading storage:", e);
      return [];
    }
  }

  private setStorage(items: SavedSimulation[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("[LocalSimulationApi] Error writing storage:", e);
    }
  }

  async getAll(): Promise<ApiResponse<SavedSimulation[]>> {
    const data = this.getStorage();
    return {
      success: true,
      data,
      timestamp: Date.now(),
    };
  }

  async getById(id: string): Promise<ApiResponse<SavedSimulation | null>> {
    const list = this.getStorage();
    const item = list.find((s) => s.id === id) || null;
    return {
      success: true,
      data: item,
      timestamp: Date.now(),
    };
  }

  async save(simulation: SavedSimulation): Promise<ApiResponse<SavedSimulation>> {
    const list = this.getStorage();
    const existingIndex = list.findIndex((s) => s.id === simulation.id);

    let updatedList: SavedSimulation[];
    if (existingIndex >= 0) {
      updatedList = [...list];
      updatedList[existingIndex] = { ...simulation, updatedAt: Date.now() };
    } else {
      updatedList = [{ ...simulation, createdAt: Date.now(), updatedAt: Date.now() }, ...list];
    }

    this.setStorage(updatedList);
    return {
      success: true,
      data: simulation,
      message: "Proyek berhasil disimpan secara offline",
      timestamp: Date.now(),
    };
  }

  async delete(id: string): Promise<ApiResponse<boolean>> {
    const list = this.getStorage();
    const nextList = list.filter((s) => s.id !== id);
    this.setStorage(nextList);
    return {
      success: true,
      data: true,
      message: "Proyek berhasil dihapus",
      timestamp: Date.now(),
    };
  }

  async exportBackupJson(): Promise<ApiResponse<string>> {
    const data = this.getStorage();
    const jsonString = JSON.stringify(
      {
        version: "1.0",
        appName: "Kalkulator Interior Android",
        exportedAt: new Date().toISOString(),
        totalProjects: data.length,
        simulations: data,
      },
      null,
      2
    );
    return {
      success: true,
      data: jsonString,
      timestamp: Date.now(),
    };
  }

  async importBackupJson(jsonString: string): Promise<ApiResponse<number>> {
    try {
      const parsed = JSON.parse(jsonString);
      const incomingList: SavedSimulation[] = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.simulations)
        ? parsed.simulations
        : [];

      if (incomingList.length === 0) {
        return {
          success: false,
          data: 0,
          message: "Format file cadangan tidak valid atau kosong",
          timestamp: Date.now(),
        };
      }

      const existing = this.getStorage();
      const existingIds = new Set(existing.map((s) => s.id));
      const newlyAdded = incomingList.filter((s) => !existingIds.has(s.id));
      const merged = [...newlyAdded, ...existing];

      this.setStorage(merged);
      return {
        success: true,
        data: newlyAdded.length,
        message: `${newlyAdded.length} proyek baru berhasil diimpor`,
        timestamp: Date.now(),
      };
    } catch (err) {
      return {
        success: false,
        data: 0,
        message: "Gagal memproses file cadangan JSON",
        timestamp: Date.now(),
      };
    }
  }
}

export const localSimulationApi = new LocalSimulationApi();
