import Link from "next/link";
import { IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";
import { Logo } from "@/components/layout/Logo";
import { company } from "@/constants/company";
import { footerContent } from "@/constants/content";
import { footerNavItems } from "@/constants/navigation";
import { services, partnerships } from "@/constants/content";
import { createWhatsAppLink } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="bg-mki-navy text-white">
      <div className="container grid gap-10 py-14 md:grid-cols-2 xl:grid-cols-[1.3fr_0.6fr_0.6fr_1.5fr]">
        <div>
          <Logo dark fullText className="-ml-3" />
          <p className="mt-2 max-w-md text-sm leading-7 text-white/60">{company.description}</p>
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-white">{footerContent.quickLinks}</h3>
          <div className="mt-5 grid gap-3">
            {footerNavItems.map((item) => (
              <Link className="text-sm text-white/60 transition hover:text-white" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-white">{footerContent.services}</h3>
          <div className="mt-5 grid gap-3">
            {services.map((service) => (
              <Link className="text-sm text-white/60 transition hover:text-white" href="#services" key={service.title}>
                {service.title}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-white">{footerContent.contact}</h3>
          <div className="mt-5 grid gap-4 text-sm text-white/60">
            <a className="flex min-w-0 gap-3 transition hover:text-white" href={createWhatsAppLink()} target="_blank" rel="noreferrer">
              <IconPhone className="mt-0.5 size-4 shrink-0 text-mki-orange" />
              <span className="min-w-0">
                <span className="block text-xs font-bold uppercase tracking-wide text-white/40">Kontak Official</span>
                <span className="block break-words">{company.phone}</span>
              </span>
            </a>
            <a className="flex min-w-0 gap-3 transition hover:text-white" href={createWhatsAppLink(undefined, { recipient: "partnership" })} target="_blank" rel="noreferrer">
              <IconPhone className="mt-0.5 size-4 shrink-0 text-mki-orange" />
              <span className="min-w-0">
                <span className="block text-xs font-bold uppercase tracking-wide text-white/40">WhatsApp Kemitraan</span>
                <span className="block break-words">{company.partnershipPhone}</span>
              </span>
            </a>
            <a className="flex min-w-0 gap-3 transition hover:text-white" href={`mailto:${company.email}`}>
              <IconMail className="mt-0.5 size-4 shrink-0 text-mki-orange" />
              <span className="min-w-0 break-words">{company.email}</span>
            </a>
            <a className="flex min-w-0 gap-3 transition hover:text-white" href={company.mapUrl} target="_blank" rel="noreferrer">
              <IconMapPin className="mt-0.5 size-4 shrink-0 text-mki-orange" />
              <span className="min-w-0 break-words">{company.address}</span>
            </a>
            <div className="mt-1 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-1">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.469204970671!2d107.42185029999999!3d-6.8342099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68fd005d719239%3A0xe4732d5eaa2c7b24!2sPT%20MENUJU%20KEINDAHAN%20INDONESIA!5e0!3m2!1sen!2sid!4v1779176563147!5m2!1sen!2sid"
                className="h-[140px] w-full rounded-lg border-0 opacity-80 transition hover:opacity-100"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta Lokasi MKI"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-3 py-6 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            Copyright {new Date().getFullYear()} {company.name}. {footerContent.copyright}
          </p>
          <div className="flex flex-wrap gap-5">
            {partnerships.map((item) => (
              <Link className="transition hover:text-white" href="#partnership" key={item.id}>
                {item.segment}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
