import { Tabs } from 'expo-router';
import { AuthProvider } from '../../src/context/AuthContext';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Calendar',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'calendar' : 'calendar-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="citas"
          options={{
            title: 'Citas',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'create' : 'create-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="pagos"
          options={{
            title: 'Pagos',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'create' : 'create-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'person-circle-outline' : 'person-circle-sharp'} color={color} />
            ),
          }}
        />
      </Tabs>
    </AuthProvider>

  );
}
