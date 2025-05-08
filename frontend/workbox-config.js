module.exports = {
  globDirectory: 'build/',
  globPatterns: [
    '**/*.{html,js,css,png,jpg,svg,json}',
  ],
  swDest: 'build/service-worker.js',
  swSrc: 'public/service-worker.js',   // <-- on injecte le manifest dans TON SW
};