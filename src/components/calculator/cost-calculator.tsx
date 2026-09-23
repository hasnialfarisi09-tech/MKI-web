"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Bed,
  Building2,
  Check,
  ChevronDown,
  Download,
  FileImage,
  FileText,
  Flame,
  Info,
  Layers,
  Loader2,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Tv,
  User,
  UtensilsCrossed,
} from "lucide-react";

import {
  ACCESSORIES_ITEMS,
  ELECTRONIC_ITEMS,
  FurnitureItemConfig,
  formatRupiah,
  KITCHEN_ITEMS,
  OTHER_CATEGORIES,
  PROVINCES_DATA,
  Region,
} from "@/data/pricing-calculator";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import {
  exportSimulationAsJpg,
  exportSimulationAsPdf,
  SimulationExportData,
} from "@/lib/export-simulation";

type ItemState = {
  enabled: boolean;
  optionId: string;
  length: number | "";
  height: number | "";
  qty: number | "";
};

type CalculatorState = Record<string, ItemState>;

type CategoryKey = "kitchen" | "wardrobe" | "living" | "bedroom";

type CustomAccessory = {
  id: string;
  name: string;
  price: number | "";
  qty: string | number;
};

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
    state[item.id] = {
      enabled: false,
      optionId: item.options[0]?.id ?? "",
      length: "",
      height: "",
      qty: "",
    };
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

