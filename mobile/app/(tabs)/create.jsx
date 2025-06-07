import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import COLORS from '../../constants/colors';
import styles from '../../assets/styles/create.styles';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function Create() {
  const [title, setTitle] = useState('');
  const [mood, setMood] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [image, setImage] = useState(null);
  const [genre, setGenre] = useState('');
  const [audioURL, setAudioURL] = useState('');

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Permission to access media library is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>♬ 𝓜𝓸𝓸𝓭𝓲𝓯𝔂 𝄞</Text>
              <Text style={styles.subtitle}>♬ Post a song that you would like for the community to hear</Text>
            </View>

            {/* Repeat for other fields like before... */}
            {/* Song Title */}
            <Text style={styles.label}>Song Title:</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="disc-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter the title of the song"
                placeholderTextColor={COLORS.textSecondary}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Song Mood */}
            <Text style={styles.label}>Song Mood:</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="heart-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter the mood of the song"
                placeholderTextColor={COLORS.textSecondary}
                value={mood}
                onChangeText={setMood}
              />
            </View>

            {/* Artist */}
            <Text style={styles.label}>Song Artist:</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter the artist"
                placeholderTextColor={COLORS.textSecondary}
                value={artist}
                onChangeText={setArtist}
              />
            </View>

            {/* Album */}
            <Text style={styles.label}>Song Album:</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="albums-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter the album"
                placeholderTextColor={COLORS.textSecondary}
                value={album}
                onChangeText={setAlbum}
              />
            </View>

            {/* Genre */}
            <Text style={styles.label}>Song Genre:</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="pricetag-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter the genre"
                placeholderTextColor={COLORS.textSecondary}
                value={genre}
                onChangeText={setGenre}
              />
            </View>

            {/* Image Picker */}
            <Text style={styles.label}>Song Image:</Text>
            <TouchableOpacity onPress={pickImage} style={[styles.imagePicker, { justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }]}>
              {image ? (
                <Image source={{ uri: image }} style={styles.imagePicker} />
              ) : (
                <>
                  <Ionicons name="image-outline" size={40} color={COLORS.primary} />
                  <Text style={{ color: COLORS.textSecondary, marginTop: 8 }}>Tap to upload image</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Audio URL */}
            <Text style={styles.label}>Song Audio URL(upload it to a cloud storage and paste the public access URL):</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="musical-notes-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter the audio URL"
                placeholderTextColor={COLORS.textSecondary}
                value={audioURL}
                onChangeText={setAudioURL}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity style = {styles.button} onPress = {()=> handleSubmit(title,artist,album,genre,audioURL,image)}>
                  <Text style={styles.buttonText}>Post</Text>
                </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
