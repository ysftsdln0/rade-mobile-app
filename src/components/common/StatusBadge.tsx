import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../utils/ThemeContext';

type StatusType = 'active' | 'pending' | 'suspended' | 'cancelled' | 'expired' | 'open' | 'resolved' | 'closed';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

const STATUS_CONFIG: Record<StatusType, { label: string; color: string; bgColor: string }> = {
  active: {
    label: 'Aktif',
    color: '#4CAF50',
    bgColor: '#E8F5E9',
  },
  pending: {
    label: 'Beklemede',
    color: '#FF9800',
    bgColor: '#FFF3E0',
  },
  suspended: {
    label: 'Askıda',
    color: '#F44336',
    bgColor: '#FFEBEE',
  },
  cancelled: {
    label: 'İptal',
    color: '#9E9E9E',
    bgColor: '#F5F5F5',
  },
  expired: {
    label: 'Süresi Dolmuş',
    color: '#F44336',
    bgColor: '#FFEBEE',
  },
  open: {
    label: 'Açık',
    color: '#2196F3',
    bgColor: '#E3F2FD',
  },
  resolved: {
    label: 'Çözüldü',
    color: '#4CAF50',
    bgColor: '#E8F5E9',
  },
  closed: {
    label: 'Kapalı',
    color: '#9E9E9E',
    bgColor: '#F5F5F5',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const config = STATUS_CONFIG[status];
  const { isDark } = useTheme();

  const bgColor = isDark ? `${config.color}20` : config.bgColor;

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.label, { color: config.color }]}>
        {label || config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
