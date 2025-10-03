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

    nodemailerConfig: {
      host: process.env.EMAIL_HOST,
      emailTo: process.env.EMAIL_TO,
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_SECRET,
      },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 30000,
    },
    
    redirects: false,
  },
  devtools: { enabled: false }
})