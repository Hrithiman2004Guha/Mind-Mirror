import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import styles from '../../assets/styles/home.styles';
import { Ionicons } from '@expo/vector-icons';
import { formatPublishDate } from '../../lib/util'; // make sure you have this or use `new Date().toLocaleDateString()`
import { Image } from 'expo-image';
export default function Home() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const {user} = useAuthStore();
  const fetchPosts = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      const res = await fetch(`https://mind-mirror.onrender.com/api/posts?page=${pageNum}&limit=5`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch posts');

      const fetchedPosts = (data.posts || []).filter((post) => post.isPublic);

      setHasMore(pageNum < data.totalPages);
      setPage(pageNum);

      if (refresh) {
        setPosts(fetchedPosts);
      } else {
        const existingIds = new Set(posts.map((p) => p._id));
        const uniquePosts = fetchedPosts.filter((p) => !existingIds.has(p._id));
        setPosts((prev) => [...prev, ...uniquePosts]);
      }
    } catch (error) {
      console.error('Fetch error:', error.message);
    } finally {
      if (refresh) setRefreshing(false);
      else setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && !refreshing && hasMore) {
      fetchPosts(page + 1);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts(1, true); // refresh on screen focus
    }, [])
  );

  const renderPost = ({ item }) => {
  console.log("🔍 Post item:", item); // ← This logs each post with user field populated

  return (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: item.user?.profileImage }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{item.user?.username || 'Anonymous'}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/post/${item._id}`)}
      >
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookDetails}>
          {item.content.length > 50 ? item.content.slice(0, 50) + '...' : item.content}
        </Text>
        <Text style={styles.date}>{formatPublishDate(item.createdAt)}</Text>
      </TouchableOpacity>
    </View>
  );
};


  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={renderPost}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>M͎i͎n͎d͎-͎M͎i͎r͎r͎o͎r͎</Text>
            <Text style={styles.headerSubtitle}>
              View posts from our fellow community members!
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbox-ellipses-outline" size={60} color="#007bff" />
            <Text style={styles.headerTitle}>No posts yet</Text>
            <Text style={styles.headerSubtitle}>
              Be the first to share your thoughts!
            </Text>
          </View>
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        refreshing={refreshing}
        onRefresh={() => fetchPosts(1, true)}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
