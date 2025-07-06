
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				orange: {
					50: 'hsl(33 100% 96%)',
					100: 'hsl(34 100% 92%)',
					200: 'hsl(32 98% 83%)',
					300: 'hsl(31 97% 72%)',
					400: 'hsl(27 96% 61%)',
					500: 'hsl(25 95% 53%)',
					600: 'hsl(21 90% 48%)',
					700: 'hsl(17 88% 40%)',
					800: 'hsl(15 79% 34%)',
					900: 'hsl(15 75% 28%)',
					950: 'hsl(13 81% 15%)'
				},
				slate: {
					50: 'hsl(210 40% 98%)',
					100: 'hsl(210 40% 96%)',
					200: 'hsl(214 32% 91%)',
					300: 'hsl(213 27% 84%)',
					400: 'hsl(215 20% 65%)',
					500: 'hsl(215 16% 47%)',
					600: 'hsl(215 19% 35%)',
					700: 'hsl(215 25% 27%)',
					800: 'hsl(217 33% 17%)',
					900: 'hsl(222 47% 11%)',
					950: 'hsl(229 84% 5%)'
				},
				gray: {
					50: 'hsl(210 20% 98%)',
					100: 'hsl(220 14% 96%)',
					200: 'hsl(220 13% 91%)',
					300: 'hsl(216 12% 84%)',
					400: 'hsl(218 11% 65%)',
					500: 'hsl(220 9% 46%)',
					600: 'hsl(215 14% 34%)',
					700: 'hsl(217 19% 27%)',
					800: 'hsl(215 28% 17%)',
					900: 'hsl(221 39% 11%)',
					950: 'hsl(224 71% 4%)'
				},
				warm: {
					50: '#fefdfb',
					100: '#fdf9f0',
					200: '#f9f0e1',
					300: '#f3e6d0',
					400: '#e8d5b7',
					500: '#d4c0a1',
					600: '#b8a082',
					700: '#9a7f5f',
					800: '#7d614a',
					900: '#5c3317'
				}
			},
			fontFamily: {
				'serif': ['Crimson Text', 'Georgia', 'serif'],
				'sans': ['Inter', 'system-ui', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in': {
					'0%': { opacity: '0', transform: 'translateX(-20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				}
			},
			animation: {
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-in': 'slide-in 0.5s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
