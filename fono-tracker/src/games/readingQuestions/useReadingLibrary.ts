import { useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ensureSeedReadings, getReadingTable } from '../../library/readingLibrary';
import { type Difficulty, type ReadingItem } from '../../library/types';

export function useReadingLibrary(difficulty?: Difficulty) {
  const [seeded, setSeeded] = useState(false);
  const table = getReadingTable();

  useEffect(() => {
    ensureSeedReadings().finally(() => setSeeded(true));
  }, []);

  const readings = useLiveQuery(async () => {
    if (!seeded) return [] as ReadingItem[];
    const items = await table.toArray();
    if (difficulty) {
      return items.filter(item => item.difficulty === difficulty);
    }
    return items;
  }, [seeded, table, difficulty], [] as ReadingItem[]);

  const sorted = useMemo(() => {
    return [...(readings ?? [])].sort((a, b) => a.title.localeCompare(b.title));
  }, [readings]);

  return {
    readings: sorted,
    loading: !seeded && (readings?.length ?? 0) === 0,
    seeded,
  };
}
