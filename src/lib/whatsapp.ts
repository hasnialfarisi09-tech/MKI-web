import { company } from "@/constants/company";

export type WhatsAppPayload = {
  name?: string;
  phone?: string;
  category?: string;
  location?: string;
  message?: string;
};

export type WhatsAppLinkOptions = {
  recipient?: "main" | "partnership";
};

export function normalizePhoneNumber(phone: string) {
  const normalized = phone.replace(/[^\d]/g, "");

  if (!normalized) return "";

  if (normalized.startsWith("62")) return normalized;
  if (normalized.startsWith("0")) return `62${normalized.slice(1)}`;

  return `62${normalized}`;
}

export function buildWhatsAppMessage(payload: WhatsAppPayload = {}) {
  const lines = [
    "Halo MKI, saya ingin konsultasi interior.",
    payload.name ? `Nama: ${payload.name}` : null,
    payload.phone ? `Nomor WhatsApp: ${payload.phone}` : null,
    payload.category ? `Kategori: ${payload.category}` : null,
    payload.location ? `Lokasi project: ${payload.location}` : null,
    payload.message ? `Pesan: ${payload.message}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}

export function buildPartnershipWhatsAppMessage(payload: WhatsAppPayload = {}) {
  return [
    "Halo Tim MKI!",
    "Saya ingin berdiskusi lebih lanjut mengenai kerja sama kemitraan ini. Boleh dibantu untuk informasi detailnya?",
    "",
    `Nama:${payload.name ? ` ${payload.name}` : ""}`,
    `Domisili:${payload.location ? ` ${payload.location}` : ""}`,
  ].join("\n");
}

export function createWhatsAppLink(payload?: WhatsAppPayload, options: WhatsAppLinkOptions = {}) {
  const isPartnership = options.recipient === "partnership";
  const phone = normalizePhoneNumber(isPartnership ? company.partnershipPhone : company.phone);
  const text = encodeURIComponent(isPartnership ? buildPartnershipWhatsAppMessage(payload) : buildWhatsAppMessage(payload));

  return `https://wa.me/${phone}?text=${text}`;
}
