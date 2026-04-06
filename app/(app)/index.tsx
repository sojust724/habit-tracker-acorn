import { useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckItem } from '../../src/components/check/CheckItem';
import { AcornAnimationLayer } from '../../src/components/game/AcornAnimation';
import { useHabitLogs } from '../../src/hooks/useHabitLogs';
import { useHabits } from '../../src/hooks/useHabits';
import { useToggleCheck } from '../../src/hooks/useToggleCheck';
import { formatDate, formatDisplayDate, getWeekday } from '../../src/lib/dateUtils';
import { signOut } from '../../src/hooks/useAuth';

export default function HomeScreen() {
  const router = useRouter();
  const today = formatDate(new Date());
  const todayWeekday = getWeekday(new Date());

  const { data: habits = [], isLoading: habitsLoading } = useHabits();
  const { data: logs = [], isLoading: logsLoading } = useHabitLogs(today);
  const toggleCheck = useToggleCheck();

  const todayHabits = habits.filter((h) => h.target_days.includes(todayWeekday));
  const completedCount = todayHabits.filter((h) =>
    logs.some((l) => l.habit_id === h.id && l.completed)
  ).length;

  const isLoading = habitsLoading || logsLoading;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* 헤더 */}
      <View className="flex-row items-center justify-between px-5 py-4">
        <View>
          <Text className="text-xl font-bold text-text-primary">
            {formatDisplayDate(today)}
          </Text>
          <Text className="text-sm text-text-secondary mt-0.5">
            {todayHabits.length > 0
              ? `${completedCount} / ${todayHabits.length} 완료`
              : '오늘 할 습관이 없어요'}
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          <View className="flex-row items-center gap-1 bg-white rounded-full px-3 py-1.5">
            <Text className="text-base">🌰</Text>
            <Text className="text-sm font-semibold text-acorn">도토리</Text>
          </View>
          <Pressable onPress={signOut}>
            <Settings size={22} color="#9CA3AF" />
          </Pressable>
        </View>
      </View>

      {/* 달성 바 */}
      {todayHabits.length > 0 && (
        <View className="mx-5 mb-4">
          <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <View
              className="h-full bg-primary rounded-full"
              style={{ width: `${(completedCount / todayHabits.length) * 100}%` }}
            />
          </View>
        </View>
      )}

      {/* 습관 목록 */}
      {isLoading ? (
        <ActivityIndicator className="mt-10" color="#4F7942" />
      ) : todayHabits.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3">
          <Text className="text-4xl">🐿️</Text>
          <Text className="text-text-secondary text-center">
            오늘 할 습관이 없어요.{'\n'}습관 탭에서 추가해보세요!
          </Text>
          <Pressable
            onPress={() => router.push('/(app)/habits')}
            className="bg-primary rounded-xl px-5 py-2.5 mt-2"
          >
            <Text className="text-white font-semibold">습관 추가하기</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={todayHabits}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-5 pb-6"
          renderItem={({ item }) => {
            const log = logs.find((l) => l.habit_id === item.id);
            const completed = log?.completed ?? false;
            return (
              <CheckItem
                habit={item}
                completed={completed}
                onToggle={() =>
                  toggleCheck.mutate({
                    habitId: item.id,
                    date: today,
                    completed: !completed,
                  })
                }
              />
            );
          }}
        />
      )}

      <AcornAnimationLayer />
    </SafeAreaView>
  );
}
