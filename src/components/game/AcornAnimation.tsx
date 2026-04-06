import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useAcornStore } from '../../store/acornStore';
import type { AcornType } from '../../types/acorn';

interface AcornBubbleProps {
  id: string;
  type: AcornType;
}

function AcornBubble({ id, type }: AcornBubbleProps) {
  const dismiss = useAcornStore((s) => s.dismiss);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 8, stiffness: 200 });
    opacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withDelay(800, withTiming(0, { duration: 300 }))
    );
    translateY.value = withSequence(
      withSpring(-60, { damping: 10, stiffness: 150 }),
      withDelay(600, withTiming(-100, { duration: 300 }, () => {
        runOnJS(dismiss)(id);
      }))
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[style, {
        position: 'absolute',
        bottom: 100,
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      }]}
    >
      <Text style={{ fontSize: 20 }}>{type === 'golden' ? '🌟' : '🌰'}</Text>
      <Text style={{ fontSize: 14, fontWeight: '600', color: '#4F7942' }}>
        {type === 'golden' ? '황금 도토리 획득!' : '+1 도토리'}
      </Text>
    </Animated.View>
  );
}

export function AcornAnimationLayer() {
  const queue = useAcornStore((s) => s.queue);

  return (
    <>
      {queue.map((item) => (
        <AcornBubble key={item.id} id={item.id} type={item.type} />
      ))}
    </>
  );
}
