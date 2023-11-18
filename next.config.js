module.exports = {
  reactStrictMode: true,
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  env: {
    BASE_URL: process.env.BASE_URL,
  }
}

module.exports = {
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
};