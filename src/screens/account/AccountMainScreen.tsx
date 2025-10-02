import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../../constants';
import { apiService } from '../../services/api';
import { updateProfileAsync, logoutAsync } from '../../store/authThunks';
import { storageService } from '../../services/storage';
import { setBiometricEnabled } from '../../store/authSlice';

const AccountMainScreen = () => {
	const dispatch = useAppDispatch();
	const { user, isLoading, biometricEnabled } = useAppSelector(s => s.auth);
	const [firstName, setFirstName] = useState(user?.firstName || '');
	const [lastName, setLastName] = useState(user?.lastName || '');
	const [company, setCompany] = useState(user?.company || '');
	const [phone, setPhone] = useState(user?.phone || '');
	const [savingProfile, setSavingProfile] = useState(false);
	const [changingPassword, setChangingPassword] = useState(false);
	const [currentPw, setCurrentPw] = useState('');
	const [pw1, setPw1] = useState('');
	const [pw2, setPw2] = useState('');
	const [bioSwitch, setBioSwitch] = useState<boolean>(biometricEnabled);

	const displayName = useMemo(() => {
		if (firstName || lastName) return `${firstName} ${lastName}`.trim();
		return user?.email?.split('@')[0] || 'Kullanıcı';
	}, [firstName, lastName, user?.email]);

	const initials = useMemo(() => {
		const fromNames = `${firstName} ${lastName}`.trim();
		if (fromNames) {
			return fromNames
				.split(' ')
				.filter(Boolean)
				.map(part => part[0]?.toUpperCase())
				.slice(0, 2)
				.join('');
		}
		const emailName = user?.email?.split('@')[0] || '';
		return (emailName[0] || 'U').toUpperCase();
	}, [firstName, lastName, user?.email]);

	useEffect(() => {
		setFirstName(user?.firstName || '');
		setLastName(user?.lastName || '');
		setCompany(user?.company || '');
		setPhone(user?.phone || '');
	}, [user]);

	const saveProfile = async () => {
		try {
			setSavingProfile(true);
			const result = await dispatch(updateProfileAsync({ firstName, lastName, company, phone }));
			if (updateProfileAsync.fulfilled.match(result)) {
				Alert.alert('Başarılı', 'Profil güncellendi.');
			} else {
				Alert.alert('Hata', (result.payload as string) || 'Profil güncellenemedi');
			}
		} finally {
			setSavingProfile(false);
		}
	};

	const changePassword = async () => {
		if (!currentPw || currentPw.length < 6) return Alert.alert('Hata', 'Mevcut şifre en az 6 karakter olmalı');
		if (pw1.length < 6 || pw2.length < 6) return Alert.alert('Hata', 'Yeni şifre en az 6 karakter olmalı');
		if (pw1 !== pw2) return Alert.alert('Hata', 'Şifreler eşleşmiyor');
		try {
			setChangingPassword(true);
			const resp = await apiService.changePassword(currentPw, pw2);
			if (resp.success) {
				Alert.alert('Başarılı', 'Şifre değiştirildi');
				setCurrentPw(''); setPw1(''); setPw2('');
			} else {
				Alert.alert('Hata', resp.message || 'Şifre değiştirilemedi');
			}
		} catch (e:any) {
			Alert.alert('Hata', e?.response?.data?.message || 'Ağ hatası');
		} finally { setChangingPassword(false); }
	};

	const toggleBiometric = async (val: boolean) => {
		setBioSwitch(val);
		await storageService.setBiometricEnabled(val);
		dispatch(setBiometricEnabled(val));
	};

	const doLogout = async () => {
		await dispatch(logoutAsync());
	};

	if (!user) {
		return (
			<View style={[styles.container, {justifyContent:'center', alignItems:'center'}]}>
				<Text style={{color:COLORS.textSecondary}}>Kullanıcı bilgisi yükleniyor...</Text>
			</View>
		);
	}

	return (
		<ScrollView contentContainerStyle={styles.container}>
			{/* Header with gradient and avatar */}
			<LinearGradient colors={[COLORS.primary, '#001eff']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.headerCard}>
				<View style={styles.avatarCircle}>
					<Text style={styles.avatarText}>{initials}</Text>
				</View>
				<View style={{ flex: 1 }}>
					<Text style={styles.headerName}>{displayName}</Text>
					<Text style={styles.headerEmail}>{user.email}</Text>
				</View>
			</LinearGradient>

			{/* Profile Info Card */}
			<View style={styles.card}>
				<View style={styles.cardHeader}>
					<Ionicons name="person-circle-outline" size={20} color={COLORS.textSecondary} />
					<Text style={styles.sectionTitle}>Profil Bilgileri</Text>
				</View>
				<View style={styles.row}><Text style={styles.label}>E-posta</Text><Text style={styles.value}>{user.email}</Text></View>
				<View style={styles.inputGroup}><Text style={styles.label}>Ad</Text><TextInput placeholder="Ad" placeholderTextColor={COLORS.textDisabled} style={styles.input} value={firstName} onChangeText={setFirstName} /></View>
				<View style={styles.inputGroup}><Text style={styles.label}>Soyad</Text><TextInput placeholder="Soyad" placeholderTextColor={COLORS.textDisabled} style={styles.input} value={lastName} onChangeText={setLastName} /></View>
				<View style={styles.inputGroup}><Text style={styles.label}>Şirket</Text><TextInput placeholder="Şirket (opsiyonel)" placeholderTextColor={COLORS.textDisabled} style={styles.input} value={company} onChangeText={setCompany} /></View>
				<View style={styles.inputGroup}><Text style={styles.label}>Telefon</Text><TextInput placeholder="Telefon" placeholderTextColor={COLORS.textDisabled} style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" /></View>
				<TouchableOpacity style={styles.primaryBtn} onPress={saveProfile} disabled={savingProfile}>
					{savingProfile ? <ActivityIndicator color="#FFF" /> : (
						<View style={styles.btnContent}> 
							<Ionicons name="save-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
							<Text style={styles.primaryBtnText}>Değişiklikleri Kaydet</Text>
						</View>
					)}
				</TouchableOpacity>
			</View>

			{/* Preferences & Security Card */}
			<View style={styles.card}>
				<View style={styles.cardHeader}>
					<Ionicons name="shield-checkmark-outline" size={20} color={COLORS.textSecondary} />
					<Text style={styles.sectionTitle}>Güvenlik</Text>
				</View>
				<View style={styles.switchRow}>
					<View>
						<Text style={styles.label}>Biyometrik Giriş</Text>
						<Text style={styles.caption}>Desteklenen cihazlarda hızlı ve güvenli giriş</Text>
					</View>
					<Switch value={bioSwitch} onValueChange={toggleBiometric} thumbColor={bioSwitch? COLORS.secondary : COLORS.gray300} trackColor={{ true: '#FFD18A', false: COLORS.gray300 }} />
				</View>
				<View style={styles.inputGroup}><Text style={styles.label}>Mevcut Şifre</Text><TextInput placeholder="Mevcut şifreniz" placeholderTextColor={COLORS.textDisabled} style={styles.input} secureTextEntry value={currentPw} onChangeText={setCurrentPw} /></View>
				<View style={styles.inputGroup}><Text style={styles.label}>Yeni Şifre</Text><TextInput placeholder="Yeni şifre" placeholderTextColor={COLORS.textDisabled} style={styles.input} secureTextEntry value={pw1} onChangeText={setPw1} /></View>
				<View style={styles.inputGroup}><Text style={styles.label}>Yeni Şifre (Tekrar)</Text><TextInput placeholder="Yeni şifre (tekrar)" placeholderTextColor={COLORS.textDisabled} style={styles.input} secureTextEntry value={pw2} onChangeText={setPw2} /></View>
				<TouchableOpacity style={styles.secondaryBtn} onPress={changePassword} disabled={changingPassword}>
					{changingPassword ? (
						<ActivityIndicator color={COLORS.textPrimary} />
					) : (
						<View style={styles.btnContent}> 
							<Ionicons name="key-outline" size={18} color={COLORS.textPrimary} style={{ marginRight: 6 }} />
							<Text style={styles.secondaryBtnText}>Şifreyi Değiştir</Text>
						</View>
					)}
				</TouchableOpacity>
			</View>

			<TouchableOpacity style={styles.logoutBtn} onPress={doLogout}>
				<View style={styles.btnContent}>
					<Ionicons name="log-out-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
					<Text style={styles.logoutText}>Çıkış Yap</Text>
				</View>
			</TouchableOpacity>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container:{ padding:SPACING.lg, backgroundColor:COLORS.background },
	headerCard:{
		flexDirection:'row',
		alignItems:'center',
		padding:SPACING.lg,
		borderRadius:BORDER_RADIUS.lg,
		marginBottom:SPACING.lg,
	},
	avatarCircle:{
		width:64,
		height:64,
		borderRadius:32,
		backgroundColor:'rgba(255,255,255,0.25)',
		alignItems:'center',
		justifyContent:'center',
		marginRight:SPACING.md,
	},
	avatarText:{ color:'#FFF', fontWeight:'800', fontSize:20 },
	headerName:{ color:'#FFF', fontSize:FONT_SIZES.xl, fontWeight:'800' },
	headerEmail:{ color:'rgba(255,255,255,0.9)', fontSize:FONT_SIZES.sm, marginTop:4 },
	card:{ backgroundColor:COLORS.surface, borderRadius:BORDER_RADIUS.lg, padding:SPACING.lg, marginBottom:SPACING.lg, borderWidth:1, borderColor:COLORS.gray200 },
	cardHeader:{ flexDirection:'row', alignItems:'center', marginBottom:SPACING.md, gap:8 },
	sectionTitle:{ fontSize:FONT_SIZES.lg, fontWeight:'700', color:COLORS.textPrimary, marginLeft:8 },
	row:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:SPACING.sm },
	label:{ fontSize:FONT_SIZES.sm, color:COLORS.textSecondary },
	value:{ fontSize:FONT_SIZES.md, color:COLORS.textPrimary, fontWeight:'600' },
	caption:{ fontSize:FONT_SIZES.xs, color:COLORS.textSecondary, marginTop:2 },
	inputGroup:{ marginTop:SPACING.sm, marginBottom:SPACING.md },
	input:{ backgroundColor:COLORS.gray100, borderRadius:BORDER_RADIUS.md, paddingHorizontal:12, height:48, color:COLORS.textPrimary },
	primaryBtn:{ backgroundColor:COLORS.primary, borderRadius:BORDER_RADIUS.md, height:48, alignItems:'center', justifyContent:'center' },
	primaryBtnText:{ color:'#FFF', fontSize:FONT_SIZES.md, fontWeight:'700' },
	secondaryBtn:{ backgroundColor:COLORS.gray100, borderRadius:BORDER_RADIUS.md, height:48, alignItems:'center', justifyContent:'center' },
	secondaryBtnText:{ color:COLORS.textPrimary, fontSize:FONT_SIZES.md, fontWeight:'700' },
	btnContent:{ flexDirection:'row', alignItems:'center', justifyContent:'center' },
	switchRow:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:SPACING.md },
	logoutBtn:{ backgroundColor:COLORS.error, borderRadius:BORDER_RADIUS.md, height:50, alignItems:'center', justifyContent:'center' },
	logoutText:{ color:'#FFF', fontWeight:'800', fontSize:FONT_SIZES.md }
});

export default AccountMainScreen;
