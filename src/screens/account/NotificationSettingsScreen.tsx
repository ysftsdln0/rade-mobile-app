/**
 * NotificationSettingsScreen
 * 
 * Comprehensive notification preferences:
 * - Email notifications
 * - Push notifications
 * - SMS notifications
 * - Notification categories
 */
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '../../styles';
import { useTheme } from '../../utils/ThemeContext';
import { useLanguage } from '../../utils/LanguageContext';
import { 
  Card, 
  AlertBanner,
} from '../../components/common';

interface NotificationToggleProps {
  icon: string;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  iconColor?: string;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
  iconColor,
}) => {
  const { colors: themeColors } = useTheme();

  return (
    <View style={styles.toggleItem}>
      <View style={styles.toggleLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor || themeColors.primary}15` }]}>
          <Ionicons name={icon as any} size={24} color={iconColor || themeColors.primary} />
        </View>
        <View style={styles.toggleTextContainer}>
          <Text style={[styles.toggleTitle, { color: themeColors.text }]}>{title}</Text>
          <Text style={[styles.toggleSubtitle, { color: themeColors.textSecondary }]}>
            {subtitle}
          </Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.neutral[300], true: themeColors.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
};

const NotificationSettingsScreen = () => {
  const navigation = useNavigation<any>();
  const { colors: themeColors } = useTheme();
  const { t } = useLanguage();

  // Master toggles
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);

  // Service notifications
  const [serviceExpiry, setServiceExpiry] = useState(true);
  const [serviceRenewal, setServiceRenewal] = useState(true);
  const [serviceSuspension, setServiceSuspension] = useState(true);
  const [serviceActivation, setServiceActivation] = useState(true);

  // Billing notifications
  const [invoiceCreated, setInvoiceCreated] = useState(true);
  const [invoicePaid, setInvoicePaid] = useState(true);
  const [invoiceOverdue, setInvoiceOverdue] = useState(true);
  const [paymentFailed, setPaymentFailed] = useState(true);

  // Support notifications
  const [ticketCreated, setTicketCreated] = useState(true);
  const [ticketReply, setTicketReply] = useState(true);
  const [ticketClosed, setTicketClosed] = useState(true);

  // Security notifications
  const [loginAlert, setLoginAlert] = useState(true);
  const [passwordChange, setPasswordChange] = useState(true);
  const [twoFactorChange, setTwoFactorChange] = useState(true);

  // Marketing
  const [promotions, setPromotions] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [productUpdates, setProductUpdates] = useState(true);

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
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>Bildirim Ayarları</Text>
          <Text style={[styles.headerSubtitle, { color: themeColors.textSecondary }]}>
            Bildirim tercihlerinizi yönetin
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >

        {/* Info Alert */}
        <View style={styles.section}>
          <AlertBanner
            type="info"
            title="Bildirim İzni"
            message="Bazı bildirimler cihaz ayarlarından da yönetilebilir."
            dismissible={false}
          />
        </View>

        {/* Master Toggles */}
        <View style={styles.section}>
          <Card title="Bildirim Kanalları" variant="elevated">
            <NotificationToggle
              icon="mail"
              title="E-posta Bildirimleri"
              subtitle="E-posta ile bildirim al"
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              iconColor={colors.semantic.info}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationToggle
              icon="notifications"
              title="Push Bildirimleri"
              subtitle="Mobil cihazınıza anında bildirim"
              value={pushEnabled}
              onValueChange={setPushEnabled}
              iconColor={themeColors.primary}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationToggle
              icon="chatbox"
              title="SMS Bildirimleri"
              subtitle="Önemli bildirimleri SMS ile al"
              value={smsEnabled}
              onValueChange={setSmsEnabled}
              iconColor={colors.semantic.success}
            />
          </Card>
        </View>

        {/* Service Notifications */}
        <View style={styles.section}>
          <Card title="Hizmet Bildirimleri" variant="elevated">
            <NotificationToggle
              icon="time"
              title="Hizmet Sona Erme"
              subtitle="Hizmet bitiş tarihinden önce hatırlatma"
              value={serviceExpiry}
              onValueChange={setServiceExpiry}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationToggle
              icon="refresh"
              title="Otomatik Yenileme"
              subtitle="Hizmet yenilendiğinde bildirim"
              value={serviceRenewal}
              onValueChange={setServiceRenewal}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationToggle
              icon="pause-circle"
              title="Hizmet Askıya Alınması"
              subtitle="Hizmet askıya alındığında bildirim"
              value={serviceSuspension}
              onValueChange={setServiceSuspension}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationToggle
              icon="checkmark-circle"
              title="Hizmet Aktivasyonu"
              subtitle="Yeni hizmet aktif olduğunda bildirim"
              value={serviceActivation}
              onValueChange={setServiceActivation}
            />
          </Card>
        </View>

        {/* Billing Notifications */}
        <View style={styles.section}>
          <Card title="Fatura Bildirimleri" variant="elevated">
            <NotificationToggle
              icon="document-text"
              title="Yeni Fatura"
              subtitle="Yeni fatura oluşturulduğunda"
              value={invoiceCreated}
              onValueChange={setInvoiceCreated}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationToggle
              icon="checkmark-circle"
              title="Ödeme Alındı"
              subtitle="Ödeme başarıyla alındığında"
              value={invoicePaid}
              onValueChange={setInvoicePaid}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationToggle
              icon="alert-circle"
              title="Gecikmiş Fatura"
              subtitle="Fatura vadesi geçtiğinde"
              value={invoiceOverdue}
              onValueChange={setInvoiceOverdue}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationToggle
              icon="close-circle"
              title="Ödeme Hatası"
              subtitle="Ödeme başarısız olduğunda"
              value={paymentFailed}
              onValueChange={setPaymentFailed}
            />
          </Card>
        </View>

        {/* Support Notifications */}
        <View style={styles.section}>
          <Card title="Destek Bildirimleri" variant="elevated">
            <NotificationToggle
              icon="add-circle"
              title="Yeni Talep"
              subtitle="Destek talebi oluşturulduğunda"
              value={ticketCreated}
              onValueChange={setTicketCreated}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationToggle
              icon="chatbubble"
              title="Yeni Yanıt"
              subtitle="Destek ekibinden yanıt geldiğinde"
              value={ticketReply}
              onValueChange={setTicketReply}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationToggle
              icon="checkmark-done-circle"
              title="Talep Kapatıldı"
              subtitle="Destek talebi çözümlendiğinde"
              value={ticketClosed}
              onValueChange={setTicketClosed}
            />
          </Card>
        </View>

        {/* Security Notifications */}
        <View style={styles.section}>
          <Card title="Güvenlik Bildirimleri" variant="elevated">
            <NotificationToggle
              icon="shield-checkmark"
              title="Giriş Uyarıları"
              subtitle="Yeni cihazdan giriş yapıldığında"
              value={loginAlert}
              onValueChange={setLoginAlert}
              iconColor={colors.semantic.warning}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationToggle
              icon="key"
              title="Şifre Değişikliği"
              subtitle="Şifre değiştirildiğinde"
              value={passwordChange}
              onValueChange={setPasswordChange}
              iconColor={colors.semantic.warning}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationToggle
              icon="finger-print"
              title="2FA Değişikliği"
              subtitle="İki faktörlü doğrulama ayarları değiştiğinde"
              value={twoFactorChange}
              onValueChange={setTwoFactorChange}
              iconColor={colors.semantic.warning}
            />
          </Card>
        </View>

        {/* Marketing */}
        <View style={styles.section}>
          <Card title="Pazarlama & Güncellemeler" variant="elevated">
            <NotificationToggle
              icon="pricetag"
              title="Kampanyalar"
              subtitle="Özel teklifler ve indirimler"
              value={promotions}
              onValueChange={setPromotions}
              iconColor="#9333ea"
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationToggle
              icon="newspaper"
              title="Bülten"
              subtitle="Haftalık/aylık RADE bülteni"
              value={newsletter}
              onValueChange={setNewsletter}
              iconColor="#9333ea"
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationToggle
              icon="rocket"
              title="Ürün Güncellemeleri"
              subtitle="Yeni özellik ve hizmetler hakkında"
              value={productUpdates}
              onValueChange={setProductUpdates}
              iconColor="#9333ea"
            />
          </Card>
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
  section: {
    paddingHorizontal: spacing[5],
    marginBottom: spacing[4],
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[3],
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing[3],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  toggleSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    marginVertical: spacing[1],
  },
  spacer: {
    height: spacing[6],
  },
});

export default NotificationSettingsScreen;
