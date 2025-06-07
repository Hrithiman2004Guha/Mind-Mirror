import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import styles from '../../assets/styles/create.styles';
import COLORS from '../../constants/colors';
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';

export default function Create() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const { user, token } = useAuthStore();

  const handleSubmit = async (title, content, isPublic) => {
    if (!title || !content) {
      Alert.alert("Please fill in both title and content.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("https://mind-mirror.onrender.com/api/posts/create", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          isPublic,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        Alert.alert("Post submission failed", data.message || "An error occurred.");
        return;
      }

      if (data.post?.aiSuggestions) {
        setAiSuggestions(data.post.aiSuggestions);
      }
      if(isPublic)
        Alert.alert("Your post has been successfully uploaded to the homepage")
      setTitle('');
      setContent('');
      setIsPrivate(true);
    } catch (error) {
      Alert.alert("Something went wrong", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
    <ScrollView>
      
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>M͎i͎n͎d͎-͎M͎i͎r͎r͎o͎r͎</Text>
            <Text style={styles.subtitle}>
              🧠💬 Share what's on your mind — your thoughts, feelings, or stories.
              You can keep it private 🔒 or make it public 🌍 to inspire and help others.
              This is your safe space — express yourself freely ✨🫶
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Title:</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder='Enter title for this post'
                placeholderTextColor={COLORS.textSecondary}
                value={title}
                onChangeText={setTitle}
                editable={!isLoading}
              />
            </View>

            <Text style={styles.label}>What is on your mind? 📖</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { height: 200, textAlignVertical: 'top' }]}
                placeholder="Write something here..."
                placeholderTextColor="#999"
                multiline
                value={content}
                onChangeText={setContent}
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity
              disabled={isLoading}
              style={[
                styles.button,
                {
                  backgroundColor: isPrivate ? 'gray' : '#007bff',
                  opacity: isLoading ? 0.6 : 1,
                },
              ]}
              onPress={() => setIsPrivate(!isPrivate)}
            >
              <Text style={styles.buttonText}>
                {isPrivate ? 'Make Public' : 'Make Private'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.subtitle}>
              {isPrivate
                ? 'This post is private and you will only get AI suggestions for it.'
                : 'This post is public and it will be posted on the home page for other users to see.'}
            </Text>

            {isLoading ? (
              <ActivityIndicator size="large" color="#007bff" style={{ marginVertical: 20 }} />
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSubmit(title, content, !isPrivate)}
              >
                <Text style={styles.buttonText}>
                  {isPrivate ? 'Post' : 'Post and share'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Display AI Suggestions */}
            {aiSuggestions && (
           
              <View style={{ marginTop: 20 }}>
                  <Text style ={styles.title}>
                      Here is the list of entertainments suggested by our AI model:
                  </Text>
                <Text style={styles.label}>🎶 Songs:</Text>
                {aiSuggestions.songs?.map((song, idx) => (
                  <Text key={idx} style={styles.suggestionItem}>• {song}</Text>
                ))}

                <Text style={styles.label}>🎬 Movies:</Text>
                {aiSuggestions.movies?.map((movie, idx) => (
                  <Text key={idx} style={styles.suggestionItem}>• {movie}</Text>
                ))}

                <Text style={styles.label}>📚 Books:</Text>
                {aiSuggestions.books?.map((book, idx) => (
                  <Text key={idx} style={styles.suggestionItem}>• {book}</Text>
                ))}

                <Text style={styles.label}>📺 TV Shows:</Text>
                {aiSuggestions.shows?.map((show, idx) => (
                  <Text key={idx} style={styles.suggestionItem}>• {show}</Text>
                ))}
              </View>
            )}
          </View>
        </View>
   
    </ScrollView>
    </KeyboardAvoidingView>
  );
}
