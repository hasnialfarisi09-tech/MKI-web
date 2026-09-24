"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  Bed,
  Building2,
  Check,
  ChevronDown,
  Copy,
  Download,
  Eye,
  FileImage,
  FileText,
  Flame,
  FolderOpen,
  History,
  Info,
  Layers,
  Loader2,
  MapPin,
  Minus,
  Palette,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
  Tv,
  User,
  UtensilsCrossed,
  X,
} from "lucide-react";

import {
  ACCESSORIES_ITEMS,
  ELECTRONIC_ITEMS,
  FurnitureItemConfig,
  formatRupiah,
  KITCHEN_ITEMS,
  MaterialOption,
  OTHER_CATEGORIES,
  PROVINCES_DATA,
  Region,
} from "@/data/pricing-calculator";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import {
  exportSimulationAsJpg,
  exportSimulationAsPdf,
  generateSimulationPreview,
  SimulationExportData,
} from "@/lib/export-simulation";

export type KitchenLayoutType = "lurus" | "l_shape" | "u_shape";
export type DimensionField = "length" | "height" | "qty" | "length2" | "length3";

export const LAYOUT_ENABLED_ITEMS = [
  "cab_bawah",
  "cab_atas",
  "cab_atas_full_plafond",
  "lemari_pakaian",
];

export function calculateCabinetLayout(
  itemId: string,
  layout: KitchenLayoutType = "lurus",
  p1: number,
  p2: number = 0,
  p3: number = 0,
  height: number = 0
): {
  effectiveMeasurement: number;
  effectiveM1: number;
  effectiveM2: number;
  formulaDescription: string;
  formulaLabel: string;
  layoutName: string;
  unit: "M1" | "M2";
} {
  // 1. Lemari Pakaian Custom (Unit M2: P x T)
  if (itemId === "lemari_pakaian") {
    const ht = height > 0 ? height : 0;
    if (layout === "l_shape") {
      const effLen = Math.max(0, Math.round((p1 + p2 - 0.6) * 100) / 100);
      const effArea = Math.max(0, Math.round(effLen * ht * 100) / 100);
      return {
        effectiveMeasurement: effArea,
        effectiveM1: effLen,
        effectiveM2: effArea,
        formulaDescription: `(${p1}m + ${p2}m - 0,6m) × ${ht}m = ${effArea} m²`,
        formulaLabel: "(P1 + P2 - 0,6) × T × Tarif",
        layoutName: "Shape L",
        unit: "M2",
      };
    }
    if (layout === "u_shape") {
      const effLen = Math.max(0, Math.round((p1 + p2 + p3 - 1.2) * 100) / 100);
      const effArea = Math.max(0, Math.round(effLen * ht * 100) / 100);
      return {
        effectiveMeasurement: effArea,
        effectiveM1: effLen,
        effectiveM2: effArea,
        formulaDescription: `(${p1}m + ${p2}m + ${p3}m - 1,2m) × ${ht}m = ${effArea} m²`,
        formulaLabel: "(P1 + P2 + P3 - 1,2) × T × Tarif",
        layoutName: "Shape U",
        unit: "M2",
      };
    }
    // Lurus
    const effArea = Math.max(0, Math.round(p1 * ht * 100) / 100);
    return {
      effectiveMeasurement: effArea,
      effectiveM1: p1,
      effectiveM2: effArea,
      formulaDescription: `${p1}m × ${ht}m = ${effArea} m²`,
      formulaLabel: "P × T × Tarif",
      layoutName: "Lurus",
      unit: "M2",
    };
  }

  // 2. Kabinet Bawah (Unit M1)
  if (itemId === "cab_bawah") {
    if (layout === "l_shape") {
      const eff = Math.max(0, Math.round((p1 + p2 - 0.6) * 100) / 100);
      return {
        effectiveMeasurement: eff,
        effectiveM1: eff,
        effectiveM2: 0,
        formulaDescription: `(${p1}m + ${p2}m - 0,6m) = ${eff} M1`,
        formulaLabel: "(P1 + P2 - 0,6) × Tarif",
        layoutName: "Shape L",
        unit: "M1",
      };
    }
    if (layout === "u_shape") {
      const eff = Math.max(0, Math.round((p1 + p2 + p3 - 1.2) * 100) / 100);
      return {
        effectiveMeasurement: eff,
        effectiveM1: eff,
        effectiveM2: 0,
        formulaDescription: `(${p1}m + ${p2}m + ${p3}m - 1,2m) = ${eff} M1`,
        formulaLabel: "(P1 + P2 + P3 - 1,2) × Tarif",
        layoutName: "Shape U",
        unit: "M1",
      };
    }
    return {
      effectiveMeasurement: p1,
      effectiveM1: p1,
      effectiveM2: 0,
      formulaDescription: `${p1} M1`,
      formulaLabel: "Panjang (P) × Tarif",
      layoutName: "Lurus",
      unit: "M1",
    };
  }

  // 3. Kabinet Atas (Unit M1)
  if (itemId === "cab_atas") {
    if (layout === "l_shape") {
      const eff = Math.max(0, Math.round((p1 + p2 - 0.4) * 100) / 100);
      return {
        effectiveMeasurement: eff,
        effectiveM1: eff,
        effectiveM2: 0,
        formulaDescription: `(${p1}m + ${p2}m - 0,4m) = ${eff} M1`,
        formulaLabel: "(P1 + P2 - 0,4) × Tarif",
        layoutName: "Shape L",
        unit: "M1",
      };
    }
    if (layout === "u_shape") {
      const eff = Math.max(0, Math.round((p1 + p2 + p3 - 0.8) * 100) / 100);
      return {
        effectiveMeasurement: eff,
        effectiveM1: eff,
        effectiveM2: 0,
        formulaDescription: `(${p1}m + ${p2}m + ${p3}m - 0,8m) = ${eff} M1`,
        formulaLabel: "(P1 + P2 + P3 - 0,8) × Tarif",
        layoutName: "Shape U",
        unit: "M1",
      };
    }
    return {
      effectiveMeasurement: p1,
      effectiveM1: p1,
      effectiveM2: 0,
      formulaDescription: `${p1} M1`,
      formulaLabel: "Panjang (P) × Tarif",
      layoutName: "Lurus",
      unit: "M1",
    };
  }

  // 4. Kabinet Atas Full Plafond (Unit M1)
  if (itemId === "cab_atas_full_plafond") {
    if (layout === "l_shape") {
      const base = Math.max(0, Math.round((p1 + p2 - 0.4) * 100) / 100);
      const eff = Math.round(base * 2 * 100) / 100;
      return {
        effectiveMeasurement: eff,
        effectiveM1: eff,
        effectiveM2: 0,
        formulaDescription: `(${p1}m + ${p2}m - 0,4m) × 2 tingkat = ${eff} M1`,
        formulaLabel: "(P1 + P2 - 0,4) × 2 × Tarif",
        layoutName: "Shape L",
        unit: "M1",
      };
    }
    if (layout === "u_shape") {
      const base = Math.max(0, Math.round((p1 + p2 + p3 - 0.8) * 100) / 100);
      const eff = Math.round(base * 2 * 100) / 100;
      return {
        effectiveMeasurement: eff,
        effectiveM1: eff,
        effectiveM2: 0,
        formulaDescription: `(${p1}m + ${p2}m + ${p3}m - 0,8m) × 2 tingkat = ${eff} M1`,
        formulaLabel: "(P1 + P2 + P3 - 0,8) × 2 × Tarif",
        layoutName: "Shape U",
        unit: "M1",
      };
    }
    const eff = Math.round(p1 * 2 * 100) / 100;
    return {
      effectiveMeasurement: eff,
      effectiveM1: eff,
      effectiveM2: 0,
      formulaDescription: `${p1}m × 2 tingkat = ${eff} M1`,
      formulaLabel: "(P × 2) × Tarif",
      layoutName: "Lurus",
      unit: "M1",
    };
  }

  return {
    effectiveMeasurement: p1,
    effectiveM1: p1,
    effectiveM2: 0,
    formulaDescription: `${p1}`,
    formulaLabel: "Panjang (P) × Tarif",
    layoutName: "Lurus",
    unit: "M1",
  };
}

export const calculateKitchenCabinetM1 = calculateCabinetLayout;

export type MaterialTier = "hemat" | "standar" | "premium";

export function getOptionTier(opt: MaterialOption): MaterialTier | null {
  const name = opt.name.toLowerCase();
  const id = opt.id.toLowerCase();
  const model = opt.model.toLowerCase();

  // Premium: PVC or Duco or Alumunium
  if (name.includes("pvc") || id.includes("pvc")) return "premium";
  if (name.includes("duco") || id.includes("duco") || model.includes("duco")) return "premium";
  if (name.includes("alumunium") || name.includes("aluminium") || id.includes("alum")) return "premium";

  // Standar: Multiplek / Plywood HPL (not Duco / Industrial)
  if (
    (name.includes("multiplek") || name.includes("plywood") || id.includes("mult_") || id.includes("lemari_mult")) &&
    !name.includes("industrial") &&
    !id.includes("industrial")
  ) {
    return "standar";
  }

  // Hemat: Block Board
  if (
    name.includes("block board") ||
    name.includes("blockboard") ||
    id.includes("bb_") ||
    id.includes("_bb") ||
    id.includes("lemari_bb")
  ) {
    return "hemat";
  }

  return null;
}

export function findOptionForTier(
  item: FurnitureItemConfig,
  currentOptionId: string,
  targetTier: MaterialTier
): MaterialOption | undefined {
  if (!item.options || item.options.length === 0) return undefined;
  const currentOpt = item.options.find((o) => o.id === currentOptionId) ?? item.options[0];
  if (!currentOpt) return undefined;

  // Deteksi gaya / style saat ini agar tidak berubah saat ganti material
  const currentModel = currentOpt.model.toLowerCase();
  const isSemi = currentModel.includes("semi");
  const isKlasik = !isSemi && currentModel.includes("klasik");
  const targetStyle = isSemi ? "semi" : isKlasik ? "klasik" : "min";

  let candidates: MaterialOption[] = [];

  if (targetTier === "hemat") {
    candidates = item.options.filter((opt) => {
      const n = opt.name.toLowerCase();
      const id = opt.id.toLowerCase();
      return (
        n.includes("block board") ||
        n.includes("blockboard") ||
        id.includes("bb_") ||
        id.includes("_bb") ||
        id.includes("lemari_bb")
      );
    });
  } else if (targetTier === "standar") {
    candidates = item.options.filter((opt) => {
      const n = opt.name.toLowerCase();
      const id = opt.id.toLowerCase();
      const m = opt.model.toLowerCase();
      const isMult =
        n.includes("multiplek") ||
        n.includes("plywood") ||
        id.includes("mult_") ||
        id.includes("lemari_mult");
      const isDuco = n.includes("duco") || id.includes("duco") || m.includes("duco");
      const isIndustrial = n.includes("industrial") || id.includes("industrial");
      return isMult && !isDuco && !isIndustrial;
    });
  } else if (targetTier === "premium") {
    // 1. Prioritas utama: PVC Board
    candidates = item.options.filter((opt) => {
      const n = opt.name.toLowerCase();
      const id = opt.id.toLowerCase();
      return n.includes("pvc") || id.includes("pvc");
    });
    // 2. Prioritas kedua jika belum ada PVC (misal lemari, island, backdrop): Finishing Duco Mewah
    if (candidates.length === 0) {
      candidates = item.options.filter((opt) => {
        const n = opt.name.toLowerCase();
        const id = opt.id.toLowerCase();
        const m = opt.model.toLowerCase();
        return n.includes("duco") || id.includes("duco") || m.includes("duco");
      });
    }
    // 3. Prioritas ketiga jika ada varian aluminium
    if (candidates.length === 0) {
      candidates = item.options.filter((opt) => {
        const n = opt.name.toLowerCase();
        const id = opt.id.toLowerCase();
        return n.includes("alumunium") || n.includes("aluminium") || id.includes("alum");
      });
    }
  }

  // Jika item tidak memiliki opsi tier ini (misal aksesoris, granit top table, keramik backsplash), pertahankan opsi saat ini
  if (candidates.length === 0) {
    return currentOpt;
  }

  // Cocokkan model / gaya (semi klasik, klasik, atau minimalis)
  if (targetStyle === "semi") {
    const matched = candidates.find((opt) => opt.model.toLowerCase().includes("semi"));
    if (matched) return matched;
  } else if (targetStyle === "klasik") {
    const matched = candidates.find(
      (opt) =>
        opt.model.toLowerCase().includes("klasik") &&
        !opt.model.toLowerCase().includes("semi")
    );
    if (matched) return matched;
  } else {
    // minimalis / default
    const matched = candidates.find((opt) => {
      const m = opt.model.toLowerCase();
      return m.includes("min") || (!m.includes("semi") && !m.includes("klasik"));
    });
    if (matched) return matched;
  }

  return candidates[0];
}

export type ItemInstance = {
  instanceId: string;
  itemId: string;
  enabled: boolean;
  optionId: string;
  length: number | "";
  height: number | "";
  qty: number | "";
  layout?: KitchenLayoutType;
  length2?: number | "";
  length3?: number | "";
};

export type ItemState = ItemInstance;

export type CalculatorState = Record<string, ItemInstance[]>;

type CategoryKey = "kitchen" | "wardrobe" | "living" | "bedroom";

type CustomAccessory = {
  id: string;
  name: string;
  price: number | "";
  qty: string | number;
};

export type SavedSimulation = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  grandTotal: number;
  totalM1: number;
  totalM2: number;
  activeCount: number;
  provinceId: string;
  cityId: string;
  accountName?: string;
  clientName?: string;
  clientAddress?: string;
  exportPrimaryColor?: string;
  exportSecondaryColor?: string;
  itemsState: CalculatorState;
  customAccessories: Record<CategoryKey, CustomAccessory[]>;
};

const SAVED_SIMULATIONS_STORAGE_KEY = "mki_saved_simulations_v1";
const EXPORT_COLORS_STORAGE_KEY = "mki_export_doc_colors_v1";

interface SavedExportColors {
  primary: string;
  secondary: string;
}

function getSavedExportColors(): SavedExportColors | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(EXPORT_COLORS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.primary === "string" && typeof parsed.secondary === "string") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function saveExportColorsToStorage(primary: string, secondary: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(EXPORT_COLORS_STORAGE_KEY, JSON.stringify({ primary, secondary }));
  } catch (err) {
    console.error("Gagal menyimpan preferensi warna dokumen ke storage:", err);
  }
}

function getSavedSimulationsFromStorage(): SavedSimulation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_SIMULATIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Gagal membaca riwayat simulasi dari storage:", err);
    return [];
  }
}

function saveSimulationsToStorage(simulations: SavedSimulation[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SAVED_SIMULATIONS_STORAGE_KEY, JSON.stringify(simulations));
  } catch (err) {
    console.error("Gagal menyimpan riwayat simulasi ke storage:", err);
  }
}

function parseQty(val: number | string | ""): number {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (!val || typeof val !== "string") return 0;
  const normalized = val.trim().replace(",", ".");
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
}

const CATEGORY_CUSTOM_CONFIG: Record<
  CategoryKey,
  { title: string; desc: string; placeholder: string; defaultItemName: string }
> = {
  kitchen: {
    title: "Aksesoris & Fitting Tambahan Kitchen Set",
    desc: "Tuliskan nama aksesoris, harga satuan, dan jumlah (qty) sesuai kebutuhan dapur Anda.",
    placeholder: "Contoh: Rak Piring Tarik / Lampu LED / Rel Gas",
    defaultItemName: "Aksesoris Kitchen Set",
  },
  wardrobe: {
    title: "Aksesoris & Fitting Tambahan Lemari & Partisi",
    desc: "Tuliskan nama aksesoris, fitting khusus, harga satuan, dan jumlah (qty) sesuai kebutuhan lemari Anda.",
    placeholder: "Contoh: Gantungan Celana Tarik / Rak Sepatu / Cermin Sliding",
    defaultItemName: "Aksesoris Lemari",
  },
  living: {
    title: "Aksesoris & Fitting Tambahan Backdrop TV & Wallpanel",
    desc: "Tuliskan nama aksesoris, lampu, fitting, harga satuan, dan jumlah (qty) sesuai kebutuhan ruang keluarga Anda.",
    placeholder: "Contoh: Stop Kontak Pop-Up / Lampu LED Strip / Ambalan Kaca",
    defaultItemName: "Aksesoris Backdrop TV",
  },
  bedroom: {
    title: "Aksesoris & Fitting Tambahan Kamar Tidur",
    desc: "Tuliskan nama aksesoris, headboard/lampu, harga satuan, dan jumlah (qty) sesuai kebutuhan kamar Anda.",
    placeholder: "Contoh: Lampu Baca Fleksibel / Busa Headboard Custom / Rel Hidrolik",
    defaultItemName: "Aksesoris Kamar Tidur",
  },
};

const ALL_ITEMS: FurnitureItemConfig[] = [
  ...KITCHEN_ITEMS,
  ...ELECTRONIC_ITEMS,
  ...OTHER_CATEGORIES,
  ...ACCESSORIES_ITEMS,
];

const CATEGORY_TABS = [
  {
    id: "kitchen" as const,
    label: "Kitchen Set Custom",
    icon: UtensilsCrossed,
  },
  {
    id: "wardrobe" as const,
    label: "Lemari & Partisi",
    icon: Layers,
  },
  {
    id: "living" as const,
    label: "Backdrop TV & Wallpanel",
    icon: Tv,
  },
  {
    id: "bedroom" as const,
    label: "Kamar Tidur (Dipan/Rias)",
    icon: Bed,
  },
];

function buildInitialState(): CalculatorState {
  const state: CalculatorState = {};
  for (const item of ALL_ITEMS) {
    state[item.id] = [
      {
        instanceId: `${item.id}_0`,
        itemId: item.id,
        enabled: false,
        optionId: item.options[0]?.id ?? "",
        length: 0,
        height: 0,
        qty: 0,
        layout: "lurus",
        length2: 0,
        length3: 0,
      },
    ];
  }
  return state;
}

