 import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../../services/auth';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const BRAND = '#1e40af';
  const [showPassword, setShowPassword] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  React.useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const onLogin = async () => {
    const value = email.trim();
    if (!value) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!password || password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    try {
      setLoading(true);
      const res = await loginUser(value, password);
      if (!res.success) {
        Alert.alert('Error', res.message || 'Invalid email or password');
        return;
      }
      navigation.replace('MainTabs');
    } catch (e) {
      Alert.alert('Error', 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.centerArea}>
            <View style={styles.content}>
              <View style={styles.logoWrap}>
                <Image
                  source={require('../../../assets/splash-icon.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.title}>Welcome Back</Text>

              <View style={styles.form}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email or Username"
                  placeholderTextColor="#9aa3b2"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  style={[
                    styles.input,
                    emailFocused && { borderColor: BRAND, shadowColor: BRAND, shadowOpacity: 0.12, shadowRadius: 6, elevation: 2 },
                  ]}
                />
                <View style={styles.passwordField}>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor="#9aa3b2"
                    secureTextEntry={!showPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    style={[
                      styles.input,
                      { paddingRight: 48 },
                      passwordFocused && { borderColor: BRAND, shadowColor: BRAND, shadowOpacity: 0.12, shadowRadius: 6, elevation: 2 },
                    ]}
                  />
                  <TouchableOpacity style={styles.toggle} onPress={() => setShowPassword((p) => !p)}>
                    <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={BRAND} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={[styles.button, { opacity: loading ? 0.7 : 1 }]} onPress={onLogin} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Log In</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 24, paddingTop: 60, backgroundColor: '#fff' },
  logoWrap: { width: 140, height: 140, borderRadius: 70, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  logo: { width: 120, height: 120 },
  centerArea: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' },
  content: { width: '100%', flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 8 },
  title: { fontSize: 22, marginBottom: 16, fontWeight: '700' },
  form: { width: '100%', gap: 12 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 14, height: 48, backgroundColor: '#fafafa' },
  button: { backgroundColor: '#1e40af', height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  passwordField: { position: 'relative', width: '100%' },
  toggle: { position: 'absolute', right: 12, top: 0, height: 48, alignItems: 'center', justifyContent: 'center' },
  bottomLogo: { width: '100%', alignItems: 'center', paddingBottom: 12 },
});
