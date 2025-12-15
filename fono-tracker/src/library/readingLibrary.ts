import { Table } from 'dexie';
import { db } from '../db';
import { readingSeed } from './seed';
import { type ReadingItem } from './types';

const readingTable: Table<ReadingItem, string> = db.table('readingLibrary');

function withTimestamps(item: ReadingItem): ReadingItem {
  const now = Date.now();
  return {
    ...item,
    createdAt: item.createdAt ?? now,
    updatedAt: now,
  };
}

export async function ensureSeedReadings(): Promise<void> {
  const count = await readingTable.count();
  if (count === 0) {
    await readingTable.bulkAdd(readingSeed.map(withTimestamps));
  }
}

export async function listReadings(): Promise<ReadingItem[]> {
  return readingTable.orderBy('title').toArray();
}

export function getReadingTable() {
  return readingTable;
}

function safeId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `reading-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export async function saveReading(item: ReadingItem): Promise<string> {
  const id = item.id || safeId();
  await readingTable.put(withTimestamps({ ...item, id }));
  return id;
}

export async function deleteReading(id: string) {
  await readingTable.delete(id);
}

export async function duplicateReading(id: string) {
  const source = await readingTable.get(id);
  if (!source) return;
  const copy: ReadingItem = {
    ...source,
    id: safeId(),
    title: `${source.title} (copia)`,
    createdAt: undefined,
    updatedAt: undefined,
    questions: source.questions.map(q => ({ ...q, id: safeId() })),
  };
  await readingTable.add(withTimestamps(copy));
}

export async function exportReadings(ids?: string[]): Promise<string> {
  const data = ids?.length ? await readingTable.where('id').anyOf(ids).toArray() : await listReadings();
  return JSON.stringify(data, null, 2);
}

export async function importReadings(payload: ReadingItem[]) {
  if (!Array.isArray(payload)) return;
  const normalized = payload.map(item => ({ ...item, id: item.id || safeId() })).map(withTimestamps);
  await readingTable.bulkPut(normalized);
}
