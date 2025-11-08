import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import babel from "vite-plugin-babel";
import { reactRouter } from "@react-router/dev/vite";

const ReactCompilerConfig = { /* ... */ };


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
    reactRouter(),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"], // if you use TypeScript
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    })
  ],
  base: '/Todo-list/',
})
