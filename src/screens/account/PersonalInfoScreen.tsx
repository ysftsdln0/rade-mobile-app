/**
 * PersonalInfoScreen
 * 
 * User profile editing screen:
 * - Edit personal information
 * - Change avatar
 * - Update contact details
 */
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { colors, spacing } from '../../styles';
import { useTheme } from '../../utils/ThemeContext';
import { useAppSelector } from '../../store';
import { 
  Card, 
  TextInput, 
  Button,
  Avatar,
} from '../../components/common';

const phoneRegex = /^\+?[0-9\s-]{7,}$/;

const profileSchema = z.object({
  firstName: z.string().min(1, 'Ad zorunlu'),
  lastName: z.string().min(1, 'Soyad zorunlu'),
  email: z.string().email('Geçerli bir e-posta girin'),
  company: z.string().max(100).optional(),
  phone: z
    .string()
    .optional()
    .refine((value) => !value || phoneRegex.test(value ?? ''), {
      message: 'Geçerli bir telefon numarası girin',
    }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const PersonalInfoScreen = () => {
  const navigation = useNavigation<any>();
  const { colors: themeColors } = useTheme();
  const { user } = useAppSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      company: user?.company || '',
      phone: user?.phone || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        company: user.company || '',
        phone: user.phone || '',
      });
    }
  }, [user, reset]);

  const initials = user 
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'U';

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      // API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Başarılı', 'Profiliniz başarıyla güncellendi');
    } catch (error) {
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu');
    }
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

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >

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

        {/* Personal Information Form */}
        <View style={styles.section}>
          <Card title="Kişisel Bilgiler" variant="elevated">
            <View style={styles.row}>
              <View style={[styles.halfInput, { marginRight: spacing[2] }]}>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="AD"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Adınız"
                      error={errors.firstName?.message}
                      icon={<Ionicons name="person-outline" size={20} color={themeColors.textSecondary} />}
                    />
                  )}
                />
              </View>
              <View style={styles.halfInput}>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="SOYAD"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Soyadınız"
                      error={errors.lastName?.message}
                      icon={<Ionicons name="person-outline" size={20} color={themeColors.textSecondary} />}
                    />
                  )}
                />
              </View>
            </View>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="E-POSTA"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="ornek@mail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message}
                  icon={<Ionicons name="mail-outline" size={20} color={themeColors.textSecondary} />}
                  editable={false}
                  containerStyle={{ opacity: 0.6 }}
                />
              )}
            />
            <Text style={[styles.helperText, { color: themeColors.textTertiary }]}>
              E-posta adresi değiştirilemez
            </Text>
          </Card>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Card title="İletişim Bilgileri" variant="elevated">
            <Controller
              control={control}
              name="company"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="ŞİRKET (Opsiyonel)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Şirket adı"
                  error={errors.company?.message}
                  icon={<Ionicons name="business-outline" size={20} color={themeColors.textSecondary} />}
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="TELEFON (Opsiyonel)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="+90 5XX XXX XX XX"
                  keyboardType="phone-pad"
                  error={errors.phone?.message}
                  icon={<Ionicons name="call-outline" size={20} color={themeColors.textSecondary} />}
                />
              )}
            />
          </Card>
        </View>

        {/* Account Information */}
        <View style={styles.section}>
          <Card title="Hesap Bilgileri" variant="default">
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
                Üyelik Tarihi
              </Text>
              <Text style={[styles.infoValue, { color: themeColors.text }]}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : '-'}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
                Son Giriş
              </Text>
              <Text style={[styles.infoValue, { color: themeColors.text }]}>
                {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('tr-TR') : '-'}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
                Hesap Durumu
              </Text>
              <View style={styles.statusBadge}>
                <View style={[styles.statusDot, { backgroundColor: colors.semantic.success }]} />
                <Text style={[styles.statusText, { color: colors.semantic.success }]}>Aktif</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Save Button */}
        <View style={styles.section}>
          <Button
            label={isSubmitting ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            variant="gradient"
            size="lg"
            onPress={handleSubmit(onSubmit)}
            disabled={!isDirty || isSubmitting}
            loading={isSubmitting}
            fullWidth
          />
          
          {isDirty && (
            <Button
              label="İptal"
              variant="secondary"
              size="lg"
              onPress={() => reset()}
              disabled={isSubmitting}
              fullWidth
              style={{ marginTop: spacing[2] }}
            />
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
  },
  backButton: {
    padding: spacing[2],
    marginRight: spacing[2],
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
    fontSize: 15,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing[10],
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
    marginBottom: spacing[4],
  },
  row: {
    flexDirection: 'row',
    marginBottom: spacing[3],
  },
  halfInput: {
    flex: 1,
  },
  helperText: {
    fontSize: 12,
    marginTop: -spacing[2],
    marginBottom: spacing[3],
    marginLeft: spacing[1],
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[3],
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    height: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
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
