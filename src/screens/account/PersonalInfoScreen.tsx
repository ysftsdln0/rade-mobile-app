/**
 * PersonalInfoScreen
 * 
 * User profile information matching SecurityScreen design
 */
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '../../styles';
import { useTheme } from '../../utils/ThemeContext';
import { useAppSelector } from '../../store';
import { Avatar } from '../../components/common';

interface InfoItemProps {
  icon: string;
  title: string;
  value: string;
  onPress?: () => void;
  showChevron?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({ 
  icon, 
  title, 
  value,
  onPress,
  showChevron = false,
}) => {
  const { colors: themeColors } = useTheme();
  
  const content = (
    <View style={styles.infoItem}>
      <View style={styles.infoItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: themeColors.surfaceAlt }]}>
          <Ionicons name={icon as any} size={20} color={themeColors.text} />
        </View>
        <View style={styles.infoTextContainer}>
          <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>{title}</Text>
          <Text style={[styles.infoValue, { color: themeColors.text }]}>{value}</Text>
        </View>
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color={themeColors.textTertiary} />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const PersonalInfoScreen = () => {
  const navigation = useNavigation<any>();
  const { colors: themeColors } = useTheme();
  const { user } = useAppSelector((state) => state.auth);

  const initials = user 
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'U';

  const handleEditPersonalInfo = () => {
    Alert.alert(
      'Bilgileri Düzenle',
      'Profil düzenleme özelliği yakında eklenecek'
    );
  };

  const handleEditContact = () => {
    Alert.alert(
      'İletişim Bilgileri',
      'İletişim bilgileri düzenleme özelliği yakında eklenecek'
    );
  };

  const handleAvatarEdit = () => {
    Alert.alert(
      'Profil Fotoğrafı',
      'Profil fotoğrafı değiştirme özelliği yakında eklenecek',
      [
        { text: 'Kamera', onPress: () => {} },
        { text: 'Galeri', onPress: () => {} },
        { text: 'İptal', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={themeColors.text} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.headerTitle, { color: themeColors.text }]}>Kişisel Bilgiler</Text>
            <Text style={[styles.headerSubtitle, { color: themeColors.textSecondary }]}>
              Profil bilgilerinizi düzenleyin
            </Text>
          </View>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Avatar
            size="xl"
            initials={initials}
            source={user?.avatar}
            showEditButton
            onEditPress={handleAvatarEdit}
          />
          <Text style={[styles.avatarLabel, { color: themeColors.textSecondary }]}>
            Profil fotoğrafı
          </Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Kişisel Bilgiler</Text>
          <View style={[styles.card, { backgroundColor: themeColors.card }]}>
            <InfoItem
              icon="person-outline"
              title="Ad Soyad"
              value={`${user?.firstName || ''} ${user?.lastName || ''}`}
              onPress={handleEditPersonalInfo}
              showChevron
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <InfoItem
              icon="mail-outline"
              title="E-posta"
              value={user?.email || '-'}
            />
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>İletişim Bilgileri</Text>
          <View style={[styles.card, { backgroundColor: themeColors.card }]}>
            <InfoItem
              icon="business-outline"
              title="Şirket"
              value={user?.company || 'Belirtilmemiş'}
              onPress={handleEditContact}
              showChevron
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <InfoItem
              icon="call-outline"
              title="Telefon"
              value={user?.phone || 'Belirtilmemiş'}
              onPress={handleEditContact}
              showChevron
            />
          </View>
        </View>

        {/* Account Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Hesap Bilgileri</Text>
          <View style={[styles.card, { backgroundColor: themeColors.card }]}>
            <InfoItem
              icon="calendar-outline"
              title="Üyelik Tarihi"
              value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : '-'}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <InfoItem
              icon="time-outline"
              title="Son Giriş"
              value={user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('tr-TR') : '-'}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <View style={styles.infoItem}>
              <View style={styles.infoItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: themeColors.surfaceAlt }]}>
                  <Ionicons name="shield-checkmark-outline" size={20} color={themeColors.text} />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>Hesap Durumu</Text>
                  <View style={styles.statusBadge}>
                    <View style={[styles.statusDot, { backgroundColor: colors.semantic.success }]} />
                    <Text style={[styles.statusText, { color: colors.semantic.success }]}>Aktif</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing[10],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[6],
    paddingBottom: spacing[4],
  },
  backButton: {
    padding: spacing[2],
    marginRight: spacing[2],
    marginLeft: -spacing[2],
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing[1],
  },
  headerSubtitle: {
    fontSize: 16,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing[6],
  },
  avatarLabel: {
    fontSize: 14,
    marginTop: spacing[3],
  },
  section: {
    paddingHorizontal: spacing[5],
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing[3],
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
  },
  infoItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginLeft: spacing[4] + 40 + spacing[3],
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  spacer: {
    height: spacing[6],
  },
});

export default PersonalInfoScreen;