export function CostCalculator() {
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

  // Toggle item enable/disable
  const toggleItem = (itemId: string) => {
    setItemsState((prev) => {
      const current = prev[itemId];
      const willEnable = !current?.enabled;
      const targetConfig = ALL_ITEMS.find((i) => i.id === itemId);

      return {
        ...prev,
        [itemId]: {
          ...current,
          enabled: willEnable,
          length:
            willEnable && (!current?.length || current.length === 0)
              ? (targetConfig?.defaultLength ?? 3)
              : (current?.length ?? ""),
          height:
            willEnable && (!current?.height || current.height === 0)
              ? (targetConfig?.defaultHeight ?? 2.8)
              : (current?.height ?? ""),
          qty:
            willEnable && (!current?.qty || current.qty === 0)
              ? (targetConfig?.defaultQty ?? 1)
              : (current?.qty ?? ""),
        },
      };
    });
  };

  // Set option for an item
  const setOption = (itemId: string, optionId: string) => {
    setItemsState((prev) => {
      const current = prev[itemId];
      const targetConfig = ALL_ITEMS.find((i) => i.id === itemId);
      const newOpt = targetConfig?.options.find((o) => o.id === optionId);

      const newLength =
        !current?.length || current.length === 0
          ? (targetConfig?.defaultLength ?? 1.5)
          : current?.length;

      const newHeight =
        newOpt?.unit === "M2" && (!current?.height || current.height === 0)
          ? (targetConfig?.defaultHeight ?? 2.0)
          : current?.height ?? "";

      const newQty =
        newOpt?.unit === "UNIT" && (!current?.qty || current.qty === 0)
          ? (targetConfig?.defaultQty ?? 1)
          : current?.qty ?? "";

      return {
        ...prev,
        [itemId]: {
          ...current,
          optionId,
          length: newLength,
          height: newHeight,
          qty: newQty,
        },
      };
    });
  };

  // Update dimension with +/- buttons
  const updateDimension = (
    itemId: string,
    field: "length" | "height" | "qty",
    delta: number,
    minVal: number = 0.5
  ) => {
    setItemsState((prev) => {
      const currentVal = prev[itemId]?.[field];
      const num = typeof currentVal === "number" ? currentVal : minVal;
      const next = Math.max(minVal, Math.round((num + delta) * 10) / 10);
      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          [field]: next,
        },
      };
    });
  };

  // Set dimension directly from input
  const setDirectDimension = (
    itemId: string,
    field: "length" | "height" | "qty",
    val: number | ""
  ) => {
    setItemsState((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: val === "" ? "" : Math.max(0, val),
      },
    }));
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
    setAccountName("");
    setClientName("");
    setClientAddress("");
  };

  // Compute Grand Total, Total M1, Total M2, and Active Breakdown
  const calculationSummary = useMemo(() => {
    let grandTotal = 0;
    let totalM1 = 0;
    let totalM2 = 0;
    let activeCount = 0;

    const activeBreakdown: Array<{
      item: FurnitureItemConfig;
      optionName: string;
      modelName: string;
      unitPrice: number;
      unit: string;
      measurement: number;
      subtotal: number;
    }> = [];

    // 1. Process regular configured items
    for (const item of ALL_ITEMS) {
      const state = itemsState[item.id];
      if (!state?.enabled) continue;

      const selectedOption =
        item.options.find((opt) => opt.id === state.optionId) ?? item.options[0];
      if (!selectedOption) continue;

      const unitPrice =
        region === "DK" ? selectedOption.priceDK : selectedOption.priceLK;

      const len = typeof state.length === "number" ? state.length : 0;
      const ht = typeof state.height === "number" ? state.height : 0;
      const q = typeof state.qty === "number" ? state.qty : 0;

      let subtotal = 0;
      let measurement = 0;

      if (item.id === "meja_island") {
        measurement = len;
        subtotal = len > 0 ? Math.round((len / 0.6) * unitPrice) : 0;
        totalM1 += len;
      } else if (item.id === "cab_atas_full_plafond") {
        measurement = len;
        subtotal = len > 0 ? Math.round((len * 2) * unitPrice) : 0;
        totalM1 += len * 2;
      } else if (selectedOption.unit === "M1") {
        measurement = len;
        subtotal = len * unitPrice;
        totalM1 += len;
      } else if (selectedOption.unit === "M2") {
        const area = Math.round(len * ht * 100) / 100;
        measurement = area;
        subtotal = area * unitPrice;
        totalM2 += area;
      } else {
        measurement = q;
        subtotal = q * unitPrice;
      }

      grandTotal += subtotal;
      activeCount += 1;

      activeBreakdown.push({
        item,
        optionName: selectedOption.name,
        modelName: selectedOption.model,
        unitPrice,
        unit: selectedOption.unit,
        measurement,
        subtotal,
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
            optionName: "Kustom",
            modelName: `${q} unit @ ${formatRupiah(p)}`,
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

  // Compute selected count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryKey, number> = {
      kitchen: 0,
      wardrobe: 0,
      living: 0,
      bedroom: 0,
    };

    for (const item of KITCHEN_ITEMS) {
      if (itemsState[item.id]?.enabled) counts.kitchen += 1;
    }
    for (const item of ELECTRONIC_ITEMS) {
      if (itemsState[item.id]?.enabled) counts.kitchen += 1;
    }
    for (const item of OTHER_CATEGORIES) {
      if (itemsState[item.id]?.enabled) {
        if (item.category === "wardrobe") counts.wardrobe += 1;
        else if (item.category === "living") counts.living += 1;
        else if (item.category === "bedroom") counts.bedroom += 1;
      }
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
  }, [itemsState, customAccessories]);

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

  const handleDownload = async (format: "jpg" | "pdf") => {
    if (calculationSummary.activeBreakdown.length === 0 || isExporting) return;
    try {
      setIsExporting(format);
      const data: SimulationExportData = {
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
          itemName: b.item.name,
          optionName: b.optionName,
          modelName: b.modelName,
          unitPrice: b.unitPrice,
          unit: b.unit,
          measurement: b.measurement,
          subtotal: b.subtotal,
        })),
      };

      if (format === "jpg") {
        await exportSimulationAsJpg(data);
      } else {
        await exportSimulationAsPdf(data);
      }
      track("simulation_export", { format, city: selectedCity.name });
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
                    <span>Nama Akun</span>
                    <span className="text-primary font-bold">(Identitas H1 di Ekspor)</span>:
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

      {/* Main Grid: Item Selectors (Left) + Live Sticky Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Component Cards */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
              <span>Pilihan Komponen</span>
              <span className="text-xs font-sans font-normal px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                Semua Opsional
              </span>
            </h3>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset Simulasi</span>
            </button>
          </div>

          {/* Render Active Category Items */}
          <div className="space-y-4">
            {activeCategoryItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                region={region}
                state={itemsState[item.id]}
                onToggle={() => toggleItem(item.id)}
                onSelectOption={(optId) => setOption(item.id, optId)}
                onUpdateDimension={(field, delta, min) =>
                  updateDimension(item.id, field, delta, min)
                }
                onSetDirectDimension={(field, val) =>
                  setDirectDimension(item.id, field, val)
                }
              />
            ))}
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

                  {ELECTRONIC_ITEMS.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      region={region}
                      state={itemsState[item.id]}
                      onToggle={() => toggleItem(item.id)}
                      onSelectOption={(optId) => setOption(item.id, optId)}
                      onUpdateDimension={(field, delta, min) =>
                        updateDimension(item.id, field, delta, min)
                      }
                      onSetDirectDimension={(field, val) =>
                        setDirectDimension(item.id, field, val)
                      }
                    />
                  ))}
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

                    return (
                      <div
                        key={acc.id}
                        className="rounded-xl border border-border bg-card p-3.5 sm:p-4 shadow-2xs transition-all hover:border-primary/40"
                      >
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                              {index + 1}
                            </span>
                            <span>Item Aksesoris #{index + 1}</span>
                          </span>

                          <div className="flex items-center gap-3">
                            {sub > 0 && (
                              <span className="text-xs font-bold text-primary">
                                Subtotal: {formatRupiah(sub)}
                              </span>
                            )}
                            {customAccessories[activeCategory].length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeCustomAccessory(activeCategory, acc.id)}
                                className="text-muted-foreground hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-500/10 cursor-pointer"
                                title="Hapus baris aksesoris ini"
                              >
                                <Trash2 className="size-4" />
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
                              type="number"
                              min="0"
                              placeholder="0"
                              value={acc.price === "" ? "" : acc.price}
                              onChange={(e) =>
                                updateCustomAccessory(
                                  activeCategory,
                                  acc.id,
                                  "price",
                                  e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value))
                                )
                              }
                              className="w-full text-xs sm:text-sm font-bold text-center rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                            />
                          </div>

                          {/* Qty (Supports comma & decimal like 2.5) */}
                          <div className="sm:col-span-3">
                            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                              Jumlah (Qty):
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
                    );
                  })}
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => addCustomAccessory(activeCategory)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    <span>Tambah Baris Aksesoris</span>
                  </button>
                  <span className="text-[11px] text-muted-foreground">
                    *Bisa isi nama aksesoris, tarif, & qty bebas (bisa desimal/koma)
                  </span>
                </div>
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
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-6">
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
                  Belum ada komponen yang dicentang. Centang komponen di sebelah kiri
                  untuk melihat simulasi.
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
                          {item.item.name}
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
                          ) : item.item.id === "cab_atas_full_plafond" ? (
                            `(${item.measurement} m x 2) x ${formatRupiah(item.unitPrice)}`
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

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload("jpg")}
                  disabled={isExporting !== null || calculationSummary.activeBreakdown.length === 0}
                  className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-primary/40 bg-background hover:bg-primary/5 text-primary text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title={
                    calculationSummary.activeBreakdown.length === 0
                      ? "Pilih komponen terlebih dahulu untuk download"
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

              {calculationSummary.activeBreakdown.length === 0 && (
                <p className="text-[10px] text-muted-foreground mt-1.5 italic text-center">
                  *Centang komponen untuk mengaktifkan pilihan download JPG & PDF
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Individual Item Card Component */
type ItemCardProps = {
  item: FurnitureItemConfig;
  region: Region;
  state?: ItemState;
  onToggle: () => void;
  onSelectOption: (optId: string) => void;
  onUpdateDimension: (
    field: "length" | "height" | "qty",
    delta: number,
    minVal?: number
  ) => void;
  onSetDirectDimension: (
    field: "length" | "height" | "qty",
    val: number | ""
  ) => void;
};

function ItemCard({
  item,
  region,
  state,
  onToggle,
  onSelectOption,
  onUpdateDimension,
  onSetDirectDimension,
}: ItemCardProps) {
  const isEnabled = state?.enabled ?? false;
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
    item.options.find((opt) => opt.id === state?.optionId) ?? item.options[0];
  const activeUnit = selectedOption?.unit ?? item.defaultUnit;
  const unitPrice = selectedOption
    ? region === "DK"
      ? selectedOption.priceDK
      : selectedOption.priceLK
    : 0;

  let subtotal = 0;
  if (state && selectedOption) {
    const len = typeof state.length === "number" ? state.length : 0;
    const ht = typeof state.height === "number" ? state.height : 0;
    const q = typeof state.qty === "number" ? state.qty : 0;

    if (item.id === "meja_island") {
      subtotal = len > 0 ? Math.round((len / 0.6) * unitPrice) : 0;
    } else if (item.id === "cab_atas_full_plafond") {
      subtotal = len > 0 ? Math.round((len * 2) * unitPrice) : 0;
    } else if (selectedOption.unit === "M1") {
      subtotal = len * unitPrice;
    } else if (selectedOption.unit === "M2") {
      subtotal = len * ht * unitPrice;
    } else {
      subtotal = q * unitPrice;
    }
  }

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
    <div
      className={cn(
        "rounded-2xl border transition-all duration-200",
        isDropdownOpen && "relative z-30",
        isEnabled
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
              checked={isEnabled}
              onChange={onToggle}
              className="size-5 rounded-md border-border text-primary focus:ring-primary accent-primary cursor-pointer"
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-sm sm:text-base text-foreground">
                {item.name}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground border border-border">
                {item.id === "meja_island"
                  ? "Rumus Khusus: (P : 0,6) x Tarif"
                  : item.id === "cab_atas_full_plafond"
                    ? "Rumus Khusus: (P x 2) x Tarif"
                    : activeUnit === "M1"
                      ? "Meter Lari (M1)"
                      : activeUnit === "M2"
                        ? "Meter Persegi (M2 / P x T)"
                        : "Jumlah (QTY)"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {item.description}
            </p>
          </div>
        </label>

        <div className="text-right shrink-0">
          <div className="text-xs text-muted-foreground">Subtotal</div>
          <div
            className={cn(
              "text-sm sm:text-base font-bold",
              isEnabled ? "text-primary" : "text-muted-foreground line-through"
            )}
          >
            {formatRupiah(subtotal)}
          </div>
        </div>
      </div>

      {/* Expanded Controls when Item is Enabled */}
      {isEnabled && (
        <div className="px-4 pb-5 pt-1 sm:px-5 border-t border-border/60 bg-muted/20 rounded-b-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-3">
            {/* Material & Model Selector */}
            <div className="sm:col-span-7">
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
                          ({formatRupiah(region === "DK" ? selectedOption.priceDK : selectedOption.priceLK)} / {selectedOption.unit === "M2" ? "M2 (P x T)" : selectedOption.unit === "UNIT" ? "QTY" : selectedOption.unit})
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
                            const isSelected = opt.id === state?.optionId;
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
                                      / {opt.unit === "M2" ? "M2 (P x T)" : opt.unit === "UNIT" ? "QTY" : opt.unit}
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
            <div className="sm:col-span-5">
              {activeUnit === "M1" && (
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>{item.id === "meja_island" ? "Panjang Meja:" : "Panjang Bentang:"}</span>
                    <span className="text-primary font-bold">
                      {state?.length
                        ? item.id === "meja_island"
                          ? `${state.length} m (${state.length} : 0,6)`
                          : item.id === "cab_atas_full_plafond"
                            ? `${state.length} m (${state.length} x 2)`
                            : `${state.length} Meter Lari (M1)`
                        : "Belum diisi (0 M1)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onUpdateDimension("length", -0.5, 0.5)}
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
                      value={state?.length ?? ""}
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
                      onClick={() => onUpdateDimension("length", 0.5, 0.5)}
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
                  {item.id === "cab_atas_full_plafond" && (
                    <div className="text-[11px] text-muted-foreground mt-1.5 flex items-center justify-between">
                      <span>Rumus workshop:</span>
                      <span className="font-semibold text-primary">
                        (Panjang &times; 2) &times; Tarif
                      </span>
                    </div>
                  )}
                </div>
              )}

              {activeUnit === "M2" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                    <span>Dimensi Luas (P x T):</span>
                    <span className="text-primary font-bold">
                      {typeof state?.length === "number" &&
                      typeof state?.height === "number" &&
                      state.length > 0 &&
                      state.height > 0
                        ? `${Math.round(state.length * state.height * 100) / 100} m² (${state.length}m x ${state.height}m)`
                        : "Belum diisi (0 m²)"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[11px] text-muted-foreground mb-0.5">Panjang / P (m)</div>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="0"
                          value={state?.length ?? ""}
                          onChange={(e) =>
                            onSetDirectDimension(
                              "length",
                              e.target.value === "" ? "" : parseFloat(e.target.value)
                            )
                          }
                          className="w-full text-center font-bold text-xs rounded-lg border border-border bg-background py-1.5 text-foreground focus:border-primary focus:outline-none"
                        />
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
                          value={state?.height ?? ""}
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
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-0.5">
                    <span>Rumus perhitungan:</span>
                    <span className="font-semibold text-primary">Panjang (P) &times; Tinggi (T) &times; Tarif</span>
                  </div>
                </div>
              )}

              {activeUnit === "UNIT" && (
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Jumlah (QTY):</span>
                    <span className="text-primary font-bold">
                      {state?.qty ? `${state.qty} QTY` : "Belum diisi (0 QTY)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onUpdateDimension("qty", -1, 1)}
                      className="size-9 rounded-xl border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer"
                      title="Kurangi 1 unit"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="0"
                      value={state?.qty ?? ""}
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
                      onClick={() => onUpdateDimension("qty", 1, 1)}
                      className="size-9 rounded-xl border border-border bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer"
                      title="Tambah 1 unit"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
