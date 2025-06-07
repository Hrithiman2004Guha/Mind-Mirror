import { View, Text } from 'react-native'
import React from 'react'
import { useAuthStore } from '../stores/authStore'
import { Image } from 'expo-image'
import styles from "../assets/styles/profile.styles"
import { formatMemberSince } from '../lib/util'
export default function ProfileHeader() {
    const {user} = useAuthStore();
    if(!user) return null;
  return (
    <View style = {styles.profileHeader}>
        <Image source = {{uri: user.profileImage}} style = {styles.profileImage}/>
        <View style = {styles.profileInfo}>
            <Text style = {styles.profileName}>{user.name}</Text>
            <Text style = {styles.profileEmail}>{user.email}</Text>
            <Text style = {styles.memberSince}>Member Since: {formatMemberSince(user.createdAt)}</Text>
        </View>
    </View>
  )
}