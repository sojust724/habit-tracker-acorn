import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { DAY_LABELS } from '../../lib/dateUtils';

interface DaySelectorProps {
  selected: number[];
  onChange: (days: number[]) => void;
}

export function DaySelector({ selected, onChange }: DaySelectorProps) {
  const toggle = (day: number) => {
    if (selected.includes(day)) {
      onChange(selected.filter((d) => d !== day));
    } else {
      onChange([...selected, day].sort((a, b) => a - b));
    }
  };

  return (
    <View className="flex-row gap-2 justify-center">
      {DAY_LABELS.map((label, idx) => {
        const isSelected = selected.includes(idx);
        return (
          <Pressable
            key={idx}
            onPress={() => toggle(idx)}
            className={`w-10 h-10 rounded-full items-center justify-center border ${
              isSelected
                ? 'bg-primary border-primary'
                : 'bg-white border-gray-200'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                isSelected ? 'text-white' : 'text-text-secondary'
              }`}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
