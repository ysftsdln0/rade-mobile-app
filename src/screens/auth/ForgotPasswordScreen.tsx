import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../styles';
import { useTheme } from '../../utils/ThemeContext';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<any>();
  const { colors: themeColors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>Şifre Sıfırlama</Text>
      <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>Henüz geliştirilme aşamasında</Text>
      
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: themeColors.primary }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Geri Dön</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;