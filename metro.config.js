const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);
const {assetExts} = defaultConfig.resolver;

const config = {
  resolver: {
    assetExts: [...new Set([...(assetExts || []), 'glb', 'gltf'])],
  },
};

module.exports = mergeConfig(defaultConfig, config);
