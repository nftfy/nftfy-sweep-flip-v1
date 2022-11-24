/** @type {import('next').NextConfig} */
const withLess = require('next-with-less')

const nextConfig = {
  reactStrictMode: true,
  api: {
    bodyParser: false
  },
  images: {
    domains: ['images.ctfassets.net']
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true
  }
}

module.exports = withLess(nextConfig)
