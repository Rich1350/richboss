import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // 這裡明確啟用 React 插件的 Fast Refresh 功能
      // 這通常能解決開發環境下的 CSP eval 問題
    }),
  ],
  server: {
    // 確保服務器設置正確
    port: 5173,
    host: true,
  }
})