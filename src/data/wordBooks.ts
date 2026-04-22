/**
 * 单词书定义
 * id 对应 book/ 目录下的 JSON 文件名（不含 .json 后缀）
 * JSON 格式参考 dict-master/README.md
 */
import { Word, Phrase, SynonymGroup, RootWordGroup, ExamQuestion } from '../types';

export type WordBookCategory =
  | '四级'
  | '六级'
  | '考研'
  | '专四'
  | '专八'
  | '雅思'
  | 'TOEFL'
  | 'GRE'
  | 'SAT'
  | 'GMAT'
  | 'BEC'
  | '中学'
  | '小学'
  | '人教版'
  | '北师版'
  | '外研社版';

export interface WordBook {
  /** 单词书唯一 ID，对应 book/{id}.json */
  id: string;
  /** 展示名称 */
  name: string;
  /** 单词数量 */
  wordCount: number;
  /** 分类标签 */
  tags: WordBookCategory[];
  /** 来源机构 */
  publisher: '有道' | '新东方' | '人教版' | '北师版' | '外研社版';
}

export const WORD_BOOKS: WordBook[] = [
  // ── 四级 ───────────────────────────────────────────────
  { id: 'CET4luan_1',  name: '四级真题核心词（图片记忆）', wordCount: 1162, tags: ['四级'], publisher: '有道' },
  { id: 'CET4luan_2',  name: '四级英语词汇',               wordCount: 3739, tags: ['四级'], publisher: '有道' },
  { id: 'CET4_1',      name: '四级真题核心词（正序版）',    wordCount: 1162, tags: ['四级'], publisher: '有道' },
  { id: 'CET4_2',      name: '四级英语词汇（正序版）',      wordCount: 3739, tags: ['四级'], publisher: '有道' },
  { id: 'CET4_3',      name: '新东方四级词汇',              wordCount: 2607, tags: ['四级'], publisher: '新东方' },

  // ── 六级 ───────────────────────────────────────────────
  { id: 'CET6luan_1',  name: '六级真题核心词（图片记忆）', wordCount: 1228, tags: ['六级'], publisher: '有道' },
  { id: 'CET6_2',      name: '六级英语词汇',               wordCount: 2078, tags: ['六级'], publisher: '有道' },
  { id: 'CET6_1',      name: '六级真题核心词（正序版）',   wordCount: 1228, tags: ['六级'], publisher: '有道' },
  { id: 'CET6_3',      name: '新东方六级词汇',             wordCount: 2345, tags: ['六级'], publisher: '新东方' },

  // ── 考研 ───────────────────────────────────────────────
  { id: 'KaoYanluan_1', name: '考研必考词汇',              wordCount: 1341, tags: ['考研'], publisher: '有道' },
  { id: 'KaoYan_2',     name: '考研英语词汇',              wordCount: 4533, tags: ['考研'], publisher: '有道' },
  { id: 'KaoYan_1',     name: '考研必考词汇（正序版）',    wordCount: 1341, tags: ['考研'], publisher: '有道' },
  { id: 'KaoYan_3',     name: '新东方考研词汇',            wordCount: 3728, tags: ['考研'], publisher: '新东方' },

  // ── 专四 ───────────────────────────────────────────────
  { id: 'Level4luan_1', name: '专四真题高频词',            wordCount: 595,  tags: ['专四'], publisher: '有道' },
  { id: 'Level4luan_2', name: '专四核心词汇',              wordCount: 4025, tags: ['专四'], publisher: '有道' },
  { id: 'Level4_1',     name: '专四真题高频词（正序版）',  wordCount: 595,  tags: ['专四'], publisher: '有道' },
  { id: 'Level4_2',     name: '专四核心词汇（正序版）',    wordCount: 4025, tags: ['专四'], publisher: '有道' },

  // ── 专八 ───────────────────────────────────────────────
  { id: 'Level8_1',     name: '专八真题高频词',            wordCount: 684,   tags: ['专八'], publisher: '有道' },
  { id: 'Level8luan_2', name: '专八核心词汇',              wordCount: 12197, tags: ['专八'], publisher: '有道' },
  { id: 'Level8_2',     name: '专八核心词汇（正序版）',    wordCount: 12197, tags: ['专八'], publisher: '有道' },

  // ── 雅思 ───────────────────────────────────────────────
  { id: 'IELTSluan_2',  name: '雅思词汇',                 wordCount: 3427, tags: ['雅思'], publisher: '有道' },
  { id: 'IELTS_2',      name: '雅思词汇（正序版）',        wordCount: 3427, tags: ['雅思'], publisher: '有道' },
  { id: 'IELTS_3',      name: '新东方雅思词汇',            wordCount: 3575, tags: ['雅思'], publisher: '新东方' },

  // ── TOEFL ──────────────────────────────────────────────
  { id: 'TOEFL_2',      name: 'TOEFL 词汇',               wordCount: 9213, tags: ['TOEFL'], publisher: '有道' },
  { id: 'TOEFL_3',      name: '新东方 TOEFL 词汇',         wordCount: 4264, tags: ['TOEFL'], publisher: '新东方' },

  // ── GRE ────────────────────────────────────────────────
  { id: 'GRE_2',        name: 'GRE 词汇',                 wordCount: 7199, tags: ['GRE'], publisher: '有道' },
  { id: 'GRE_3',        name: '新东方 GRE 词汇',           wordCount: 6515, tags: ['GRE'], publisher: '新东方' },

  // ── SAT ────────────────────────────────────────────────
  { id: 'SAT_2',        name: 'SAT 词汇',                 wordCount: 4423, tags: ['SAT'], publisher: '有道' },
  { id: 'SAT_3',        name: '新东方 SAT 词汇',           wordCount: 4464, tags: ['SAT'], publisher: '新东方' },

  // ── GMAT ───────────────────────────────────────────────
  { id: 'GMATluan_2',   name: 'GMAT 词汇',                wordCount: 3254, tags: ['GMAT'], publisher: '有道' },
  { id: 'GMAT_2',       name: 'GMAT 词汇（正序版）',       wordCount: 3254, tags: ['GMAT'], publisher: '有道' },
  { id: 'GMAT_3',       name: '新东方 GMAT 词汇',          wordCount: 3047, tags: ['GMAT'], publisher: '新东方' },

  // ── BEC 商务英语 ────────────────────────────────────────
  { id: 'BEC_2',        name: '商务英语词汇',              wordCount: 2753, tags: ['BEC'], publisher: '有道' },
  { id: 'BEC_3',        name: '新东方 BEC 词汇',           wordCount: 2825, tags: ['BEC'], publisher: '新东方' },

  // ── 中学 ───────────────────────────────────────────────
  { id: 'ChuZhongluan_2', name: '中考必备词汇',            wordCount: 1420, tags: ['中学'], publisher: '有道' },
  { id: 'ChuZhong_2',    name: '初中英语词汇（正序版）',   wordCount: 1420, tags: ['中学'], publisher: '有道' },
  { id: 'ChuZhong_3',    name: '新东方初中词汇',           wordCount: 1803, tags: ['中学'], publisher: '新东方' },
  { id: 'GaoZhongluan_2', name: '高考必备词汇（图片记忆）', wordCount: 3668, tags: ['中学'], publisher: '有道' },
  { id: 'GaoZhong_2',    name: '高中英语词汇（正序版）',   wordCount: 3668, tags: ['中学'], publisher: '人教版' },
  { id: 'GaoZhong_3',    name: '新东方高中词汇',           wordCount: 2340, tags: ['中学'], publisher: '新东方' },

  // ── 人教版小学 ─────────────────────────────────────────
  { id: 'PEPXiaoXue3_1', name: '人教版小学英语-三年级上册', wordCount: 64,  tags: ['小学', '人教版'], publisher: '人教版' },
  { id: 'PEPXiaoXue3_2', name: '人教版小学英语-三年级下册', wordCount: 72,  tags: ['小学', '人教版'], publisher: '人教版' },
  { id: 'PEPXiaoXue4_1', name: '人教版小学英语-四年级上册', wordCount: 84,  tags: ['小学', '人教版'], publisher: '人教版' },
  { id: 'PEPXiaoXue4_2', name: '人教版小学英语-四年级下册', wordCount: 104, tags: ['小学', '人教版'], publisher: '人教版' },
  { id: 'PEPXiaoXue5_1', name: '人教版小学英语-五年级上册', wordCount: 131, tags: ['小学', '人教版'], publisher: '人教版' },
  { id: 'PEPXiaoXue5_2', name: '人教版小学英语-五年级下册', wordCount: 156, tags: ['小学', '人教版'], publisher: '人教版' },
  { id: 'PEPXiaoXue6_1', name: '人教版小学英语-六年级上册', wordCount: 130, tags: ['小学', '人教版'], publisher: '人教版' },
  { id: 'PEPXiaoXue6_2', name: '人教版小学英语-六年级下册', wordCount: 108, tags: ['小学', '人教版'], publisher: '人教版' },

  // ── 人教版初中 ─────────────────────────────────────────
  { id: 'PEPChuZhong7_1', name: '人教版初中英语-七年级上册', wordCount: 392, tags: ['中学', '人教版'], publisher: '人教版' },
  { id: 'PEPChuZhong7_2', name: '人教版初中英语-七年级下册', wordCount: 492, tags: ['中学', '人教版'], publisher: '人教版' },
  { id: 'PEPChuZhong8_1', name: '人教版初中英语-八年级上册', wordCount: 419, tags: ['中学', '人教版'], publisher: '人教版' },
  { id: 'PEPChuZhong8_2', name: '人教版初中英语-八年级下册', wordCount: 466, tags: ['中学', '人教版'], publisher: '人教版' },
  { id: 'PEPChuZhong9_1', name: '人教版初中英语-九年级全册', wordCount: 551, tags: ['中学', '人教版'], publisher: '人教版' },

  // ── 人教版高中 ─────────────────────────────────────────
  { id: 'PEPGaoZhong_1',  name: '人教版高中英语-必修 1',   wordCount: 311, tags: ['中学', '人教版'], publisher: '人教版' },
  { id: 'PEPGaoZhong_2',  name: '人教版高中英语-必修 2',   wordCount: 319, tags: ['中学', '人教版'], publisher: '人教版' },
  { id: 'PEPGaoZhong_3',  name: '人教版高中英语-必修 3',   wordCount: 366, tags: ['中学', '人教版'], publisher: '人教版' },
  { id: 'PEPGaoZhong_4',  name: '人教版高中英语-必修 4',   wordCount: 307, tags: ['中学', '人教版'], publisher: '人教版' },
  { id: 'PEPGaoZhong_5',  name: '人教版高中英语-必修 5',   wordCount: 357, tags: ['中学', '人教版'], publisher: '人教版' },
  { id: 'PEPGaoZhong_6',  name: '人教版高中英语-选修 6',   wordCount: 391, tags: ['中学', '人教版'], publisher: '人教版' },
  { id: 'PEPGaoZhong_7',  name: '人教版高中英语-选修 7',   wordCount: 384, tags: ['中学', '人教版'], publisher: '人教版' },
  { id: 'PEPGaoZhong_8',  name: '人教版高中英语-选修 8',   wordCount: 420, tags: ['中学', '人教版'], publisher: '人教版' },
  { id: 'PEPGaoZhong_9',  name: '人教版高中英语-选修 9',   wordCount: 352, tags: ['中学', '人教版'], publisher: '人教版' },
  { id: 'PEPGaoZhong_10', name: '人教版高中英语-选修 10',  wordCount: 361, tags: ['中学', '人教版'], publisher: '人教版' },
  { id: 'PEPGaoZhong_11', name: '人教版高中英语-选修 11',  wordCount: 309, tags: ['中学', '人教版'], publisher: '人教版' },

  // ── 外研社版初中 ────────────────────────────────────────
  { id: 'WaiYanSheChuZhong_1', name: '外研社版初中英语-七年级上册', wordCount: 629, tags: ['中学', '外研社版'], publisher: '外研社版' },
  { id: 'WaiYanSheChuZhong_2', name: '外研社版初中英语-七年级下册', wordCount: 438, tags: ['中学', '外研社版'], publisher: '外研社版' },
  { id: 'WaiYanSheChuZhong_3', name: '外研社版初中英语-八年级上册', wordCount: 320, tags: ['中学', '外研社版'], publisher: '外研社版' },
  { id: 'WaiYanSheChuZhong_4', name: '外研社版初中英语-八年级下册', wordCount: 266, tags: ['中学', '外研社版'], publisher: '外研社版' },
  { id: 'WaiYanSheChuZhong_5', name: '外研社版初中英语-九年级上册', wordCount: 381, tags: ['中学', '外研社版'], publisher: '外研社版' },
  { id: 'WaiYanSheChuZhong_6', name: '外研社版初中英语-九年级下册', wordCount: 128, tags: ['中学', '外研社版'], publisher: '外研社版' },

  // ── 北师大版高中 ────────────────────────────────────────
  { id: 'BeiShiGaoZhong_1',  name: '北师大版高中必修一',   wordCount: 226, tags: ['中学', '北师版'], publisher: '北师版' },
  { id: 'BeiShiGaoZhong_2',  name: '北师大版高中必修二',   wordCount: 244, tags: ['中学', '北师版'], publisher: '北师版' },
  { id: 'BeiShiGaoZhong_3',  name: '北师大版高中必修三',   wordCount: 295, tags: ['中学', '北师版'], publisher: '北师版' },
  { id: 'BeiShiGaoZhong_4',  name: '北师大版高中必修四',   wordCount: 336, tags: ['中学', '北师版'], publisher: '北师版' },
  { id: 'BeiShiGaoZhong_5',  name: '北师大版高中必修五',   wordCount: 327, tags: ['中学', '北师版'], publisher: '北师版' },
  { id: 'BeiShiGaoZhong_6',  name: '北师大版高中选修六',   wordCount: 271, tags: ['中学', '北师版'], publisher: '北师版' },
  { id: 'BeiShiGaoZhong_7',  name: '北师大版高中选修七',   wordCount: 334, tags: ['中学', '北师版'], publisher: '北师版' },
  { id: 'BeiShiGaoZhong_8',  name: '北师大版高中选修八',   wordCount: 364, tags: ['中学', '北师版'], publisher: '北师版' },
  { id: 'BeiShiGaoZhong_9',  name: '北师大版高中选修九',   wordCount: 299, tags: ['中学', '北师版'], publisher: '北师版' },
  { id: 'BeiShiGaoZhong_10', name: '北师大版高中选修十',   wordCount: 267, tags: ['中学', '北师版'], publisher: '北师版' },
  { id: 'BeiShiGaoZhong_11', name: '北师大版高中选修十一', wordCount: 330, tags: ['中学', '北师版'], publisher: '北师版' },
];

