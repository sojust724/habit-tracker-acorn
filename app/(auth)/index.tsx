import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signIn, signUp } from '../../src/hooks/useAuth';

type Mode = 'login' | 'signup';

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    setError('');
    setMessage('');
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        setMessage('가입 확인 이메일을 보냈어요. 이메일을 확인해주세요!');
      }
    } catch (e: any) {
      setError(e.message ?? '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-center px-6"
      >
        {/* 타이틀 */}
        <View className="items-center mb-10">
          <Text className="text-4xl mb-2">🌰</Text>
          <Text className="text-2xl font-bold text-text-primary">다람쥐의 하루</Text>
          <Text className="text-sm text-text-secondary mt-1">습관을 쌓고 도토리를 모아봐요</Text>
        </View>

        {/* 탭 */}
        <View className="flex-row bg-white rounded-2xl p-1 mb-6">
          {(['login', 'signup'] as const).map((m) => (
            <Pressable
              key={m}
              onPress={() => { setMode(m); setError(''); setMessage(''); }}
              className={`flex-1 py-2.5 rounded-xl items-center ${
                mode === m ? 'bg-primary' : ''
              }`}
            >
              <Text className={`font-semibold text-sm ${mode === m ? 'text-white' : 'text-text-secondary'}`}>
                {m === 'login' ? '로그인' : '회원가입'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* 입력 */}
        <View className="gap-3 mb-4">
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="이메일"
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-base text-text-primary"
            placeholderTextColor="#9CA3AF"
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="비밀번호 (6자 이상)"
            secureTextEntry
            className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-base text-text-primary"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {error ? <Text className="text-red-500 text-sm mb-3 text-center">{error}</Text> : null}
        {message ? <Text className="text-primary text-sm mb-3 text-center">{message}</Text> : null}

        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          className="bg-primary rounded-xl py-4 items-center"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">
              {mode === 'login' ? '로그인' : '가입하기'}
            </Text>
          )}
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
