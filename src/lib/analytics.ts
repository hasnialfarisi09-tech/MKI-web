export type AnalyticsEvent =
  | "hero_consultation_click"
  | "hero_portfolio_click"
  | "portfolio_open"
  | "service_open"
  | "knowledge_open"
  | "process_cta_click"
  | "whatsapp_click"
  | "survey_start"
  | "survey_step_complete"
  | "survey_submit"
  | "faq_open"
  | "final_cta_click"
  | "social_click"
  | "simulation_export";

export type AnalyticsPayload = Record<string, string | number | boolean>;

export function track(event: AnalyticsEvent | string, payload?: AnalyticsPayload): void {
  if (process.env.NODE_ENV === "development") {
    console.debug(`[analytics] ${event}`, payload);
  }
}
