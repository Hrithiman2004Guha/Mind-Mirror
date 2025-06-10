# 🎵 Mind-Mirror – AI-Powered Mood Journal App

Welcome to **Mind-Mirror**, an AI-powered journaling app that suggests songs, movies, books, and TV shows based on your mood. Built with **React Native** using **Expo**, and powered by **Hugging Face's NLP models**, this app helps you track your feelings while receiving emotionally intelligent media recommendations.

---
##DEMO VIDEO:
[![Watch the video](https://img.youtube.com/vi/rI0IbQQgYhs/0.jpg)](https://www.youtube.com/watch?v=rI0IbQQgYhs&t=13s)


## 📱 Features

* 🔐 **Authentication**: Fully functional Login/Signup system (email + password)
* ✍️ **Create Posts**: Add a title and content to your post
* 🕵️‍♂️ **Post Privacy**: Choose between **public** or **private** posts
* 🤖 **AI Suggestions**: Based on your writing, get personalized **songs, movies, books, and TV show** recommendations using Hugging Face
* 💬 **Comments**: Comment on public posts (only the author of a comment can delete it)
* 🔄 **Toggle Visibility**: Convert posts from public ↔ private anytime
* 🧑‍💼 **Profile View**: Displays your posts, account creation date, and post metadata
* 🎨 **Minimal UI**: Clean, content-first design

---

## 🚀 Getting Started

These steps will help you run the project locally on your machine.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Mind-Mirror.git
cd Mind-Mirror
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the App with Expo

```bash
npx expo start
```

You'll see a QR code in your terminal or browser. Open it with the **Expo Go app** on your mobile device (download from Play Store/App Store).

---

## 📦 Optional: Building an APK

To get a real APK file to install on Android phones:

### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

### 2. Login to Expo

```bash
eas login
```

### 3. Configure EAS Build

```bash
eas build:configure
```

### 4. Build APK

```bash
eas build --platform android --profile preview
```

Expo will generate an APK and give you a download link once it's done.

> ✅ You can open this link on your phone and install the APK directly.

---

## 📁 Folder Structure (Key Parts)

```
📦 app
 ┣ 📜 index.js             # Entry point
 ┣ 📂 screens              # All screen components (Home, CreatePost, Profile, etc.)
 ┣ 📂 components           # Reusable UI components
 ┣ 📂 utils                # Helper functions (API calls, formatters, etc.)
 ┣ 📂 assets               # Fonts, images, etc.
```

---

## 🔌 Tech Stack

* **React Native** w/ **Expo**
* **Node.js + Express** (Backend - optional, if you're using a custom backend)
* **Hugging Face Inference API** for AI suggestions
* **MongoDB** or Firebase (for authentication & storage, depending on your setup)

---

## 💡 Why Mind-Mirror?

I built this in **one week** after learning JavaScript and React Native from scratch. Instead of cloning a tutorial, I learned the tools and built something original — because I believe in apps that respond to **how we feel**, not just what we do.

---

## 📚 Resources

* [Expo Docs](https://docs.expo.dev/)
* [React Native Docs](https://reactnative.dev/docs/getting-started)
* [Hugging Face Inference API](https://huggingface.co/inference-api)

---

## 🙌 Contributing

Want to improve Mind-Mirror? Fork the repo and make a pull request — ideas are welcome!

---

## 📞 Contact

Made by **Hrithiman Guha**
For feedback or collaboration: \(hrithimanguha@gmail.com)]
LinkedIn: ([https://linkedin.com/in/yourprofile](https://www.linkedin.com/in/hrithiman-guha-92746826a/))

---

## 🌟 Final Words

Mind-Mirror isn't just a project — it's proof that ideas + execution > tutorials. It's your emotions, visualized — and maybe, healed a little.

Feel something? Mind-Mirror it. ✨

---

> Built with ❤️ and JavaScript
