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

const statusMeta = {
	active: { label: 'Aktif', color: COLORS.success },
	suspended: { label: 'Askıda', color: COLORS.warning },
	expired: { label: 'Süresi Dolmuş', color: COLORS.error },
	pending: { label: 'Beklemede', color: COLORS.info },
} as const;

const packageLabel = {
	shared: 'Shared Hosting',
	vps: 'VPS',
	dedicated: 'Dedicated',
} as const;

const HostingListScreen: React.FC = () => {
	const navigation = useNavigation<any>();

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
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			{packages.map((item) => {
				const status = statusMeta[item.status] ?? statusMeta.pending;
				return (
					<AppCard
						key={item.id}
						style={styles.card}
						onPress={() => navigation.navigate('HostingDetails', { hostingId: item.id })}
					>
						<View style={styles.headerRow}>
							<Text style={styles.title}>{item.name}</Text>
							<View style={[styles.badge, { backgroundColor: `${status.color}20` }]}>
								<Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
							</View>
						</View>
						<Text style={styles.domain}>{item.domain}</Text>
									<View style={styles.metaRow}>
										<Text style={styles.metaLabel}>Paket Türü</Text>
										<Text style={styles.metaValue}>{packageLabel[item.packageType] ?? item.packageType}</Text>
									</View>
									<View style={styles.metaRow}>
										<Text style={styles.metaLabel}>Disk Kullanımı</Text>
										<Text style={styles.metaValue}>
											{item.diskUsage} / {item.diskLimit} GB
										</Text>
									</View>
									<View style={styles.metaRow}>
										<Text style={styles.metaLabel}>Bant Genişliği</Text>
										<Text style={styles.metaValue}>
											{item.bandwidthUsage} / {item.bandwidthLimit} GB
										</Text>
									</View>
									<View style={styles.metaRow}>
										<Text style={styles.metaLabel}>Bitiş Tarihi</Text>
										<Text style={styles.metaValue}>{formatDate(item.expiryDate)}</Text>
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
		backgroundColor: COLORS.background,
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
		color: COLORS.textPrimary,
	},
	domain: {
		marginTop: SPACING.sm,
		fontSize: FONT_SIZES.md,
		color: COLORS.textSecondary,
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
		color: COLORS.textSecondary,
		fontSize: FONT_SIZES.sm,
	},
	metaValue: {
		color: COLORS.textPrimary,
		fontSize: FONT_SIZES.sm,
		fontWeight: '600',
	},
});

export default HostingListScreen;
