# Dark Mode Implementation Guide

## Overview
RADE Mobile App now has dark mode infrastructure in place. The implementation is **ready but not activated** - all screens are prepared to support dark mode when enabled.

## Architecture

### 1. ThemeContext (`src/utils/ThemeContext.tsx`)
Central theme management system providing:
- `useTheme()` hook to access theme colors
- `isDark` boolean to check current mode
- `colors` object with theme-aware colors
- `setThemeMode()` to switch between 'light', 'dark', 'system'

### 2. Theme Colors Structure
```typescript
interface ThemeColors {
  // Backgrounds
  background: string;      // Main app background
  surface: string;         // Card/component background
  surfaceAlt: string;      // Alternative surface
  
  // Text
  text: string;            // Primary text
  textSecondary: string;   // Secondary text
  textTertiary: string;    // Tertiary/hint text
  
  // Borders
  border: string;
  borderLight: string;
  
  // Components
  card: string;
  cardBorder: string;
  input: string;
  inputBorder: string;
  
  // Status colors (consistent across themes)
  primary: string;         // #135bec (light) / #3B9EFF (dark)
  success: string;
  warning: string;
  error: string;
  info: string;
}
```

### 3. Color Palette (`src/styles/colors.ts`)
Extended with dark mode colors:
```typescript
dark: {
  bg: '#0F1419',          // Main background
  surface: '#1A1F26',     // Card/surface background
  surfaceAlt: '#252D38',  // Alternative surface
  border: '#334155',      // Borders in dark mode
  text: '#E5E7EB',        // Primary text in dark
  textSecondary: '#9CA3AF', // Secondary text in dark
}
```

## How to Use in Screens

### Basic Pattern
```typescript
import { useTheme } from '../../utils/ThemeContext';

const MyScreen = () => {
  const { colors: themeColors, isDark } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.text, { color: themeColors.text }]}>Hello</Text>
      <View style={[styles.card, { 
        backgroundColor: themeColors.card,
        borderColor: themeColors.cardBorder 
      }]}>
        {/* Card content */}
      </View>
    </View>
  );
};
```

### Dynamic Styles Pattern
```typescript
const createStyles = (themeColors: ThemeColors, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  card: {
    backgroundColor: themeColors.card,
    borderWidth: 1,
    borderColor: themeColors.cardBorder,
  },
  text: {
    color: themeColors.text,
  },
});

// In component:
const { colors: themeColors, isDark } = useTheme();
const styles = useMemo(() => createStyles(themeColors, isDark), [themeColors, isDark]);
```

## Screens to Update

### Priority 1 - Main Screens (Core User Experience)
- [ ] `DashboardScreen.tsx` - Home dashboard
- [ ] `ServicesListScreen.tsx` - Services overview
- [ ] `BillingMainScreen.tsx` - Billing page
- [ ] `ServerListScreen.tsx` - Server management
- [ ] `ProfileScreen.tsx` - User profile

### Priority 2 - Auth & Settings
- [ ] `LoginScreen.tsx` - Login page
- [ ] `RegisterScreen.tsx` - Registration
- [ ] `AccountMainScreen.tsx` - Account settings
- [ ] Add theme toggle to ProfileScreen

### Priority 3 - Secondary Screens
- [ ] `HostingDetailsScreen.tsx`
- [ ] `DomainListScreen.tsx`
- [ ] `InvoiceListScreen.tsx`
- [ ] `ChatbotScreen.tsx`
- [ ] All other detail screens

## Common Patterns

### 1. Background Colors
```typescript
// Container backgrounds
<SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>

// Card backgrounds
<View style={[styles.card, { backgroundColor: themeColors.surface }]}>
```

### 2. Text Colors
```typescript
// Primary text
<Text style={[styles.title, { color: themeColors.text }]}>

// Secondary text
<Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
```

### 3. Borders
```typescript
<View style={[styles.input, { 
  borderColor: themeColors.border,
  backgroundColor: themeColors.input 
}]}>
```

### 4. Status Colors (Always Use Theme Primary)
```typescript
// Instead of colors.primary[500]
<Ionicons name="star" color={themeColors.primary} />
```

## Components to Update

### Custom Components (`src/components/common/`)
These need theme support:
- [ ] `Card.tsx` - Add theme-aware backgrounds
- [ ] `Button.tsx` - Dark mode button styles
- [ ] `TextInput.tsx` - Dark input fields
- [ ] `AlertBanner.tsx` - Dark alert styles
- [ ] `MetricCard.tsx` - Dark card styles
- [ ] `DataRow.tsx` - Dark row styles

### Example Component Update
```typescript
// Before
const Card = ({ children }) => (
  <View style={styles.card}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.neutral[200],
  },
});

// After
const Card = ({ children }) => {
  const { colors: themeColors } = useTheme();
  
  return (
    <View style={[styles.card, { 
      backgroundColor: themeColors.card,
      borderColor: themeColors.cardBorder 
    }]}>
      {children}
    </View>
  );
};
```

## Enabling Dark Mode

### Option 1: Profile Settings Toggle (Recommended)
Add to `ProfileScreen.tsx`:
```typescript
const { mode, setThemeMode } = useTheme();

<View style={styles.settingRow}>
  <Text>Theme</Text>
  <SegmentedButtons
    value={mode}
    onValueChange={setThemeMode}
    buttons={[
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
      { value: 'system', label: 'System' },
    ]}
  />
</View>
```

### Option 2: Dev/Admin Toggle
For testing purposes, add a debug button:
```typescript
<TouchableOpacity onPress={() => setThemeMode(isDark ? 'light' : 'dark')}>
  <Text>Toggle Theme (Dev)</Text>
</TouchableOpacity>
```

## Testing Checklist

When activating dark mode:
- [ ] All text is readable (sufficient contrast)
- [ ] All icons are visible
- [ ] Cards have proper elevation/borders
- [ ] Input fields are clearly defined
- [ ] Status colors maintain meaning (green=good, red=bad)
- [ ] Navigation bar is themed
- [ ] StatusBar color matches theme
- [ ] Modal backgrounds are themed
- [ ] Loading states are visible
- [ ] Error states are visible

## Color Contrast Standards (WCAG)
- **Normal text**: 4.5:1 contrast ratio
- **Large text** (18pt+): 3:1 contrast ratio
- **Status colors**: Must be distinguishable in both modes

## Notes
- Theme persists across app restarts (AsyncStorage)
- System mode follows device dark mode setting
- Default is 'light' until user changes it
- Primary blue (#135bec) slightly lightened in dark mode for better visibility

## Future Enhancements
- [ ] Smooth theme transition animations
- [ ] Per-screen theme override (e.g., always dark login)
- [ ] OLED black mode option (#000000 background)
- [ ] Schedule-based theme switching (auto dark at night)
- [ ] Theme preview in settings
