const withTM = require('next-transpile-modules')(['@elek.io/ui']);

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

module.exports = withTM(config);
