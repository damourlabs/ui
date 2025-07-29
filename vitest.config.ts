import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        setupFiles: ['./test/setup.ts'],
        include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/.nuxt/**',
            '**/.output/**'
        ],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'coverage/**',
                'dist/**',
                'packages/*/test{,s}/**',
                '**/*.d.ts',
                'cypress/**',
                'test{,s}/**',
                'test{,-*}.{js,cjs,mjs,ts,tsx,jsx}',
                '**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}',
                '**/*{.,-}spec.{js,cjs,mjs,ts,tsx,jsx}',
                '**/__tests__/**',
                '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
                '**/.{eslint,mocha,prettier}rc.{js,cjs,yml}',
                '**/{vitest,vite}.config.{js,ts}',
                '**/form-test-example.ts'
            ]
        }
    },
    resolve: {
        alias: {
            '~ui': resolve(__dirname, '.'),
            '~': resolve(__dirname, '.'),
            '@': resolve(__dirname, '.')
        }
    }
})
