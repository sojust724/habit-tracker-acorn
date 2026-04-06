import { useRouter } from 'expo-router';
import { ChevronRight, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HabitForm } from '../../src/components/habit/HabitForm';
import { useCreateHabit, useDeleteHabit, useHabits, useUpdateHabit } from '../../src/hooks/useHabits';
import { DAY_LABELS } from '../../src/lib/dateUtils';
import type { Habit } from '../../src/types/habit';

export default function HabitsScreen() {
  const { data: habits = [], isLoading } = useHabits();
  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit();
  const deleteHabit = useDeleteHabit();

  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Habit | null>(null);

  const handleCreate = async (name: string, days: number[]) => {
    await createHabit.mutateAsync({ name, target_days: days });
    setShowAdd(false);
  };

  const handleUpdate = async (name: string, days: number[]) => {
    if (!editTarget) return;
    await updateHabit.mutateAsync({ id: editTarget.id, name, target_days: days });
    setEditTarget(null);
  };

  const handleDelete = () => {
    if (!editTarget) return;
    Alert.alert('습관 삭제', `"${editTarget.name}"을(를) 삭제할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          await deleteHabit.mutateAsync(editTarget.id);
          setEditTarget(null);
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* 헤더 */}
      <View className="flex-row items-center justify-between px-5 py-4">
        <Text className="text-xl font-bold text-text-primary">습관 관리</Text>
        <Pressable
          onPress={() => setShowAdd(true)}
          className="bg-primary w-9 h-9 rounded-full items-center justify-center"
        >
          <Plus size={20} color="white" />
        </Pressable>
      </View>

      {/* 목록 */}
      {habits.length === 0 && !isLoading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <Text className="text-4xl">🌰</Text>
          <Text className="text-text-secondary text-center">
            아직 습관이 없어요.{'\n'}+ 버튼을 눌러 추가해보세요!
          </Text>
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-5 pb-6"
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setEditTarget(item)}
              className="flex-row items-center bg-white rounded-2xl px-4 py-4 mb-2"
            >
              <View className="flex-1">
                <Text className="text-base font-medium text-text-primary">{item.name}</Text>
                <Text className="text-xs text-text-secondary mt-0.5">
                  {item.target_days.map((d) => DAY_LABELS[d]).join(' · ')}
                </Text>
              </View>
              <ChevronRight size={18} color="#9CA3AF" />
            </Pressable>
          )}
        />
      )}

      {/* 추가 모달 */}
      <Modal visible={showAdd} animationType="slide" presentationStyle="formSheet">
        <SafeAreaView className="flex-1 bg-background">
          <View className="flex-row items-center justify-between px-5 py-4">
            <Text className="text-lg font-bold text-text-primary">습관 추가</Text>
            <Pressable onPress={() => setShowAdd(false)}>
              <Text className="text-text-secondary">닫기</Text>
            </Pressable>
          </View>
          <View className="px-5">
            <HabitForm onSubmit={handleCreate} submitLabel="추가하기" />
          </View>
        </SafeAreaView>
      </Modal>

      {/* 수정 모달 */}
      <Modal visible={!!editTarget} animationType="slide" presentationStyle="formSheet">
        <SafeAreaView className="flex-1 bg-background">
          <View className="flex-row items-center justify-between px-5 py-4">
            <Text className="text-lg font-bold text-text-primary">습관 수정</Text>
            <Pressable onPress={() => setEditTarget(null)}>
              <Text className="text-text-secondary">닫기</Text>
            </Pressable>
          </View>
          <View className="px-5">
            {editTarget && (
              <HabitForm
                initialName={editTarget.name}
                initialDays={editTarget.target_days}
                onSubmit={handleUpdate}
                onDelete={handleDelete}
                submitLabel="수정하기"
              />
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
