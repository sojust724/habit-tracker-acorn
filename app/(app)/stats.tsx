import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMonthlyStats } from '../../src/hooks/useMonthlyStats';
import type { HabitAchievement } from '../../src/hooks/useMonthlyStats';

function AchievementBar({ rate }: { rate: number }) {
  const color = rate >= 80 ? '#4F7942' : rate >= 50 ? '#F59E0B' : '#EF4444';
  return (
    <View className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
      <View
        className="h-full rounded-full"
        style={{ width: `${rate}%`, backgroundColor: color }}
      />
    </View>
  );
}

function AchievementItem({ item }: { item: HabitAchievement }) {
  const { habit, targetCount, completedCount, rate } = item;
  return (
    <View className="bg-white rounded-2xl px-4 py-4 mb-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-medium text-text-primary flex-1 mr-3" numberOfLines={1}>
          {habit.name}
        </Text>
        <Text className="text-base font-bold" style={{ color: rate >= 80 ? '#4F7942' : rate >= 50 ? '#F59E0B' : '#EF4444' }}>
          {rate}%
        </Text>
      </View>
      <AchievementBar rate={rate} />
      <Text className="text-xs text-text-secondary mt-1.5">
        {completedCount} / {targetCount}일 완료
      </Text>
    </View>
  );
}

export default function StatsScreen() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const { achievements, isLoading } = useMonthlyStats(year, month);

  const goPrev = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  };

  const goNext = () => {
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1;
    if (isCurrentMonth) return;
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  };

  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* 헤더 */}
      <View className="px-5 pt-4 pb-2">
        <Text className="text-xl font-bold text-text-primary">월간 통계</Text>
      </View>

      {/* 월 선택 */}
      <View className="flex-row items-center justify-center gap-6 py-3">
        <Pressable onPress={goPrev} className="p-2">
          <ChevronLeft size={22} color="#4F7942" />
        </Pressable>
        <Text className="text-lg font-semibold text-text-primary w-24 text-center">
          {year}.{String(month).padStart(2, '0')}
        </Text>
        <Pressable onPress={goNext} className="p-2" disabled={isCurrentMonth}>
          <ChevronRight size={22} color={isCurrentMonth ? '#D1D5DB' : '#4F7942'} />
        </Pressable>
      </View>

      {/* 목록 */}
      {isLoading ? (
        <ActivityIndicator className="mt-10" color="#4F7942" />
      ) : achievements.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-4xl mb-3">🌰</Text>
          <Text className="text-text-secondary">이 달에 등록된 습관이 없어요.</Text>
        </View>
      ) : (
        <FlatList
          data={achievements}
          keyExtractor={(item) => item.habit.id}
          contentContainerClassName="px-5 pb-6"
          renderItem={({ item }) => <AchievementItem item={item} />}
        />
      )}
    </SafeAreaView>
  );
}
