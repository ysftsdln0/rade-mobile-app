import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store';
import { registerAsync } from '../../store/authThunks';

const RegisterScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(s => s.auth);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    if (!firstName.trim() || !lastName.trim()) return 'İsim ve soyisim zorunlu.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase())) return 'Geçerli bir e-posta girin.';
    if (password.length < 6) return 'Şifre en az 6 karakter olmalı.';
    if (password !== confirmPassword) return 'Şifreler eşleşmiyor.';
    if (!acceptTerms) return 'Devam etmek için şartları kabul edin.';
    return null;
  };

  const handleRegister = async () => {
    const err = validate();
    if (err) {
      Alert.alert('Hata', err);
      return;
    }

    const result = await dispatch(registerAsync({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      company: company || undefined,
      phone: phone || undefined,
      acceptTerms,
    }));
    if (registerAsync.fulfilled.match(result)) {
      navigation.replace('Main');
    } else {
      Alert.alert('Kayıt Hatası', result.payload as string || 'Kayıt başarısız');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios'?'padding':undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Hesap Oluştur</Text>
          <Text style={styles.subtitle}>Bilgilerinizi doldurun ve hemen başlayın</Text>

          <View style={styles.row}>
            <View style={[styles.inputGroup,{flex:1, marginRight:8}]}> 
              <Text style={styles.label}>Ad</Text>
              <TextInput value={firstName} onChangeText={setFirstName} style={styles.input} placeholder="Ad" autoCapitalize="words" />
            </View>
            <View style={[styles.inputGroup,{flex:1}]}> 
              <Text style={styles.label}>Soyad</Text>
              <TextInput value={lastName} onChangeText={setLastName} style={styles.input} placeholder="Soyad" autoCapitalize="words" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-posta</Text>
            <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder="ornek@mail.com" keyboardType="email-address" autoCapitalize="none" />
          </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Şifre</Text>
              <TextInput value={password} onChangeText={setPassword} style={styles.input} placeholder="Şifre" secureTextEntry={!showPassword} />
              <TouchableOpacity style={styles.toggle} onPress={()=>setShowPassword(p=>!p)}>
                <Text style={styles.toggleText}>{showPassword? 'Gizle' : 'Göster'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Şifre (Tekrar)</Text>
              <TextInput value={confirmPassword} onChangeText={setConfirmPassword} style={styles.input} placeholder="Şifreyi tekrar" secureTextEntry={!showConfirmPassword} />
              <TouchableOpacity style={styles.toggle} onPress={()=>setShowConfirmPassword(p=>!p)}>
                <Text style={styles.toggleText}>{showConfirmPassword? 'Gizle' : 'Göster'}</Text>
              </TouchableOpacity>
            </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Şirket (opsiyonel)</Text>
            <TextInput value={company} onChangeText={setCompany} style={styles.input} placeholder="Şirket Adı" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefon (opsiyonel)</Text>
            <TextInput value={phone} onChangeText={setPhone} style={styles.input} placeholder="+90 ..." keyboardType="phone-pad" />
          </View>

          <TouchableOpacity style={styles.termsRow} onPress={()=>setAcceptTerms(a=>!a)}>
            <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]} />
            <Text style={styles.termsText}>Kullanım şartlarını kabul ediyorum</Text>
          </TouchableOpacity>

          <TouchableOpacity disabled={isLoading} onPress={handleRegister} style={[styles.registerButton, isLoading && {opacity:0.7}]}> 
            {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.registerButtonText}>Kayıt Ol</Text>}
          </TouchableOpacity>

          <View style={styles.loginLinkRow}> 
            <Text style={styles.loginText}>Zaten hesabın var mı? </Text>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
              <Text style={styles.loginLink}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#FFF' },
  scroll:{ padding:20, paddingBottom:40 },
  title:{ fontSize:28, fontWeight:'700', color:COLORS.textPrimary, marginBottom:4 },
  subtitle:{ fontSize:14, color:COLORS.textSecondary, marginBottom:24 },
  inputGroup:{ marginBottom:16, position:'relative' },
  label:{ fontSize:13, fontWeight:'600', color:COLORS.textSecondary, marginBottom:6, textTransform:'uppercase', letterSpacing:0.5 },
  input:{ backgroundColor:COLORS.gray100, borderRadius:10, paddingHorizontal:14, height:50, fontSize:15, color:COLORS.textPrimary },
  toggle:{ position:'absolute', right:12, top:30, padding:4 },
  toggleText:{ fontSize:12, color:COLORS.primary, fontWeight:'600' },
  row:{ flexDirection:'row' },
  termsRow:{ flexDirection:'row', alignItems:'center', marginBottom:20 },
  checkbox:{ width:20, height:20, borderRadius:4, borderWidth:1.5, borderColor:COLORS.primary, marginRight:10 },
  checkboxChecked:{ backgroundColor:COLORS.primary },
  termsText:{ flex:1, fontSize:13, color:COLORS.textSecondary },
  registerButton:{ backgroundColor:COLORS.primary, borderRadius:12, height:54, alignItems:'center', justifyContent:'center', marginBottom:24 },
  registerButtonText:{ color:'#FFF', fontSize:16, fontWeight:'600' },
  loginLinkRow:{ flexDirection:'row', justifyContent:'center', alignItems:'center' },
  loginText:{ fontSize:14, color:COLORS.textSecondary },
  loginLink:{ fontSize:14, color:COLORS.primary, fontWeight:'600' }
});

export default RegisterScreen;