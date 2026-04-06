import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { DaySelector } from './DaySelector';

interface HabitFormProps {
  initialName?: string;
  initialDays?: number[];
  onSubmit: (name: string, days: number[]) => Promise<void>;
  onDelete?: () => void;
  submitLabel?: string;
}

export function HabitForm({
  initialName = '',
  initialDays = [],
  onSubmit,
  onDelete,
  submitLabel = '저장',
}: HabitFormProps) {
  const [name, setName] = useState(initialName);
  const [days, setDays] = useState<number[]>(initialDays);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('습관 이름을 입력해주세요.');
      return;
    }
    if (days.length === 0) {
      setError('반복 요일을 하나 이상 선택해주세요.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onSubmit(name.trim(), days);
    } catch (e: any) {
      setError(e.message ?? '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="gap-5">
      <View className="gap-2">
        <Text className="text-sm font-medium text-text-secondary">습관 이름</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="예) 물 2L 마시기"
          maxLength={50}
          className="border border-gray-200 rounded-xl px-4 py-3 text-base text-text-primary bg-white"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View className="gap-2">
        <Text className="text-sm font-medium text-text-secondary">반복 요일</Text>
        <DaySelector selected={days} onChange={setDays} />
      </View>

      {error ? (
        <Text className="text-red-500 text-sm text-center">{error}</Text>
      ) : null}

      <Pressable
        onPress={handleSubmit}
        disabled={loading}
        className="bg-primary rounded-xl py-4 items-center"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-base">{submitLabel}</Text>
        )}
      </Pressable>

      {onDelete && (
        <Pressable onPress={onDelete} className="py-3 items-center">
          <Text className="text-red-500 text-sm font-medium">습관 삭제</Text>
        </Pressable>
      )}
    </View>
  );
}
