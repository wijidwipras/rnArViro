import React from 'react';
import {View, StyleSheet, ViewStyle, StyleProp} from 'react-native';
import {Button} from '@ui-kitten/components';

type UIButtonProps = React.ComponentProps<typeof Button>;

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  shadowColor?: string;
  radius?: number;
  elevation?: number;
} & UIButtonProps;

const ShadowButton: React.FC<Props> = ({
  children,
  containerStyle,
  buttonStyle,
  shadowColor = '#FFBF1B',
  radius = 15,
  elevation = 12,
  ...buttonProps
}) => {
  return (
    <View
      style={[
        styles.shadow,
        {shadowColor, borderRadius: radius, elevation},
        containerStyle,
      ]}>
      <Button
        {...buttonProps}
        style={[styles.button, {borderRadius: radius}, buttonStyle]}>
        {children}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 15,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.45,
    shadowRadius: 20,
  },
  button: {
    width: '100%',
    borderRadius: 15,
  },
});

export default ShadowButton;

