/* eslint-disable react/no-unstable-nested-components */
import React, {useState} from 'react';
import {Image, KeyboardAvoidingView, Platform, StyleSheet, View, Pressable} from 'react-native';
import {Layout, Text, Input} from '@ui-kitten/components';
import {SafeAreaView} from 'react-native-safe-area-context';
import ShadowButton from '../components/common/ShadowButton';
import {EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon} from 'react-native-heroicons/outline';

const LoginScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onLogin = () => {
    navigation.navigate('MainTabs');
  };

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.select({ios: 'padding', android: undefined})}
          style={styles.kav}>
          <View style={styles.header}>
            <Image
              source={require('../assets/images/logo-criti-space.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.content}>
            <Text category="h3" style={styles.title}>
              Hai !
            </Text>
            <Text appearance="hint" style={styles.subtitle}>
              Masuk untuk melanjutkan eksplorasi ruang kreatif Anda.
            </Text>

            <Input
              size="large"
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              accessoryLeft={() => <EnvelopeIcon size={22} color="#8F9BB3" />}
            />
            <Input
              size="large"
              style={styles.input}
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              accessoryLeft={() => <LockClosedIcon size={22} color="#8F9BB3" />}
              accessoryRight={() => (
                <Pressable onPress={() => setShowPassword(v => !v)} hitSlop={10}>
                  {showPassword ? (
                    <EyeSlashIcon size={22} color="#8F9BB3" />
                  ) : (
                    <EyeIcon size={22} color="#8F9BB3" />
                  )}
                </Pressable>
              )}
            />

            <ShadowButton size="large" onPress={onLogin}>
              Login
            </ShadowButton>
          </View>

          <View style={styles.footer}>
            <Text appearance="hint" style={styles.footerText}>
              Dengan masuk, Anda menyetujui ketentuan penggunaan dan kebijakan privasi.
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF'},
  safe: {flex: 1},
  kav: {flex: 1},
  header: {paddingHorizontal: 8, paddingTop: 32, paddingBottom: 8},
  headerLogo: {height: 28, width: 120},
  content: {flex: 1, paddingHorizontal: 24, justifyContent: 'center'},
  title: {marginBottom: 6, textAlign: 'center', color: '#FFBF1B'},
  subtitle: {marginBottom: 24, textAlign: 'center'},
  input: {marginBottom: 16, borderRadius: 15, width: '100%'},
  footer: {paddingHorizontal: 24, paddingVertical: 16},
  footerText: {textAlign: 'center', fontSize: 12},
});

export default LoginScreen;

