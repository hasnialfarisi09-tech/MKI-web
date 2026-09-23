import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/constants/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* ── MKI brand palette — modern slate grey & logo orange ── */
        mki: {
          orange: "#E5571F", // ember — refined primary accent
          ember: "#F2682C", // brighter ember (gradients, glows)
          red: "#B23A18", // deep clay — secondary warm accent
          clay: "#9C3B1B",
          charcoal: "#212529", // clean slate charcoal (from logo 'M')
          navy: "#0F141C", // premium dark slate (from logo dark elements)
          ink: "#151A22", // dark ink slate
          gray: "#6C757D", // logo grey
          soft: "#E9ECEF", // logo light silver soft grey
          ivory: "#F8F9FA", // clean neutral off-white
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        "2xl": "1.5rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 16px 40px -20px rgba(36, 30, 25, 0.08)",
        glow: "0 16px 36px -12px rgba(242, 104, 44, 0.14)",
        "inner-light": "inset 0 1px 0 0 rgba(255,255,255,0.55)",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Fraunces", "Georgia", "serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      backgroundImage: {
        "mki-gradient": "linear-gradient(135deg, #F2682C 0%, #B23A18 100%)",
        "mki-radial": "radial-gradient(120% 120% at 0% 0%, #F2682C 0%, #B23A18 60%, #9C3B1B 100%)",
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "aurora-drift": {
          "0%, 100%": { transform: "translate3d(0,0,0) rotate(0deg) scale(1)" },
          "33%": { transform: "translate3d(4%, -3%, 0) rotate(40deg) scale(1.15)" },
          "66%": { transform: "translate3d(-3%, 4%, 0) rotate(-30deg) scale(0.95)" },
        },
        "marquee": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "shimmer": {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "aurora-drift": "aurora-drift 22s ease-in-out infinite",
        "marquee": "marquee var(--marquee-duration, 40s) linear infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
