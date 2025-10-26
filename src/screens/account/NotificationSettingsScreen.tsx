/**
 * NotificationSettingsScreen
 * 
 * Notification preferences matching ProfileScreen design
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../styles';
import { useTheme } from '../../utils/ThemeContext';

interface NotificationItemProps {
  icon: string;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  iconColor?: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  icon, 
  title, 
  subtitle,
  value,
  onValueChange,
  iconColor,
}) => {
  const { colors: themeColors } = useTheme();
  
  return (
    <View style={styles.notificationItem}>
      <View style={styles.notificationItemLeft}>
        <Ionicons name={icon as any} size={20} color={iconColor || themeColors.text} style={styles.itemIcon} />
        <View style={styles.notificationTextContainer}>
          <Text style={[styles.notificationItemText, { color: themeColors.text }]}>{title}</Text>
          <Text style={[styles.notificationItemSubtitle, { color: themeColors.textSecondary }]}>
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

  // Channel preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // Service notifications
  const [serviceExpiry, setServiceExpiry] = useState(true);
  const [serviceRenewal, setServiceRenewal] = useState(true);
  const [serviceSuspension, setServiceSuspension] = useState(true);

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
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [passwordChange, setPasswordChange] = useState(true);
  const [twoFactorChange, setTwoFactorChange] = useState(true);

  // Marketing
  const [promotions, setPromotions] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

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
            <Text style={[styles.headerTitle, { color: themeColors.text }]}>Bildirimler</Text>
            <Text style={[styles.headerSubtitle, { color: themeColors.textSecondary }]}>
              Bildirim tercihlerinizi yönetin
            </Text>
          </View>
        </View>

        {/* Notification Channels */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Bildirim Kanalları</Text>
          <View style={[styles.card, { backgroundColor: themeColors.card }]}>
            <NotificationItem
              icon="mail-outline"
              title="E-posta Bildirimleri"
              subtitle="E-posta ile bildirim al"
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              iconColor={colors.primary[500]}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationItem
              icon="notifications-outline"
              title="Push Bildirimleri"
              subtitle="Mobil bildirim al"
              value={pushNotifications}
              onValueChange={setPushNotifications}
              iconColor={colors.primary[500]}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationItem
              icon="chatbubble-outline"
              title="SMS Bildirimleri"
              subtitle="SMS ile bildirim al"
              value={smsNotifications}
              onValueChange={setSmsNotifications}
              iconColor={colors.primary[500]}
            />
          </View>
        </View>

        {/* Service Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Hizmet Bildirimleri</Text>
          <View style={[styles.card, { backgroundColor: themeColors.card }]}>
            <NotificationItem
              icon="calendar-outline"
              title="Hizmet Süresi"
              subtitle="Süre dolmadan 7 gün önce hatırlat"
              value={serviceExpiry}
              onValueChange={setServiceExpiry}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationItem
              icon="refresh-outline"
              title="Otomatik Yenileme"
              subtitle="Yenileme işlemlerinden haberdar ol"
              value={serviceRenewal}
              onValueChange={setServiceRenewal}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationItem
              icon="pause-outline"
              title="Hizmet Askıya Alma"
              subtitle="Askıya alınma durumunda bildir"
              value={serviceSuspension}
              onValueChange={setServiceSuspension}
            />
          </View>
        </View>

        {/* Billing Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Fatura Bildirimleri</Text>
          <View style={[styles.card, { backgroundColor: themeColors.card }]}>
            <NotificationItem
              icon="document-text-outline"
              title="Yeni Fatura"
              subtitle="Fatura oluşturulduğunda bildir"
              value={invoiceCreated}
              onValueChange={setInvoiceCreated}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationItem
              icon="checkmark-circle-outline"
              title="Ödeme Alındı"
              subtitle="Ödeme tamamlandığında bildir"
              value={invoicePaid}
              onValueChange={setInvoicePaid}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationItem
              icon="time-outline"
              title="Geciken Ödemeler"
              subtitle="Ödeme tarihi geçtiğinde hatırlat"
              value={invoiceOverdue}
              onValueChange={setInvoiceOverdue}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationItem
              icon="close-circle-outline"
              title="Başarısız Ödeme"
              subtitle="Ödeme başarısız olduğunda bildir"
              value={paymentFailed}
              onValueChange={setPaymentFailed}
            />
          </View>
        </View>

        {/* Support Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Destek Bildirimleri</Text>
          <View style={[styles.card, { backgroundColor: themeColors.card }]}>
            <NotificationItem
              icon="create-outline"
              title="Yeni Ticket"
              subtitle="Ticket oluşturulduğunda bildir"
              value={ticketCreated}
              onValueChange={setTicketCreated}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationItem
              icon="chatbubbles-outline"
              title="Yanıt Geldi"
              subtitle="Destek yanıt verdiğinde bildir"
              value={ticketReply}
              onValueChange={setTicketReply}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationItem
              icon="checkmark-done-outline"
              title="Ticket Kapatıldı"
              subtitle="Ticket çözüldüğünde bildir"
              value={ticketClosed}
              onValueChange={setTicketClosed}
            />
          </View>
        </View>

        {/* Security Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Güvenlik Bildirimleri</Text>
          <View style={[styles.card, { backgroundColor: themeColors.card }]}>
            <NotificationItem
              icon="log-in-outline"
              title="Yeni Giriş"
              subtitle="Hesabınıza giriş yapıldığında bildir"
              value={loginAlerts}
              onValueChange={setLoginAlerts}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationItem
              icon="key-outline"
              title="Şifre Değişikliği"
              subtitle="Şifre değiştirildiğinde bildir"
              value={passwordChange}
              onValueChange={setPasswordChange}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationItem
              icon="shield-checkmark-outline"
              title="2FA Değişikliği"
              subtitle="2FA ayarları değiştiğinde bildir"
              value={twoFactorChange}
              onValueChange={setTwoFactorChange}
            />
          </View>
        </View>

        {/* Marketing */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Pazarlama</Text>
          <View style={[styles.card, { backgroundColor: themeColors.card }]}>
            <NotificationItem
              icon="pricetag-outline"
              title="Promosyonlar"
              subtitle="İndirim ve kampanyalardan haberdar ol"
              value={promotions}
              onValueChange={setPromotions}
            />
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <NotificationItem
              icon="newspaper-outline"
              title="Bülten"
              subtitle="Haftalık bülten al"
              value={newsletter}
              onValueChange={setNewsletter}
            />
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
    paddingBottom: spacing[6],
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
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
  },
  notificationItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing[3],
  },
  itemIcon: {
    marginRight: spacing[3],
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  notificationItemSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginLeft: spacing[4],
  },
  spacer: {
    height: spacing[6],
  },
});

export default NotificationSettingsScreen;
