// 单词标记状态
export type MarkStatus = 'none' | 'star' | 'pass';

// 例句
export interface Example {
  sentence: string;
  translation: string;
}

// 单词数据结构
export interface Word {
  id: string;
  word: string;
  phonetic: string;
  pos: string; // 词性，如 n./v./adj.
  meaning: string;
  etymology?: string; // 词根词缀
  relatedWords?: string[]; // 关联词汇
  examples: Example[];
}

// 用户学习进度
export interface UserProgress {
  userId?: string; // 预留云端同步字段
  currentRoundDate: string; // 当前轮次日期，格式 YYYY-MM-DD
  currentRoundWords: string[]; // 当前轮次20个单词ID
  viewedWordsInRound: string[]; // 当前轮次已浏览的单词ID
  starWords: string[]; // 重点学单词ID列表
  passWords: string[]; // 已掌握单词ID列表
  coverImages: Record<string, string>; // 单词封面图 wordId → base64 data URI 或远程 URL
  lastSyncAt?: number; // 上次同步时间戳
}

// 用户设置
export interface UserSettings {
  speechRate: number; // 发音语速 0.5-2.0
  speechPitch: number; // 发音音调 0.5-2.0
  imageSource: 'bing' | 'unsplash' | 'pexels'; // 图片搜索引擎
  dictSource: 'bing' | 'google'; // 词典来源
  cardLayout: CardModule[]; // 卡片模块布局
}

// 学习模式状态
export interface LearningState {
  currentIndex: number; // 当前单词索引
  isImageExpanded: boolean;
  isDictExpanded: boolean;
}

// 单词列表筛选类型
export type WordListFilter = 'all' | 'star' | 'pass';

// 卡片模块类型
export type CardModuleType = 'word' | 'phonetic' | 'pos' | 'meaning' | 'etymology' | 'examples' | 'relatedWords' | 'imageButton' | 'dictButton';

// 卡片模块配置
export interface CardModule {
  id: CardModuleType;
  label: string;
  enabled: boolean;
}
