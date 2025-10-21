/**
 * Component Showcase Screen
 * Displays enhanced UI components
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles';
import { SPACING } from '../constants';
import { useTheme } from '../utils/ThemeContext';
import {
  Button,
  Badge,
  Chip,
  Progress,
  Rating,
  Card,
  AlertBanner,
} from '../components/common';

export const ComponentShowcaseScreen: React.FC = () => {
  const [selectedChips, setSelectedChips] = useState<string[]>(['modern']);
  const [rating, setRating] = useState(4);
  const { colors: themeColors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.text }]}>UI Components</Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>Production-Ready Design System</Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Buttons</Text>
          <Card style={styles.card}>
            <View style={styles.buttonRow}>
              <Button
                label="Primary"
                variant="primary"
                size="sm"
                onPress={() => {}}
              />
              <Button
                label="Secondary"
                variant="secondary"
                size="sm"
                onPress={() => {}}
              />
              <Button
                label="Danger"
                variant="danger"
                size="sm"
                onPress={() => {}}
              />
            </View>
            <View style={styles.spacer} />
            <Button label="Loading..." loading onPress={() => {}} />
          </Card>
        </View>

        {/* Badges Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Badges</Text>
          <Card style={styles.card}>
            <View style={styles.badgeRow}>
              <Badge label="Active" variant="success" />
              <Badge label="Pending" variant="warning" />
              <Badge label="Error" variant="error" />
              <Badge label="Info" variant="info" />
            </View>
          </Card>
        </View>

        {/* Chips Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Chips</Text>
          <Card style={styles.card}>
            <View style={styles.chipContainer}>
              {['modern', 'professional', 'responsive'].map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  selected={selectedChips.includes(tag)}
                  onPress={() => {
                    setSelectedChips((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  variant="outlined"
                />
              ))}
            </View>
          </Card>
        </View>

        {/* Progress Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Progress</Text>
          <Card style={styles.card}>
            <Progress progress={30} showLabel />
            <View style={styles.spacer} />
            <Progress progress={60} showLabel />
            <View style={styles.spacer} />
            <Progress progress={100} showLabel />
          </Card>
        </View>

        {/* Rating Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Rating</Text>
          <Card style={styles.card}>
            <Rating
              value={rating}
              onChange={setRating}
              interactive
              showLabel
              size="lg"
            />
            <View style={styles.spacer} />
            <Rating value={4.5} showLabel size="md" />
          </Card>
        </View>

        {/* Alerts Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Alerts</Text>
          <View style={styles.alertContainer}>
            <AlertBanner
              type="success"
              title="Success"
              message="Operation completed successfully"
            />
            <AlertBanner
              type="warning"
              title="Warning"
              message="Please review before proceeding"
            />
            <AlertBanner
              type="error"
              title="Error"
              message="Something went wrong"
            />
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Features</Text>
          <Card style={styles.card}>
            {[
              { icon: 'checkmark-circle', label: '✓ Material Design 3' },
              { icon: 'checkmark-circle', label: '✓ React Native Paper' },
              { icon: 'checkmark-circle', label: '✓ Smooth Animations' },
              { icon: 'checkmark-circle', label: '✓ Dark Mode Ready' },
            ].map((feature, idx) => (
              <View key={idx} style={styles.featureItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.semantic.success}
                  style={styles.featureIcon}
                />
                <Text style={[styles.featureText, { color: themeColors.text }]}>{feature.label}</Text>
              </View>
            ))}
          </Card>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
            Ready for Production Deployment
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: colors.primary[500],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.neutral[50],
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  card: {
    marginBottom: SPACING.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    flexWrap: 'wrap',
  },
  chipContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  spacer: {
    height: SPACING.md,
  },
  alertContainer: {
    gap: SPACING.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  featureIcon: {
    marginRight: SPACING.md,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ComponentShowcaseScreen;
