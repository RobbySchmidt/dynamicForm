import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['nuxt-directus', 'shadcn-nuxt'],

  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    
    componentDir: './components/ui'
  },

  directus: {      
    url: process.env.DIRECTUS_URL,
    autoFetch: false,
  },
 
  runtimeConfig: {
    public: {
      directusUrl: process.env.DIRECTUS_URL,
    },
    
    redirects: false,
  },
  devtools: { enabled: false }
})