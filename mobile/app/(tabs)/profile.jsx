import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Alert, FlatList, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import styles from '../../assets/styles/profile.styles';
import ProfileHeader from '../../components/ProfileHeader';
import LogoutButton from '../../components/LogoutButton';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { Image } from 'expo-image';
import { formatPublishDate } from '../../lib/util';

export default function Profile() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { token } = useAuthStore();
  const router = useRouter();

  const fetchPosts = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setIsLoading(true);

      const response = await fetch("https://mind-mirror.onrender.com/api/posts/user", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch posts");

      // backend returns posts array directly, so setPosts(data)
      setPosts(data);

    } catch (error) {
      console.error("Error fetching posts:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      if (isRefresh) setRefreshing(false);
      setIsLoading(false);
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await fetch(`https://mind-mirror.onrender.com/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete post");

      Alert.alert("Success", "Post deleted successfully");
      fetchPosts();

    } catch (error) {
      console.error("Error deleting post:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  const confirmDelete = (postId) => {
    Alert.alert("Delete post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => deletePost(postId) },
    ]);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderPostItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Image
        source={require("../../assets/images/i3.png")}
        style={styles.bookImage}
      />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{`${item.title} (${item.isPublic ? "Public" : "Private"})`}</Text>
        <Text style={styles.bookCaption} numberOfLines={2}>{item.content}</Text>
        <Text style={styles.bookDate}>Posted on {formatPublishDate(item.createdAt)}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id)}>
        <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />

      <View style={styles.booksHeader}>
        <Text style={styles.bookTitle}>Your posts:</Text>
        <Text style={styles.booksCount}>{posts.length}</Text>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
        refreshing={refreshing}
        onRefresh={() => fetchPosts(true)}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbox-ellipses-outline" size={60} color={COLORS.primary} />
            <Text style={styles.emptyText}>No posts yet</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={() => router.push("/create")}>
              <Ionicons name="add-circle-outline" size={24} color={COLORS.textPrimary} style={{ marginRight: 8 }} />
              <Text style={styles.logoutText}>Create a post now!</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
