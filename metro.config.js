const { getDefaultConfig } = require('expo/metro-config');

const DefaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');

module.exports = defaultConfig;