/** Reusable custom dropdown for single-level options (Provinsi & Kota) */
function SimpleDropdown({
  value,
  options,
  onChange,
  className,
}: {
  value: string;
  options: Array<{ id: string; name: string }>;
  onChange: (newId: string) => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.id === value) ?? options[0];

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground flex items-center justify-between gap-1 shadow-xs hover:border-primary transition-all cursor-pointer"
      >
        <span className="truncate">{selectedOption?.name ?? "Pilih..."}</span>
        <ChevronDown
          className={cn("size-3.5 text-muted-foreground transition-transform shrink-0", isOpen && "rotate-180 text-primary")}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 max-h-56 overflow-y-auto rounded-xl border border-border bg-card shadow-xl divide-y divide-border/50 overscroll-contain">
          {options.map((opt) => {
            const isSelected = opt.id === value;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onChange(opt.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer",
                  isSelected
                    ? "bg-primary/10 text-primary font-bold"
                    : "hover:bg-muted text-foreground"
                )}
              >
                <span className="truncate">{opt.name}</span>
                {isSelected && <Check className="size-3.5 stroke-[3] text-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const EXPORT_COLOR_PRESETS = [
  { name: "Terracotta MKI", primary: "#E5571F", secondary: "#1C1917" },
  { name: "Navy Executive", primary: "#1D4ED8", secondary: "#0F172A" },
  { name: "Emerald Luxury", primary: "#059669", secondary: "#064E3B" },
  { name: "Warm Amber", primary: "#D97706", secondary: "#451A03" },
  { name: "Monochrome", primary: "#27272A", secondary: "#09090B" },
];

export function CostCalculator() {
  // Ref & State for Mobile Sticky "Lihat RAB" Button
  const summaryCardRef = useRef<HTMLDivElement>(null);
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);

  // Monitor visibility of summary card on mobile
  useEffect(() => {
    const el = summaryCardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSummaryVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Smooth scroll to summary card without being clipped by sticky header
  const scrollToSummary = () => {
    const target = summaryCardRef.current || document.getElementById("ringkasan-estimasi-card");
    if (!target) return;
    const headerOffset = 76; // 64px header height + 12px breathing room
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  // State: Export Document Theme Colors (Primary & Secondary)
  const [exportPrimaryColor, setExportPrimaryColor] = useState<string>("#E5571F");
  const [exportSecondaryColor, setExportSecondaryColor] = useState<string>("#1C1917");
  const isColorsInitialized = useRef(false);

  // State: Riwayat Estimasi Otomatis (LocalStorage)
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>([]);
  const [activeSimulationId, setActiveSimulationId] = useState<string | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historySearchQuery, setHistorySearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load riwayat dan preferensi warna terakhir dari LocalStorage saat component mount
  useEffect(() => {
    setSavedSimulations(getSavedSimulationsFromStorage());
    const savedColors = getSavedExportColors();
    if (savedColors) {
      setExportPrimaryColor(savedColors.primary);
      setExportSecondaryColor(savedColors.secondary);
    }
    isColorsInitialized.current = true;
  }, []);

  // Simpan preferensi warna dokumen ke LocalStorage setiap kali user mengganti warna
  useEffect(() => {
    if (!isColorsInitialized.current) return;
    saveExportColorsToStorage(exportPrimaryColor, exportSecondaryColor);
  }, [exportPrimaryColor, exportSecondaryColor]);

  // Auto-dismiss notifikasi toast
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const activeSimulation = useMemo(
    () => savedSimulations.find((s) => s.id === activeSimulationId) ?? null,
    [savedSimulations, activeSimulationId]
  );

  // State: Identity & Client info (initialized to empty text)
  const [accountName, setAccountName] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");
  const [clientAddress, setClientAddress] = useState<string>("");

  // State: Location selection
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("jabar");
  const [selectedCityId, setSelectedCityId] = useState<string>("kota-bandung");

  // State: Active Category Tab
  const [activeCategory, setActiveCategory] = useState<
    "kitchen" | "wardrobe" | "living" | "bedroom"
  >("kitchen");

  // State: Item configurations
  const [itemsState, setItemsState] = useState<CalculatorState>(buildInitialState);

  // State: Kitchen Electronics Accordion (opened by default)
  const [showElectronics, setShowElectronics] = useState(false);

  // State: Accessories Accordion per Category (opened by default)
  const [showAccessories, setShowAccessories] = useState<Record<CategoryKey, boolean>>({
    kitchen: true,
    wardrobe: true,
    living: true,
    bedroom: true,
  });

  // State: Dynamic Custom Accessories per Category
  const [customAccessories, setCustomAccessories] = useState<
    Record<CategoryKey, CustomAccessory[]>
  >({
    kitchen: [{ id: "custom_acc_kitchen_1", name: "", price: "", qty: "" }],
    wardrobe: [{ id: "custom_acc_wardrobe_1", name: "", price: "", qty: "" }],
    living: [{ id: "custom_acc_living_1", name: "", price: "", qty: "" }],
    bedroom: [{ id: "custom_acc_bedroom_1", name: "", price: "", qty: "" }],
  });

  // Track editing state for custom accessories per category
  const [accEditingMap, setAccEditingMap] = useState<Record<string, boolean>>({});

  // State: Export loading status
  const [isExporting, setIsExporting] = useState<"jpg" | "pdf" | null>(null);

  // Resolve Province and City objects
  const selectedProvince = useMemo(() => {
    return (
      PROVINCES_DATA.find((p) => p.id === selectedProvinceId) ?? PROVINCES_DATA[0]
    );
  }, [selectedProvinceId]);

  const availableCities = selectedProvince.cities;

  const selectedCity = useMemo(() => {
    return (
      availableCities.find((c) => c.id === selectedCityId) ?? availableCities[0]
    );
  }, [availableCities, selectedCityId]);

  // Determine Region (Dalam Kota DK vs Luar Kota LK)
  const region: Region = selectedCity.isDK ? "DK" : "LK";

  // Handle province change: update city to first city in new province
  const handleProvinceChange = (newProvId: string) => {
    setSelectedProvinceId(newProvId);
    const newProv = PROVINCES_DATA.find((p) => p.id === newProvId);
    if (newProv && newProv.cities.length > 0) {
      setSelectedCityId(newProv.cities[0].id);
    }
  };

  // Add another instance of a component
  const addComponentInstance = (itemId: string) => {
    const itemConfig = ALL_ITEMS.find((i) => i.id === itemId);
    if (!itemConfig) return;

    setItemsState((prev) => {
      const list = prev[itemId] || [];
      const newInstance: ItemInstance = {
        instanceId: `${itemId}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        itemId,
        enabled: true, // Langsung aktif saat ditambah
        optionId: itemConfig.options[0]?.id ?? "",
        length: 0,
        height: 0,
        qty: 0,
        layout: "lurus",
        length2: 0,
        length3: 0,
      };
      const updatedList = list.map((inst, idx) =>
        idx === 0 ? { ...inst, enabled: true } : inst
      );
      return {
        ...prev,
        [itemId]: [...updatedList, newInstance],
      };
    });
  };

  // Remove a specific instance of a component
  const removeComponentInstance = (itemId: string, instanceId: string) => {
    setItemsState((prev) => {
      const list = prev[itemId] || [];
      if (list.length <= 1) {
        return {
          ...prev,
          [itemId]: [
            {
              ...list[0],
              enabled: false,
              length: 0,
              height: 0,
              qty: 0,
              layout: "lurus",
              length2: 0,
              length3: 0,
            },
          ],
        };
      }
      return {
        ...prev,
        [itemId]: list.filter((inst) => inst.instanceId !== instanceId),
      };
    });
  };

  // Toggle all instances of an item (for the outer card checkbox)
  const toggleItemAll = (itemId: string) => {
    setItemsState((prev) => {
      const list = prev[itemId] || [];
      const hasAnyEnabled = list.some((inst) => inst.enabled);
      return {
        ...prev,
        [itemId]: list.map((inst, idx) => {
          if (hasAnyEnabled) {
            return { ...inst, enabled: false };
          } else {
            if (idx === 0) {
              return {
                ...inst,
                enabled: true,
                length: typeof inst.length === "number" ? inst.length : 0,
                height: typeof inst.height === "number" ? inst.height : 0,
                qty: typeof inst.qty === "number" ? inst.qty : 0,
              };
            }
            return inst;
          }
        }),
      };
    });
  };

  // Toggle item instance enable/disable
  const toggleItem = (itemId: string, instanceId: string) => {
    setItemsState((prev) => {
      const list = prev[itemId] || [];
      return {
        ...prev,
        [itemId]: list.map((inst) => {
          if (inst.instanceId !== instanceId) return inst;
          return {
            ...inst,
            enabled: !inst.enabled,
            length: typeof inst.length === "number" ? inst.length : 0,
            height: typeof inst.height === "number" ? inst.height : 0,
            qty: typeof inst.qty === "number" ? inst.qty : 0,
          };
        }),
      };
    });
  };

  // Set option for an item instance
  const setOption = (itemId: string, instanceId: string, optionId: string) => {
    setItemsState((prev) => {
      const list = prev[itemId] || [];
      return {
        ...prev,
        [itemId]: list.map((inst) => {
          if (inst.instanceId !== instanceId) return inst;
          return {
            ...inst,
            optionId,
          };
        }),
      };
    });
  };

  // Set layout for kitchen cabinets and wardrobe instance
  const setLayout = (itemId: string, instanceId: string, layout: KitchenLayoutType) => {
    setItemsState((prev) => {
      const list = prev[itemId] || [];
      return {
        ...prev,
        [itemId]: list.map((inst) => {
          if (inst.instanceId !== instanceId) return inst;
          const p1 = typeof inst.length === "number" ? inst.length : 0;
          let p2: number | "" = typeof inst.length2 === "number" ? inst.length2 : 0;
          let p3: number | "" = typeof inst.length3 === "number" ? inst.length3 : 0;
          const ht = typeof inst.height === "number" ? inst.height : 0;

          if (layout === "l_shape") {
            p3 = 0;
          } else if (layout === "u_shape") {
            // keep p2, p3
          } else {
            p2 = 0;
            p3 = 0;
          }

          return {
            ...inst,
            layout,
            length: p1,
            length2: p2,
            length3: p3,
            height: ht,
          };
        }),
      };
    });
  };

  // Update dimension with +/- buttons
  const updateDimension = (
    itemId: string,
    instanceId: string,
    field: DimensionField,
    delta: number,
    minVal: number = 0
  ) => {
    setItemsState((prev) => {
      const list = prev[itemId] || [];
      return {
        ...prev,
        [itemId]: list.map((inst) => {
          if (inst.instanceId !== instanceId) return inst;
          const currentVal = inst[field];
          const num = typeof currentVal === "number" ? currentVal : 0;
          const next = Math.max(minVal, Math.round((num + delta) * 10) / 10);
          return {
            ...inst,
            [field]: next,
          };
        }),
      };
    });
  };

  // Set dimension directly from input
  const setDirectDimension = (
    itemId: string,
    instanceId: string,
    field: DimensionField,
    val: number | ""
  ) => {
    setItemsState((prev) => {
      const list = prev[itemId] || [];
      return {
        ...prev,
        [itemId]: list.map((inst) => {
          if (inst.instanceId !== instanceId) return inst;
          return {
            ...inst,
            [field]: val === "" ? "" : Math.max(0, val),
          };
        }),
      };
    });
  };

  // Reset entire calculator to initial state
  const handleReset = () => {
    setItemsState(buildInitialState());
    setCustomAccessories({
      kitchen: [{ id: "custom_acc_kitchen_1", name: "", price: "", qty: "" }],
      wardrobe: [{ id: "custom_acc_wardrobe_1", name: "", price: "", qty: "" }],
      living: [{ id: "custom_acc_living_1", name: "", price: "", qty: "" }],
      bedroom: [{ id: "custom_acc_bedroom_1", name: "", price: "", qty: "" }],
    });
    setAccEditingMap({});
    setAccountName("");
    setClientName("");
    setClientAddress("");
    const savedColors = getSavedExportColors();
    if (savedColors) {
      setExportPrimaryColor(savedColors.primary);
      setExportSecondaryColor(savedColors.secondary);
    } else {
      setExportPrimaryColor("#E5571F");
      setExportSecondaryColor("#1C1917");
    }
    setActiveSimulationId(null);
  };

  // Otomatis simpan / perbarui ke Riwayat Proyek saat user melakukan Export JPG atau PDF
  const autoSaveToHistory = () => {
    const now = Date.now();
    const finalClientName = clientName.trim() || "Klien Umum";
    const finalClientAddress = clientAddress.trim() || selectedCity.name;
    const finalTitle = clientName.trim()
      ? `${clientName.trim()}${clientAddress.trim() ? ` — ${clientAddress.trim()}` : ` (${selectedCity.name})`}`
      : `Klien Umum (${selectedCity.name})`;

    if (activeSimulationId) {
      // Perbarui proyek yang sedang diedit
      const updatedList = savedSimulations.map((sim) => {
        if (sim.id === activeSimulationId) {
          return {
            ...sim,
            title: finalTitle,
            clientName: finalClientName,
            clientAddress: finalClientAddress,
            updatedAt: now,
            grandTotal: calculationSummary.grandTotal,
            totalM1: calculationSummary.totalM1,
            totalM2: calculationSummary.totalM2,
            activeCount: calculationSummary.activeCount,
            provinceId: selectedProvinceId,
            cityId: selectedCityId,
            accountName: accountName.trim() || undefined,
            exportPrimaryColor,
            exportSecondaryColor,
            itemsState,
            customAccessories,
          };
        }
        return sim;
      });

      setSavedSimulations(updatedList);
      saveSimulationsToStorage(updatedList);
      setToastMessage(`Estimasi ${finalClientName} berhasil diekspor & diperbarui di Riwayat!`);
      return;
    }

    // Buat entri proyek baru di riwayat
    const newSim: SavedSimulation = {
      id: `sim_${now}_${Math.random().toString(36).substring(2, 7)}`,
      title: finalTitle,
      clientName: finalClientName,
      clientAddress: finalClientAddress,
      createdAt: now,
      updatedAt: now,
      grandTotal: calculationSummary.grandTotal,
      totalM1: calculationSummary.totalM1,
      totalM2: calculationSummary.totalM2,
      activeCount: calculationSummary.activeCount,
      provinceId: selectedProvinceId,
      cityId: selectedCityId,
      accountName: accountName.trim() || undefined,
      exportPrimaryColor,
      exportSecondaryColor,
      itemsState,
      customAccessories,
    };

    const nextList = [newSim, ...savedSimulations];
    setSavedSimulations(nextList);
    saveSimulationsToStorage(nextList);
    setActiveSimulationId(newSim.id);
    setToastMessage(`Estimasi ${finalClientName} berhasil diekspor & tersimpan di Riwayat!`);
  };

  const handleLoadSimulation = (sim: SavedSimulation) => {
    setSelectedProvinceId(sim.provinceId);
    setSelectedCityId(sim.cityId);
    setAccountName(sim.accountName || "");
    setClientName(sim.clientName || "");
    setClientAddress(sim.clientAddress || "");
    setItemsState(sim.itemsState);
    setCustomAccessories(sim.customAccessories);
    if (sim.exportPrimaryColor) setExportPrimaryColor(sim.exportPrimaryColor);
    if (sim.exportSecondaryColor) setExportSecondaryColor(sim.exportSecondaryColor);
    setActiveSimulationId(sim.id);
    setIsHistoryModalOpen(false);
    setToastMessage(`Proyek "${sim.clientName || sim.title}" berhasil dimuat! Anda dapat mengedit sekarang.`);

    if (summaryCardRef.current) {
      summaryCardRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDuplicateSimulation = (simId: string) => {
    const target = savedSimulations.find((s) => s.id === simId);
    if (!target) return;
    const now = Date.now();
    const clientCopy = target.clientName ? `${target.clientName} (Salinan)` : "Klien Umum (Salinan)";
    const clone: SavedSimulation = {
      ...target,
      id: `sim_${now}_${Math.random().toString(36).substring(2, 7)}`,
      title: `${target.title} (Salinan)`,
      clientName: clientCopy,
      createdAt: now,
      updatedAt: now,
    };
    const nextList = [clone, ...savedSimulations];
    setSavedSimulations(nextList);
    saveSimulationsToStorage(nextList);
    setToastMessage(`Proyek "${target.clientName || target.title}" berhasil digandakan!`);
  };

  const handleDeleteSimulation = (simId: string) => {
    const target = savedSimulations.find((s) => s.id === simId);
    const nextList = savedSimulations.filter((s) => s.id !== simId);
    setSavedSimulations(nextList);
    saveSimulationsToStorage(nextList);
    if (activeSimulationId === simId) {
      setActiveSimulationId(null);
    }
    setToastMessage(`Proyek ${target ? `"${target.clientName || target.title}"` : ""} telah dihapus.`);
  };

  const filteredSimulations = useMemo(() => {
    if (!historySearchQuery.trim()) return savedSimulations;
    const q = historySearchQuery.toLowerCase();
    return savedSimulations.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (s.clientName && s.clientName.toLowerCase().includes(q)) ||
        (s.clientAddress && s.clientAddress.toLowerCase().includes(q)) ||
        (s.accountName && s.accountName.toLowerCase().includes(q))
    );
  }, [savedSimulations, historySearchQuery]);

  // Compute Grand Total, Total M1, Total M2, and Active Breakdown
  const calculationSummary = useMemo(() => {
    let grandTotal = 0;
    let totalM1 = 0;
    let totalM2 = 0;
    let activeCount = 0;

    const activeBreakdown: Array<{
      item: FurnitureItemConfig;
      displayName: string;
      layout: KitchenLayoutType;
      optionName: string;
      modelName: string;
      unitPrice: number;
      unit: string;
      measurement: number;
      subtotal: number;
    }> = [];

    // 1. Process regular configured items (all instances)
    for (const item of ALL_ITEMS) {
      const instances = itemsState[item.id] || [];
      const totalInstances = instances.length;

      instances.forEach((state, idx) => {
        if (!state?.enabled) return;

        const selectedOption =
          item.options.find((opt) => opt.id === state.optionId) ?? item.options[0];
        if (!selectedOption) return;

        const unitPrice =
          region === "DK" ? selectedOption.priceDK : selectedOption.priceLK;

        const len = typeof state.length === "number" ? state.length : 0;
        const ht = typeof state.height === "number" ? state.height : 0;
        const q = typeof state.qty === "number" ? state.qty : 0;

        let subtotal = 0;
        let measurement = 0;
        const baseName = totalInstances > 1 ? `${item.name} #${idx + 1}` : item.name;
        let displayName = baseName;

        if (LAYOUT_ENABLED_ITEMS.includes(item.id)) {
          const p1 = len;
          const p2 = typeof state.length2 === "number" ? state.length2 : 0;
          const p3 = typeof state.length3 === "number" ? state.length3 : 0;
          const layoutRes = calculateCabinetLayout(
            item.id,
            state.layout ?? "lurus",
            p1,
            p2,
            p3,
            ht
          );
          measurement = layoutRes.effectiveMeasurement;
          subtotal = Math.round(measurement * unitPrice);
          if (state.layout && state.layout !== "lurus") {
            displayName = `${baseName} (${layoutRes.layoutName})`;
          }
        } else if (item.id === "meja_island") {
          measurement = len;
          subtotal = len > 0 ? Math.round((len / 0.6) * unitPrice) : 0;
        } else if (item.id === "lemari_bawah_tangga") {
          const area = Math.round(len * ht * 0.8 * 100) / 100;
          measurement = area;
          subtotal = len > 0 && ht > 0 ? Math.round(len * ht * 0.8 * unitPrice) : 0;
        } else if (selectedOption.unit === "M1") {
          measurement = len;
          subtotal = len * unitPrice;
        } else if (selectedOption.unit === "M2") {
          const area = Math.round(len * ht * 100) / 100;
          measurement = area;
          subtotal = area * unitPrice;
        } else {
          measurement = q;
          subtotal = q * unitPrice;
        }

        // Jika nilai rupiah (subtotal) <= 0, anggap unit tidak aktif: tidak tampil di ringkasan & export
        if (subtotal <= 0) return;

        // Akumulasi dimensi hanya untuk unit yang aktif (subtotal > 0)
        if (LAYOUT_ENABLED_ITEMS.includes(item.id)) {
          const layoutRes = calculateCabinetLayout(
            item.id,
            state.layout ?? "lurus",
            len,
            typeof state.length2 === "number" ? state.length2 : 0,
            typeof state.length3 === "number" ? state.length3 : 0,
            ht
          );
          if (layoutRes.unit === "M2") {
            totalM2 += measurement;
          } else {
            totalM1 += measurement;
          }
        } else if (item.id === "meja_island") {
          totalM1 += len;
        } else if (item.id === "lemari_bawah_tangga") {
          totalM2 += measurement;
        } else if (selectedOption.unit === "M1") {
          totalM1 += len;
        } else if (selectedOption.unit === "M2") {
          totalM2 += measurement;
        }

        grandTotal += subtotal;
        activeCount += 1;

        activeBreakdown.push({
          item,
          displayName,
          layout: state.layout ?? "lurus",
          optionName: selectedOption.name,
          modelName: selectedOption.model,
          unitPrice,
          unit: selectedOption.unit,
          measurement,
          subtotal,
        });
      });
    }

    // 2. Process custom accessories across all categories
    for (const cat of Object.keys(customAccessories) as CategoryKey[]) {
      for (const acc of customAccessories[cat]) {
        const p = typeof acc.price === "number" ? acc.price : 0;
        const q = parseQty(acc.qty);
        if (acc.name.trim() !== "" && p > 0 && q > 0) {
          const subtotal = Math.round(p * q);
          grandTotal += subtotal;
          activeCount += 1;
          activeBreakdown.push({
            item: {
              id: acc.id,
              name: `${acc.name.trim()} (${CATEGORY_CUSTOM_CONFIG[cat].defaultItemName})`,
              category: "accessories",
              defaultUnit: "UNIT",
              description: `Aksesoris Kustom - ${CATEGORY_CUSTOM_CONFIG[cat].title}`,
              options: [],
            },
            displayName: `${acc.name.trim()} (${CATEGORY_CUSTOM_CONFIG[cat].defaultItemName})`,
            layout: "lurus",
            optionName: "Kustom",
            modelName: `${q} @ ${formatRupiah(p)}`,
            unitPrice: p,
            unit: "UNIT",
            measurement: q,
            subtotal,
          });
        }
      }
    }

    return {
      grandTotal,
      totalM1: Math.round(totalM1 * 10) / 10,
      totalM2: Math.round(totalM2 * 100) / 100,
      activeCount,
      activeBreakdown,
    };
  }, [itemsState, region, customAccessories]);

  const activeCategoryItems = useMemo(() => {
    if (activeCategory === "kitchen") {
      return KITCHEN_ITEMS;
    }
    return OTHER_CATEGORIES.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  // Compute selected count per category (hanya menghitung unit yang aktif dengan subtotal > 0)
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryKey, number> = {
      kitchen: 0,
      wardrobe: 0,
      living: 0,
      bedroom: 0,
    };

    const isInstanceActive = (item: FurnitureItemConfig, inst: ItemInstance) => {
      if (!inst.enabled) return false;
      const c = getInstanceCalculation(item, inst, region);
      return c.subtotal > 0;
    };

    for (const item of KITCHEN_ITEMS) {
      const active = (itemsState[item.id] || []).filter((i) => isInstanceActive(item, i)).length;
      counts.kitchen += active;
    }
    for (const item of ELECTRONIC_ITEMS) {
      const active = (itemsState[item.id] || []).filter((i) => isInstanceActive(item, i)).length;
      counts.kitchen += active;
    }
    for (const item of OTHER_CATEGORIES) {
      const active = (itemsState[item.id] || []).filter((i) => isInstanceActive(item, i)).length;
      if (item.category === "wardrobe") counts.wardrobe += active;
      else if (item.category === "living") counts.living += active;
      else if (item.category === "bedroom") counts.bedroom += active;
    }

    // Include valid custom accessories per category
    for (const cat of Object.keys(customAccessories) as CategoryKey[]) {
      const validCustomCount = customAccessories[cat].filter(
        (a) =>
          a.name.trim() !== "" &&
          typeof a.price === "number" &&
          a.price > 0 &&
          parseQty(a.qty) > 0
      ).length;
      counts[cat] += validCustomCount;
    }

    return counts;
  }, [itemsState, region, customAccessories]);

  const addCustomAccessory = (cat: CategoryKey) => {
    setCustomAccessories((prev) => ({
      ...prev,
      [cat]: [
        ...prev[cat],
        { id: `custom_acc_${cat}_${Date.now()}`, name: "", price: "", qty: "" },
      ],
    }));
  };

  const removeCustomAccessory = (cat: CategoryKey, id: string) => {
    setCustomAccessories((prev) => {
      const filtered = prev[cat].filter((acc) => acc.id !== id);
      return {
        ...prev,
        [cat]:
          filtered.length === 0
            ? [{ id: `custom_acc_${cat}_${Date.now()}`, name: "", price: "", qty: "" }]
            : filtered,
      };
    });
  };

  const updateCustomAccessory = (
    cat: CategoryKey,
    id: string,
    field: "name" | "price" | "qty",
    val: string | number
  ) => {
    setCustomAccessories((prev) => ({
      ...prev,
      [cat]: prev[cat].map((acc) => (acc.id === id ? { ...acc, [field]: val } : acc)),
    }));
  };

  // Perbandingan Cerdas Alternatif Bahan (Smart Budget Comparison)
  const comparisonTiers = useMemo(() => {
    if (calculationSummary.grandTotal <= 0) {
      return {
        hematTotal: 0,
        standarTotal: 0,
        premiumTotal: 0,
        currentTier: "standar" as const,
        tiers: {
          hemat: {
            label: "Paket Hemat",
            material: "Block Board 18mm — Finishing HPL",
            tag: "Ekonomis",
            total: 0,
            diff: 0,
          },
          standar: {
            label: "Paket Standar",
            material: "Multiplek / Plywood — Finishing HPL",
            tag: "Paling Populer",
            total: 0,
            diff: 0,
          },
          premium: {
            label: "Paket Premium",
            material: "PVC Board 100% Anti Rayap",
            tag: "Anti Rayap & Air",
            total: 0,
            diff: 0,
          },
        },
      };
    }

    // Hitung custom accessories aktif (tetap konstan di semua tier)
    let customAccTotal = 0;
    for (const cat of Object.keys(customAccessories) as CategoryKey[]) {
      for (const acc of customAccessories[cat]) {
        const p = typeof acc.price === "number" ? acc.price : 0;
        const q = parseQty(acc.qty);
        if (acc.name.trim() !== "" && p > 0 && q > 0) {
          customAccTotal += Math.round(p * q);
        }
      }
    }

    const tierTotals = {
      hemat: 0,
      standar: 0,
      premium: 0,
    };

    let totalTierCapable = 0;
    const tierCounts = {
      hemat: 0,
      standar: 0,
      premium: 0,
    };

    const targetTiers: MaterialTier[] = ["hemat", "standar", "premium"];

    for (const item of ALL_ITEMS) {
      const instances = itemsState[item.id] || [];

      instances.forEach((inst) => {
        if (!inst?.enabled) return;

        const currentCalc = getInstanceCalculation(item, inst, region);
        if (currentCalc.subtotal <= 0) return;

        // Cek tier bahan yang saat ini aktif
        const currentOpt =
          item.options.find((opt) => opt.id === inst.optionId) ?? item.options[0];
        const detectedTier = currentOpt ? getOptionTier(currentOpt) : null;
        if (detectedTier) {
          totalTierCapable += 1;
          tierCounts[detectedTier] += 1;
        }

        // Hitung estimasi untuk setiap tier alternatif
        for (const tier of targetTiers) {
          const targetOpt = findOptionForTier(item, inst.optionId, tier);
          if (targetOpt && targetOpt.id !== inst.optionId) {
            const targetCalc = getInstanceCalculation(
              item,
              { ...inst, optionId: targetOpt.id },
              region
            );
            tierTotals[tier] += targetCalc.subtotal;
          } else {
            tierTotals[tier] += currentCalc.subtotal;
          }
        }
      });
    }

    const hematTotal = tierTotals.hemat + customAccTotal;
    const standarTotal = tierTotals.standar + customAccTotal;
    const premiumTotal = tierTotals.premium + customAccTotal;

    let currentTier: "hemat" | "standar" | "premium" | "custom" = "custom";
    if (totalTierCapable > 0) {
      if (tierCounts.hemat === totalTierCapable) currentTier = "hemat";
      else if (tierCounts.standar === totalTierCapable) currentTier = "standar";
      else if (tierCounts.premium === totalTierCapable) currentTier = "premium";
    }

    return {
      hematTotal,
      standarTotal,
      premiumTotal,
      currentTier,
      tiers: {
        hemat: {
          label: "Paket Hemat",
          material: "Block Board 18mm — Finishing HPL",
          tag: "Ekonomis",
          total: hematTotal,
          diff: hematTotal - calculationSummary.grandTotal,
        },
        standar: {
          label: "Paket Standar",
          material: "Multiplek / Plywood — Finishing HPL",
          tag: "Paling Populer",
          total: standarTotal,
          diff: standarTotal - calculationSummary.grandTotal,
        },
        premium: {
          label: "Paket Premium",
          material: "PVC Board 100% Anti Rayap",
          tag: "Anti Rayap & Air",
          total: premiumTotal,
          diff: premiumTotal - calculationSummary.grandTotal,
        },
      },
    };
  }, [itemsState, region, customAccessories, calculationSummary.grandTotal]);

  // Aksi 1-Klik: Terapkan bahan tier ke seluruh komponen aktif
  const applyMaterialTier = (tier: MaterialTier) => {
    setItemsState((prev) => {
      const nextState: CalculatorState = {};
      for (const item of ALL_ITEMS) {
        const instances = prev[item.id] || [];
        nextState[item.id] = instances.map((inst) => {
          const targetOpt = findOptionForTier(item, inst.optionId, tier);
          if (targetOpt && targetOpt.id !== inst.optionId) {
            return {
              ...inst,
              optionId: targetOpt.id,
            };
          }
          return inst;
        });
      }
      return nextState;
    });
  };

  // Memoized export simulation payload for download and live preview
  const exportSimulationData: SimulationExportData = useMemo(() => {
    return {
      cityName: selectedCity.name,
      provinceName: selectedProvince.name,
      region,
      accountName: accountName.trim() || undefined,
      clientName: clientName.trim() || undefined,
      clientAddress: clientAddress.trim() || undefined,
      grandTotal: calculationSummary.grandTotal,
      totalM1: calculationSummary.totalM1,
      totalM2: calculationSummary.totalM2,
      activeCount: calculationSummary.activeCount,
      breakdown: calculationSummary.activeBreakdown.map((b) => ({
        itemName: b.displayName,
        optionName: b.optionName,
        modelName: b.modelName,
        unitPrice: b.unitPrice,
        unit: b.unit,
        measurement: b.measurement,
        subtotal: b.subtotal,
      })),
      primaryColor: exportPrimaryColor,
      secondaryColor: exportSecondaryColor,
    };
  }, [
    selectedCity.name,
    selectedProvince.name,
    region,
    accountName,
    clientName,
    clientAddress,
    calculationSummary,
    exportPrimaryColor,
    exportSecondaryColor,
  ]);

  // Aturan Ekspor: Jika item > 15 hanya bisa ekspor ke PDF. Jika <= 15 bisa JPG dan PDF.
  const isJpgAllowed = calculationSummary.activeBreakdown.length <= 15;

  // State: Live Preview Modal & Zoom Controls
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewZoom, setPreviewZoom] = useState<"fit" | "actual">("fit");
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  // Open Preview Modal & Immediately Generate Image
  const handleOpenPreview = () => {
    if (calculationSummary.activeBreakdown.length === 0) return;
    try {
      setIsGeneratingPreview(true);
      const url = generateSimulationPreview(exportSimulationData, 1.2);
      setPreviewDataUrl(url);
    } catch (err) {
      console.error("Gagal membuat live preview:", err);
    } finally {
      setIsGeneratingPreview(false);
    }
    setIsPreviewOpen(true);
  };

  // Debounced auto-refresh of preview when modal is open and data or colors change
  useEffect(() => {
    if (!isPreviewOpen || calculationSummary.activeBreakdown.length === 0) {
      return;
    }
    setIsGeneratingPreview(true);
    const timer = setTimeout(() => {
      try {
        const url = generateSimulationPreview(exportSimulationData, 1.2);
        setPreviewDataUrl(url);
      } catch (err) {
        console.error("Gagal update live preview:", err);
      } finally {
        setIsGeneratingPreview(false);
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [isPreviewOpen, exportSimulationData, calculationSummary.activeBreakdown.length]);

  // Lock body scroll and handle Escape key for preview modal
  useEffect(() => {
    if (!isPreviewOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPreviewOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPreviewOpen]);

  const handleDownload = async (format: "jpg" | "pdf") => {
    if (calculationSummary.activeBreakdown.length === 0 || isExporting) return;
    if (format === "jpg" && !isJpgAllowed) {
      alert("Jumlah item lebih dari 15. Ekspor hanya tersedia dalam format PDF untuk menjaga kerapian dokumen.");
      return;
    }
    try {
      setIsExporting(format);
      if (format === "jpg") {
        await exportSimulationAsJpg(exportSimulationData);
      } else {
        await exportSimulationAsPdf(exportSimulationData);
      }
      track("simulation_export", { format, city: selectedCity.name });
      // Otomatis simpan / perbarui ke Riwayat Proyek saat user melakukan Export JPG atau PDF
      autoSaveToHistory();
    } catch (err) {
      console.error("Gagal export estimasi:", err);
      alert("Terjadi kendala saat menyiapkan file. Silakan coba lagi.");
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Header Panel & Location Picker */}
      <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 lg:p-10 mb-8 shadow-xs">
        {/* Top Header Intro */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="size-3.5" />
            Kalkulator Biaya Custom Transparan
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight">
            Simulasi Estimasi Biaya Furniture
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Pilih lokasi pemasangan Anda dan kombinasikan komponen furniture yang Anda butuhkan.
            Tarif dihitung otomatis secara transparan sesuai area jangkauan workshop.
          </p>
        </div>

        {/* Input Controls: Data Akun & Klien + Area Pemasangan */}
        <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Box 1: Data Akun & Klien */}
          <div className="lg:col-span-7 bg-background rounded-2xl p-4 sm:p-5 border border-border shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Building2 className="size-4 text-primary" />
                  <span>Identitas Akun & Klien:</span>
                </div>
                <span className="text-[11px] text-muted-foreground font-medium">
                  Tampil di Ekspor JPG / PDF
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Nama Akun */}
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground mb-1">
                    <Building2 className="size-3 text-primary" />
                    <span>Nama Akun:</span>
                  </label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Masukkan nama akun..."
                    className="w-full h-9 px-3 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>

                {/* Nama Client */}
                <div>
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground mb-1">
                    <User className="size-3 text-primary" />
                    <span>Nama Client:</span>
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Masukkan nama client..."
                    className="w-full h-9 px-3 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>

                {/* Alamat Client */}
                <div>
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground mb-1">
                    <MapPin className="size-3 text-primary" />
                    <span>Alamat Client:</span>
                  </label>
                  <input
                    type="text"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="Masukkan alamat client..."
                    className="w-full h-9 px-3 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Box 2: Area Pemasangan */}
          <div className="lg:col-span-5 bg-background rounded-2xl p-4 sm:p-5 border border-border shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-3 px-0.5">
                <MapPin className="size-4 text-primary" />
                <span>Pilih Area Pemasangan:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Province Select */}
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Provinsi:
                  </label>
                  <SimpleDropdown
                    value={selectedProvinceId}
                    options={PROVINCES_DATA.map((prov) => ({ id: prov.id, name: prov.name }))}
                    onChange={handleProvinceChange}
                  />
                </div>

                {/* City Select */}
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Kota / Kabupaten:
                  </label>
                  <SimpleDropdown
                    value={selectedCityId}
                    options={availableCities.map((city) => ({ id: city.id, name: city.name }))}
                    onChange={(newId) => setSelectedCityId(newId)}
                  />
                </div>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-muted-foreground/80 leading-normal">
              Tarif wilayah otomatis disesuaikan (Dalam Kota / Luar Kota).
            </p>
          </div>
        </div>

        {/* Category Navigation Tabs */}
        <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-2 sm:gap-3">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            const count = categoryCounts[tab.id];
            const hasSelected = count > 0;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer select-none",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs ring-1 ring-primary"
                    : hasSelected
                      ? "bg-card text-foreground border border-primary/40 shadow-2xs hover:bg-primary/5 ring-1 ring-primary/20 font-semibold"
                      : "bg-card text-muted-foreground hover:bg-muted border border-border"
                )}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0 transition-colors",
                    isActive
                      ? "text-primary-foreground"
                      : hasSelected
                        ? "text-primary"
                        : "text-muted-foreground"
                  )}
                />
                <span>{tab.label}</span>

                {hasSelected && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold leading-none shrink-0 transition-all",
                      isActive
                        ? "bg-background text-primary shadow-xs"
                        : "bg-primary text-primary-foreground shadow-xs"
                    )}
                  >
                    <Check className="size-2.5 stroke-[3]" />
                    <span>
                      {count}
                      <span className="hidden sm:inline"> item</span>
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Project Banner (Mode Edit Riwayat) */}
      {activeSimulation && (
        <div className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-primary/10 border-2 border-primary/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs mb-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="size-2.5 rounded-full bg-primary animate-ping shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-primary uppercase tracking-wider block">
                Sedang Mengedit Proyek:
              </span>
              <h4 className="text-sm sm:text-base font-display font-bold text-foreground truncate">
                {activeSimulation.clientName || "Klien Umum"} {activeSimulation.clientAddress ? `— ${activeSimulation.clientAddress}` : ""}
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Perubahan otomatis terupdate ke Riwayat saat Anda mengekspor (JPG / PDF).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveSimulationId(null)}
              className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-medium transition-colors cursor-pointer"
              title="Tutup mode edit proyek ini (data kalkulasi saat ini tetap ada)"
            >
              Keluar Mode Edit
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Item Selectors (Left) + Live Sticky Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Component Cards */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-bold text-foreground">
              <span>Pilihan Komponen</span>
            </h3>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(true)}
                className="text-xs text-primary hover:text-primary/80 inline-flex items-center gap-1.5 font-bold transition-colors cursor-pointer"
                title="Buka daftar riwayat estimasi proyek yang pernah disimpan"
              >
                <FolderOpen className="size-3.5" />
                <span>Riwayat ({savedSimulations.length})</span>
              </button>
              <span className="text-border select-none">|</span>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset Simulasi</span>
              </button>
            </div>
          </div>

          {/* Render Active Category Items */}
          <div className="space-y-4">
            {activeCategoryItems.map((item) => {
              const instances = itemsState[item.id] || [];
              return (
                <ItemCard
                  key={item.id}
                  item={item}
                  region={region}
                  instances={instances}
                  onToggle={() => toggleItemAll(item.id)}
                  onSelectOption={(instanceId, optId) => setOption(item.id, instanceId, optId)}
                  onUpdateDimension={(instanceId, field, delta, min) =>
                    updateDimension(item.id, instanceId, field, delta, min)
                  }
                  onSetDirectDimension={(instanceId, field, val) =>
                    setDirectDimension(item.id, instanceId, field, val)
                  }
                  onSetLayout={(instanceId, layout) => setLayout(item.id, instanceId, layout)}
                  onAddInstance={() => addComponentInstance(item.id)}
                  onRemoveInstance={(instanceId) => removeComponentInstance(item.id, instanceId)}
                />
              );
            })}
          </div>

          {/* Kitchen Electronics & Appliances Accordion (Displayed in Kitchen tab) */}
          {activeCategory === "kitchen" && (
            <div className="mt-8 rounded-2xl border border-primary/30 bg-card shadow-xs relative z-20 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowElectronics((prev) => !prev)}
                className={cn(
                  "w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/40 transition-colors cursor-pointer"
                )}
              >
                <div>
                  <h4 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Flame className="size-3.5" />
                    </span>
                    <span>Peralatan Elektronik & Kitchen Appliances</span>
                    <span className="text-xs font-normal text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      Kompor, Hood, Sink, Paket Hemat
                    </span>
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Peralatan dapur standar Modena / Rinnai bergaransi resmi. Bisa pilih satuan atau paket bundling hemat.
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    "size-5 text-muted-foreground transition-transform duration-200 shrink-0",
                    showElectronics ? "rotate-180 text-primary" : ""
                  )}
                />
              </button>

              {showElectronics && (
                <div className="p-4 sm:p-6 border-t border-border space-y-4 bg-background">
                  <div className="rounded-xl border border-primary/25 bg-primary/5 p-3 sm:p-4 text-xs text-foreground flex items-start gap-2.5">
                    <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-primary">Tips Hemat Paket Bundling: </span>
                      <span>
                        Pilih <strong>Paket Standar Lengkap</strong> (Kompor 2 Tungku + Sink 60 + Cookerhood 70) seharga <strong>Rp 7.200.000</strong> untuk menghemat biaya dibandingkan memilih satuan (total Rp 7.500.000).
                      </span>
                    </div>
                  </div>

                  {ELECTRONIC_ITEMS.map((item) => {
                    const instances = itemsState[item.id] || [];
                    return (
                      <ItemCard
                        key={item.id}
                        item={item}
                        region={region}
                        instances={instances}
                        onToggle={() => toggleItemAll(item.id)}
                        onSelectOption={(instanceId, optId) => setOption(item.id, instanceId, optId)}
                        onUpdateDimension={(instanceId, field, delta, min) =>
                          updateDimension(item.id, instanceId, field, delta, min)
                        }
                        onSetDirectDimension={(instanceId, field, val) =>
                          setDirectDimension(item.id, instanceId, field, val)
                        }
                        onSetLayout={(instanceId, layout) => setLayout(item.id, instanceId, layout)}
                        onAddInstance={() => addComponentInstance(item.id)}
                        onRemoveInstance={(instanceId) => removeComponentInstance(item.id, instanceId)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Custom Accessories Accordion (Available in ALL Categories) */}
          <div className="mt-4 rounded-2xl border border-border bg-card relative z-10 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() =>
                setShowAccessories((prev) => ({
                  ...prev,
                  [activeCategory]: !prev[activeCategory],
                }))
              }
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/40 transition-colors cursor-pointer"
            >
              <div>
                <h4 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <span>{CATEGORY_CUSTOM_CONFIG[activeCategory].title}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    (Input Kustom)
                  </span>
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {CATEGORY_CUSTOM_CONFIG[activeCategory].desc}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "size-5 text-muted-foreground transition-transform duration-200 shrink-0",
                  showAccessories[activeCategory] ? "rotate-180 text-primary" : ""
                )}
              />
            </button>

            {showAccessories[activeCategory] && (
              <div className="p-4 sm:p-6 border-t border-border space-y-4 bg-background">
                <div className="space-y-3">
                  {customAccessories[activeCategory].map((acc, index) => {
                    const p = typeof acc.price === "number" ? acc.price : 0;
                    const q = parseQty(acc.qty);
                    const sub = Math.round(p * q);
                    const totalAccessories = customAccessories[activeCategory].length;
                    const isLatest = index === totalAccessories - 1;
                    const isEditing =
                      totalAccessories <= 1 ||
                      (accEditingMap[acc.id] !== undefined ? accEditingMap[acc.id] : isLatest);

                    return isEditing ? (
                      <div
                        key={acc.id}
                        className="rounded-xl border border-primary/40 bg-card p-3.5 sm:p-4 shadow-2xs transition-all"
                      >
                        <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-primary/20">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground shadow-2xs">
                              <Sparkles className="size-3" />
                              <span>Item Aksesoris #{index + 1}</span>
                            </span>
                            {sub > 0 && (
                              <span className="text-xs font-bold text-primary">
                                Subtotal: {formatRupiah(sub)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            {totalAccessories > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setAccEditingMap((prev) => ({
                                    ...prev,
                                    [acc.id]: false,
                                  }))
                                }
                                className="text-xs font-semibold text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors cursor-pointer"
                                title="Ringkas tampilan aksesoris ini"
                              >
                                Ringkas
                              </button>
                            )}
                            {totalAccessories > 1 && (
                              <button
                                type="button"
                                onClick={() => removeCustomAccessory(activeCategory, acc.id)}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-red-500 hover:bg-red-500/10 px-2 py-1 rounded-md transition-colors cursor-pointer"
                                title={`Hapus Item Aksesoris #${index + 1}`}
                              >
                                <Trash2 className="size-3.5" />
                                <span className="hidden sm:inline">Hapus</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                          {/* Nama Item */}
                          <div className="sm:col-span-6">
                            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                              Nama Item Aksesoris:
                            </label>
                            <input
                              type="text"
                              placeholder={CATEGORY_CUSTOM_CONFIG[activeCategory].placeholder}
                              value={acc.name}
                              onChange={(e) =>
                                updateCustomAccessory(activeCategory, acc.id, "name", e.target.value)
                              }
                              className="w-full text-xs sm:text-sm font-medium rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none placeholder:text-muted-foreground/60"
                            />
                          </div>

                          {/* Harga Satuan */}
                          <div className="sm:col-span-3">
                            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                              Harga Satuan (Rp):
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="0"
                              value={
                                acc.price !== "" && typeof acc.price === "number" && !isNaN(acc.price)
                                  ? new Intl.NumberFormat("id-ID").format(acc.price)
                                  : ""
                              }
                              onFocus={(e) => {
                                if (e.target.value === "0") e.target.select();
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Backspace") {
                                  const input = e.currentTarget;
                                  const pos = input.selectionStart;
                                  if (pos !== null && pos > 0 && input.value[pos - 1] === ".") {
                                    e.preventDefault();
                                    const raw = input.value.slice(0, pos - 2) + input.value.slice(pos);
                                    const digits = raw.replace(/\D/g, "");
                                    const num = digits ? parseInt(digits, 10) : "";
                                    updateCustomAccessory(activeCategory, acc.id, "price", num);

                                    const newDigitsBefore = raw.slice(0, pos - 2).replace(/\D/g, "").length;
                                    const formatted = num === "" ? "" : new Intl.NumberFormat("id-ID").format(num);
                                    let targetPos = 0;
                                    let count = 0;
                                    for (let i = 0; i < formatted.length; i++) {
                                      if (/\d/.test(formatted[i])) count++;
                                      if (count === newDigitsBefore) {
                                        targetPos = i + 1;
                                        break;
                                      }
                                    }
                                    requestAnimationFrame(() => {
                                      input.setSelectionRange(targetPos, targetPos);
                                    });
                                  }
                                }
                              }}
                              onChange={(e) => {
                                const input = e.target;
                                const raw = input.value;
                                const cursorPos = input.selectionStart ?? raw.length;
                                const digitsBeforeCursor = raw.slice(0, cursorPos).replace(/\D/g, "").length;

                                const digits = raw.replace(/\D/g, "");
                                if (!digits) {
                                  updateCustomAccessory(activeCategory, acc.id, "price", "");
                                  return;
                                }

                                const parsed = parseInt(digits, 10);
                                const validNum = isNaN(parsed) ? "" : parsed;
                                updateCustomAccessory(activeCategory, acc.id, "price", validNum);

                                const formatted = validNum === "" ? "" : new Intl.NumberFormat("id-ID").format(validNum);
                                let targetPos = 0;
                                let digitCount = 0;
                                for (let i = 0; i < formatted.length; i++) {
                                  if (/\d/.test(formatted[i])) digitCount++;
                                  if (digitCount === digitsBeforeCursor) {
                                    targetPos = i + 1;
                                    break;
                                  }
                                }
                                if (targetPos === 0 && digitsBeforeCursor === 0) targetPos = 0;
                                if (digitCount < digitsBeforeCursor) targetPos = formatted.length;

                                requestAnimationFrame(() => {
                                  input.setSelectionRange(targetPos, targetPos);
                                });
                              }}
                              className="w-full text-xs sm:text-sm font-bold text-center rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                            />
                          </div>

                          {/* Qty (Supports comma & decimal like 2.5) */}
                          <div className="sm:col-span-3">
                            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                              QTY / Meter:
                            </label>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  const current = parseQty(acc.qty);
                                  const next = Math.max(0, Math.round((current - 1) * 10) / 10);
                                  updateCustomAccessory(
                                    activeCategory,
                                    acc.id,
                                    "qty",
                                    next === 0 ? "" : next
                                  );
                                }}
                                className="size-9 rounded-xl border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer shrink-0"
                                title="Kurangi 1"
                              >
                                <Minus className="size-3.5" />
                              </button>
                              <input
                                type="text"
                                inputMode="decimal"
                                placeholder="0"
                                value={acc.qty}
                                onChange={(e) => {
                                  let val = e.target.value.replace(/[^0-9.,]/g, "");
                                  const sepMatch = val.match(/[.,]/);
                                  if (sepMatch && sepMatch.index !== undefined) {
                                    const before = val.slice(0, sepMatch.index);
                                    const sep = sepMatch[0];
                                    const after = val.slice(sepMatch.index + 1).replace(/[.,]/g, "");
                                    val = before + sep + after;
                                  }
                                  updateCustomAccessory(activeCategory, acc.id, "qty", val);
                                }}
                                className="w-full text-center font-bold text-xs sm:text-sm rounded-xl border border-border bg-background py-2 text-foreground focus:border-primary focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const current = parseQty(acc.qty);
                                  const next = Math.round((current + 1) * 10) / 10;
                                  updateCustomAccessory(activeCategory, acc.id, "qty", next);
                                }}
                                className="size-9 rounded-xl border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer shrink-0"
                                title="Tambah 1"
                              >
                                <Plus className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={acc.id}
                        className="rounded-xl border border-primary/40 bg-primary/5 hover:border-primary/60 p-3.5 sm:p-4 transition-all shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold font-sans bg-primary text-primary-foreground shadow-2xs">
                              <Sparkles className="size-3" />
                              <span>Item Aksesoris #{index + 1}</span>
                            </span>
                            <span className="text-xs font-bold text-foreground">
                              {acc.name.trim() || `Item Aksesoris #${index + 1}`}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 ml-auto">
                            <span className="text-xs sm:text-sm font-bold text-primary">
                              {sub > 0 ? formatRupiah(sub) : "Rp 0"}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setAccEditingMap((prev) => ({
                                  ...prev,
                                  [acc.id]: true,
                                }))
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-primary hover:bg-primary/10 border border-primary/25 transition-colors cursor-pointer"
                              title="Ubah data aksesoris ini"
                            >
                              <Pencil className="size-3" />
                              <span>Ubah</span>
                            </button>
                            {totalAccessories > 1 && (
                              <button
                                type="button"
                                onClick={() => removeCustomAccessory(activeCategory, acc.id)}
                                className="size-7 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-colors cursor-pointer"
                                title={`Hapus Item Aksesoris #${index + 1}`}
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground gap-1.5 pt-1.5 border-t border-border/40">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-foreground">QTY / Meter:</span>
                            <span className="font-bold text-foreground bg-background px-2 py-0.5 rounded-md border border-border/60">
                              {q > 0 ? `${q}` : "0"}
                            </span>
                          </div>
                          <div className="text-[11px] text-muted-foreground shrink-0">
                            Harga Satuan: {p > 0 ? formatRupiah(p) : "Rp 0"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {(() => {
                  const isAddAccessoryDisabled = customAccessories[activeCategory].some(
                    (acc) =>
                      acc.name.trim() === "" ||
                      typeof acc.price !== "number" ||
                      acc.price <= 0 ||
                      parseQty(acc.qty) <= 0
                  );

                  return (
                    <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
                      <button
                        type="button"
                        disabled={isAddAccessoryDisabled}
                        onClick={() => {
                          if (isAddAccessoryDisabled) return;
                          setAccEditingMap({});
                          addCustomAccessory(activeCategory);
                        }}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all shadow-2xs",
                          isAddAccessoryDisabled
                            ? "border-border bg-muted/40 text-muted-foreground opacity-50 cursor-not-allowed select-none"
                            : "border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary hover:shadow-xs cursor-pointer"
                        )}
                        title={
                          isAddAccessoryDisabled
                            ? "Lengkapi nama, harga satuan, dan jumlah (qty) aksesoris terlebih dahulu untuk menambah baris baru"
                            : "Tambah baris aksesoris baru"
                        }
                      >
                        <Plus className="size-3.5" />
                        <span>Tambah Baris Aksesoris</span>
                      </button>
                      <span className="text-[11px] text-muted-foreground">
                        *Bisa isi nama aksesoris, tarif, & qty bebas (bisa desimal/koma)
                      </span>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Educational Notes / Panduan Ukur */}
          <div className="rounded-2xl bg-card border border-border p-5 sm:p-6 text-xs sm:text-sm text-muted-foreground space-y-3">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <Info className="size-4 text-primary" />
              <span>Cara Membaca Satuan Perhitungan:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1 leading-relaxed">
              <li>
                <strong>Meter Lari (M1):</strong> Dihitung berdasarkan panjang
                bentangan furniture dengan kedalaman dan tinggi standar ergonomis
                (misal kabinet bawah tinggi ~85cm kedalaman ~60cm).
              </li>
              <li>
                <strong>Meter Persegi (M2):</strong> Dihitung berdasarkan luas bidang
                tampak depan (Panjang x Tinggi), cocok untuk lemari full-plafon atau
                backdrop panel dinding.
              </li>
              <li>
                <strong>Unit:</strong> Dihitung per buah atau per set aksesoris pelengkap
                dapur (sink, rak piring tarik, rel tabung gas).
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Sticky Live Summary */}
        <div
          id="ringkasan-estimasi-card"
          ref={summaryCardRef}
          className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-6 scroll-mt-24"
        >
          <div className="rounded-3xl bg-card border-2 border-primary/20 p-6 sm:p-7 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Ringkasan Estimasi
                </span>
                <h4 className="text-lg font-display font-bold text-foreground">
                  Total Perkiraan Biaya
                </h4>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {selectedCity.name}
              </span>
            </div>

            {/* Big Price Display */}
            <div className="mb-6">
              <div className="text-xs text-muted-foreground mb-1 font-medium">
                Estimasi Total (Komponen Terpilih):
              </div>
              <div className="text-3xl sm:text-4xl font-display font-black tracking-tight text-primary">
                {formatRupiah(calculationSummary.grandTotal)}
              </div>
              <div className="flex items-center gap-2 sm:gap-3 mt-3 text-xs text-muted-foreground flex-wrap">
                <span className="inline-flex items-center gap-1 font-medium bg-background px-2.5 py-1 rounded-md border border-border">
                  <strong>{calculationSummary.activeCount}</strong> Item Aktif
                </span>
                {calculationSummary.totalM1 > 0 && (
                  <span className="inline-flex items-center gap-1 bg-background px-2.5 py-1 rounded-md border border-border">
                    <strong>{calculationSummary.totalM1}</strong> M1 Lari
                  </span>
                )}
                {calculationSummary.totalM2 > 0 && (
                  <span className="inline-flex items-center gap-1 bg-background px-2.5 py-1 rounded-md border border-border">
                    <strong>{calculationSummary.totalM2}</strong> m² Persegi
                  </span>
                )}
              </div>
            </div>

            {/* Item Breakdown List */}
            <div className="border-t border-border pt-4 mb-6">
              <div className="text-xs font-semibold text-foreground mb-3 flex items-center justify-between">
                <span>Rincian Komponen Terpilih</span>
                <span className="text-primary font-bold">Subtotal</span>
              </div>

              {calculationSummary.activeBreakdown.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground italic bg-muted/30 rounded-xl border border-dashed border-border">
                  Belum ada komponen aktif yang diisi ukurannya. Centang komponen di sebelah kiri dan masukkan ukuran dimensi untuk melihat rincian estimasi.
                </div>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1 text-xs">
                  {calculationSummary.activeBreakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-background border border-border flex flex-col gap-1"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-foreground line-clamp-1">
                          {item.displayName}
                        </span>
                        <span className="font-bold text-foreground whitespace-nowrap">
                          {formatRupiah(item.subtotal)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{item.optionName}</span>
                        <span>
                          {item.item.id === "meja_island" ? (
                            `(${item.measurement} m : 0,6) x ${formatRupiah(item.unitPrice)}`
                          ) : item.item.id === "lemari_bawah_tangga" ? (
                            `(${item.measurement} m² [x 0,8]) x ${formatRupiah(item.unitPrice)}`
                          ) : (
                            <>
                              {item.unit === "M1" && `${item.measurement} m1`}
                              {item.unit === "M2" && `${item.measurement} m²`}
                              {item.unit === "UNIT" && `${item.measurement} QTY`}
                              {" x "}
                              {formatRupiah(item.unitPrice)}
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Export Document Options (JPG & PDF) */}
            <div className="border-t border-border pt-4 mb-4">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-2.5">
                <span className="flex items-center gap-1.5">
                  <Download className="size-3.5 text-primary" />
                  <span>Download Hasil Estimasi:</span>
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">Pilihan Format</span>
              </div>

              {/* Kustomisasi Tema Warna Dokumen - Ultra Minimalis */}
              <div className="mb-3 px-3.5 py-2.5 rounded-2xl bg-muted/30 border border-border/70 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Palette className="size-3.5 text-primary" />
                  <span>Warna Dokumen</span>
                </div>

                {/* Swatches Aktif & Pemilih Warna Kustom */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center -space-x-1 p-0.5 rounded-full bg-background border border-border/80 shadow-2xs">
                    <label
                      className="relative size-5 rounded-full overflow-hidden cursor-pointer border border-background shadow-2xs hover:scale-110 transition-transform"
                      title={`Warna Primer: ${exportPrimaryColor} (Klik untuk ubah)`}
                    >
                      <input
                        type="color"
                        value={exportPrimaryColor}
                        onChange={(e) => setExportPrimaryColor(e.target.value)}
                        className="absolute -top-2 -left-2 size-8 cursor-pointer opacity-0"
                      />
                      <span
                        className="block size-full rounded-full"
                        style={{ backgroundColor: exportPrimaryColor }}
                      />
                    </label>
                    <label
                      className="relative size-5 rounded-full overflow-hidden cursor-pointer border border-background shadow-2xs hover:scale-110 transition-transform"
                      title={`Warna Sekunder: ${exportSecondaryColor} (Klik untuk ubah)`}
                    >
                      <input
                        type="color"
                        value={exportSecondaryColor}
                        onChange={(e) => setExportSecondaryColor(e.target.value)}
                        className="absolute -top-2 -left-2 size-8 cursor-pointer opacity-0"
                      />
                      <span
                        className="block size-full rounded-full"
                        style={{ backgroundColor: exportSecondaryColor }}
                      />
                    </label>
                  </div>

                  {(exportPrimaryColor.toLowerCase() !== "#e5571f" ||
                    exportSecondaryColor.toLowerCase() !== "#1c1917") && (
                    <button
                      type="button"
                      onClick={() => {
                        setExportPrimaryColor("#E5571F");
                        setExportSecondaryColor("#1C1917");
                      }}
                      className="text-[10px] font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      title="Kembalikan warna default (Terracotta MKI)"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Tombol Buka Live Preview */}
              <button
                type="button"
                onClick={handleOpenPreview}
                disabled={calculationSummary.activeBreakdown.length === 0}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-2xs mb-2 cursor-pointer",
                  calculationSummary.activeBreakdown.length === 0
                    ? "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                    : "bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 hover:border-primary/50 shadow-2xs hover:shadow-xs active:scale-[0.99]"
                )}
                title={
                  calculationSummary.activeBreakdown.length === 0
                    ? "Pilih komponen terlebih dahulu untuk melihat preview"
                    : "Buka live preview dokumen estimasi (format 9:16)"
                }
              >
                <Eye className="size-4 shrink-0 text-primary" />
                <span>Live Preview Dokumen (9:16)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload("jpg")}
                  disabled={
                    isExporting !== null ||
                    calculationSummary.activeBreakdown.length === 0 ||
                    !isJpgAllowed
                  }
                  className={cn(
                    "flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer",
                    !isJpgAllowed || calculationSummary.activeBreakdown.length === 0
                      ? "border-border bg-muted/40 text-muted-foreground opacity-45 cursor-not-allowed select-none"
                      : "border-primary/40 bg-background hover:bg-primary/5 text-primary hover:shadow-xs"
                  )}
                  title={
                    calculationSummary.activeBreakdown.length === 0
                      ? "Pilih komponen terlebih dahulu untuk download"
                      : !isJpgAllowed
                      ? "Format JPG hanya tersedia untuk maksimal 15 item. Silakan gunakan format PDF."
                      : "Download estimasi dalam format gambar JPG"
                  }
                >
                  {isExporting === "jpg" ? (
                    <Loader2 className="size-4 animate-spin shrink-0" />
                  ) : (
                    <FileImage className="size-4 shrink-0" />
                  )}
                  <span>{isExporting === "jpg" ? "Memproses..." : "Format JPG"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload("pdf")}
                  disabled={isExporting !== null || calculationSummary.activeBreakdown.length === 0}
                  className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-primary/40 bg-background hover:bg-primary/5 text-primary text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title={
                    calculationSummary.activeBreakdown.length === 0
                      ? "Pilih komponen terlebih dahulu untuk download"
                      : "Download estimasi resmi dalam format dokumen PDF"
                  }
                >
                  {isExporting === "pdf" ? (
                    <Loader2 className="size-4 animate-spin shrink-0" />
                  ) : (
                    <FileText className="size-4 shrink-0" />
                  )}
                  <span>{isExporting === "pdf" ? "Memproses..." : "Format PDF"}</span>
                </button>
              </div>

              {!isJpgAllowed && calculationSummary.activeBreakdown.length > 0 && (
                <div className="flex items-start gap-1.5 mt-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-300 text-[11px] leading-snug">
                  <Info className="size-3.5 shrink-0 mt-0.5" />
                  <span>
                    Jumlah item ({calculationSummary.activeBreakdown.length}) lebih dari 15. Ekspor hanya dapat dilakukan ke <strong>Format PDF</strong>.
                  </span>
                </div>
              )}

              {calculationSummary.activeBreakdown.length === 0 && (
                <p className="text-[10px] text-muted-foreground mt-1.5 italic text-center">
                  *Centang komponen untuk mengaktifkan pilihan download JPG & PDF
                </p>
              )}
            </div>

            {/* Perbandingan Cerdas Alternatif Bahan (Smart Budget Comparison) */}
            {calculationSummary.grandTotal > 0 && (
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-primary" />
                    <span className="text-xs font-bold text-foreground">
                      Perbandingan Alternatif Bahan
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                    Simulasi 1-Klik
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
                  Estimasi total jika seluruh komponen diubah ke tier spesifikasi bahan berikut:
                </p>

                <div className="space-y-2.5">
                  {(
                    [
                      {
                        tier: "hemat" as const,
                        icon: "🥉",
                        badgeClass:
                          "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
                        activeBorder: "border-amber-500/60 bg-amber-500/[0.03]",
                        data: comparisonTiers.tiers.hemat,
                      },
                      {
                        tier: "standar" as const,
                        icon: "🥈",
                        badgeClass:
                          "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
                        activeBorder: "border-primary bg-primary/[0.04]",
                        data: comparisonTiers.tiers.standar,
                      },
                      {
                        tier: "premium" as const,
                        icon: "🥇",
                        badgeClass:
                          "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
                        activeBorder: "border-emerald-500/60 bg-emerald-500/[0.04]",
                        data: comparisonTiers.tiers.premium,
                      },
                    ]
                  ).map(({ tier, icon, badgeClass, activeBorder, data }) => {
                    const isCurrent = comparisonTiers.currentTier === tier;
                    return (
                      <div
                        key={tier}
                        className={cn(
                          "rounded-2xl border p-3 transition-all",
                          isCurrent
                            ? cn("shadow-2xs", activeBorder)
                            : "border-border bg-background/60 hover:border-border/80"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-sm select-none">{icon}</span>
                            <span className="font-bold text-xs text-foreground truncate">
                              {data.label}
                            </span>
                          </div>
                          <span
                            className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0",
                              badgeClass
                            )}
                          >
                            {data.tag}
                          </span>
                        </div>

                        <div className="text-[11px] text-muted-foreground mb-2">
                          {data.material}
                        </div>

                        <div className="flex items-baseline justify-between gap-2 mb-2.5">
                          <span className="text-sm font-display font-black text-foreground">
                            {formatRupiah(data.total)}
                          </span>

                          {isCurrent ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                              <Check className="size-3 stroke-[3]" />
                              Pilihan Saat Ini
                            </span>
                          ) : (
                            <span
                              className={cn(
                                "text-[11px] font-semibold px-2 py-0.5 rounded-md",
                                data.diff < 0
                                  ? "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 font-bold"
                                  : "text-muted-foreground bg-muted"
                              )}
                            >
                              {data.diff < 0
                                ? `Hemat ${formatRupiah(Math.abs(data.diff))}`
                                : data.diff > 0
                                  ? `+${formatRupiah(data.diff)}`
                                  : "Setara"}
                            </span>
                          )}
                        </div>

                        {/* Tombol Interaktif 1-Klik Terapkan Bahan */}
                        <button
                          type="button"
                          onClick={() => applyMaterialTier(tier)}
                          disabled={isCurrent}
                          className={cn(
                            "w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                            isCurrent
                              ? "bg-muted text-muted-foreground/80 cursor-default opacity-80"
                              : "bg-primary/10 hover:bg-primary text-primary hover:text-white shadow-2xs hover:shadow-sm"
                          )}
                        >
                          {isCurrent ? (
                            <>
                              <Check className="size-3.5 stroke-[2.5]" />
                              <span>Bahan Sedang Diterapkan</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="size-3.5" />
                              <span>Terapkan Bahan Ini</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Floating Bar "Lihat RAB" khusus Mobile (Hanya tampil jika ada komponen aktif & belum di area RAB) */}
      {calculationSummary.activeCount > 0 && !isSummaryVisible && (
        <div className="fixed bottom-4 inset-x-3 sm:inset-x-4 z-30 lg:hidden max-w-md mx-auto animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-auto">
          <div className="rounded-2xl border-2 border-primary/30 bg-card/95 backdrop-blur-xl p-2.5 sm:p-3 shadow-xl flex items-center justify-between gap-3">
            {/* Info Singkat Total Biaya */}
            <div className="min-w-0 pl-1">
              <div className="text-[10px] sm:text-xs font-semibold text-muted-foreground truncate">
                Total Estimasi ({calculationSummary.activeCount} Item):
              </div>
              <div className="text-base sm:text-lg font-bold text-primary font-mono truncate leading-tight">
                {formatRupiah(calculationSummary.grandTotal)}
              </div>
            </div>

            {/* Tombol Utama Lihat RAB */}
            <button
              type="button"
              onClick={scrollToSummary}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-md hover:bg-primary/90 active:scale-95 transition-all cursor-pointer shrink-0"
              title="Scroll ke Ringkasan Estimasi / RAB"
            >
              <span>Lihat RAB</span>
              <ArrowDown className="size-4 animate-bounce shrink-0" />
            </button>
          </div>
        </div>
      )}

      {/* Modal Live Preview Dokumen */}
      {isPreviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Live Preview Dokumen Estimasi"
          onClick={() => setIsPreviewOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            className="relative w-full max-w-5xl h-[94vh] max-h-[920px] rounded-3xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border bg-card shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Eye className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-foreground">
                      Live Preview Dokumen Estimasi
                    </h3>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground border border-border">
                      9:16 Portrait
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground hidden sm:block">
                    Tampilan real-time output JPG & PDF dengan kustomisasi warna
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Zoom Mode Toggle */}
                <div className="hidden sm:flex items-center rounded-xl bg-muted/60 p-0.5 border border-border text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setPreviewZoom("fit")}
                    className={cn(
                      "px-2.5 py-1 rounded-lg transition-colors cursor-pointer",
                      previewZoom === "fit"
                        ? "bg-card text-foreground font-bold shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    title="Sesuaikan ukuran dokumen dengan layar modal"
                  >
                    Fit Layar
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewZoom("actual")}
                    className={cn(
                      "px-2.5 py-1 rounded-lg transition-colors cursor-pointer",
                      previewZoom === "actual"
                        ? "bg-card text-foreground font-bold shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    title="Lihat ukuran detail 100%"
                  >
                    100% Detail
                  </button>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="size-9 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  title="Tutup preview (Esc)"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Modal Content Split: Stage (Left) & Controls/Actions (Right) */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
              {/* Preview Stage */}
              <div className="flex-1 bg-neutral-950 p-3 sm:p-6 overflow-auto flex items-center justify-center relative select-none">
                {/* Subtle dark pattern grid */}
                <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

                {isGeneratingPreview && (
                  <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur text-white text-xs font-medium border border-white/10 shadow-lg">
                    <Loader2 className="size-3.5 animate-spin text-primary" />
                    <span>Merender dokumen...</span>
                  </div>
                )}

                {previewDataUrl ? (
                  <div
                    className={cn(
                      "relative transition-all duration-200 flex items-center justify-center my-auto",
                      previewZoom === "fit" ? "max-h-full max-w-full" : "py-4"
                    )}
                  >
                    <img
                      src={previewDataUrl}
                      alt="Live Preview Estimasi"
                      className={cn(
                        "rounded-xl shadow-2xl ring-1 ring-white/10 transition-all",
                        previewZoom === "fit"
                          ? "max-h-[calc(94vh-130px)] sm:max-h-[calc(94vh-100px)] w-auto object-contain"
                          : "w-[460px] sm:w-[520px] max-w-none h-auto object-contain"
                      )}
                    />
                  </div>
                ) : (
                  <div className="text-center text-neutral-400 py-12">
                    <Loader2 className="size-8 animate-spin mx-auto text-primary mb-3" />
                    <p className="text-xs">Menyiapkan live preview...</p>
                  </div>
                )}

                {/* Floating Zoom Switcher for mobile */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex sm:hidden items-center gap-1 px-2 py-1 rounded-full bg-black/80 backdrop-blur border border-white/15 text-[11px] text-white">
                  <button
                    type="button"
                    onClick={() => setPreviewZoom("fit")}
                    className={cn(
                      "px-2.5 py-0.5 rounded-full font-medium transition-colors",
                      previewZoom === "fit" ? "bg-primary text-white font-bold" : "text-neutral-300"
                    )}
                  >
                    Fit
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewZoom("actual")}
                    className={cn(
                      "px-2.5 py-0.5 rounded-full font-medium transition-colors",
                      previewZoom === "actual" ? "bg-primary text-white font-bold" : "text-neutral-300"
                    )}
                  >
                    Detail
                  </button>
                </div>
              </div>

              {/* Sidebar Control Panel inside Modal */}
              <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border bg-card p-4 sm:p-5 flex flex-col justify-between overflow-y-auto shrink-0 space-y-4">
                <div className="space-y-3.5">
                  {/* Summary Info */}
                  <div className="p-3 rounded-2xl bg-muted/50 border border-border/80">
                    <div className="text-[11px] font-semibold text-muted-foreground mb-1">
                      Ringkasan Dokumen:
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-foreground font-medium">Total Estimasi:</span>
                      <span className="text-sm font-bold text-primary font-mono">
                        {formatRupiah(calculationSummary.grandTotal)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                      <span>Komponen Aktif:</span>
                      <span className="font-semibold text-foreground">
                        {calculationSummary.activeCount} Item
                      </span>
                    </div>
                    {(clientName.trim() || accountName.trim()) && (
                      <div className="pt-2 mt-2 border-t border-border/60 text-[11px] text-muted-foreground space-y-0.5">
                        {accountName.trim() && (
                          <div className="truncate">
                            Akun: <strong className="text-foreground">{accountName.trim()}</strong>
                          </div>
                        )}
                        {clientName.trim() && (
                          <div className="truncate">
                            Klien: <strong className="text-foreground">{clientName.trim()}</strong>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Live Color Picker Controls inside modal */}
                  <div className="p-3.5 rounded-2xl bg-card border border-border shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <Palette className="size-3.5 text-primary" />
                        <span>Kustomisasi Warna:</span>
                      </div>
                      {(exportPrimaryColor.toLowerCase() !== "#e5571f" ||
                        exportSecondaryColor.toLowerCase() !== "#1c1917") && (
                        <button
                          type="button"
                          onClick={() => {
                            setExportPrimaryColor("#E5571F");
                            setExportSecondaryColor("#1C1917");
                          }}
                          className="text-[10px] font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                          title="Kembalikan warna default"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                    {/* Live Color Bar */}
                    <div className="h-1.5 w-full rounded-full overflow-hidden flex shadow-2xs">
                      <div
                        className="h-full flex-1 transition-colors"
                        style={{ backgroundColor: exportPrimaryColor }}
                        title={`Warna Primer: ${exportPrimaryColor}`}
                      />
                      <div
                        className="h-full flex-1 transition-colors"
                        style={{ backgroundColor: exportSecondaryColor }}
                        title={`Warna Sekunder: ${exportSecondaryColor}`}
                      />
                    </div>

                    {/* Color Inputs */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-muted-foreground mb-1">
                          Primer:
                        </label>
                        <div className="flex items-center gap-1.5 p-1 rounded-xl border border-border bg-background">
                          <label className="relative size-6 rounded-lg overflow-hidden shrink-0 cursor-pointer border border-border/60">
                            <input
                              type="color"
                              value={exportPrimaryColor}
                              onChange={(e) => setExportPrimaryColor(e.target.value)}
                              className="absolute -top-2 -left-2 size-10 cursor-pointer opacity-0"
                            />
                            <span
                              className="block size-full rounded-lg"
                              style={{ backgroundColor: exportPrimaryColor }}
                            />
                          </label>
                          <input
                            type="text"
                            value={exportPrimaryColor.toUpperCase()}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (/^#[0-9A-Fa-f]{0,6}$/.test(val) || /^[0-9A-Fa-f]{0,6}$/.test(val)) {
                                setExportPrimaryColor(val.startsWith("#") ? val : `#${val}`);
                              }
                            }}
                            maxLength={7}
                            className="w-full text-[11px] font-mono font-bold text-foreground bg-transparent focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-muted-foreground mb-1">
                          Sekunder:
                        </label>
                        <div className="flex items-center gap-1.5 p-1 rounded-xl border border-border bg-background">
                          <label className="relative size-6 rounded-lg overflow-hidden shrink-0 cursor-pointer border border-border/60">
                            <input
                              type="color"
                              value={exportSecondaryColor}
                              onChange={(e) => setExportSecondaryColor(e.target.value)}
                              className="absolute -top-2 -left-2 size-10 cursor-pointer opacity-0"
                            />
                            <span
                              className="block size-full rounded-lg"
                              style={{ backgroundColor: exportSecondaryColor }}
                            />
                          </label>
                          <input
                            type="text"
                            value={exportSecondaryColor.toUpperCase()}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (/^#[0-9A-Fa-f]{0,6}$/.test(val) || /^[0-9A-Fa-f]{0,6}$/.test(val)) {
                                setExportSecondaryColor(val.startsWith("#") ? val : `#${val}`);
                              }
                            }}
                            maxLength={7}
                            className="w-full text-[11px] font-mono font-bold text-foreground bg-transparent focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Presets */}
                    <div>
                      <div className="text-[10px] font-semibold text-muted-foreground mb-1.5">
                        Pilih Tema Preset:
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {EXPORT_COLOR_PRESETS.map((preset) => {
                          const isActive =
                            exportPrimaryColor.toLowerCase() === preset.primary.toLowerCase() &&
                            exportSecondaryColor.toLowerCase() === preset.secondary.toLowerCase();
                          return (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => {
                                setExportPrimaryColor(preset.primary);
                                setExportSecondaryColor(preset.secondary);
                              }}
                              className={cn(
                                "flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer border",
                                isActive
                                  ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                                  : "border-border bg-card hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <span className="flex items-center -space-x-1 shrink-0">
                                  <span
                                    className="size-2.5 rounded-full border border-card shadow-2xs"
                                    style={{ backgroundColor: preset.primary }}
                                  />
                                  <span
                                    className="size-2.5 rounded-full border border-card shadow-2xs"
                                    style={{ backgroundColor: preset.secondary }}
                                  />
                                </span>
                                <span className="text-[11px]">{preset.name}</span>
                              </div>
                              {isActive && <Check className="size-3 text-primary" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons in Modal */}
                <div className="pt-3 border-t border-border space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                    <span>Unduh File Hasil:</span>
                    {!isJpgAllowed && (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                        Hanya PDF (&gt; 15 item)
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownload("jpg")}
                      disabled={isExporting !== null || !isJpgAllowed}
                      className={cn(
                        "flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer",
                        !isJpgAllowed
                          ? "border-border bg-muted/40 text-muted-foreground opacity-45 cursor-not-allowed select-none"
                          : "border-primary/40 bg-background hover:bg-primary/5 text-primary hover:shadow-xs"
                      )}
                      title={
                        !isJpgAllowed
                          ? "Format JPG hanya tersedia untuk maksimal 15 item. Silakan gunakan format PDF."
                          : "Download format gambar JPG"
                      }
                    >
                      {isExporting === "jpg" ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <FileImage className="size-3.5" />
                      )}
                      <span>{isExporting === "jpg" ? "Proses..." : "Unduh JPG"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload("pdf")}
                      disabled={isExporting !== null}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-primary/40 bg-background hover:bg-primary/5 text-primary text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer disabled:opacity-40"
                      title="Download format dokumen PDF"
                    >
                      {isExporting === "pdf" ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <FileText className="size-3.5" />
                      )}
                      <span>{isExporting === "pdf" ? "Proses..." : "Unduh PDF"}</span>
                    </button>
                  </div>

                  {!isJpgAllowed && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 leading-tight">
                      *Jumlah item ({calculationSummary.activeBreakdown.length}) lebih dari 15. Ekspor dibatasi hanya ke format PDF demi kerapian dokumen.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(false)}
                    className="w-full py-2 text-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    Tutup Jendela
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Daftar Riwayat Estimasi */}
      {isHistoryModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Riwayat Estimasi Proyek"
          onClick={() => setIsHistoryModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] rounded-3xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between shrink-0 bg-card">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <FolderOpen className="size-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-foreground font-display">
                      Riwayat Estimasi Proyek
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                      {savedSimulations.length} Proyek
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Otomatis tersimpan di browser setiap kali Anda mengekspor JPG atau PDF.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="size-8.5 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
                  title="Tutup (Esc)"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Filter Search Bar */}
            <div className="p-3 sm:p-4 border-b border-border/80 bg-muted/30 shrink-0">
              <div className="relative w-full">
                <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={historySearchQuery}
                  onChange={(e) => setHistorySearchQuery(e.target.value)}
                  placeholder="Cari berdasarkan nama klien, alamat, atau akun..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 min-h-0">
              {filteredSimulations.length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-muted/20 rounded-2xl border border-dashed border-border/80">
                  <div className="size-12 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                    <History className="size-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">
                      {historySearchQuery ? "Tidak ada proyek yang sesuai pencarian" : "Belum Ada Riwayat Estimasi"}
                    </p>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      {historySearchQuery
                        ? "Coba gunakan kata kunci pencarian yang lain."
                        : "Simulasikan kebutuhan furniture Anda, lalu download estimasi (JPG atau PDF). Proyek akan otomatis tersimpan di sini."}
                    </p>
                  </div>
                </div>
              ) : (
                filteredSimulations.map((sim) => {
                  const isCurrentActive = sim.id === activeSimulationId;
                  const dateStr = new Date(sim.updatedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={sim.id}
                      className={cn(
                        "p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                        isCurrentActive
                          ? "border-primary/50 bg-primary/[0.03] shadow-xs"
                          : "border-border bg-card hover:border-border/80 hover:shadow-2xs"
                      )}
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <User className="size-4 text-primary shrink-0" />
                            <h4 className="text-sm sm:text-base font-bold text-foreground font-display truncate">
                              {sim.clientName || "Klien Umum"}
                            </h4>
                          </div>
                          {isCurrentActive && (
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">
                              ✓ Sedang Dibuka
                            </span>
                          )}
                        </div>

                        {sim.clientAddress && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="size-3.5 text-primary/70 shrink-0" />
                            <span className="truncate">{sim.clientAddress}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground flex-wrap pt-0.5">
                          <span>{dateStr}</span>
                          <span>•</span>
                          <span>{sim.activeCount} Item</span>
                          {sim.totalM1 > 0 && <span>• {sim.totalM1} M1</span>}
                          {sim.totalM2 > 0 && <span>• {sim.totalM2} m²</span>}
                          {sim.accountName && <span>• Akun: {sim.accountName}</span>}
                        </div>

                        <div className="text-base sm:text-lg font-bold text-primary font-display pt-0.5">
                          {formatRupiah(sim.grandTotal)}
                        </div>
                      </div>

                      {/* Item Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleLoadSimulation(sim)}
                          className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                          title="Buka dan muat proyek ini ke kalkulator untuk diedit ulang"
                        >
                          <Pencil className="size-3" />
                          <span>Buka & Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDuplicateSimulation(sim.id)}
                          className="size-8 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                          title="Gandakan proyek ini sebagai salinan baru"
                        >
                          <Copy className="size-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Yakin ingin menghapus proyek "${sim.clientName || sim.title}" dari riwayat?`)) {
                              handleDeleteSimulation(sim.id);
                            }
                          }}
                          className="size-8 rounded-xl border border-border bg-card hover:bg-red-500/10 text-muted-foreground hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                          title="Hapus dari riwayat"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-border bg-card flex items-center justify-between text-xs text-muted-foreground">
              <span>Total Tersimpan: {savedSimulations.length} Proyek</span>
              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(false)}
                className="font-semibold text-primary hover:underline cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button "Riwayat" (Menggantikan tombol scroll khusus di halaman simulasi) */}
      <button
        type="button"
        onClick={() => setIsHistoryModalOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-border bg-card/95 backdrop-blur-md text-foreground shadow-md hover:shadow-lg hover:border-primary/40 active:scale-95 transition-all duration-200 cursor-pointer select-none"
        title="Buka Riwayat Estimasi Proyek"
        aria-label="Buka Riwayat Estimasi Proyek"
      >
        <History className="size-4 text-primary shrink-0" />
        <span className="text-xs sm:text-sm font-semibold">Riwayat</span>
        {savedSimulations.length > 0 && (
          <span className="size-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center border border-primary/20 shrink-0">
            {savedSimulations.length}
          </span>
        )}
      </button>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl bg-card border-2 border-primary/30 p-3.5 shadow-2xl flex items-center gap-2.5 text-xs text-foreground animate-in slide-in-from-bottom-5 duration-300">
          <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Check className="size-3.5 stroke-[3]" />
          </div>
          <p className="font-semibold leading-snug">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}

/** Helper calculation per item instance */
function getInstanceCalculation(
  item: FurnitureItemConfig,
  instance: ItemInstance,
  region: Region
) {
  const selectedOption =
    item.options.find((opt) => opt.id === instance.optionId) ?? item.options[0];
  const unitPrice = selectedOption
    ? region === "DK"
      ? selectedOption.priceDK
      : selectedOption.priceLK
    : 0;

  const len = typeof instance.length === "number" ? instance.length : 0;
  const ht = typeof instance.height === "number" ? instance.height : 0;
  const q = typeof instance.qty === "number" ? instance.qty : 0;
  const p2 = typeof instance.length2 === "number" ? instance.length2 : 0;
  const p3 = typeof instance.length3 === "number" ? instance.length3 : 0;

  let subtotal = 0;
  let measurement = 0;
  let layoutResult: ReturnType<typeof calculateCabinetLayout> | null = null;
  let dimensionSummary = "";

  if (LAYOUT_ENABLED_ITEMS.includes(item.id)) {
    layoutResult = calculateCabinetLayout(
      item.id,
      instance.layout ?? "lurus",
      len,
      p2,
      p3,
      ht
    );
    measurement = layoutResult.effectiveMeasurement;
    subtotal = Math.round(measurement * unitPrice);
    if (item.id === "lemari_pakaian") {
      if (instance.layout === "l_shape") {
        dimensionSummary = len > 0 || p2 > 0 || ht > 0
          ? `Shape L: Sisi 1: ${len}m, Sisi 2: ${p2}m, T: ${ht}m (${measurement} m²)`
          : "Shape L: Belum diisi (0 m²)";
      } else if (instance.layout === "u_shape") {
        dimensionSummary = len > 0 || p2 > 0 || p3 > 0 || ht > 0
          ? `Shape U: Sisi 1: ${len}m, Sisi 2: ${p2}m, Sisi 3: ${p3}m, T: ${ht}m (${measurement} m²)`
          : "Shape U: Belum diisi (0 m²)";
      } else {
        dimensionSummary = len > 0 || ht > 0
          ? `Lurus: P: ${len}m, T: ${ht}m (${measurement} m²)`
          : "Lurus: Belum diisi (0 m²)";
      }
    } else {
      if (instance.layout === "l_shape") {
        dimensionSummary = len > 0 || p2 > 0
          ? `Shape L: Sisi 1: ${len}m, Sisi 2: ${p2}m (${measurement} M1)`
          : "Shape L: Belum diisi (0 M1)";
      } else if (instance.layout === "u_shape") {
        dimensionSummary = len > 0 || p2 > 0 || p3 > 0
          ? `Shape U: Sisi 1: ${len}m, Sisi 2: ${p2}m, Sisi 3: ${p3}m (${measurement} M1)`
          : "Shape U: Belum diisi (0 M1)";
      } else {
        dimensionSummary = len > 0
          ? item.id === "cab_atas_full_plafond"
            ? `Lurus: P: ${len}m (${measurement} M1)`
            : `Lurus: P: ${len} Meter Lari (M1)`
          : "Lurus: Belum diisi (0 M1)";
      }
    }
  } else if (item.id === "meja_island") {
    measurement = len;
    subtotal = len > 0 ? Math.round((len / 0.6) * unitPrice) : 0;
    dimensionSummary = len > 0
      ? `Panjang: ${len}m (${Math.round((len / 0.6) * 10) / 10} M1)`
      : "Belum diisi (0 M1)";
  } else if (item.id === "lemari_bawah_tangga") {
    measurement = Math.round(len * ht * 0.8 * 100) / 100;
    subtotal = len > 0 && ht > 0 ? Math.round(len * ht * 0.8 * unitPrice) : 0;
    dimensionSummary = len > 0 && ht > 0
      ? `P: ${len}m, T: ${ht}m (${measurement} m²)`
      : "Belum diisi (0 m²)";
  } else if (selectedOption?.unit === "M1") {
    measurement = len;
    subtotal = len * unitPrice;
    dimensionSummary = len > 0 ? `Panjang: ${len} Meter Lari (M1)` : "Belum diisi (0 M1)";
  } else if (selectedOption?.unit === "M2") {
    measurement = Math.round(len * ht * 100) / 100;
    subtotal = measurement * unitPrice;
    dimensionSummary = len > 0 && ht > 0
      ? item.id === "dipan_ranjang"
        ? `P: ${len}m, L: ${ht}m (${measurement} m²)`
        : `P: ${len}m, T: ${ht}m (${measurement} m²)`
      : "Belum diisi (0 m²)";
  } else {
    measurement = q;
    subtotal = q * unitPrice;
    dimensionSummary = q > 0 ? `Jumlah: ${q} QTY` : "Belum diisi (0 QTY)";
  }

  return {
    selectedOption,
    unitPrice,
    subtotal,
    measurement,
    layoutResult,
    dimensionSummary,
  };
}

/** Ringkasan Visual Unit (Summary Box) */
type UnitSummaryViewProps = {
  item: FurnitureItemConfig;
  region: Region;
  instance: ItemInstance;
  instanceIndex: number;
  totalInstances: number;
  onEdit: () => void;
  onRemove?: () => void;
};

function UnitSummaryView({
  item,
  region,
  instance,
  instanceIndex,
  totalInstances,
  onEdit,
  onRemove,
}: UnitSummaryViewProps) {
  const calc = getInstanceCalculation(item, instance, region);
  const isPrimary = instanceIndex === 0;

  return (
    <div className="rounded-xl border border-primary/40 bg-primary/5 hover:border-primary/60 p-3.5 sm:p-4 transition-all shadow-2xs">
      <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold font-sans bg-primary text-primary-foreground shadow-2xs">
            <Sparkles className="size-3" />
            <span>
              {item.name} #{instanceIndex + 1}
            </span>
          </span>
          <span className="text-xs font-bold text-foreground">
            {calc.selectedOption?.name}{" "}
            <span className="text-muted-foreground font-medium">— {calc.selectedOption?.model}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <span className="text-xs sm:text-sm font-bold text-primary">
            {calc.subtotal > 0 ? formatRupiah(calc.subtotal) : "Rp 0"}
          </span>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-primary hover:bg-primary/10 border border-primary/25 transition-colors cursor-pointer"
            title="Ubah spesifikasi atau ukuran unit ini"
          >
            <Pencil className="size-3" />
            <span>Ubah</span>
          </button>
          {!isPrimary && onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="size-7 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-colors cursor-pointer"
              title={`Hapus ${item.name} #${instanceIndex + 1}`}
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground gap-1.5 pt-1.5 border-t border-border/40">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-foreground">Ukuran & Bentuk:</span>
          <span className="font-bold text-foreground bg-muted/70 px-2 py-0.5 rounded-md border border-border/60">
            {calc.dimensionSummary}
          </span>
        </div>
        <div className="text-[11px] text-muted-foreground shrink-0">
          Tarif: {formatRupiah(calc.unitPrice)} /{" "}
          {calc.selectedOption?.unit === "M2"
            ? item.id === "dipan_ranjang"
              ? "M2 (P x L)"
              : "M2 (P x T)"
            : calc.selectedOption?.unit === "UNIT"
            ? "QTY"
            : calc.selectedOption?.unit}
        </div>
      </div>
    </div>
  );
}

/** Sub-Component: Unit Editor (Form Bahan, Layout & Dimensi) */
type UnitEditorProps = {
  item: FurnitureItemConfig;
  region: Region;
  instance: ItemInstance;
  instanceIndex: number;
  totalInstances: number;
  onSelectOption: (optId: string) => void;
  onUpdateDimension: (
    field: DimensionField,
    delta: number,
    minVal?: number
  ) => void;
  onSetDirectDimension: (
    field: DimensionField,
    val: number | ""
  ) => void;
  onSetLayout?: (layout: KitchenLayoutType) => void;
};

function UnitEditor({
  item,
  region,
  instance,
  instanceIndex,
  totalInstances,
  onSelectOption,
  onUpdateDimension,
  onSetDirectDimension,
  onSetLayout,
}: UnitEditorProps) {
  const selectId = useId();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDropdownOpen) return;
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  const selectedOption =
    item.options.find((opt) => opt.id === instance.optionId) ?? item.options[0];
  const activeUnit = selectedOption?.unit ?? item.defaultUnit;
  const calc = getInstanceCalculation(item, instance, region);
  const layoutResult = calc.layoutResult;

  const groupedOptions = useMemo(() => {
    const groups: Array<{ groupName: string; options: typeof item.options }> = [];
    for (const opt of item.options) {
      const existing = groups.find((g) => g.groupName === opt.name);
      if (existing) {
        existing.options.push(opt);
      } else {
        groups.push({ groupName: opt.name, options: [opt] });
      }
    }
    return groups;
  }, [item]);

  return (
    <div className="space-y-3.5">
      {/* Pilihan Layout Bentuk Khusus Kabinet Dapur & Lemari Pakaian */}
      {LAYOUT_ENABLED_ITEMS.includes(item.id) && (
        <div className="pb-3 border-b border-border/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">
              {item.category === "wardrobe" || item.id === "lemari_pakaian"
                ? "Pilihan Layout Lemari Pakaian:"
                : "Pilihan Layout Bentuk Dapur:"}
            </span>
            <span className="text-[11px] font-bold text-primary">
              {instance?.layout === "l_shape"
                ? "Bentuk Sudut L (Shape L)"
                : instance?.layout === "u_shape"
                  ? "Bentuk Keliling U (Shape U)"
                  : "Bentuk Lurus (I-Line)"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onSetLayout?.("lurus")}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                (!instance?.layout || instance.layout === "lurus")
                  ? "border-primary bg-primary text-primary-foreground shadow-xs font-bold ring-2 ring-primary/20"
                  : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <span>Lurus</span>
            </button>
            <button
              type="button"
              onClick={() => onSetLayout?.("l_shape")}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                instance?.layout === "l_shape"
                  ? "border-primary bg-primary text-primary-foreground shadow-xs font-bold ring-2 ring-primary/20"
                  : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <span>Shape L</span>
            </button>
            <button
              type="button"
              onClick={() => onSetLayout?.("u_shape")}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                instance?.layout === "u_shape"
                  ? "border-primary bg-primary text-primary-foreground shadow-xs font-bold ring-2 ring-primary/20"
                  : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <span>Shape U</span>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Material & Model Selector */}
        <div className={LAYOUT_ENABLED_ITEMS.includes(item.id) ? "sm:col-span-6" : "sm:col-span-7"}>
          <div className="flex items-center justify-between mb-1.5 gap-2">
            <label
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="block text-xs font-semibold text-muted-foreground cursor-pointer"
            >
              Pilihan Bahan Utama & Model:
            </label>
            {item.options.length > 1 && (
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-[11px] font-medium text-primary bg-primary/10 hover:bg-primary/20 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
              >
                <span>{item.options.length} pilihan bahan</span>
                <ChevronDown className={cn("size-3 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
              </button>
            )}
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              id={selectId}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
              className={cn(
                "w-full text-left rounded-xl border bg-card px-3.5 py-2.5 text-foreground font-medium flex items-center justify-between gap-2 shadow-2xs transition-all cursor-pointer",
                isDropdownOpen
                  ? "border-primary ring-2 ring-primary/20 bg-card"
                  : "border-border hover:border-primary/60 hover:bg-muted/40"
              )}
              title="Klik untuk memilih bahan dan model"
            >
              <div className="min-w-0 flex-1">
                {selectedOption ? (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 leading-tight">
                    <span className="font-semibold text-xs sm:text-sm truncate">
                      {selectedOption.name}{" "}
                      <span className="text-muted-foreground font-normal">— {selectedOption.model}</span>
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold text-primary shrink-0 mt-0.5 sm:mt-0">
                      ({formatRupiah(region === "DK" ? selectedOption.priceDK : selectedOption.priceLK)} / {selectedOption.unit === "M2" ? (item.id === "dipan_ranjang" ? "M2 (P x L)" : "M2 (P x T)") : selectedOption.unit === "UNIT" ? "QTY" : selectedOption.unit})
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Pilih bahan & model...</span>
                )}
              </div>
              <ChevronDown
                className={cn(
                  "size-4 text-muted-foreground transition-transform duration-200 shrink-0",
                  isDropdownOpen && "rotate-180 text-primary"
                )}
              />
            </button>

            {/* Custom Responsive Dropdown Menu */}
            {isDropdownOpen && (
              <div
                role="listbox"
                className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-72 sm:max-h-80 w-full overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl divide-y divide-border/40 focus:outline-none overscroll-contain"
              >
                {groupedOptions.map(({ groupName, options }) => {
                  const showHeader = groupedOptions.length > 1;

                  return (
                    <div key={groupName} className="py-0.5">
                      {showHeader && (
                        <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/80 sticky top-0 backdrop-blur-md z-10 flex items-center justify-between border-b border-border/40 mb-0.5">
                          <span>{groupName}</span>
                          <span className="font-medium text-[10px] lowercase text-muted-foreground/70">
                            {options.length} model
                          </span>
                        </div>
                      )}

                      {options.map((opt) => {
                        const isSelected = opt.id === instance?.optionId;
                        const price = region === "DK" ? opt.priceDK : opt.priceLK;

                        return (
                          <button
                            type="button"
                            role="option"
                            key={opt.id}
                            aria-selected={isSelected}
                            onClick={() => {
                              onSelectOption(opt.id);
                              setIsDropdownOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-3.5 py-2.5 transition-colors flex items-center justify-between gap-3 cursor-pointer",
                              isSelected
                                ? "bg-primary/10 text-primary font-medium"
                                : "hover:bg-muted text-foreground"
                            )}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-xs sm:text-sm font-medium leading-snug">
                                <span
                                  className={
                                    isSelected
                                      ? "font-bold text-primary"
                                      : "text-foreground font-semibold"
                                  }
                                >
                                  {opt.model}
                                </span>
                                {!showHeader && (
                                  <span className="text-muted-foreground font-normal text-[11px] sm:text-xs ml-1">
                                    ({opt.name})
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] sm:text-xs font-bold text-primary mt-0.5">
                                {formatRupiah(price)}{" "}
                                <span className="font-normal text-muted-foreground">
                                  / {opt.unit === "M2" ? (item.id === "dipan_ranjang" ? "M2 (P x L)" : "M2 (P x T)") : opt.unit === "UNIT" ? "QTY" : opt.unit}
                                </span>
                              </div>
                            </div>

                            {isSelected && (
                              <div className="size-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0">
                                <Check className="size-3 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Dimension Inputs */}
        <div className={LAYOUT_ENABLED_ITEMS.includes(item.id) ? "sm:col-span-6" : "sm:col-span-5"}>
          {LAYOUT_ENABLED_ITEMS.includes(item.id) ? (
            <div>
              {item.id === "lemari_pakaian" ? (
                /* Input Dimensi Khusus Lemari Pakaian (Unit M2: P x T) */
                <div>
                  {(!instance?.layout || instance.layout === "lurus") && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                        <span>Dimensi Luas (P x T):</span>
                        <span className="text-primary font-bold">
                          {typeof instance?.length === "number" &&
                          typeof instance?.height === "number" &&
                          instance.length > 0 &&
                          instance.height > 0
                            ? `${layoutResult?.effectiveMeasurement ?? 0} m² (${instance.length}m x ${instance.height}m)`
                            : "0 m² (0m x 0m)"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-[11px] text-muted-foreground mb-0.5">Panjang / P (m)</div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => onUpdateDimension("length", -0.5, 0)}
                              className="size-8 rounded-lg border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer shrink-0"
                              title="Kurangi 0.5m"
                            >
                              <Minus className="size-3" />
                            </button>
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              placeholder="0"
                              value={instance?.length ?? 0}
                              onFocus={(e) => { if (e.target.value === "0") e.target.select(); }}
                              onBlur={(e) => { if (e.target.value === "") onSetDirectDimension("length", 0); }}
                              onChange={(e) =>
                                onSetDirectDimension(
                                  "length",
                                  e.target.value === "" ? "" : parseFloat(e.target.value)
                                )
                              }
                              className="w-full text-center font-bold text-xs rounded-lg border border-border bg-background py-1.5 text-foreground focus:border-primary focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => onUpdateDimension("length", 0.5, 0)}
                              className="size-8 rounded-lg border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer shrink-0"
                              title="Tambah 0.5m"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] text-muted-foreground mb-0.5">Tinggi / T (m)</div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => onUpdateDimension("height", -0.1, 0)}
                              className="size-8 rounded-lg border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer shrink-0"
                              title="Kurangi 0.1m"
                            >
                              <Minus className="size-3" />
                            </button>
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              placeholder="0"
                              value={instance?.height ?? 0}
                              onFocus={(e) => { if (e.target.value === "0") e.target.select(); }}
                              onBlur={(e) => { if (e.target.value === "") onSetDirectDimension("height", 0); }}
                              onChange={(e) =>
                                onSetDirectDimension(
                                  "height",
                                  e.target.value === "" ? "" : parseFloat(e.target.value)
                                )
                              }
                              className="w-full text-center font-bold text-xs rounded-lg border border-border bg-background py-1.5 text-foreground focus:border-primary focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => onUpdateDimension("height", 0.1, 0)}
                              className="size-8 rounded-lg border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer shrink-0"
                              title="Tambah 0.1m"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between">
                        <span>Rumus layout:</span>
                        <span className="font-semibold text-primary">
                          {layoutResult?.formulaLabel}
                        </span>
                      </div>
                    </div>
                  )}

                  {instance?.layout === "l_shape" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                        <span>Luas Efektif:</span>
                        <span className="text-primary font-bold">
                          {layoutResult && layoutResult.effectiveMeasurement > 0
                            ? `${layoutResult.effectiveMeasurement} m²`
                            : "0 m²"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <div className="text-[11px] text-muted-foreground mb-0.5">Sisi 1 / P1 (m)</div>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="0"
                            value={instance?.length ?? 0}
                            onFocus={(e) => { if (e.target.value === "0") e.target.select(); }}
                            onBlur={(e) => { if (e.target.value === "") onSetDirectDimension("length", 0); }}
                            onChange={(e) =>
                              onSetDirectDimension(
                                "length",
                                e.target.value === "" ? "" : parseFloat(e.target.value)
                              )
                            }
                            className="w-full text-center font-bold text-xs rounded-lg border border-border bg-background py-1.5 text-foreground focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <div className="text-[11px] text-muted-foreground mb-0.5">Sisi 2 / P2 (m)</div>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="0"
                            value={instance?.length2 ?? 0}
                            onFocus={(e) => { if (e.target.value === "0") e.target.select(); }}
                            onBlur={(e) => { if (e.target.value === "") onSetDirectDimension("length2", 0); }}
                            onChange={(e) =>
                              onSetDirectDimension(
                                "length2",
                                e.target.value === "" ? "" : parseFloat(e.target.value)
                              )
                            }
                            className="w-full text-center font-bold text-xs rounded-lg border border-border bg-background py-1.5 text-foreground focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <div className="text-[11px] text-muted-foreground mb-0.5">Tinggi / T (m)</div>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="0"
                            value={instance?.height ?? 0}
                            onFocus={(e) => { if (e.target.value === "0") e.target.select(); }}
                            onBlur={(e) => { if (e.target.value === "") onSetDirectDimension("height", 0); }}
                            onChange={(e) =>
                              onSetDirectDimension(
                                "height",
                                e.target.value === "" ? "" : parseFloat(e.target.value)
                              )
                            }
                            className="w-full text-center font-bold text-xs rounded-lg border border-border bg-background py-1.5 text-foreground focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="text-[11px] text-muted-foreground flex flex-col gap-0.5 pt-0.5">
                        <div className="flex items-center justify-between">
                          <span>Potongan sudut (0,6m):</span>
                          <span className="font-semibold text-foreground">
                            {layoutResult?.formulaDescription}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Rumus hitung:</span>
                          <span className="font-semibold text-primary">
                            {layoutResult?.formulaLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {instance?.layout === "u_shape" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                        <span>Luas Efektif:</span>
                        <span className="text-primary font-bold">
                          {layoutResult && layoutResult.effectiveMeasurement > 0
                            ? `${layoutResult.effectiveMeasurement} m²`
                            : "0 m²"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-[11px] text-muted-foreground mb-0.5">Sisi 1 / P1 (m)</div>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              placeholder="0"
                              value={instance?.length ?? 0}
                              onFocus={(e) => { if (e.target.value === "0") e.target.select(); }}
                              onBlur={(e) => { if (e.target.value === "") onSetDirectDimension("length", 0); }}
                              onChange={(e) =>
                                onSetDirectDimension(
                                  "length",
                                  e.target.value === "" ? "" : parseFloat(e.target.value)
                                )
                              }
                              className="w-full text-center font-bold text-xs rounded-lg border border-border bg-background py-1.5 text-foreground focus:border-primary focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => onUpdateDimension("length", 0.5, 0)}
                              className="size-8 rounded-lg border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer shrink-0"
                              title="Tambah 0.5m"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] text-muted-foreground mb-0.5">Sisi 2 / P2 (m)</div>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              placeholder="0"
                              value={instance?.length2 ?? 0}
                              onFocus={(e) => { if (e.target.value === "0") e.target.select(); }}
                              onBlur={(e) => { if (e.target.value === "") onSetDirectDimension("length2", 0); }}
                              onChange={(e) =>
                                onSetDirectDimension(
                                  "length2",
                                  e.target.value === "" ? "" : parseFloat(e.target.value)
                                )
                              }
                              className="w-full text-center font-bold text-xs rounded-lg border border-border bg-background py-1.5 text-foreground focus:border-primary focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => onUpdateDimension("length2", 0.5, 0)}
                              className="size-8 rounded-lg border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer shrink-0"
                              title="Tambah 0.5m"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-[11px] text-muted-foreground mb-0.5">Sisi 3 / P3 (m)</div>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              placeholder="0"
                              value={instance?.length3 ?? 0}
                              onFocus={(e) => { if (e.target.value === "0") e.target.select(); }}
                              onBlur={(e) => { if (e.target.value === "") onSetDirectDimension("length3", 0); }}
                              onChange={(e) =>
                                onSetDirectDimension(
                                  "length3",
                                  e.target.value === "" ? "" : parseFloat(e.target.value)
                                )
                              }
                              className="w-full text-center font-bold text-xs rounded-lg border border-border bg-background py-1.5 text-foreground focus:border-primary focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => onUpdateDimension("length3", 0.5, 0)}
                              className="size-8 rounded-lg border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer shrink-0"
                              title="Tambah 0.5m"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] text-muted-foreground mb-0.5">Tinggi / T (m)</div>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              placeholder="0"
                              value={instance?.height ?? 0}
                              onFocus={(e) => { if (e.target.value === "0") e.target.select(); }}
                              onBlur={(e) => { if (e.target.value === "") onSetDirectDimension("height", 0); }}
                              onChange={(e) =>
                                onSetDirectDimension(
                                  "height",
                                  e.target.value === "" ? "" : parseFloat(e.target.value)
                                )
                              }
                              className="w-full text-center font-bold text-xs rounded-lg border border-border bg-background py-1.5 text-foreground focus:border-primary focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => onUpdateDimension("height", 0.1, 0)}
                              className="size-8 rounded-lg border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer shrink-0"
                              title="Tambah 0.1m"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="text-[11px] text-muted-foreground flex flex-col gap-0.5 pt-0.5">
                        <div className="flex items-center justify-between">
                          <span>Potongan 2 sudut:</span>
                          <span className="font-semibold text-foreground">
                            {layoutResult?.formulaDescription}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Rumus hitung:</span>
                          <span className="font-semibold text-primary">
                            {layoutResult?.formulaLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Input Dimensi Khusus Kabinet Dapur (Unit M1) */
                <div>
                  {(!instance?.layout || instance.layout === "lurus") && (
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                        <span>Panjang Bentang (P):</span>
                        <span className="text-primary font-bold">
                          {instance?.length
                            ? item.id === "cab_atas_full_plafond"
                              ? `${instance.length} m (${instance.length}m x 2 = ${Math.round(instance.length * 2 * 10) / 10} M1)`
                              : `${instance.length} Meter Lari (M1)`
                            : "Belum diisi (0 M1)"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateDimension("length", -0.5, 0)}
                          className="size-9 rounded-xl border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer"
                          title="Kurangi 0.5 meter"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="0"
                          value={instance?.length ?? 0}
                          onFocus={(e) => { if (e.target.value === "0") e.target.select(); }}
                          onBlur={(e) => { if (e.target.value === "") onSetDirectDimension("length", 0); }}
                          onChange={(e) =>
                            onSetDirectDimension(
                              "length",
                              e.target.value === "" ? "" : parseFloat(e.target.value)
                            )
                          }
                          className="flex-1 text-center font-bold text-sm rounded-xl border border-border bg-background py-1.5 text-foreground focus:border-primary focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => onUpdateDimension("length", 0.5, 0)}
                          className="size-9 rounded-xl border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer"
                          title="Tambah 0.5 meter"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1.5 flex items-center justify-between">
                        <span>Rumus layout:</span>
                        <span className="font-semibold text-primary">
                          {layoutResult?.formulaLabel}
                        </span>
                      </div>
                    </div>
                  )}

                  {instance?.layout === "l_shape" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                        <span>Panjang Efektif:</span>
                        <span className="text-primary font-bold">
                          {layoutResult ? `${layoutResult.effectiveM1} M1` : "0 M1"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-[11px] text-muted-foreground mb-0.5">Sisi 1 / P1 (m)</div>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="0"
                            value={instance?.length ?? 0}
                            onFocus={(e) => { if (e.target.value === "0") e.target.select(); }}
                            onBlur={(e) => { if (e.target.value === "") onSetDirectDimension("length", 0); }}
                            onChange={(e) =>
                              onSetDirectDimension(
                                "length",
                                e.target.value === "" ? "" : parseFloat(e.target.value)
                              )
                            }
                            className="w-full text-center font-bold text-xs rounded-lg border border-border bg-background py-1.5 text-foreground focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <div className="text-[11px] text-muted-foreground mb-0.5">Sisi 2 / P2 (m)</div>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="0"
                            value={instance?.length2 ?? 0}
                            onFocus={(e) => { if (e.target.value === "0") e.target.select(); }}
                            onBlur={(e) => { if (e.target.value === "") onSetDirectDimension("length2", 0); }}
                            onChange={(e) =>
                              onSetDirectDimension(
                                "length2",
                                e.target.value === "" ? "" : parseFloat(e.target.value)
                              )
                            }
                            className="w-full text-center font-bold text-xs rounded-lg border border-border bg-background py-1.5 text-foreground focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="text-[11px] text-muted-foreground flex flex-col gap-0.5 pt-0.5">
                        <div className="flex items-center justify-between">
                          <span>Potongan sudut:</span>
                          <span className="font-semibold text-foreground">
                            {layoutResult?.formulaDescription}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Rumus hitung:</span>
                          <span className="font-semibold text-primary">
                            {layoutResult?.formulaLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {instance?.layout === "u_shape" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                        <span>Panjang Efektif:</span>
                        <span className="text-primary font-bold">
                          {layoutResult ? `${layoutResult.effectiveM1} M1` : "0 M1"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <div className="text-[11px] text-muted-foreground mb-0.5">Sisi 1 / P1 (m)</div>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="0"
                            value={instance?.length ?? 0}
                            onFocus={(e) => { if (e.target.value === "0") e.target.select(); }}
                            onBlur={(e) => { if (e.target.value === "") onSetDirectDimension("length", 0); }}
                            onChange={(e) =>
                              onSetDirectDimension(
                                "length",
                                e.target.value === "" ? "" : parseFloat(e.target.value)
                              )
                            }
                            className="w-full text-center font-bold text-xs rounded-lg border border-border bg-background py-1.5 text-foreground focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <div className="text-[11px] text-muted-foreground mb-0.5">Sisi 2 / P2 (m)</div>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="0"
                            value={instance?.length2 ?? 0}
                            onFocus={(e) => { if (e.target.value === "0") e.target.select(); }}
                            onBlur={(e) => { if (e.target.value === "") onSetDirectDimension("length2", 0); }}
                            onChange={(e) =>
                              onSetDirectDimension(
                                "length2",
                                e.target.value === "" ? "" : parseFloat(e.target.value)
                              )
                            }
                            className="w-full text-center font-bold text-xs rounded-lg border border-border bg-background py-1.5 text-foreground focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <div className="text-[11px] text-muted-foreground mb-0.5">Sisi 3 / P3 (m)</div>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="0"
                            value={instance?.length3 ?? 0}
                            onFocus={(e) => { if (e.target.value === "0") e.target.select(); }}
                            onBlur={(e) => { if (e.target.value === "") onSetDirectDimension("length3", 0); }}
                            onChange={(e) =>
                              onSetDirectDimension(
                                "length3",
                                e.target.value === "" ? "" : parseFloat(e.target.value)
                              )
                            }
                            className="w-full text-center font-bold text-xs rounded-lg border border-border bg-background py-1.5 text-foreground focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="text-[11px] text-muted-foreground flex flex-col gap-0.5 pt-0.5">
                        <div className="flex items-center justify-between">
                          <span>Potongan 2 sudut:</span>
                          <span className="font-semibold text-foreground">
                            {layoutResult?.formulaDescription}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Rumus hitung:</span>
                          <span className="font-semibold text-primary">
                            {layoutResult?.formulaLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : activeUnit === "M1" ? (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                <span>{item.id === "meja_island" ? "Panjang Meja:" : "Panjang Bentang:"}</span>
                <span className="text-primary font-bold">
                  {instance?.length
                    ? item.id === "meja_island"
                      ? `${instance.length} m (${instance.length} : 0,6)`
                      : `${instance.length} Meter Lari (M1)`
                    : "Belum diisi (0 M1)"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateDimension("length", -0.5, 0)}
                  className="size-9 rounded-xl border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer"
                  title="Kurangi 0.5 meter"
                >
                  <Minus className="size-3.5" />
                </button>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="0"
                  value={instance?.length ?? 0}
                  onFocus={(e) => { if (e.target.value === "0") e.target.select(); }}
                  onBlur={(e) => { if (e.target.value === "") onSetDirectDimension("length", 0); }}
                  onChange={(e) =>
                    onSetDirectDimension(
                      "length",
                      e.target.value === "" ? "" : parseFloat(e.target.value)
                    )
                  }
                  className="flex-1 text-center font-bold text-sm rounded-xl border border-border bg-background py-1.5 text-foreground focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => onUpdateDimension("length", 0.5, 0)}
                  className="size-9 rounded-xl border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer"
                  title="Tambah 0.5 meter"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
              {item.id === "meja_island" && (
                <div className="text-[11px] text-muted-foreground mt-1.5 flex items-center justify-between">
                  <span>Rumus workshop:</span>
                  <span className="font-semibold text-primary">
                    (Panjang : 0,6) &times; Tarif
                  </span>
                </div>
              )}
            </div>
          ) : activeUnit === "M2" ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>
                  {item.id === "lemari_bawah_tangga"
                    ? "Dimensi Luas Efektif (P x T x 0,8):"
                    : item.id === "dipan_ranjang"
                    ? "Dimensi Luas (P x L):"
                    : "Dimensi Luas (P x T):"}
                </span>
                <span className="text-primary font-bold">
                  {typeof instance?.length === "number" &&
                  typeof instance?.height === "number" &&
                  instance.length > 0 &&
                  instance.height > 0
                    ? item.id === "lemari_bawah_tangga"
                      ? `${Math.round(instance.length * instance.height * 0.8 * 100) / 100} m² (${instance.length}m x ${instance.height}m x 0,8)`
                      : `${Math.round(instance.length * instance.height * 100) / 100} m² (${instance.length}m x ${instance.height}m)`
                    : "Belum diisi (0 m²)"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[11px] text-muted-foreground mb-0.5">Panjang / P (m)</div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onUpdateDimension("length", -0.5, 0)}
                      className="size-8 rounded-lg border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer shrink-0"
                      title="Kurangi 0.5m"
                    >
                      <Minus className="size-3" />
                    </button>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="0"
                      value={instance?.length ?? 0}
                      onFocus={(e) => { if (e.target.value === "0") e.target.select(); }}
                      onBlur={(e) => { if (e.target.value === "") onSetDirectDimension("length", 0); }}
                      onChange={(e) =>
                        onSetDirectDimension(
                          "length",
                          e.target.value === "" ? "" : parseFloat(e.target.value)
                        )
                      }
                      className="w-full text-center font-bold text-xs rounded-lg border border-border bg-background py-1.5 text-foreground focus:border-primary focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => onUpdateDimension("length", 0.5, 0)}
                      className="size-8 rounded-lg border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer shrink-0"
                      title="Tambah 0.5m"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground mb-0.5">
                    {item.id === "dipan_ranjang" ? "Lebar / L (m)" : "Tinggi / T (m)"}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onUpdateDimension("height", -0.1, 0)}
                      className="size-8 rounded-lg border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer shrink-0"
                      title="Kurangi 0.1m"
                    >
                      <Minus className="size-3" />
                    </button>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="0"
                      value={instance?.height ?? 0}
                      onFocus={(e) => { if (e.target.value === "0") e.target.select(); }}
                      onBlur={(e) => { if (e.target.value === "") onSetDirectDimension("height", 0); }}
                      onChange={(e) =>
                        onSetDirectDimension(
                          "height",
                          e.target.value === "" ? "" : parseFloat(e.target.value)
                        )
                      }
                      className="w-full text-center font-bold text-xs rounded-lg border border-border bg-background py-1.5 text-foreground focus:border-primary focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => onUpdateDimension("height", 0.1, 0)}
                      className="size-8 rounded-lg border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer shrink-0"
                      title="Tambah 0.1m"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-0.5">
                <span>Rumus perhitungan:</span>
                <span className="font-semibold text-primary">
                  {item.id === "lemari_bawah_tangga"
                    ? "Panjang (P) × Tinggi (T) × 0,8 × Tarif"
                    : item.id === "dipan_ranjang"
                    ? "Panjang (P) × Lebar (L) × Tarif"
                    : "Panjang (P) × Tinggi (T) × Tarif"}
                </span>
              </div>
            </div>
          ) : activeUnit === "UNIT" ? (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                <span>Jumlah (QTY):</span>
                <span className="text-primary font-bold">
                  {instance?.qty ? `${instance.qty} QTY` : "Belum diisi (0 QTY)"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateDimension("qty", -1, 0)}
                  className="size-9 rounded-xl border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer"
                  title="Kurangi 1 unit"
                >
                  <Minus className="size-3.5" />
                </button>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0"
                  value={instance?.qty ?? 0}
                  onFocus={(e) => { if (e.target.value === "0") e.target.select(); }}
                  onBlur={(e) => { if (e.target.value === "") onSetDirectDimension("qty", 0); }}
                  onChange={(e) => {
                    let val = e.target.value.replace(/[^0-9.,]/g, "");
                    const sepMatch = val.match(/[.,]/);
                    if (sepMatch && sepMatch.index !== undefined) {
                      const before = val.slice(0, sepMatch.index);
                      const sep = sepMatch[0];
                      const after = val.slice(sepMatch.index + 1).replace(/[.,]/g, "");
                      val = before + sep + after;
                    }
                    const parsed = parseQty(val);
                    onSetDirectDimension(
                      "qty",
                      val === "" ? "" : parsed
                    );
                  }}
                  className="flex-1 text-center font-bold text-sm rounded-xl border border-border bg-background py-1.5 text-foreground focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => onUpdateDimension("qty", 1, 0)}
                  className="size-9 rounded-xl border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer"
                  title="Tambah 1 unit"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Individual Item Card Component (Single card hosting all unit instances) */
type ItemCardProps = {
  item: FurnitureItemConfig;
  region: Region;
  instances: ItemInstance[];
  onToggle: () => void;
  onSelectOption: (instanceId: string, optId: string) => void;
  onUpdateDimension: (
    instanceId: string,
    field: DimensionField,
    delta: number,
    minVal?: number
  ) => void;
  onSetDirectDimension: (
    instanceId: string,
    field: DimensionField,
    val: number | ""
  ) => void;
  onSetLayout?: (instanceId: string, layout: KitchenLayoutType) => void;
  onAddInstance: () => void;
  onRemoveInstance: (instanceId: string) => void;
};

function ItemCard({
  item,
  region,
  instances,
  onToggle,
  onSelectOption,
  onUpdateDimension,
  onSetDirectDimension,
  onSetLayout,
  onAddInstance,
  onRemoveInstance,
}: ItemCardProps) {
  const hasAnyEnabled = instances.some((inst) => inst.enabled);
  const totalSubtotal = useMemo(() => {
    return instances.reduce((acc, inst) => {
      if (!inst.enabled) return acc;
      const c = getInstanceCalculation(item, inst, region);
      return acc + c.subtotal;
    }, 0);
  }, [instances, item, region]);

  // Track editing state for each instance: default Unit 1 is summary if > 1 instance
  const [editingMap, setEditingMap] = useState<Record<string, boolean>>({});

  const primaryInstance = instances[0] || {
    instanceId: `${item.id}_0`,
    itemId: item.id,
    enabled: false,
    optionId: item.options[0]?.id ?? "",
    length: 0,
    height: 0,
    qty: 0,
    layout: "lurus",
    length2: 0,
    length3: 0,
  };

  // Disable tombol "+ Tambah Komponen" jika ada unit yang belum diisi ukurannya (subtotal <= 0)
  const isAddDisabled = useMemo(() => {
    if (instances.length === 0) return true;
    return instances.some((inst) => {
      const calc = getInstanceCalculation(item, inst, region);
      return calc.subtotal <= 0;
    });
  }, [instances, item, region]);

  // Unit 1 is in edit mode if instances <= 1 or explicitly marked true in editingMap
  const isPrimaryEditing = instances.length <= 1 || Boolean(editingMap[primaryInstance.instanceId]);

  const selectedPrimaryOption =
    item.options.find((opt) => opt.id === primaryInstance.optionId) ?? item.options[0];
  const primaryUnit = selectedPrimaryOption?.unit ?? item.defaultUnit;

  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-200",
        hasAnyEnabled
          ? "bg-card border-primary/40 shadow-xs ring-1 ring-primary/20"
          : "bg-card/70 border-border opacity-85 hover:opacity-100"
      )}
    >
      {/* Header Bar */}
      <div className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4">
        <label className="flex items-start sm:items-center gap-3.5 cursor-pointer select-none flex-1">
          <div className="pt-0.5 sm:pt-0">
            <input
              type="checkbox"
              checked={hasAnyEnabled}
              onChange={onToggle}
              className="size-5 rounded-md border-border text-primary focus:ring-primary accent-primary cursor-pointer"
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-sm sm:text-base text-foreground">
                {item.name}
              </span>
              {instances.length > 1 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                  {instances.length} Unit
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground border border-border">
                {LAYOUT_ENABLED_ITEMS.includes(item.id)
                  ? item.id === "lemari_pakaian"
                    ? "Meter Persegi (M2 / P x T)"
                    : item.id === "cab_atas_full_plafond"
                    ? "Rumus Khusus: (P x 2) x Tarif"
                    : "Meter Lari (M1 / Layout)"
                  : item.id === "meja_island"
                  ? "Rumus Khusus: (P : 0,6) x Tarif"
                  : item.id === "lemari_bawah_tangga"
                  ? "Rumus Khusus: P x T x 0,8 x Tarif"
                  : primaryUnit === "M1"
                  ? "Meter Lari (M1)"
                  : primaryUnit === "M2"
                  ? item.id === "dipan_ranjang"
                    ? "Meter Persegi (M2 / P x L)"
                    : "Meter Persegi (M2 / P x T)"
                  : "Jumlah (QTY)"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {item.description}
            </p>
          </div>
        </label>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Subtotal</div>
            <div
              className={cn(
                "text-sm sm:text-base font-bold",
                hasAnyEnabled && totalSubtotal > 0 ? "text-primary" : "text-muted-foreground"
              )}
            >
              {hasAnyEnabled && totalSubtotal > 0 ? formatRupiah(totalSubtotal) : "Rp 0"}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Controls when Item is Enabled */}
      {hasAnyEnabled && (
        <div className="px-4 pb-5 pt-3 sm:px-5 border-t border-border/60 bg-muted/20 rounded-b-2xl space-y-4">
          {/* Scenario A: Single Instance */}
          {instances.length <= 1 && (
            <UnitEditor
              item={item}
              region={region}
              instance={primaryInstance}
              instanceIndex={0}
              totalInstances={1}
              onSelectOption={(optId) => onSelectOption(primaryInstance.instanceId, optId)}
              onUpdateDimension={(field, delta, min) =>
                onUpdateDimension(primaryInstance.instanceId, field, delta, min)
              }
              onSetDirectDimension={(field, val) =>
                onSetDirectDimension(primaryInstance.instanceId, field, val)
              }
              onSetLayout={(layout) => onSetLayout?.(primaryInstance.instanceId, layout)}
            />
          )}

          {/* Scenario B: Multiple Instances */}
          {instances.length > 1 && (
            <div className="space-y-3.5">
              {/* 1. Komponen Utama (Unit #1) */}
              <div>
                {isPrimaryEditing ? (
                  <div className="rounded-xl border border-primary/40 bg-card p-3.5 sm:p-4 shadow-2xs">
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-primary/20">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground shadow-2xs">
                          <Sparkles className="size-3" />
                          <span>{item.name} #1</span>
                        </span>
                        <span className="text-xs font-bold text-primary">
                          Subtotal:{" "}
                          {getInstanceCalculation(item, primaryInstance, region).subtotal > 0
                            ? formatRupiah(
                                getInstanceCalculation(item, primaryInstance, region).subtotal
                              )
                            : "Rp 0"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingMap((prev) => ({
                              ...prev,
                              [primaryInstance.instanceId]: false,
                            }))
                          }
                          className="text-xs font-semibold text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors cursor-pointer"
                          title="Ringkas tampilan unit ini"
                        >
                          Ringkas
                        </button>
                      </div>
                    </div>

                    <UnitEditor
                      item={item}
                      region={region}
                      instance={primaryInstance}
                      instanceIndex={0}
                      totalInstances={instances.length}
                      onSelectOption={(optId) => onSelectOption(primaryInstance.instanceId, optId)}
                      onUpdateDimension={(field, delta, min) =>
                        onUpdateDimension(primaryInstance.instanceId, field, delta, min)
                      }
                      onSetDirectDimension={(field, val) =>
                        onSetDirectDimension(primaryInstance.instanceId, field, val)
                      }
                      onSetLayout={(layout) => onSetLayout?.(primaryInstance.instanceId, layout)}
                    />
                  </div>
                ) : (
                  <UnitSummaryView
                    item={item}
                    region={region}
                    instance={primaryInstance}
                    instanceIndex={0}
                    totalInstances={instances.length}
                    onEdit={() =>
                      setEditingMap((prev) => ({
                        ...prev,
                        [primaryInstance.instanceId]: true,
                      }))
                    }
                  />
                )}
              </div>

              {/* 2. Unit Tambahan (Unit #2, #3, ...) */}
              {instances.slice(1).map((inst, idx) => {
                const isLatest = idx === instances.slice(1).length - 1;
                const isEditing =
                  editingMap[inst.instanceId] !== undefined
                    ? editingMap[inst.instanceId]
                    : isLatest;
                const unitCalc = getInstanceCalculation(item, inst, region);

                return isEditing ? (
                  <div
                    key={inst.instanceId}
                    className="rounded-xl border border-primary/40 bg-card p-3.5 sm:p-4 shadow-2xs"
                  >
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-primary/20">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground shadow-2xs">
                          <Sparkles className="size-3" />
                          <span>
                            {item.name} #{idx + 2}
                          </span>
                        </span>
                        <span className="text-xs font-bold text-primary">
                          Subtotal: {unitCalc.subtotal > 0 ? formatRupiah(unitCalc.subtotal) : "Rp 0"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingMap((prev) => ({
                              ...prev,
                              [inst.instanceId]: false,
                            }))
                          }
                          className="text-xs font-semibold text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors cursor-pointer"
                          title="Ringkas tampilan unit ini"
                        >
                          Ringkas
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveInstance(inst.instanceId)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-red-500 hover:bg-red-500/10 px-2 py-1 rounded-md transition-colors cursor-pointer"
                          title={`Hapus ${item.name} #${idx + 2}`}
                        >
                          <Trash2 className="size-3.5" />
                          <span className="hidden sm:inline">Hapus Unit</span>
                        </button>
                      </div>
                    </div>

                    <UnitEditor
                      item={item}
                      region={region}
                      instance={inst}
                      instanceIndex={idx + 1}
                      totalInstances={instances.length}
                      onSelectOption={(optId) => onSelectOption(inst.instanceId, optId)}
                      onUpdateDimension={(field, delta, min) =>
                        onUpdateDimension(inst.instanceId, field, delta, min)
                      }
                      onSetDirectDimension={(field, val) =>
                        onSetDirectDimension(inst.instanceId, field, val)
                      }
                      onSetLayout={(layout) => onSetLayout?.(inst.instanceId, layout)}
                    />
                  </div>
                ) : (
                  <UnitSummaryView
                    key={inst.instanceId}
                    item={item}
                    region={region}
                    instance={inst}
                    instanceIndex={idx + 1}
                    totalInstances={instances.length}
                    onEdit={() =>
                      setEditingMap((prev) => ({
                        ...prev,
                        [inst.instanceId]: true,
                      }))
                    }
                    onRemove={() => onRemoveInstance(inst.instanceId)}
                  />
                );
              })}
            </div>
          )}

          {/* Action Footer: Tambah Komponen & Info Ringkas */}
          <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2 flex-wrap">
            <button
              type="button"
              disabled={isAddDisabled}
              onClick={() => {
                if (isAddDisabled) return;
                setEditingMap({});
                onAddInstance();
              }}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all shadow-2xs",
                isAddDisabled
                  ? "border-border bg-muted/40 text-muted-foreground opacity-50 cursor-not-allowed select-none"
                  : "border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary hover:shadow-xs cursor-pointer"
              )}
              title={
                isAddDisabled
                  ? `Isi ukuran ${item.name} terlebih dahulu untuk menambah komponen baru`
                  : `Tambah unit lain untuk ${item.name}`
              }
            >
              <Plus className="size-3.5" />
              <span>Tambah Komponen</span>
            </button>

            {instances.length > 1 && (
              <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                <span>Total: <strong className="text-foreground">{instances.length} Unit</strong></span>
                <span>•</span>
                <span>Subtotal: <strong className="text-primary">{formatRupiah(totalSubtotal)}</strong></span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
