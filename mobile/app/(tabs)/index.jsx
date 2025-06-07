import { View, Text } from 'react-native'
import React from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
export default function Home() {
    const router = useRouter();
    const {logout} = useAuthStore();
    const handleLogout = () => {
        logout();
        router.replace("/(auth)")
    }
  return (
    <View>
      <Text>Home Screen</Text>
      <TouchableOpacity onPress={()=>handleLogout()}>
            <Text>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  )
}