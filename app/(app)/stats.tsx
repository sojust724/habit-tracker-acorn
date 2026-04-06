import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StatsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background items-center justify-center">
      <Text className="text-4xl mb-3">📊</Text>
      <Text className="text-text-secondary">월간 통계는 곧 추가될 예정이에요!</Text>
    </SafeAreaView>
  );
}
