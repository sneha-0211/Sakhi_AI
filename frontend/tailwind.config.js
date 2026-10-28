/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sakhi: {
          lavender: {
            50: "#F8F5FF",
            100: "#F0EAFF",
            200: "#E3D5FF",
            300: "#CDB5FF",
            400: "#B088FF",
            500: "#8E51FF",
            600: "#7633E6",
            700: "#5D1CBF",
            800: "#44128F",
            900: "#2F0B66",
          },
          teal: {
            50: "#F0FDF9",
            100: "#CCFBF1",
            200: "#99F6E4",
            300: "#5EEAD4",
            400: "#2DD4BF",
            500: "#14B8A6",
            600: "#0D9488",
            700: "#0F766E",
            800: "#115E59",
            900: "#134E48",
          },
          indigo: {
            50: "#EEF2FF",
            100: "#E0E7FF",
            500: "#6366F1",
            600: "#4F46E5",
            700: "#4338CA",
            800: "#3730A3",
            900: "#1E1B4B",
          },
          sand: {
            50: "#FDFCFA",
            100: "#FAF7F2",
            200: "#F5EFE6",
            300: "#EADDCB",
          }
        }
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "Plus Jakarta Sans", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(142, 81, 255, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'elevated': '0 20px 40px -15px rgba(118, 51, 230, 0.15)',
      }
    },
  },
  plugins: [],
}
