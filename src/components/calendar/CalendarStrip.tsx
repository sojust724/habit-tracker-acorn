import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { DAY_LABELS_SHORT, formatDate, getWeekDates, isToday } from '../../lib/dateUtils';

interface CalendarStripProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  completionMap?: Record<string, boolean>; // dateStr -> 전체 완료 여부
}

export function CalendarStrip({ selectedDate, onSelectDate, completionMap = {} }: CalendarStripProps) {
  const today = new Date();
  const weekDates = getWeekDates(
    selectedDate ? new Date(selectedDate + 'T00:00:00') : today
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="flex-row gap-2 px-4 py-2"
    >
      {weekDates.map((date) => {
        const dateStr = formatDate(date);
        const isSelected = dateStr === selectedDate;
        const isTodayDate = isToday(dateStr);
        const isDone = completionMap[dateStr];

        return (
          <Pressable
            key={dateStr}
            onPress={() => onSelectDate(dateStr)}
            className={`w-12 items-center py-2 rounded-2xl ${
              isSelected ? 'bg-primary' : isTodayDate ? 'bg-primary/10' : 'bg-white'
            }`}
          >
            <Text
              className={`text-xs font-medium mb-1 ${
                isSelected ? 'text-white' : 'text-text-secondary'
              }`}
            >
              {DAY_LABELS_SHORT[date.getDay()]}
            </Text>
            <Text
              className={`text-base font-bold ${
                isSelected ? 'text-white' : isTodayDate ? 'text-primary' : 'text-text-primary'
              }`}
            >
              {date.getDate()}
            </Text>
            {/* 완료 도트 */}
            {isDone && !isSelected && (
              <View className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />
            )}
            {!isDone && isSelected && <View className="w-1.5 h-1.5 mt-1" />}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
