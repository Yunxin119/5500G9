module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!react-markdown|vfile|vfile-message|unified|bail|is-plain-obj|trough|remark-parse|mdast-util-from-markdown|micromark|decode-named-character-reference|character-entities|micromark-core-commonmark|micromark-util-.*|mdast-util-.*|remark-rehype|hast-util-.*|space-separated-tokens|comma-separated-tokens|property-information|hastscript|web-namespaces|zwitch|html-void-elements|unist-.*|unist|rehype-.*|framer-motion)/"
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  setupFilesAfterEnv: [
    "<rootDir>/src/setupTests.js"
  ],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}"
  ]
}; 