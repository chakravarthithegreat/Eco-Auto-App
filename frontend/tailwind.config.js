/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Universal Color System
      colors: {
        // Primary Brand Colors
        'primary': {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
          DEFAULT: 'var(--primary)',
          light: 'var(--primary-light)',
          dark: 'var(--primary-dark)',
        },
        
        // Secondary Brand Colors
        'secondary': {
          50: 'var(--secondary-50)',
          100: 'var(--secondary-100)',
          200: 'var(--secondary-200)',
          300: 'var(--secondary-300)',
          400: 'var(--secondary-400)',
          500: 'var(--secondary-500)',
          600: 'var(--secondary-600)',
          700: 'var(--secondary-700)',
          800: 'var(--secondary-800)',
          900: 'var(--secondary-900)',
          DEFAULT: 'var(--secondary)',
          light: 'var(--secondary-light)',
          dark: 'var(--secondary-dark)',
        },
        
        // Accent Colors
        'accent': {
          50: 'var(--accent-50)',
          100: 'var(--accent-100)',
          200: 'var(--accent-200)',
          300: 'var(--accent-300)',
          400: 'var(--accent-400)',
          500: 'var(--accent-500)',
          600: 'var(--accent-600)',
          700: 'var(--accent-700)',
          800: 'var(--accent-800)',
          900: 'var(--accent-900)',
          DEFAULT: 'var(--accent)',
          light: 'var(--accent-light)',
          dark: 'var(--accent-dark)',
        },
        
        // Success Colors
        'success': {
          50: 'var(--success-50)',
          100: 'var(--success-100)',
          200: 'var(--success-200)',
          300: 'var(--success-300)',
          400: 'var(--success-400)',
          500: 'var(--success-500)',
          600: 'var(--success-600)',
          700: 'var(--success-700)',
          800: 'var(--success-800)',
          900: 'var(--success-900)',
          DEFAULT: 'var(--success)',
          light: 'var(--success-light)',
          dark: 'var(--success-dark)',
        },
        
        // Warning Colors
        'warning': {
          50: 'var(--warning-50)',
          100: 'var(--warning-100)',
          200: 'var(--warning-200)',
          300: 'var(--warning-300)',
          400: 'var(--warning-400)',
          500: 'var(--warning-500)',
          600: 'var(--warning-600)',
          700: 'var(--warning-700)',
          800: 'var(--warning-800)',
          900: 'var(--warning-900)',
          DEFAULT: 'var(--warning)',
          light: 'var(--warning-light)',
          dark: 'var(--warning-dark)',
        },
        
        // Danger Colors
        'danger': {
          50: 'var(--danger-50)',
          100: 'var(--danger-100)',
          200: 'var(--danger-200)',
          300: 'var(--danger-300)',
          400: 'var(--danger-400)',
          500: 'var(--danger-500)',
          600: 'var(--danger-600)',
          700: 'var(--danger-700)',
          800: 'var(--danger-800)',
          900: 'var(--danger-900)',
          DEFAULT: 'var(--danger)',
          light: 'var(--danger-light)',
          dark: 'var(--danger-dark)',
        },
        
        // Info Colors
        'info': {
          50: 'var(--info-50)',
          100: 'var(--info-100)',
          200: 'var(--info-200)',
          300: 'var(--info-300)',
          400: 'var(--info-400)',
          500: 'var(--info-500)',
          600: 'var(--info-600)',
          700: 'var(--info-700)',
          800: 'var(--info-800)',
          900: 'var(--info-900)',
          DEFAULT: 'var(--info)',
          light: 'var(--info-light)',
          dark: 'var(--info-dark)',
        },
        
        // Neutral Colors
        'neutral': {
          50: 'var(--neutral-50)',
          100: 'var(--neutral-100)',
          200: 'var(--neutral-200)',
          300: 'var(--neutral-300)',
          400: 'var(--neutral-400)',
          500: 'var(--neutral-500)',
          600: 'var(--neutral-600)',
          700: 'var(--neutral-700)',
          800: 'var(--neutral-800)',
          900: 'var(--neutral-900)',
        },
        
        // Background Colors
        'bg': {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          surface: 'var(--bg-surface)',
          overlay: 'var(--bg-overlay)',
        },
        
        // Text Colors
        'text': {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          inverse: 'var(--text-inverse)',
          muted: 'var(--text-muted)',
        },
        
        // Border Colors
        'border': {
          primary: 'var(--border-primary)',
          secondary: 'var(--border-secondary)',
          tertiary: 'var(--border-tertiary)',
          focus: 'var(--border-focus)',
        },
        
        // Shadow Colors
        'shadow': {
          color: 'var(--shadow-color)',
          'color-light': 'var(--shadow-color-light)',
          'color-dark': 'var(--shadow-color-dark)',
        },
        
        // Legacy Support
        'primary-green': 'var(--primary)',
        'primary-green-light': 'var(--primary-light)',
        'accent-purple': 'var(--secondary)',
        'accent-blue': 'var(--secondary)',
        'accent-blue-light': 'var(--secondary-light)',
        'warning-amber': 'var(--warning)',
        'danger-red': 'var(--danger)',
        'info-cyan': 'var(--info)',
        'background-gray': 'var(--bg-primary)',
        'background-gray-light': 'var(--bg-secondary)',
        'surface-dark': 'var(--neutral-800)',
        'surface-medium': 'var(--neutral-500)',
        'surface-light': 'var(--neutral-400)',
        'login-bg': 'var(--secondary-900)',
        
        // Enhanced 2025 modern theme colors with psychology-based principles
        'light': {
          // Primary - Green for growth, harmony, and balance
          'primary': 'var(--primary)',
          // Secondary - Indigo for trust and reliability
          'secondary': 'var(--secondary)',
          // Accent - Purple for creativity and innovation
          'accent': 'var(--accent)',
          // Background - Clean, neutral tones
          'bg': 'var(--bg-primary)',
          'bg-secondary': 'var(--bg-secondary)',
          // Surface - Pure white for clarity
          'surface': 'var(--bg-surface)',
          // Text - High contrast for readability
          'text': 'var(--text-primary)',
          'text-secondary': 'var(--text-secondary)',
          'text-tertiary': 'var(--text-tertiary)',
          // Status colors - Psychologically appropriate
          'success': 'var(--success)',
          'warning': 'var(--warning)',
          'danger': 'var(--danger)',
          'info': 'var(--info)',
          // Focus - Subtle but distinct
          'focus': 'var(--primary)',
          // Glassmorphism effects
          'glass': {
            'bg': 'rgba(255,255,255,0.7)',
            'border': '1px solid rgba(229, 231, 235, 0.8)',
            'shadow': '0 8px 32px rgba(31,41,55,0.1)'
          }
        },
        'dark': {
          // Primary - Softer green for dark mode eye comfort
          'primary': 'var(--primary-light)',
          // Secondary - Softer indigo for reduced eye strain
          'secondary': 'var(--secondary-light)',
          // Accent - Lighter purple for contrast
          'accent': 'var(--accent-light)',
          // Background - Deep but not harsh
          'bg': '#0F172A',
          'bg-secondary': '#1E293B',
          // Surface - Slightly lighter than background
          'surface': '#111827',
          // Text - High contrast but not harsh
          'text': '#F1F5F9',
          'text-secondary': '#94A3B8',
          'text-tertiary': '#64748B',
          // Status colors - Adjusted for dark mode
          'success': 'var(--success-light)',
          'warning': 'var(--warning-light)',
          'danger': 'var(--danger-light)',
          'info': 'var(--info-light)',
          // Focus - Consistent with light mode
          'focus': 'var(--primary-light)',
          // Glassmorphism effects
          'glass': {
            'bg': 'rgba(15, 23, 42, 0.6)',
            'border': '1px solid rgba(30, 41, 59, 0.7)',
            'shadow': '0 8px 32px rgba(0,0,0,0.3)'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Reference UI spacing and sizing
      borderRadius: {
        'xs': '0.125rem',
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '1.75rem',
        'full': '9999px',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.03)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.05)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.15)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        // Enhanced glassmorphism shadows
        'glass-sm': '0 8px 32px rgba(31, 41, 55, 0.08)',
        'glass-md': '0 8px 32px rgba(31, 41, 55, 0.15)',
        'glass-lg': '0 8px 32px rgba(31, 41, 55, 0.25)',
      },
      // Reference UI breakpoints (mobile-first)
      screens: {
        'xs': '360px',
        'sm': '640px', 
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      // Blur effects for glassmorphism
      backdropBlur: {
        'glass-sm': '6px',
        'glass-md': '12px',
        'glass-lg': '18px',
      },
      // Custom glassmorphism utilities
      backgroundColor: {
        'glass-light': 'rgba(255, 255, 255, 0.7)',
        'glass-dark': 'rgba(15, 23, 42, 0.6)',
      },
      backgroundImage: theme => ({
        'brand-gradient': 'linear-gradient(135deg, var(--brand-grad-start) 0%, var(--brand-grad-end) 100%)',
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  safelist: [
    // Light theme classes
    'bg-light-bg',
    'bg-light-bg-secondary',
    'bg-light-surface',
    'bg-light-primary',
    'bg-light-secondary',
    'bg-light-accent',
    'bg-light-success',
    'bg-light-warning',
    'bg-light-danger',
    'bg-light-info',
    'text-light-text',
    'text-light-text-secondary',
    'text-light-text-tertiary',
    'text-light-primary',
    'text-light-secondary',
    'text-light-accent',
    'text-light-success',
    'text-light-warning',
    'text-light-danger',
    'text-light-info',
    'border-light-bg-secondary',
    'border-light-surface',
    'border-light-primary',
    'border-light-secondary',
    'border-light-accent',
    'border-light-success',
    'border-light-warning',
    'border-light-danger',
    'border-light-info',
    // Dark theme classes
    'dark:bg-dark-bg',
    'dark:bg-dark-bg-secondary',
    'dark:bg-dark-surface',
    'dark:bg-dark-primary',
    'dark:bg-dark-secondary',
    'dark:bg-dark-accent',
    'dark:bg-dark-success',
    'dark:bg-dark-warning',
    'dark:bg-dark-danger',
    'dark:bg-dark-info',
    'dark:text-dark-text',
    'dark:text-dark-text-secondary',
    'dark:text-dark-text-tertiary',
    'dark:text-dark-primary',
    'dark:text-dark-secondary',
    'dark:text-dark-accent',
    'dark:text-dark-success',
    'dark:text-dark-warning',
    'dark:text-dark-danger',
    'dark:text-dark-info',
    'dark:border-dark-bg-secondary',
    'dark:border-dark-surface',
    'dark:border-dark-primary',
    'dark:border-dark-secondary',
    'dark:border-dark-accent',
    'dark:border-dark-success',
    'dark:border-dark-warning',
    'dark:border-dark-danger',
    'dark:border-dark-info',
    // Opacity variants
    'bg-light-bg-secondary/10',
    'bg-light-bg-secondary/20',
    'bg-light-bg-secondary/30',
    'bg-light-bg-secondary/50',
    'bg-light-bg-secondary/80',
    'bg-light-bg-secondary/90',
    'bg-light-surface/80',
    'bg-light-surface/95',
    'bg-light-primary/10',
    'bg-light-secondary/10',
    'bg-light-accent/10',
    'bg-light-success/10',
    'bg-light-warning/10',
    'bg-light-danger/10',
    'bg-light-info/10',
    'bg-light-secondary/20',
    'bg-light-accent/20',
    'bg-light-success/20',
    'bg-light-warning/20',
    'bg-light-danger/20',
    'bg-light-info/20',
    'dark:bg-dark-bg-secondary/10',
    'dark:bg-dark-bg-secondary/20',
    'dark:bg-dark-bg-secondary/30',
    'dark:bg-dark-bg-secondary/50',
    'dark:bg-dark-bg-secondary/80',
    'dark:bg-dark-bg-secondary/90',
    'dark:bg-dark-surface/80',
    'dark:bg-dark-surface/95',
    'dark:bg-dark-primary/10',
    'dark:bg-dark-secondary/10',
    'dark:bg-dark-accent/10',
    'dark:bg-dark-success/10',
    'dark:bg-dark-warning/10',
    'dark:bg-dark-danger/10',
    'dark:bg-dark-info/10',
    'dark:bg-dark-secondary/20',
    'dark:bg-dark-accent/20',
    'dark:bg-dark-success/20',
    'dark:bg-dark-warning/20',
    'dark:bg-dark-danger/20',
    'dark:bg-dark-info/20',
    // Hover states
    'hover:bg-light-bg-secondary',
    'hover:bg-light-bg-secondary/80',
    'hover:text-light-text',
    'hover:text-light-danger',
    'hover:bg-light-bg-secondary',
    'dark:hover:bg-dark-bg-secondary',
    'dark:hover:bg-dark-bg-secondary/80',
    'dark:hover:text-dark-text',
    'dark:hover:text-dark-danger',
    'dark:hover:bg-dark-bg-secondary',
    // Focus states
    'focus:ring-light-secondary',
    'dark:focus:ring-dark-secondary',
  ],
}