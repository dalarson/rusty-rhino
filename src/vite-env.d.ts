/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_RUSTY_API_BASE_URL: string
}

interface ImportMeta {
    env: ImportMetaEnv
}