/** 通过 id 快速查找单词书元信息 */
export const WORD_BOOK_MAP: Record<string, WordBook> = Object.fromEntries(
  WORD_BOOKS.map(book => [book.id, book])
);

// ── 模块级缓存 ─────────────────────────────────────────────
let _cachedBookId = '';
let _cachedWords: Word[] = [];
let _cachedWordMap: Map<string, Word> = new Map();

/** 获取指定单词书的全部 Word[]（带缓存） */
export function getWordsForBook(bookId: string): Word[] {
  if (bookId === _cachedBookId && _cachedWords.length > 0) {
    return _cachedWords;
  }
  _cachedWords = loadWordsFromBook(bookId);
  _cachedBookId = bookId;
  _cachedWordMap = new Map(_cachedWords.map(w => [w.id, w]));
  return _cachedWords;
}

/** 从已缓存的单词书中按 ID 查找单词 */
export function getWordByIdFromBook(bookId: string, wordId: string): Word | undefined {
  getWordsForBook(bookId); // 确保缓存已加载
  return _cachedWordMap.get(wordId);
}

/** 清除缓存（切换词书时调用） */
export function clearBookCache(): void {
  _cachedBookId = '';
  _cachedWords = [];
  _cachedWordMap = new Map();
}

/**
 * 将单词书 JSON 转换为 APP 内部的 Word[].
 * JSON 格式参考 dict-master/README.md。
 */

