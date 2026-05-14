import React, { useRef, useState } from "react";
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
} from "react-native";
// import { storage } from "../../services/storage"; // Uncomment when ready

const { width } = Dimensions.get("window");

const SLIDES_DATA = [
  {
    key: "walk",
    title: "Camina",
    subtitle: "Cada paso cuenta",
    body: "Conecta tu app de salud y gana Guacoins por alcanzar tus metas diarias de pasos.",
    image: require("../../assets/images/onboarding-walk.png"),
    accent: "#FF7B4C",
  },
  {
    key: "earn",
    title: "Gana",
    subtitle: "Binestar y recompensas reales",
    body: "Acumula Guacoins todos los días. Mantén rachas para ganar bonificaciones especiales.",
    image: require("../../assets/images/onboarding-run.png"),
    accent: "#FF70A6",
  },
  {
    key: "redeem",
    title: "Canjea",
    subtitle: "Ahorra en tus comercios",
    body: "Usa tus Guacoins para obtener descuentos en farmacias, supermercados y más.",
    image: require("../../assets/images/onboarding-redeem.png"),
    accent: "#00C69C",
  },
];

export const OnboardingScreen = ({ navigation }: any) => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const goNext = async () => {
    if (currentIndex < SLIDES_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // await storage.setHasOnboarded(true);
      navigation.replace("Auth");
    }
  };

  const skip = async () => {
    // await storage.setHasOnboarded(true);
    navigation.replace("Auth");
  };

  const slide = SLIDES_DATA[currentIndex];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={skip}>
        <Text style={styles.skipText}>Omitir</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={SLIDES_DATA}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.imageContainer}>
              {/* Outer Wrapper for the Accent Line */}
              <View
                style={[
                  styles.accentWrapper,
                  { backgroundColor: item.accent },
                  item.key === 'walk' && styles.accentWalk,
                  item.key === 'earn' && styles.accentEarn,
                  item.key === 'redeem' && styles.accentRedeem,
                ]}
              >
                <Image
                  source={item.image}
                  style={[
                    styles.image,
                    item.key === 'walk' && styles.imageWalk,
                    item.key === 'earn' && styles.imageEarn,
                    item.key === 'redeem' && styles.imageRedeem,
                  ]}
                  resizeMode="cover"
                />
              </View>
            </View>

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

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES_DATA.map((_, index) => (
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

        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: slide.accent }]}
          onPress={goNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === SLIDES_DATA.length - 1 ? "Comenzar ›" : "Siguiente ›"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111111" },
  skipButton: { position: "absolute", top: 52, right: 20, zIndex: 10, padding: 8 },
  skipText: { color: "#FFFFFF", fontSize: 13, fontFamily: "Poppins-Regular" },
  slide: { width, flex: 1 },
  imageContainer: { width: "100%", height: "58%", marginTop: 90, position: "relative" },

  // The "Accent Line" logic: Wrapper provides the color, Image is slightly smaller
  accentWrapper: {
    height: "100%",
    width: "100%",
    overflow: "hidden",
  },
  image: {
    height: "100%",
    width: width - 8, // Leaves 8px for the accent
    position: "absolute",
  },

  // Slide-specific Curves & Alignment
  accentWalk: { borderTopRightRadius: 146 },
  imageWalk: { borderTopRightRadius: 146, left: 0 },

  accentEarn: { borderBottomLeftRadius: 146 },
  imageEarn: { borderBottomLeftRadius: 146, right: 0 },

  accentRedeem: { borderBottomRightRadius: 146 },
  imageRedeem: { borderBottomRightRadius: 146, left: 0 },

  // Text & UI
  textContainer: { flex: 1, paddingHorizontal: 28, paddingTop: 24, alignItems: "center" },
  title: { color: "#FFFFFF", fontSize: 32, fontFamily: "Poppins-Bold", marginBottom: 4 },
  subtitle: { fontSize: 16, fontFamily: "Poppins-SemiBold", marginBottom: 12 },
  body: { color: "#888888", fontSize: 14, fontFamily: "Poppins-Regular", textAlign: "center", lineHeight: 22 },
  footer: { paddingHorizontal: 24, paddingBottom: 40, alignItems: "center", gap: 20 },
  dots: { flexDirection: "row", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#333333" },
  nextButton: { width: "100%", paddingVertical: 18, borderRadius: 100, alignItems: "center" },
  nextButtonText: { color: "#FFFFFF", fontSize: 16, fontFamily: "Poppins-SemiBold" },
});