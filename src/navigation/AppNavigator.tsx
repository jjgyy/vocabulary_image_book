import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  BookOpen, 
  List, 
  Gear, 
  X,
} from 'phosphor-react-native';
import { paperTheme } from '../constants/theme';
import { colors, spacing, fontSize } from '../constants/theme';

// Screens
import LearningScreen from '../screens/LearningScreen';
import WordListScreen from '../screens/WordListScreen';
import SettingsScreen from '../screens/SettingsScreen';
import WordDetailScreen from '../screens/WordDetailScreen';
import CardLayoutScreen from '../screens/CardLayoutScreen';
import WordBookScreen from '../screens/WordBookScreen';

export type RootStackParamList = {
  Main: undefined;
  WordDetail: { wordId: string };
  CardLayout: undefined;
  WordBook: undefined;
};

export type DrawerParamList = {
  Learning: undefined;
  WordList: undefined;
  Settings: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// 自定义抽屉内容
function CustomDrawerContent(props: any) {
  const { navigation, state } = props;
  const insets = useSafeAreaInsets();
  
  const menuItems = [
    { name: 'Learning',   label: '学习模式', icon: BookOpen },
    { name: 'WordList',   label: '单词列表', icon: List },
    { name: 'Settings',   label: '设置',     icon: Gear },
  ];

  return (
    <DrawerContentScrollView 
      {...props} 
      style={styles.drawerContent}
      contentContainerStyle={styles.drawerContentContainer}
    >
      {/* 抽屉头部留白，适配顶部安全区 */}
      <View style={[styles.drawerHeader, { paddingTop: insets.top }]} />

      {/* 菜单项 */}
      <View style={styles.menuContainer}>
        {menuItems.map((item) => {
          const activeRoute = state.routes[state.index];
          const isActive = activeRoute?.name === item.name;
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={item.name}
              style={[
                styles.menuItem,
                isActive && styles.menuItemActive
              ]}
              onPress={() => navigation.navigate(item.name)}
            >
              <Icon 
                size={24} 
                color={isActive ? colors.primary : colors.textSecondary} 
                weight={isActive ? "fill" : "regular"}
              />
              <Text style={[
                styles.menuLabel,
                isActive && styles.menuLabelActive
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </DrawerContentScrollView>
  );
}

// 抽屉导航
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colors.background,
          width: 280,
        },
        drawerType: 'front',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <Drawer.Screen
        name="Learning"
        component={LearningScreen}
        options={{ title: '学习模式' }}
      />
      <Drawer.Screen
        name="WordList"
        component={WordListScreen}
        options={{ title: '单词列表' }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: '设置' }}
      />
    </Drawer.Navigator>
  );
}

// 主导航器
export default function AppNavigator() {
  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: colors.background,
            },
          }}
        >
          <Stack.Screen name="Main" component={DrawerNavigator} />
          <Stack.Screen
            name="WordDetail"
            component={WordDetailScreen}
            options={{
              title: '单词详情',
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="CardLayout"
            component={CardLayoutScreen}
            options={{
              title: '卡片布局',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="WordBook"
            component={WordBookScreen}
            options={{
              title: '选择单词书',
              animation: 'slide_from_right',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    backgroundColor: colors.background,
  },
  drawerContentContainer: {
    flex: 1,
    paddingTop: 0,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  drawerTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: spacing.sm,
  },
  menuContainer: {
    paddingTop: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    borderRadius: 12,
    gap: spacing.md,
  },
  menuItemActive: {
    backgroundColor: colors.primary + '15',
  },
  menuLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  menuLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});