function jsonEntryToWord(entry: any): Word {
  const wordContent = entry?.content?.word?.content ?? {};
  const wordId = entry?.content?.word?.wordId ?? entry?.headWord ?? String(entry?.wordRank ?? '');

  // 中文释义
  const trans: any[] = wordContent?.trans ?? [];
  const meaning = trans.map((t: any) => `${t.pos ? t.pos + '. ' : ''}${(t.tranCn ?? '').trim()}`).join('；') || '';

  // 英英释义：取第一个有 tranOther 的词性
  const meaningEn = trans.map((t: any) => t.tranOther).filter(Boolean).join('; ') || undefined;

  // 音标：优先美音
  const phonetic = wordContent?.usphone
    ? `/${wordContent.usphone}/`
    : wordContent?.ukphone
    ? `/${wordContent.ukphone}/`
    : '';

  // 例句
  const sentences: any[] = wordContent?.sentence?.sentences ?? [];
  const examples = sentences.slice(0, 3).map((s: any) => ({
    sentence: s.sContent ?? '',
    translation: s.sCn ?? '',
  }));

  // 词性
  const pos = trans[0]?.pos ?? '';

  // 记忆方法（词根词缀）
  const etymology = wordContent?.remMethod?.val?.trim() || undefined;

  // 短语搭配
  const rawPhrases: any[] = wordContent?.phrase?.phrases ?? [];
  const phrases: Phrase[] | undefined = rawPhrases.length > 0
    ? rawPhrases.slice(0, 8).map((p: any) => ({ en: p.pContent ?? '', cn: p.pCn ?? '' }))
    : undefined;

  // 近义词（结构化）
  const rawSynos: any[] = wordContent?.syno?.synos ?? [];
  const synonyms: SynonymGroup[] | undefined = rawSynos.length > 0
    ? rawSynos.map((s: any) => ({
        pos: s.pos ?? '',
        meaning: s.tran ?? '',
        words: (s.hwds ?? []).map((h: any) => h.w as string),
      }))
    : undefined;

  // 同根词（结构化）
  const rawRels: any[] = wordContent?.relWord?.rels ?? [];
  const rootWords: RootWordGroup[] | undefined = rawRels.length > 0
    ? rawRels.map((r: any) => ({
        pos: r.pos ?? '',
        words: (r.words ?? []).map((w: any) => ({
          word: w.hwd ?? '',
          meaning: (w.tran ?? '').trim(),
        })),
      }))
    : undefined;

  // 考试真题
  const rawExam: any[] = wordContent?.exam ?? [];
  const examQuestions: ExamQuestion[] | undefined = rawExam.length > 0
    ? rawExam.map((e: any) => ({
        question: e.question ?? '',
        choices: (e.choices ?? []).sort((a: any, b: any) => a.choiceIndex - b.choiceIndex).map((c: any) => c.choice ?? ''),
        rightIndex: (e.answer?.rightIndex ?? 1) - 1, // 转 0-based
        explain: e.answer?.explain?.trim() || undefined,
      }))
    : undefined;

  // 向后兼容：扁平 relatedWords
  const synoWords: string[] = rawSynos.flatMap((s: any) => (s.hwds ?? []).map((h: any) => h.w as string));
  const relWords: string[] = rawRels.flatMap((r: any) => (r.words ?? []).map((w: any) => w.hwd as string));
  const relatedWords = [...new Set([...synoWords, ...relWords])].slice(0, 6);

  return {
    id: wordId,
    word: entry.headWord ?? '',
    phonetic,
    pos,
    meaning,
    meaningEn,
    etymology,
    examples,
    phrases,
    synonyms,
    rootWords,
    examQuestions,
    relatedWords: relatedWords.length > 0 ? relatedWords : undefined,
  };
}

