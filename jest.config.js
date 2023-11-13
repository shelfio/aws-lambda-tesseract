const ES_PACKAGES_TO_TRANSFORM = ['is-image'];

/** @type {import("jest").Config} */
const config = {
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
          },
        },
      },
    ],
  },
  transformIgnorePatterns: [
    `node_modules/(?!(${ES_PACKAGES_TO_TRANSFORM.join('|')}))/node_modules/.+\\.js`,
  ],
};

module.exports = config;
