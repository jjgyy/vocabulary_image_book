import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, UserSettings, CardModule } from '../types';
import { getRandomWords } from '../data/words';

// 获取今天的日期字符串 YYYY-MM-DD
const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

interface UserState extends UserProgress {
  settings: UserSettings;
  
  // Actions
  initializeDailyWords: () => void;
  markWord: (wordId: string, status: 'star' | 'pass') => void;
  unmarkWord: (wordId: string) => void;
  viewWord: (wordId: string) => void;
  nextWord: () => void;
  prevWord: () => void;
  startNewRound: () => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  updateCardLayout: (layout: CardModule[]) => void;
  setCoverImage: (wordId: string, uri: string) => void;
  removeCoverImage: (wordId: string) => void;
  
  // Getters
  isStarWord: (wordId: string) => boolean;
  isPassWord: (wordId: string) => boolean;
  getCurrentWordId: () => string | null;
  getProgress: () => number;
  hasCompletedRound: () => boolean;
}

const defaultCardLayout: CardModule[] = [
  { id: 'word',        label: '单词',   enabled: true },
  { id: 'phonetic',    label: '音标',   enabled: true },
  { id: 'pos',         label: '词性',   enabled: true },
  { id: 'meaning',     label: '中文释义', enabled: true },
  { id: 'etymology',   label: '词根词缀', enabled: true },
  { id: 'examples',    label: '例句',   enabled: true },
  { id: 'relatedWords', label: '关联词汇', enabled: true },
  { id: 'imageButton', label: '单词图片', enabled: true },
  { id: 'dictButton',  label: '查词典',  enabled: true },
];

const defaultSettings: UserSettings = {
  speechRate: 1.0,
  speechPitch: 1.0,
  imageSource: 'unsplash',
  dictSource: 'bing',
  cardLayout: defaultCardLayout,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 初始状态
      currentRoundDate: '',
      currentRoundWords: [],
      viewedWordsInRound: [],
      starWords: [],
      passWords: [],
      coverImages: {},
      settings: defaultSettings,
      
      // 初始化每日单词（每天第一次打开时调用）
      initializeDailyWords: () => {
        const today = getTodayString();
        const state = get();
        
        // 如果今天已经初始化过，就不重新随机
        if (state.currentRoundDate === today && state.currentRoundWords.length > 0) {
          return;
        }
        
        // 随机20个单词，排除已掌握的
        const newWords = getRandomWords(20, state.passWords);
        const wordIds = newWords.map(w => w.id);
        
        set({
          currentRoundDate: today,
          currentRoundWords: wordIds,
          viewedWordsInRound: wordIds.length > 0 ? [wordIds[0]] : [], // 默认浏览第一个
        });
      },
      
      // 标记单词
      markWord: (wordId: string, status: 'star' | 'pass') => {
        set((state) => {
          const newState = { ...state };
          
          // 从其他列表中移除
          newState.starWords = state.starWords.filter(id => id !== wordId);
          newState.passWords = state.passWords.filter(id => id !== wordId);
          
          // 添加到新列表
          if (status === 'star') {
            newState.starWords = [...newState.starWords, wordId];
          } else if (status === 'pass') {
            newState.passWords = [...newState.passWords, wordId];
          }
          
          return newState;
        });
      },
      
      // 取消标记
      unmarkWord: (wordId: string) => {
        set((state) => ({
          starWords: state.starWords.filter(id => id !== wordId),
          passWords: state.passWords.filter(id => id !== wordId),
        }));
      },
      
      // 记录浏览过的单词
      viewWord: (wordId: string) => {
        set((state) => {
          if (state.viewedWordsInRound.includes(wordId)) {
            return state;
          }
          return {
            viewedWordsInRound: [...state.viewedWordsInRound, wordId],
          };
        });
      },
      
      // 下一个单词
      nextWord: () => {
        const state = get();
        const currentIndex = state.currentRoundWords.findIndex(
          id => id === state.viewedWordsInRound[state.viewedWordsInRound.length - 1]
        );
        
        if (currentIndex < state.currentRoundWords.length - 1) {
          const nextWordId = state.currentRoundWords[currentIndex + 1];
          get().viewWord(nextWordId);
        }
      },
      
      // 上一个单词
      prevWord: () => {
        const state = get();
        const currentIndex = state.currentRoundWords.findIndex(
          id => id === state.viewedWordsInRound[state.viewedWordsInRound.length - 1]
        );
        
        if (currentIndex > 0) {
          // 从历史记录中移除当前单词，回到上一个
          const newViewed = state.viewedWordsInRound.slice(0, -1);
          set({ viewedWordsInRound: newViewed });
        }
      },
      
      // 开始新一轮
      startNewRound: () => {
        const state = get();
        const newWords = getRandomWords(20, state.passWords);
        const wordIds = newWords.map(w => w.id);
        
        set({
          currentRoundWords: wordIds,
          viewedWordsInRound: wordIds.length > 0 ? [wordIds[0]] : [],
        });
      },
      
      // 更新设置
      updateSettings: (newSettings: Partial<UserSettings>) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      // 更新卡片布局
      updateCardLayout: (layout: CardModule[]) => {
        set((state) => ({
          settings: { ...state.settings, cardLayout: layout },
        }));
      },

      // 设置单词封面图
      setCoverImage: (wordId: string, uri: string) => {
        set((state) => ({
          coverImages: { ...state.coverImages, [wordId]: uri },
        }));
      },

      // 移除单词封面图
      removeCoverImage: (wordId: string) => {
        set((state) => {
          const next = { ...state.coverImages };
          delete next[wordId];
          return { coverImages: next };
        });
      },
      
      // 判断是否为重点学单词
      isStarWord: (wordId: string) => {
        return get().starWords.includes(wordId);
      },
      
      // 判断是否为已掌握单词
      isPassWord: (wordId: string) => {
        return get().passWords.includes(wordId);
      },
      
      // 获取当前单词ID
      getCurrentWordId: () => {
        const state = get();
        const viewed = state.viewedWordsInRound;
        return viewed.length > 0 ? viewed[viewed.length - 1] : null;
      },
      
      // 获取进度（0-1）
      getProgress: () => {
        const state = get();
        if (state.currentRoundWords.length === 0) return 0;
        return state.viewedWordsInRound.length / state.currentRoundWords.length;
      },
      
      // 是否完成当前轮次
      hasCompletedRound: () => {
        const state = get();
        return state.viewedWordsInRound.length >= state.currentRoundWords.length;
      },
    }),
    {
      name: 'user-storage',
      storage: {
        getItem: async (key) => {
          const value = await AsyncStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (key, value) => {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: async (key) => {
          await AsyncStorage.removeItem(key);
        },
      },
      // 从持久化数据恢复时，补全 defaultCardLayout 中有但旧数据里没有的新模块
      merge: (persistedState: any, currentState: UserState) => {
        const persisted = persistedState as Partial<UserState>;
        const savedLayout: CardModule[] = persisted?.settings?.cardLayout ?? [];

        // 将 defaultCardLayout 中的新模块追加到已保存布局末尾
        const savedIds = new Set(savedLayout.map((m) => m.id));
        const newModules = defaultCardLayout.filter((m) => !savedIds.has(m.id));
        const mergedLayout = [...savedLayout, ...newModules];

        return {
          ...currentState,
          ...persisted,
          coverImages: persisted.coverImages ?? {},
          settings: {
            ...currentState.settings,
            ...persisted.settings,
            cardLayout: mergedLayout,
          },
        };
      },
    }
  )
);
