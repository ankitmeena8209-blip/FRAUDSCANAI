import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    base: '/',
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 3000,
    },
    build: {
        target: 'es2020',
        cssCodeSplit: true,
        chunkSizeWarningLimit: 1200,
        rollupOptions: {
            output: {
                manualChunks: function (id) {
                    if (id.indexOf('recharts') >= 0) {
                        return 'vendor-charts';
                    }
                    if (id.indexOf('react-dropzone') >= 0 || id.indexOf('@hookform/resolvers') >= 0 || id.indexOf('react-hook-form') >= 0) {
                        return 'vendor-forms';
                    }
                    if (id.indexOf('framer-motion') >= 0) {
                        return 'vendor-motion';
                    }
                    if (id.indexOf('node_modules') >= 0) {
                        return 'vendor';
                    }
                },
            },
        },
    },
});
