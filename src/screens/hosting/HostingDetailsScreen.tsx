import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import AppCard from '../../components/common/AppCard';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { apiService } from '../../services/api';
import { COLORS, FONT_SIZES, SPACING } from '../../constants';
import { ServicesStackParamList } from '../../types';

interface HostingDetailsResponse {
	id: string;
	name: string;
	domain: string;
	packageType: string;
	status: string;
	createdAt: string;
	expiryDate: string;
	ipAddress: string;
	nameservers: string[];
	autoRenew: boolean;
	features: string[];
}

interface HostingUsageResponse {
	disk: {
		used: number;
		total: number;
	};
	bandwidth: {
		used: number;
		total: number;
	};
	databases: number;
	ftpAccounts: number;
	emailAccounts: number;
	backupsEnabled: boolean;
}

type HostingDetailsRoute = RouteProp<ServicesStackParamList, 'HostingDetails'>;

const HostingDetailsScreen: React.FC = () => {
	const route = useRoute<HostingDetailsRoute>();
	const { hostingId } = route.params;

	const detailsQuery = useQuery({
		queryKey: ['hostingDetails', hostingId],
		queryFn: async () => {
			const response = await apiService.getHostingDetails(hostingId);
			return response.data as HostingDetailsResponse;
		},
	});

	const usageQuery = useQuery({
		queryKey: ['hostingUsage', hostingId],
		queryFn: async () => {
			const response = await apiService.getHostingUsage(hostingId);
			return response.data as HostingUsageResponse;
		},
		enabled: detailsQuery.isSuccess,
		staleTime: 1000 * 60,
		refetchInterval: 1000 * 60,
	});

	const isLoading = detailsQuery.isLoading || usageQuery.isLoading;

	if (isLoading) {
		return <LoadingState message="Hosting detayları yükleniyor..." />;
	}

	if (detailsQuery.isError || usageQuery.isError || !detailsQuery.data) {
		return (
			<EmptyState
				icon="warning-outline"
				title="Hosting bilgileri alınamadı"
				description="Sayfayı yenileyerek tekrar deneyebilirsiniz."
			/>
		);
	}

	const details = detailsQuery.data;
	const usage = usageQuery.data;

	const statusMeta = useMemo(() => {
		switch (details.status) {
			case 'active':
				return { label: 'Aktif', color: COLORS.success };
			case 'suspended':
				return { label: 'Askıda', color: COLORS.warning };
			case 'expired':
				return { label: 'Süresi Dolmuş', color: COLORS.error };
			default:
				return { label: 'Beklemede', color: COLORS.info };
		}
	}, [details.status]);

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			<AppCard style={styles.card}>
				<View style={styles.headerRow}>
					<Text style={styles.title}>{details.name}</Text>
					<View style={[styles.badge, { backgroundColor: `${statusMeta.color}20` }]}>
						<Text style={[styles.badgeText, { color: statusMeta.color }]}>{statusMeta.label}</Text>
					</View>
				</View>
				<Text style={styles.domain}>{details.domain}</Text>
				<View style={styles.metaRow}>
					<Text style={styles.metaLabel}>Paket Türü</Text>
					<Text style={styles.metaValue}>{details.packageType}</Text>
				</View>
				<View style={styles.metaRow}>
					<Text style={styles.metaLabel}>IP Adresi</Text>
					<Text style={styles.metaValue}>{details.ipAddress}</Text>
				</View>
				<View style={styles.metaRow}>
					<Text style={styles.metaLabel}>Oluşturulma</Text>
					<Text style={styles.metaValue}>{formatDate(details.createdAt)}</Text>
				</View>
				<View style={styles.metaRow}>
					<Text style={styles.metaLabel}>Bitiş Tarihi</Text>
					<Text style={styles.metaValue}>{formatDate(details.expiryDate)}</Text>
				</View>
				<View style={styles.metaRow}>
					<Text style={styles.metaLabel}>Otomatik Yenileme</Text>
					<Text style={styles.metaValue}>{details.autoRenew ? 'Açık' : 'Kapalı'}</Text>
				</View>
			</AppCard>

			{usage ? (
				<AppCard style={styles.card}>
					<Text style={styles.sectionTitle}>Kaynak Kullanımı</Text>
					<ResourceBar label="Disk" used={usage.disk.used} total={usage.disk.total} unit="GB" />
					<ResourceBar label="Bant Genişliği" used={usage.bandwidth.used} total={usage.bandwidth.total} unit="GB" />
					<View style={styles.quickStatsRow}>
						<QuickStat label="Veritabanı" value={`${usage.databases}`} />
						<QuickStat label="FTP Hesabı" value={`${usage.ftpAccounts}`} />
						<QuickStat label="E-posta" value={`${usage.emailAccounts}`} />
					</View>
					<Text style={styles.metaLabel}>Yedekleme</Text>
					<Text style={styles.metaValue}>{usage.backupsEnabled ? 'Aktif' : 'Pasif'}</Text>
				</AppCard>
			) : null}

			<AppCard style={styles.card}>
				<Text style={styles.sectionTitle}>Nameserver Bilgileri</Text>
				{details.nameservers.map((ns) => (
					<Text key={ns} style={styles.listItem}>{ns}</Text>
				))}
			</AppCard>

			<AppCard style={styles.card}>
				<Text style={styles.sectionTitle}>Paket Özellikleri</Text>
				{details.features.map((feature) => (
					<Text key={feature} style={styles.listItem}>• {feature}</Text>
				))}
			</AppCard>
		</ScrollView>
	);
};

const ResourceBar: React.FC<{ label: string; used: number; total: number; unit?: string }> = ({
	label,
	used,
	total,
	unit,
}) => {
	const ratio = total > 0 ? Math.min(1, used / total) : 0;
	return (
		<View style={styles.resourceContainer}>
			<View style={styles.resourceHeader}>
				<Text style={styles.metaLabel}>{label}</Text>
				<Text style={styles.metaValue}>
					{used} / {total} {unit}
				</Text>
			</View>
			<View style={styles.progressTrack}>
				<View style={[styles.progressBar, { width: `${ratio * 100}%` }]} />
			</View>
		</View>
	);
};

const QuickStat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
	<View style={styles.quickStat}>
		<Text style={styles.quickStatValue}>{value}</Text>
		<Text style={styles.quickStatLabel}>{label}</Text>
	</View>
);

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
		paddingBottom: SPACING.xxl,
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
	sectionTitle: {
		fontSize: FONT_SIZES.lg,
		fontWeight: '700',
		marginBottom: SPACING.md,
		color: COLORS.textPrimary,
	},
	listItem: {
		fontSize: FONT_SIZES.sm,
		color: COLORS.textSecondary,
		marginBottom: SPACING.xs,
	},
	resourceContainer: {
		marginBottom: SPACING.md,
	},
	resourceHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: SPACING.xs,
	},
	progressTrack: {
		height: 8,
		backgroundColor: COLORS.gray200,
		borderRadius: 4,
		overflow: 'hidden',
	},
	progressBar: {
		height: '100%',
		backgroundColor: COLORS.primary,
		borderRadius: 4,
	},
	quickStatsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: SPACING.md,
	},
	quickStat: {
		alignItems: 'center',
		flex: 1,
	},
	quickStatValue: {
		fontSize: FONT_SIZES.lg,
		fontWeight: '700',
		color: COLORS.textPrimary,
	},
	quickStatLabel: {
		marginTop: SPACING.xs,
		fontSize: FONT_SIZES.xs,
		color: COLORS.textSecondary,
		textTransform: 'uppercase',
	},
});

export default HostingDetailsScreen;
