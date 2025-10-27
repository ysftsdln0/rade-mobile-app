import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  source?: string;
  initials?: string;
  showEditButton?: boolean;
  onEditPress?: () => void;
  containerStyle?: ViewStyle;
  testID?: string;
}

/**
 * Avatar Component
 * 
 * Professional user avatar with initials fallback and edit functionality.
 * 
 * Features:
 * - Image display with URI source
 * - Initials fallback when no image
 * - Multiple sizes (sm, md, lg, xl)
 * - Optional edit button overlay
 * - Peach/salmon background for initials
 * 
 * @example
 * <Avatar 
 *   initials="AT"
 *   size="xl"
 *   showEditButton
 *   onEditPress={() => handleEditAvatar()}
 * />
 */
export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  source,
  initials = '??',
  showEditButton = false,
  onEditPress,
  containerStyle,
  testID,
}) => {
  const sizeStyles = styles[`avatar_${size}`];
  const textStyles = styles[`text_${size}`];
  const buttonStyles = styles[`editButton_${size}`];

  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      <View style={[styles.avatar, sizeStyles, !source && styles.avatarPlaceholder]}>
        {source ? (
          <Image source={{ uri: source }} style={[styles.image, sizeStyles]} />
        ) : (
          <Text style={[styles.initials, textStyles]}>{initials.toUpperCase()}</Text>
        )}
      </View>
      
      {showEditButton && onEditPress && (
        <TouchableOpacity
          style={[styles.editButton, buttonStyles]}
          onPress={onEditPress}
          activeOpacity={0.8}
        >
          <Ionicons name="pencil" size={size === 'xl' ? 20 : 16} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    borderRadius: 9999,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral[200],
  },
  avatarPlaceholder: {
    backgroundColor: '#E8B4A0', // Peach/Salmon color from Figma
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  editButton: {
    position: 'absolute',
    backgroundColor: colors.primary[500],
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  
  // Sizes - Avatar
  avatar_sm: {
    width: 40,
    height: 40,
  },
  avatar_md: {
    width: 60,
    height: 60,
  },
  avatar_lg: {
    width: 80,
    height: 80,
  },
  avatar_xl: {
    width: 140,
    height: 140,
  },
  
  // Sizes - Text
  text_sm: {
    fontSize: 16,
  },
  text_md: {
    fontSize: 22,
  },
  text_lg: {
    fontSize: 28,
  },
  text_xl: {
    fontSize: 48,
  },
  
  // Sizes - Edit Button
  editButton_sm: {
    width: 24,
    height: 24,
    right: 0,
    bottom: 0,
  },
  editButton_md: {
    width: 28,
    height: 28,
    right: 2,
    bottom: 2,
  },
  editButton_lg: {
    width: 32,
    height: 32,
    right: 4,
    bottom: 4,
  },
  editButton_xl: {
    width: 48,
    height: 48,
    right: 8,
    bottom: 8,
  },
});
