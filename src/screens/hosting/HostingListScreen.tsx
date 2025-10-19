import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import AppCard from '../../components/common/AppCard';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { apiService } from '../../services/api';
import { HostingPackage } from '../../types';
import { COLORS, FONT_SIZES, SPACING } from '../../constants';
import { useTheme } from '../../utils/ThemeContext';

const statusMeta = {
	active: { label: 'Aktif', color: COLORS.success.main },
	suspended: { label: 'Askıda', color: COLORS.warning.main },
	expired: { label: 'Süresi Dolmuş', color: COLORS.error.main },
	pending: { label: 'Beklemede', color: COLORS.info.main },
} as const;

const packageLabel = {
	shared: 'Shared Hosting',
	vps: 'VPS',
	dedicated: 'Dedicated',
} as const;

const HostingListScreen: React.FC = () => {
	const navigation = useNavigation<any>();
	const { colors: themeColors } = useTheme();

	const hostingQuery = useQuery({
		queryKey: ['hostingPackages'],
		queryFn: async () => {
			const response = await apiService.getHostingPackages();
			return response.data as HostingPackage[];
		},
	});

	if (hostingQuery.isLoading) {
		return <LoadingState message="Hosting paketleri yükleniyor..." />;
	}

	if (hostingQuery.isError) {
		return (
			<EmptyState
				icon="warning-outline"
				title="Hosting paketleri alınamadı"
				description="Lütfen bağlantınızı kontrol ederek tekrar deneyin."
			/>
		);
	}

	const packages = hostingQuery.data || [];

	if (packages.length === 0) {
		return (
			<EmptyState
				icon="server-outline"
				title="Henüz hosting paketiniz yok"
				description="Yeni bir paket satın aldıktan sonra bu alanda listelenecek."
			/>
		);
	}

	return (
		<ScrollView style={[styles.container, { backgroundColor: themeColors.background }]} contentContainerStyle={styles.content}>
			{packages.map((item) => {
				const status = statusMeta[item.status] ?? statusMeta.pending;
				return (
					<AppCard
						key={item.id}
						style={styles.card}
						onPress={() => navigation.navigate('HostingDetails', { hostingId: item.id })}
					>
						<View style={styles.headerRow}>
							<Text style={[styles.title, { color: themeColors.text }]}>{item.name}</Text>
							<View style={[styles.badge, { backgroundColor: `${status.color}20` }]}>
								<Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
							</View>
						</View>
						<Text style={[styles.domain, { color: themeColors.textSecondary }]}>{item.domain}</Text>
									<View style={styles.metaRow}>
										<Text style={[styles.metaLabel, { color: themeColors.textSecondary }]}>Paket Türü</Text>
										<Text style={[styles.metaValue, { color: themeColors.text }]}>{packageLabel[item.packageType] ?? item.packageType}</Text>
									</View>
									<View style={styles.metaRow}>
										<Text style={[styles.metaLabel, { color: themeColors.textSecondary }]}>Disk Kullanımı</Text>
										<Text style={[styles.metaValue, { color: themeColors.text }]}>
											{item.diskUsage} / {item.diskLimit} GB
										</Text>
									</View>
									<View style={styles.metaRow}>
										<Text style={[styles.metaLabel, { color: themeColors.textSecondary }]}>Bant Genişliği</Text>
										<Text style={[styles.metaValue, { color: themeColors.text }]}>
											{item.bandwidthUsage} / {item.bandwidthLimit} GB
										</Text>
									</View>
									<View style={styles.metaRow}>
										<Text style={[styles.metaLabel, { color: themeColors.textSecondary }]}>Bitiş Tarihi</Text>
										<Text style={[styles.metaValue, { color: themeColors.text }]}>{formatDate(item.expiryDate)}</Text>
									</View>
					</AppCard>
				);
			})}
		</ScrollView>
	);
};

const formatDate = (date: string) => {
	const d = new Date(date);
	if (Number.isNaN(d.getTime())) return '-';
	return d.toLocaleDateString('tr-TR', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		padding: SPACING.lg,
	},
	card: {
		marginBottom: SPACING.lg,
	},
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	title: {
		fontSize: FONT_SIZES.lg,
		fontWeight: '700',
	},
	domain: {
		marginTop: SPACING.sm,
		fontSize: FONT_SIZES.md,
	},
	badge: {
		paddingHorizontal: SPACING.md,
		paddingVertical: 6,
		borderRadius: 24,
	},
	badgeText: {
		fontSize: FONT_SIZES.xs,
		fontWeight: '700',
		textTransform: 'uppercase',
	},
	metaRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: SPACING.sm,
	},
	metaLabel: {
		fontSize: FONT_SIZES.sm,
	},
	metaValue: {
		fontSize: FONT_SIZES.sm,
		fontWeight: '600',
	},
});

export default HostingListScreen;
