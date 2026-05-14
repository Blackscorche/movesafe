import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Animated,
} from "react-native";
import { colors } from "../../utils/theme";
import { ONBOARDING_SLIDES } from "../../utils/constants";
import { storage } from "../../services/storage";

const { width } = Dimensions.get("window");

export const OnboardingScreen = ({ navigation }: any) => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const goNext = async () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await storage.setHasOnboarded(true);
      navigation.replace("Auth");
    }
  };

  const skip = async () => {
    await storage.setHasOnboarded(true);
    navigation.replace("Auth");
  };

  const slide = ONBOARDING_SLIDES[currentIndex];

  return (
    <View style={styles.container}>
      {/* SKIP — sits above everything */}
      <TouchableOpacity style={styles.skipButton} onPress={skip}>
        <Text style={styles.skipText}>Omitir</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            {/* IMAGE */}
            <View style={styles.imageContainer}>
              <Image
                source={item.image}
                style={[
                  styles.image,
                  item.key === 'earn' && styles.imageCurveBottomLeft,
                  item.key === 'redeem' && styles.imageCurveBottomRight,
                ]}
                resizeMode="cover"
              />
              <View
                style={[
                  { zIndex: 10 },
                  item.key === 'earn' ? styles.accentBottomLeft : item.key === 'redeem' ? styles.accentBottomRight : styles.accentTopRight,
                  { borderColor: item.accent }
                ]}
              />
            </View>

            {/* TEXT */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={[styles.subtitle, { color: item.accent }]}>
                {item.subtitle}
              </Text>
              <Text style={styles.body}>{item.body}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.key}
      />

      {/* FOOTER */}
      <View style={styles.footer}>
        {/* DOTS */}
        <View style={styles.dots}>
          {ONBOARDING_SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && {
                  backgroundColor: slide.accent,
                  width: 26,
                },
              ]}
            />
          ))}
        </View>

        {/* PILL BUTTON */}
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: slide.accent }]}
          onPress={goNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === ONBOARDING_SLIDES.length - 1
              ? "Comenzar  ›"
              : "Siguiente  ›"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
  },

  // SKIP
  skipButton: {
    position: "absolute",
    top: 52,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
  },

  // SLIDE
  slide: {
    width,
    flex: 1,
  },

  imageContainer: {
    width: "100%",
    height: "58%",
    marginTop: 90, // ← pushes image down, Omitir shows on dark bg above
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderTopRightRadius: 146,
  },

  imageCurveBottomLeft: {
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 146,
  },

  imageCurveBottomRight: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 146,
  },

  accentTopRight: {
    position: "absolute",
    top: 0,
    bottom: 40,
    right: 0,
    width: 146,
    borderTopRightRadius: 146,
    borderTopWidth: 6,
    borderRightWidth: 6,
  },

  accentBottomLeft: {
    position: "absolute",
    top: 40,
    bottom: 0,
    left: 0,
    width: 146,
    borderBottomLeftRadius: 146,
    borderBottomWidth: 6,
    borderLeftWidth: 6,
  },

  accentBottomRight: {
    position: "absolute",
    top: 40,
    bottom: 0,
    right: 0,
    width: 146,
    borderBottomRightRadius: 146,
    borderBottomWidth: 6,
    borderRightWidth: 6,
  },

  // TEXT
  textContainer: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontFamily: "Poppins-Bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 10,
    textAlign: "center",
  },
  body: {
    color: "#888888",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 250,
  },

  // FOOTER
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 18,
    alignItems: "center",
  },

  // DOTS
  dots: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#444444",
  },

  // BUTTON
  nextButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 0.2,
  },
});
