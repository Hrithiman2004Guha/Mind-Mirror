import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  FlatList
} from 'react-native';
import React, { useState, useCallback } from 'react';
import { useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

import styles from '../assets/styles/home.styles';
import styles2 from '../assets/styles/profile.styles';
import styles3 from '../assets/styles/create.styles';
import COLORS from '../constants/colors';
import { useAuthStore } from '../stores/authStore';
import { formatMemberSince, formatPublishDate } from '../lib/util';
import { useNavigation } from 'expo-router';
export default function Post() {
  const route = useRoute();
  const { post } = route.params;
  const aiSuggestions = post.aiSuggestions;
  const navigation = useNavigation();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [allComments, setAllComments] = useState([]);

  const { token, user } = useAuthStore();
  const fetchComments = async () => {
    try {
      const response = await fetch(`https://mind-mirror.onrender.com/api/comments/${post._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch comments');
      setAllComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchComments();
    }, [])
  );

  const handleCommentPost = async (content) => {
    if (!content.trim()) {
      Alert.alert('Comment cannot be empty!');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`https://mind-mirror.onrender.com/api/comments/${post._id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error posting comment');
      Alert.alert("Your comment has been posted")
      setComment('');
      fetchComments();
    } catch (error) {
      console.error('Error:', error.message);
      Alert.alert('Failed to post comment', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    Alert.alert("Delete Comment", "Are you sure you want to delete this comment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(`https://mind-mirror.onrender.com/api/comments/${commentId}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to delete comment");
            fetchComments();
          } catch (error) {
            Alert.alert("Failed to delete comment", error.message);
          }
        }
      }
    ]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style = {styles.container}>
            <FlatList
        data={[]} // required, we won't use it
        keyExtractor={() => 'dummy'} // dummy key
        ListHeaderComponent={
          <View style={{ flex: 1, padding: 16 }}>

            {/* Post Card */}
            <View style={styles.bookCard}>
              <View style={styles.header}>
                <Text style={[styles.headerTitle, { fontWeight: 'bold' }]}>{post.title}</Text>
              </View>

              <View style={styles.bookHeader}>
                <View style={styles.userInfo}>
                  <Image source={{ uri: post.user.profileImage }} style={styles.avatar} />
                  <View style={styles2.profileInfo}>
                    <Text style={styles.username}>{post.user.username}</Text>
                    <Text style={styles2.memberSince}>Member Since: {formatMemberSince(post.user.createdAt)}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.bookDetails}>
                <Text style={styles.caption}>{post.content}</Text>
                <Text style={styles.bookTitle}>AI Suggestions:</Text>

                <Text style={styles.username}>Here is the list of entertainments suggested by our AI model:</Text>

                <Text style={styles.bookTitle}>🎶 Songs:</Text>
                {aiSuggestions.songs?.map((song, idx) => (
                  <Text key={idx} style={styles3.suggestionItem}>- {song}</Text>
                ))}

                <Text style={styles.bookTitle}>🎬 Movies:</Text>
                {aiSuggestions.movies?.map((movie, idx) => (
                  <Text key={idx} style={styles3.suggestionItem}>- {movie}</Text>
                ))}

                <Text style={styles.bookTitle}>📚 Books:</Text>
                {aiSuggestions.books?.map((book, idx) => (
                  <Text key={idx} style={styles3.suggestionItem}>- {book}</Text>
                ))}

                <Text style={styles.bookTitle}>📺 TV Shows:</Text>
                {aiSuggestions.shows?.map((show, idx) => (
                  <Text key={idx} style={styles3.suggestionItem}>- {show}</Text>
                ))}

                <Text style={[styles2.memberSince, { marginTop: 10 }]}>
                  {`Posted on: ${formatPublishDate(post.createdAt)}`}
                </Text>
              </View>
            </View>

            {/* Add Comment Box */}
            <View style={styles.bookCard}>
              <Text style={styles3.label}>Add a comment?</Text>
              <View style={styles3.inputContainer}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles3.inputIcon}
                />
                <TextInput
                  style={styles3.input}
                  placeholder="Type your comment..."
                  placeholderTextColor="#999"
                  value={comment}
                  onChangeText={setComment}
                  editable={!loading}
                />
              </View>
              <TouchableOpacity
                style={styles3.button}
                onPress={() => handleCommentPost(comment)}
                disabled={loading}
              >
                <Text style={styles3.buttonText}>{loading ? 'Posting...' : 'Post'}</Text>
              </TouchableOpacity>
            </View>

            {/* Comments Section */}
            <View style={styles.bookCard}>
              <Text style={[styles.bookTitle, { marginBottom: 50 }]}>Comments:</Text>
              {allComments.map((item) => (
                <View key={item._id} style={styles2.bookInfo}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Image
                      source={{ uri: item.user.profileImage }}
                      style={{ width: 30, height: 30, borderRadius: 15, marginRight: 8 }}
                    />
                    <Text style={[styles.username,{ fontWeight: 'bold' }]}>{`${item.user.username} says:`}</Text>
                  </View>
                  
                  {/* Wrap content and delete button in a row */}
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ flex: 1, marginRight: 8, marginBottom: 20}}>{item.content}</Text>
                    
                    {item.user._id === user.id && (
                      <TouchableOpacity 
                        style={{ marginLeft: 'auto' }} 
                        onPress={() => handleDeleteComment(item._id)}
                      >
                        <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>

          </View>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      />
      </View>
    </KeyboardAvoidingView>
  );
}
