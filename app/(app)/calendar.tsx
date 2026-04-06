import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarStrip } from '../../src/components/calendar/CalendarStrip';
import { CheckItem } from '../../src/components/check/CheckItem';
import { AcornAnimationLayer } from '../../src/components/game/AcornAnimation';
import { useHabitLogs } from '../../src/hooks/useHabitLogs';
import { useHabits } from '../../src/hooks/useHabits';
import { useToggleCheck } from '../../src/hooks/useToggleCheck';
import { formatDisplayDate, getWeekday, isFutureDate } from '../../src/lib/dateUtils';
import { useSelectedDateStore } from '../../src/store/selectedDateStore';

export default function CalendarScreen() {
  const { selectedDate, setSelectedDate } = useSelectedDateStore();
  const selectedWeekday = getWeekday(new Date(selectedDate + 'T00:00:00'));
  const isFuture = isFutureDate(selectedDate);

  const { data: habits = [], isLoading: habitsLoading } = useHabits();
  const { data: logs = [], isLoading: logsLoading } = useHabitLogs(selectedDate);
  const toggleCheck = useToggleCheck();

  const targetHabits = habits.filter((h) => h.target_days.includes(selectedWeekday));
  const isLoading = habitsLoading || logsLoading;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* 헤더 */}
      <View className="px-5 pt-4 pb-2">
        <Text className="text-xl font-bold text-text-primary">달력</Text>
      </View>

      <CalendarStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />

      {/* 선택 날짜 */}
      <View className="px-5 py-3 flex-row items-center justify-between">
        <Text className="text-base font-semibold text-text-primary">
          {formatDisplayDate(selectedDate)}
        </Text>
        {isFuture && (
          <Text className="text-xs text-text-secondary bg-gray-100 px-2 py-1 rounded-full">
            미래 날짜
          </Text>
        )}
      </View>

      {/* 습관 목록 */}
      {isLoading ? (
        <ActivityIndicator className="mt-10" color="#4F7942" />
      ) : targetHabits.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-4xl mb-3">🐿️</Text>
          <Text className="text-text-secondary">이 날에 해당하는 습관이 없어요.</Text>
        </View>
      ) : (
        <FlatList
          data={targetHabits}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-5 pb-6"
          renderItem={({ item }) => {
            const log = logs.find((l) => l.habit_id === item.id);
            const completed = log?.completed ?? false;
            return (
              <CheckItem
                habit={item}
                completed={completed}
                disabled={isFuture}
                onToggle={() =>
                  toggleCheck.mutate({
                    habitId: item.id,
                    date: selectedDate,
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
