import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { DAY_LABELS } from '../../lib/dateUtils';
import type { Habit } from '../../types/habit';

interface CheckItemProps {
  habit: Habit;
  completed: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export function CheckItem({ habit, completed, disabled, onToggle }: CheckItemProps) {
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(completed ? 1 : 0);

  useEffect(() => {
    checkScale.value = withSpring(completed ? 1 : 0, { damping: 12, stiffness: 200 });
  }, [completed]);

  const handlePress = () => {
    if (disabled) return;
    scale.value = withSpring(0.93, {}, () => {
      scale.value = withSpring(1);
    });
    onToggle();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        className={`flex-row items-center gap-3 px-4 py-4 rounded-2xl mb-2 ${
          completed ? 'bg-primary/10' : 'bg-white'
        } ${disabled ? 'opacity-40' : ''}`}
      >
        {/* 체크박스 */}
        <View
          className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
            completed ? 'bg-primary border-primary' : 'border-gray-300'
          }`}
        >
          <Animated.View style={checkStyle}>
            <Text className="text-white text-xs font-bold">✓</Text>
          </Animated.View>
        </View>

        {/* 습관 이름 */}
        <View className="flex-1">
          <Text
            className={`text-base font-medium ${
              completed ? 'text-primary line-through' : 'text-text-primary'
            }`}
          >
            {habit.name}
          </Text>
          <Text className="text-xs text-text-secondary mt-0.5">
            {habit.target_days.map((d) => DAY_LABELS[d]).join(' · ')}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}
