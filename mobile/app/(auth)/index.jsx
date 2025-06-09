import React, { useState } from 'react';
import {
  Platform,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import styles from '../../assets/styles/login.styles';
import COLORS from '../../constants/colors';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../stores/authStore';
import { Alert } from 'react-native';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [seePassword, setSeePassword] = useState(false);
  const { user, token, login, isLoading } = useAuthStore();
  const router = useRouter();
  const handleLogin = async(email,password) => {
    const result = await login(email,password)
    if(!result.success)
      Alert.alert("Login Failed:",result.error);
    else
    {
      Alert.alert("Success","You have been logged in successfully")
      router.navigate('(tabs)')
    }
  };

  return (
    <LinearGradient colors={['#f7f9ff', '#e0ecff']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.container}>
            {/* Optional center image */}
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <Image
                source={require('../../assets/images/i.png')}
                style={{ width: 160, height: 160 }}
                contentFit="contain"
              />
            </View>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  padding: 20,
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowOffset: { width: 0, height: 4 },
                  shadowRadius: 10,
                  elevation: 5,
                },
              ]}
            >
              <Text style={[styles.title, { textAlign: 'center', marginBottom: 8 }]}>
                Welcome to M͎i͎n͎d͎-͎M͎i͎r͎r͎o͎r͎!
              </Text>
              <Text style={[styles.subtitle, { textAlign: 'center', marginBottom: 20 }]}>
                😀 Please sign-in to continue!
              </Text>

              <Text style={styles.label}>E-mail:</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-unread-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="johndoe@youremail.com"
                  placeholderTextColor="#999999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <Text style={styles.label}>Password:</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#999999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!seePassword}
                  autoCapitalize="none"
                  autoComplete="password"
                />
                <Ionicons
                  name={seePassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.primary}
                  style={styles.eyeIcon}
                  onPress={() => setSeePassword(!seePassword)}
                />
              </View>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: COLORS.primary, marginTop: 20 }]}
                onPress={()=>handleLogin(email,password)}
                disabled={isLoading}
              >
                { isLoading?(
                  <ActivityIndicator color = "yellow"/>
                ):(
                  <Text style={[styles.buttonText, { color: '#fff', fontWeight: 'bold' }]}>
                  Login
                </Text>
                )}
                
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => router.navigate('/signup')}>
                  <Text style={styles.link}>Sign-up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
