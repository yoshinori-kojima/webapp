import { atom, useAtom } from 'jotai';
import { users }  from '../../shared/src/data/db/models/users';

// users型のatomを定義
export const currentUserAtom = atom<users | undefined>(undefined);

// メニューの展開状態を管理するatomを定義
export const expandedAtom = atom<string[]>([]);
