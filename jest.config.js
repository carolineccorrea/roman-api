module.exports = {
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  moduleNameMapper: {
    '@/tests/(.+)': '<rootDir>/tests/$1',
    '@/(.+)': '<rootDir>/src/$1'
  },
  "modulePaths": [ "<rootDir>/src" ],
  roots: [
    '<rootDir>/src'
  ],
  transform: {
    '\\.ts$': 'ts-jest'
  }
}