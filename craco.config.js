const path = require('path');
module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
	jest: {
    moduleNameMapper: {
			"^@/(.*)$": "<rootDir>/src/$1"
		}
  }
};