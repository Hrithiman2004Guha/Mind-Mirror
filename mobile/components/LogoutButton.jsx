import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../stores/authStore';
import COLORS from '../constants/colors';
import styles from '../assets/styles/profile.styles';

export default function LogoutButton() {
  const { logout } = useAuthStore();

  const confirmLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
      <Ionicons
        name="log-out-outline"
        size={24}
        color={COLORS.textPrimary}
        style={{ marginRight: 8 }}
      />
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );
}
