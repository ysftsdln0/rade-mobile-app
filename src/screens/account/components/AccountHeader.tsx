import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FONT_SIZES, BORDER_RADIUS, SPACING } from '../../../constants';
import { colors } from '../../../styles/colors';

type Props = {
  displayName: string;
  email: string;
  initials: string;
  lastLoginText?: string;
};

export const AccountHeader: React.FC<Props> = ({ displayName, email, initials, lastLoginText }) => {
  return (
    <LinearGradient
      colors={[colors.primary[500], colors.accent.gradient_end]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.headerCard}
    >
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.headerContent}>
        <Text style={styles.headerName}>{displayName}</Text>
        <Text style={styles.headerEmail}>{email}</Text>
        {lastLoginText ? <Text style={styles.lastLoginText}>{lastLoginText}</Text> : null}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 22,
  },
  headerContent: {
    flex: 1,
  },
  headerName: {
    color: '#FFF',
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
  },
  headerEmail: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FONT_SIZES.sm,
    marginTop: 4,
  },
  lastLoginText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONT_SIZES.xs,
    marginTop: 6,
  },
});
