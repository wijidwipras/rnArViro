/* global jest */
// Mock @viro-community/react-viro to avoid native calls during tests
jest.mock('@viro-community/react-viro', () => {
  const React = require('react');
  const {View} = require('react-native');
  const Mock = React.forwardRef((props, ref) =>
    React.createElement(View, {...props, ref}),
  );
  return {
    ViroARSceneNavigator: Mock,
    ViroARScene: Mock,
    Viro3DObject: Mock,
    ViroAmbientLight: Mock,
    ViroDirectionalLight: Mock,
    ViroText: Mock,
    ViroMaterials: {createMaterials: () => {}},
    ViroNode: Mock,
    ViroQuad: Mock,
  };
});
