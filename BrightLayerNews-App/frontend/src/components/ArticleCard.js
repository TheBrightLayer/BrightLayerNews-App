import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  useWindowDimensions, 
  Alert 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { shareToWhatsApp, shareToX } from "../utils/shareNews";
import { FontAwesome6 } from "@expo/vector-icons";
import { apiClient } from "../api/apiClient";
import { useNavigation } from "@react-navigation/native";

const HORIZONTAL_PADDING = 24;
const IMG_HEIGHT = 180;
const BOOKMARK_KEY = "bookmarked_articles";

export default function ArticleCard({ article, onPress }) {
  const navigation = useNavigation();
  const { width: windowWidth } = useWindowDimensions();
  const CARD_MAX_WIDTH = Math.max(320, windowWidth - HORIZONTAL_PADDING);
  const { title, summary, image, source, publishedAt, category } = article || {};

  const [imgError, setImgError] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : "";
  const imgSrc = image || null;
  const showImage = imgSrc && !imgError;

  // ✅ Check if signed in
  useEffect(() => {
    const checkSignin = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // stored at login/signup
        setIsSignedIn(!!token);
      } catch (err) {
        console.log("Signin check error:", err);
      }
    };
    checkSignin();
    checkIfBookmarked();
  }, []);

  // ✅ Bookmark check
  const checkIfBookmarked = async () => {
    try {
      const saved = await AsyncStorage.getItem(BOOKMARK_KEY);
      const bookmarks = saved ? JSON.parse(saved) : [];
      const exists = bookmarks.some((b) => b.title === article.title);
      setIsBookmarked(exists);
    } catch (err) {
      console.log("Bookmark check error:", err);
    }
  };

  // ✅ Helper: Redirect to signup
  const redirectToSignup = () => {
    Alert.alert(
      "Sign In Required",
      "You need to sign in first to access all features.",
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("Signup"),
        },
      ]
    );
  };

  // ✅ Toggle bookmark (only if signed in)
  const toggleBookmark = async () => {
    if (!isSignedIn) return redirectToSignup();

    try {
      const saved = await AsyncStorage.getItem(BOOKMARK_KEY);
      const bookmarks = saved ? JSON.parse(saved) : [];

      if (isBookmarked) {
        const updated = bookmarks.filter((b) => b.title !== article.title);
        await AsyncStorage.setItem(BOOKMARK_KEY, JSON.stringify(updated));
        setIsBookmarked(false);
        Alert.alert("Removed", "Article removed from bookmarks.");
      } else {
        const updated = [...bookmarks, article];
        await AsyncStorage.setItem(BOOKMARK_KEY, JSON.stringify(updated));
        setIsBookmarked(true);
        Alert.alert("Added", "Article added to bookmarks.");
      }
    } catch (err) {
      console.log("Bookmark toggle error:", err);
    }
  };

  // ✅ Handle article press
  const handlePress = async () => {
    console.log("🟩 handlePress triggered");
    if (!isSignedIn) return redirectToSignup();

    if (onPress) onPress(article); // navigate to detail
    try {
      const trendingData = {
        title: article.title,
        link: article.link,
        summary: article.summary || article.description || "",
        image: article.image || "",
        source: article.source || "WorldNews",
        category: article.category || "General",
        publishedAt: article.publishedAt || new Date(),
      };

      const res = await apiClient.post("/increment-views", {
        articleData: trendingData,
      });

      console.log("Trending article updated:", res);
    } catch (err) {
      console.warn("Failed to increment trending views", err);
    }
  };

  // ✅ Share actions (only if signed in)
  const handleShareWhatsApp = () => {
    if (!isSignedIn) return redirectToSignup();
    shareToWhatsApp(article);
  };

  const handleShareX = () => {
    if (!isSignedIn) return redirectToSignup();
    shareToX(article);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      style={{
        alignSelf: "center",
        width: "100%",
        maxWidth: CARD_MAX_WIDTH,
        marginHorizontal: 12,
        marginBottom: 12,
        backgroundColor: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        elevation: 1,
      }}
    >
      {showImage ? (
        <Image
          source={{ uri: imgSrc }}
          style={{ width: "100%", height: IMG_HEIGHT, backgroundColor: "#eee" }}
          resizeMode="cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <View
          style={{
            width: "100%",
            height: IMG_HEIGHT,
            backgroundColor: "#f3f3f3",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#888" }}>No image available</Text>
        </View>
      )}

      {category ? (
        <View
          style={{
            position: "absolute",
            left: 12,
            top: 12,
            backgroundColor: "#2563eb",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 999,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
            {category}
          </Text>
        </View>
      ) : null}

      {/* Bookmark icon */}
      <TouchableOpacity
        onPress={toggleBookmark}
        style={{
          position: "absolute",
          right: 12,
          top: 12,
          backgroundColor: "rgba(0,0,0,0.5)",
          borderRadius: 50,
          padding: 6,
        }}
      >
        <FontAwesome6
          name={isBookmarked ? "bookmark" : "bookmark-o"}
          size={18}
          color="#fff"
        />
      </TouchableOpacity>

      <View style={{ padding: 12 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "800",
            color: "#000",
            marginBottom: 6,
          }}
          numberOfLines={2}
        >
          {title}
        </Text>

        {summary ? (
          <Text
            style={{ color: "#444", fontSize: 14, lineHeight: 20 }}
            numberOfLines={3}
          >
            {summary.replace(/<[^>]*>/g, "")}
          </Text>
        ) : null}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Text style={{ fontSize: 12, color: "#6b7280" }} numberOfLines={1}>
              {source ?? "WorldNews"}
            </Text>
            <Text style={{ color: "#6b7280", marginHorizontal: 6 }}>•</Text>
            <Text style={{ fontSize: 12, color: "#6b7280" }}>{date}</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <TouchableOpacity
              onPress={handleShareWhatsApp}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 8,
                backgroundColor: "#10b981",
                borderRadius: 6,
                marginLeft: 8,
              }}
              accessibilityLabel="Share on WhatsApp"
            >
              <FontAwesome6 name="whatsapp" size={18} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShareX}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 8,
                backgroundColor: "#000",
                borderRadius: 6,
                marginLeft: 8,
              }}
              accessibilityLabel="Share on X"
            >
              <FontAwesome6 name="x-twitter" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