/**
 * 根据单词书 id 加载并转换为 Word[]。
 * 注意：部分大词书（如 Level8_2）较大，首次加载稍慢。
 */
function loadWordsFromBook(id: string): Word[] {
  const json: any[] = getWordBookJson(id);
  return json.map(jsonEntryToWord);
}

/**
 * 获取单词书对应的 JSON。
 * 由于 React Native bundler 不支持动态 require，
 * 需要用 switch 枚举所有 id。
 */
export function getWordBookJson(id: string): any {
  switch (id) {
    case 'CET4luan_1':       return require('./book/CET4luan_1.json');
    case 'CET4luan_2':       return require('./book/CET4luan_2.json');
    case 'CET4_1':           return require('./book/CET4_1.json');
    case 'CET4_2':           return require('./book/CET4_2.json');
    case 'CET4_3':           return require('./book/CET4_3.json');
    case 'CET6luan_1':       return require('./book/CET6luan_1.json');
    case 'CET6_2':           return require('./book/CET6_2.json');
    case 'CET6_1':           return require('./book/CET6_1.json');
    case 'CET6_3':           return require('./book/CET6_3.json');
    case 'KaoYanluan_1':     return require('./book/KaoYanluan_1.json');
    case 'KaoYan_2':         return require('./book/KaoYan_2.json');
    case 'KaoYan_1':         return require('./book/KaoYan_1.json');
    case 'KaoYan_3':         return require('./book/KaoYan_3.json');
    case 'Level4luan_1':     return require('./book/Level4luan_1.json');
    case 'Level4luan_2':     return require('./book/Level4luan_2.json');
    case 'Level4_1':         return require('./book/Level4_1.json');
    case 'Level4_2':         return require('./book/Level4_2.json');
    case 'Level8_1':         return require('./book/Level8_1.json');
    case 'Level8luan_2':     return require('./book/Level8luan_2.json');
    case 'Level8_2':         return require('./book/Level8_2.json');
    case 'IELTSluan_2':      return require('./book/IELTSluan_2.json');
    case 'IELTS_2':          return require('./book/IELTS_2.json');
    case 'IELTS_3':          return require('./book/IELTS_3.json');
    case 'TOEFL_2':          return require('./book/TOEFL_2.json');
    case 'TOEFL_3':          return require('./book/TOEFL_3.json');
    case 'GRE_2':            return require('./book/GRE_2.json');
    case 'GRE_3':            return require('./book/GRE_3.json');
    case 'SAT_2':            return require('./book/SAT_2.json');
    case 'SAT_3':            return require('./book/SAT_3.json');
    case 'GMATluan_2':       return require('./book/GMATluan_2.json');
    case 'GMAT_2':           return require('./book/GMAT_2.json');
    case 'GMAT_3':           return require('./book/GMAT_3.json');
    case 'BEC_2':            return require('./book/BEC_2.json');
    case 'BEC_3':            return require('./book/BEC_3.json');
    case 'ChuZhongluan_2':   return require('./book/ChuZhongluan_2.json');
    case 'ChuZhong_2':       return require('./book/ChuZhong_2.json');
    case 'ChuZhong_3':       return require('./book/ChuZhong_3.json');
    case 'GaoZhongluan_2':   return require('./book/GaoZhongluan_2.json');
    case 'GaoZhong_2':       return require('./book/GaoZhong_2.json');
    case 'GaoZhong_3':       return require('./book/GaoZhong_3.json');
    case 'PEPXiaoXue3_1':    return require('./book/PEPXiaoXue3_1.json');
    case 'PEPXiaoXue3_2':    return require('./book/PEPXiaoXue3_2.json');
    case 'PEPXiaoXue4_1':    return require('./book/PEPXiaoXue4_1.json');
    case 'PEPXiaoXue4_2':    return require('./book/PEPXiaoXue4_2.json');
    case 'PEPXiaoXue5_1':    return require('./book/PEPXiaoXue5_1.json');
    case 'PEPXiaoXue5_2':    return require('./book/PEPXiaoXue5_2.json');
    case 'PEPXiaoXue6_1':    return require('./book/PEPXiaoXue6_1.json');
    case 'PEPXiaoXue6_2':    return require('./book/PEPXiaoXue6_2.json');
    case 'PEPChuZhong7_1':   return require('./book/PEPChuZhong7_1.json');
    case 'PEPChuZhong7_2':   return require('./book/PEPChuZhong7_2.json');
    case 'PEPChuZhong8_1':   return require('./book/PEPChuZhong8_1.json');
    case 'PEPChuZhong8_2':   return require('./book/PEPChuZhong8_2.json');
    case 'PEPChuZhong9_1':   return require('./book/PEPChuZhong9_1.json');
    case 'PEPGaoZhong_1':    return require('./book/PEPGaoZhong_1.json');
    case 'PEPGaoZhong_2':    return require('./book/PEPGaoZhong_2.json');
    case 'PEPGaoZhong_3':    return require('./book/PEPGaoZhong_3.json');
    case 'PEPGaoZhong_4':    return require('./book/PEPGaoZhong_4.json');
    case 'PEPGaoZhong_5':    return require('./book/PEPGaoZhong_5.json');
    case 'PEPGaoZhong_6':    return require('./book/PEPGaoZhong_6.json');
    case 'PEPGaoZhong_7':    return require('./book/PEPGaoZhong_7.json');
    case 'PEPGaoZhong_8':    return require('./book/PEPGaoZhong_8.json');
    case 'PEPGaoZhong_9':    return require('./book/PEPGaoZhong_9.json');
    case 'PEPGaoZhong_10':   return require('./book/PEPGaoZhong_10.json');
    case 'PEPGaoZhong_11':   return require('./book/PEPGaoZhong_11.json');
    case 'WaiYanSheChuZhong_1': return require('./book/WaiYanSheChuZhong_1.json');
    case 'WaiYanSheChuZhong_2': return require('./book/WaiYanSheChuZhong_2.json');
    case 'WaiYanSheChuZhong_3': return require('./book/WaiYanSheChuZhong_3.json');
    case 'WaiYanSheChuZhong_4': return require('./book/WaiYanSheChuZhong_4.json');
    case 'WaiYanSheChuZhong_5': return require('./book/WaiYanSheChuZhong_5.json');
    case 'WaiYanSheChuZhong_6': return require('./book/WaiYanSheChuZhong_6.json');
    case 'BeiShiGaoZhong_1':  return require('./book/BeiShiGaoZhong_1.json');
    case 'BeiShiGaoZhong_2':  return require('./book/BeiShiGaoZhong_2.json');
    case 'BeiShiGaoZhong_3':  return require('./book/BeiShiGaoZhong_3.json');
    case 'BeiShiGaoZhong_4':  return require('./book/BeiShiGaoZhong_4.json');
    case 'BeiShiGaoZhong_5':  return require('./book/BeiShiGaoZhong_5.json');
    case 'BeiShiGaoZhong_6':  return require('./book/BeiShiGaoZhong_6.json');
    case 'BeiShiGaoZhong_7':  return require('./book/BeiShiGaoZhong_7.json');
    case 'BeiShiGaoZhong_8':  return require('./book/BeiShiGaoZhong_8.json');
    case 'BeiShiGaoZhong_9':  return require('./book/BeiShiGaoZhong_9.json');
    case 'BeiShiGaoZhong_10': return require('./book/BeiShiGaoZhong_10.json');
    case 'BeiShiGaoZhong_11': return require('./book/BeiShiGaoZhong_11.json');
    default:
      throw new Error(`Unknown word book id: ${id}`);
  }
}
