import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { AppButton } from '../../components/common/AppButton';

const MAYA = require('../../assets/images/maya-happy.png');
const WELCOME_ICON = require('../../assets/images/welcome-icon.png');

export const WelcomeBadgeScreen = ({ navigation }: any) => {
  const [seconds, setSeconds] = useState(4);

  const goToMain = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      })
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (seconds <= 0) {
      goToMain();
    }
  }, [seconds]);

  return (
    <View style={styles.container}>

      {/* MAYA */}
      <View style={styles.mayaWrapper}>
        <Image
          source={MAYA}
          style={styles.mayaImage}
          resizeMode="contain"
        />
      </View>

      {/* CARD */}
      <View style={styles.card}>

        <Text style={styles.title}>
          ¡Bienvenido a MoveSave!
        </Text>

        <Text style={styles.subtitle}>
          Conoce a Maya, tu guía en este viaje
        </Text>

        {/* BADGE IMAGE */}
        <View style={styles.badgeWrapper}>
          <Image
            source={WELCOME_ICON}
            style={styles.badgeImage}
            resizeMode="contain"
          />
        </View>

      </View>

      {/* TEXT */}
      <Text style={styles.unlockText}>
        ¡Has desbloqueado tu primera insignia!
      </Text>

      <Text style={styles.unlockSubtext}>
        Comienza a caminar para ganar más recompensas
      </Text>

      {/* BUTTON */}
      <AppButton
        title="Comenzar mi viaje"
        onPress={goToMain}
        style={styles.beginButton}
        textStyle={styles.beginButtonText}
      />

      {/* AUTO CONTINUE */}
      <Text style={styles.autoText}>
        Continúa automáticamente en {seconds} segundos...
      </Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECECEC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  /* MAYA */
  mayaWrapper: {
    zIndex: 10,
    marginBottom: -30,
  },

  mayaImage: {
    width: 150,
    height: 150,
  },

  /* CARD */
  card: {
    width: '100%',
    backgroundColor: '#000000',
    borderRadius: 30,
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 46,
    paddingHorizontal: 24,
    marginBottom: 34,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 6,
  },

  subtitle: {
    color: '#B8B8B8',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 34,
  },

  /* BADGE */
  badgeWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },

  badgeImage: {
    width: 240,
    height: 240,
  },

  /* TEXT */
  unlockText: {
    color: '#111111',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginBottom: 6,
  },

  unlockSubtext: {
    color: '#777777',
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },

  /* BUTTON */
  beginButton: {
    width: '100%',
    backgroundColor: '#000000',
    borderRadius: 100,
    marginBottom: 16,
  },

  beginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },

  /* AUTO TEXT */
  autoText: {
    color: '#B5B5B5',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});
