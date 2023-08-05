/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: [
      'ivrnsiypeuywzncgbfga.supabase.co'
    ]
  }
}

module.exports = nextConfig
