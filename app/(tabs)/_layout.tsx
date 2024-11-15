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
          tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
    tabBarStyle: { backgroundColor: '#000000' }, // Fondo negro para la barra de pestañas
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
              <TabBarIcon name={focused ? 'bag-check' : 'bag-check-outline'} color={color} />
            ),
          }}
        />

         <Tabs.Screen
          name="pacientes"
          options={{
            title: 'Pacientes',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'bandage' : 'bandage-outline'} color={color} />
            ),
          }}
        />
         <Tabs.Screen
          name="feedback"
          options={{
            title: 'FeedBack',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'analytics' : 'analytics-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'person-circle-sharp' : 'person-circle-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
    </AuthProvider>

  );
}
