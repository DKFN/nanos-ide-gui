import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"
import legacy from '@vitejs/plugin-legacy'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
    plugins: [/*viteSingleFile()*/, svgLoader({defaultImport: 'url'}), legacy({
        targets: ['defaults', 'not IE 11']
    })],
})