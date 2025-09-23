import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ViewToken,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, APP_CONFIG } from '../constants';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: [string, string];
}

const onboardingData: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Hosting Yönetimi',
    description: 'Tüm hosting paketlerinizi tek yerden yönetin. Disk kullanımı, trafik ve performans verilerinizi anlık olarak takip edin.',
    icon: 'server-outline',
    gradient: ['#2196F3', '#21CBF3'],
  },
  {
    id: '2',
    title: 'Domain Kontrolü',
    description: 'Domain adlarınızı kolayca yönetin. DNS ayarları, yenileme tarihleri ve WHOIS bilgilerinizi güncel tutun.',
    icon: 'globe-outline',
    gradient: ['#9C27B0', '#E91E63'],
  },
  {
    id: '3',
    title: 'Sunucu İzleme',
    description: 'VPS ve dedicated sunucularınızı 7/24 izleyin. CPU, RAM ve disk kullanımını gerçek zamanlı görüntüleyin.',
    icon: 'hardware-chip-outline',
    gradient: ['#FF9800', '#FF5722'],
  },
  {
    id: '4',
    title: 'Destek Sistemi',
    description: 'Teknik destek ekibimizle anında iletişime geçin. Bilet sistemi ve canlı chat ile sorularınızı çözün.',
    icon: 'headset-outline',
    gradient: ['#4CAF50', '#8BC34A'],
  },
  {
    id: '5',
    title: 'Mali İşlemler',
    description: 'Faturalarınızı görüntüleyin, ödeme yapın ve harcama geçmişinizi takip edin. Güvenli ödeme seçenekleri ile.',
    icon: 'card-outline',
    gradient: ['#795548', '#607D8B'],
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    navigation.replace('Auth');
  };

  const handleFinish = () => {
    navigation.replace('Auth');
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <LinearGradient colors={item.gradient} style={styles.slide}>
      <View style={styles.slideContent}>
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon} size={80} color="#FFFFFF" />
        </View>
        
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </LinearGradient>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            {
              backgroundColor: index === currentIndex ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
              width: index === currentIndex ? 25 : 8,
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Atla</Text>
        </TouchableOpacity>

        {/* Slides */}
        <FlatList
          ref={flatListRef}
          data={onboardingData}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
          }}
        />

        {/* Bottom Controls */}
        <View style={styles.bottomContainer}>
          {renderPagination()}
          
          <View style={styles.navigationButtons}>
            {/* Previous Button */}
            {currentIndex > 0 && (
              <TouchableOpacity
                style={[styles.navButton, styles.prevButton]}
                onPress={handlePrevious}
              >
                <Ionicons name="chevron-back" size={24} color="#666666" />
              </TouchableOpacity>
            )}

            {/* Next/Finish Button */}
            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={handleNext}
            >
              {currentIndex === onboardingData.length - 1 ? (
                <>
                  <Text style={styles.nextButtonText}>Başla</Text>
                  <Ionicons name="checkmark" size={24} color="#FFFFFF" />
                </>
              ) : (
                <>
                  <Text style={styles.nextButtonText}>İleri</Text>
                  <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    width,
    flex: 1,
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
    paddingBottom: 150,
  },
  iconContainer: {
    width: 150,
    height: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '300',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    minWidth: 100,
    justifyContent: 'center',
  },
  prevButton: {
    backgroundColor: '#F5F5F5',
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    flex: 1,
    marginLeft: 15,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default OnboardingScreen;