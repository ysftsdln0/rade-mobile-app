import React from 'react';
import {
  View,
  StyleSheet,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../styles';

interface AppHeaderProps {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  showLogo?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  leftContent,
  rightContent,
  showLogo = true,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[colors.primary[500], colors.primary[700]]}
      style={[styles.header, { paddingTop: insets.top }]}
    >
      <View style={styles.headerContent}>
        {/* Left Content */}
        <View style={styles.headerLeft}>
          {leftContent}
        </View>

        {/* Center Logo */}
        {showLogo && (
          <View style={styles.headerCenter}>
            <Image
              source={require('../../../assets/radelogo-beyaz.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Right Content */}
        <View style={styles.headerRight}>
          {rightContent}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logo: {
    width: 100,
    height: 40,
  },
});
