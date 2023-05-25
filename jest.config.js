/** @type {import('jest').Config} */
const config = {
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/$1',
    '~/(.*)': '<rootDir>/$1',
  },
};

module.exports = config;
