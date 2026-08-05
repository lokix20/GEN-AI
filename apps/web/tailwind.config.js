import animate from "tailwindcss-animate";
export default {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                harvest: {
                    DEFAULT: "#236A43",
                    hover: "#1B5434",
                    light: "#E4F2E9",
                },
                deepgreen: {
                    DEFAULT: "#0F2B1D",
                    dark: "#091F14",
                    light: "#1A3B2A",
                },
                terracotta: {
                    DEFAULT: "#C85A32",
                    hover: "#B34E2A",
                    light: "#F5EBE6",
                },
                soil: {
                    DEFAULT: "#2B1F17",
                    light: "#3D2E24",
                    dark: "#1C130D",
                },
                sage: {
                    DEFAULT: "#5E7A68",
                    light: "#8EA895",
                    dark: "#3F5647",
                    subtle: "#EBF0EC",
                },
                sand: {
                    DEFAULT: "#FAF8F5",
                    muted: "#F4EFEA",
                },
                forest: {
                    DEFAULT: "hsl(var(--forest))",
                    foreground: "hsl(var(--forest-foreground))",
                },
                leaf: {
                    DEFAULT: "hsl(var(--leaf))",
                    foreground: "hsl(var(--leaf-foreground))",
                },
                golden: {
                    DEFAULT: "hsl(var(--golden))",
                    foreground: "hsl(var(--golden-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                xl: "calc(var(--radius) + 0.5rem)",
                "2xl": "calc(var(--radius) + 1rem)",
            },
            boxShadow: {
                // glassmorphism cards: pair this shadow with backdrop-blur + bg-card/60
                glass: "0 8px 32px 0 hsl(var(--forest) / 0.12)",
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
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [animate],
};
