import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Plus, RefreshCcw, Upload, BookOpenText, Copy, Trash2 } from 'lucide-react';
import { useTranslation } from '../i18n';
import { useReadingLibrary } from '../games/readingQuestions/useReadingLibrary';
import {
  deleteReading,
  duplicateReading,
  exportReadings,
  importReadings,
  saveReading,
} from '../library/readingLibrary';
import { type Difficulty, type QType, type Question, type ReadingItem } from '../library/types';

const QUESTION_TYPES: { id: QType; labelKey: string }[] = [
  { id: 'literal', labelKey: 'interactiveActivities.games.readingQuestions.types.literal' },
  { id: 'inferencial', labelKey: 'interactiveActivities.games.readingQuestions.types.inferencial' },
  { id: 'emociones', labelKey: 'interactiveActivities.games.readingQuestions.types.emociones' },
  { id: 'figurado', labelKey: 'interactiveActivities.games.readingQuestions.types.figurado' },
];

const defaultQuestion = (index: number): Question => ({
  id: `q-${Date.now()}-${index}`,
  type: 'literal',
  prompt: '',
  options: ['', '', ''],
  correctIndex: 0,
  explanation: '',
});

function emptyReading(): ReadingItem {
  return {
    id: '',
    title: '',
    difficulty: 1,
    text: '',
    image: '',
    questions: [defaultQuestion(0)],
  };
}

export function ReadingLibraryPage() {
  const { t } = useTranslation();
  const { readings, loading } = useReadingLibrary();
  const [therapistUnlocked, setTherapistUnlocked] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('reading-library-therapist') === 'true';
  });
  const [draft, setDraft] = useState<ReadingItem>(emptyReading());
  const [selectedId, setSelectedId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!therapistUnlocked && typeof window !== 'undefined') {
      localStorage.setItem('reading-library-therapist', 'false');
    }
  }, [therapistUnlocked]);

  useEffect(() => {
    if (!selectedId && readings.length) {
      setSelectedId(readings[0].id);
      setDraft(readings[0]);
    }
  }, [readings, selectedId]);

  const selectedReading = useMemo(() => readings.find(item => item.id === selectedId), [readings, selectedId]);

  useEffect(() => {
    if (selectedReading) {
      setDraft(selectedReading);
    }
  }, [selectedReading]);

  function handleFieldChange(field: keyof ReadingItem, value: string | Difficulty) {
    setDraft(prev => ({ ...prev, [field]: value } as ReadingItem));
  }

  function handleQuestionChange(index: number, payload: Partial<Question>) {
    setDraft(prev => {
      const questions = [...prev.questions];
      questions[index] = { ...questions[index], ...payload } as Question;
      return { ...prev, questions } as ReadingItem;
    });
  }

  function handleOptionChange(qIndex: number, optIndex: number, value: string) {
    setDraft(prev => {
      const questions = [...prev.questions];
      const options = [...questions[qIndex].options];
      options[optIndex] = value;
      questions[qIndex] = { ...questions[qIndex], options } as Question;
      return { ...prev, questions } as ReadingItem;
    });
  }

  function addOption(qIndex: number) {
    setDraft(prev => {
      const questions = [...prev.questions];
      const options = [...questions[qIndex].options, ''];
      questions[qIndex] = { ...questions[qIndex], options } as Question;
      return { ...prev, questions } as ReadingItem;
    });
  }

  function addQuestion() {
    setDraft(prev => ({ ...prev, questions: [...prev.questions, defaultQuestion(prev.questions.length)] }));
  }

  function deleteQuestion(index: number) {
    setDraft(prev => ({ ...prev, questions: prev.questions.filter((_, i) => i !== index) }));
  }

  async function handleSave() {
    const sanitized: ReadingItem = {
      ...draft,
      title: draft.title.trim(),
      text: draft.text.trim(),
      questions: draft.questions.map(q => ({
        ...q,
        prompt: q.prompt.trim(),
        explanation: q.explanation.trim(),
        evidence: q.evidence?.trim(),
        options: q.options.map(opt => opt.trim()),
      })),
    };
    const id = await saveReading(sanitized);
    setSelectedId(id);
    setMessage(t('readingLibrary.messages.saved'));
  }

  async function handleDelete(id: string) {
    if (!id) return;
    await deleteReading(id);
    setMessage(t('readingLibrary.messages.deleted'));
    setDraft(emptyReading());
    setSelectedId('');
  }

  async function handleDuplicate(id: string) {
    await duplicateReading(id);
    setMessage(t('readingLibrary.messages.duplicated'));
  }

  async function handleExport() {
    const data = await exportReadings();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'biblioteca-lecturas.json';
    link.click();
    URL.revokeObjectURL(url);
    setMessage(t('readingLibrary.messages.exported'));
  }

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const payload = JSON.parse(text) as ReadingItem[];
      await importReadings(payload);
      setMessage(t('readingLibrary.messages.imported'));
    } catch (error) {
      console.error(error);
      setMessage(t('readingLibrary.messages.importError'));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function startNew() {
    setSelectedId('');
    setDraft(emptyReading());
  }

  if (!therapistUnlocked) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-teal-700">
          <BookOpenText className="h-6 w-6" />
          <h1 className="text-2xl font-bold">{t('readingLibrary.title')}</h1>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2 text-amber-800">
          <p className="font-semibold">{t('readingLibrary.therapistOnly.title')}</p>
          <p className="text-sm">{t('readingLibrary.therapistOnly.description')}</p>
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-3 py-2 rounded-lg text-sm"
            onClick={() => {
              setTherapistUnlocked(true);
              if (typeof window !== 'undefined') localStorage.setItem('reading-library-therapist', 'true');
            }}
          >
            {t('readingLibrary.therapistOnly.cta')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-teal-700 font-semibold">
            {t('readingLibrary.badge')}
          </p>
          <h1 className="text-3xl font-bold text-slate-900">{t('readingLibrary.title')}</h1>
          <p className="text-slate-600 text-sm max-w-3xl">{t('readingLibrary.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={startNew}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-800 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" /> {t('readingLibrary.actions.new')}
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-800"
          >
            <Download className="h-4 w-4" /> {t('readingLibrary.actions.export')}
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-800"
          >
            <Upload className="h-4 w-4" /> {t('readingLibrary.actions.import')}
          </button>
          <input type="file" accept="application/json" ref={fileInputRef} className="hidden" onChange={handleImport} />
        </div>
      </div>

      {message && <div className="text-sm text-teal-700 bg-teal-50 border border-teal-100 rounded-lg px-3 py-2">{message}</div>}

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 lg:col-span-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">{t('readingLibrary.list.title')}</p>
            <span className="text-xs text-slate-500">{t('readingLibrary.list.count', { count: readings.length })}</span>
          </div>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {loading && <p className="text-sm text-slate-600">{t('readingLibrary.list.loading')}</p>}
            {!loading && readings.length === 0 && (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-2">
                {t('readingLibrary.list.empty')}
              </p>
            )}
            {readings.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`w-full text-left border rounded-lg px-3 py-2 ${
                  selectedId === item.id
                    ? 'border-teal-500 bg-teal-50 text-teal-800'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                }`}
              >
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs text-slate-500">
                  {t('interactiveActivities.games.readingQuestions.difficulties.' + item.difficulty)} · {item.questions.length}{' '}
                  {t('readingLibrary.list.questions')}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">{t('readingLibrary.editor.title')}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <button
                type="button"
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200"
                onClick={() => selectedId && handleDuplicate(selectedId)}
                disabled={!selectedId}
              >
                <Copy className="h-4 w-4" /> {t('readingLibrary.actions.duplicate')}
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 text-rose-700"
                onClick={() => selectedId && handleDelete(selectedId)}
                disabled={!selectedId}
              >
                <Trash2 className="h-4 w-4" /> {t('readingLibrary.actions.delete')}
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-semibold text-slate-800">{t('readingLibrary.editor.fields.title')}</span>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-lg px-3 py-2"
                value={draft.title}
                onChange={e => handleFieldChange('title', e.target.value)}
                placeholder={t('readingLibrary.editor.placeholders.title')}
              />
            </label>
            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-semibold text-slate-800">{t('readingLibrary.editor.fields.difficulty')}</span>
              <select
                className="w-full border border-slate-200 rounded-lg px-3 py-2"
                value={draft.difficulty}
                onChange={e => handleFieldChange('difficulty', Number(e.target.value) as Difficulty)}
              >
                {[1, 2, 3].map(level => (
                  <option key={level} value={level}>
                    {t('interactiveActivities.games.readingQuestions.difficulties.' + level)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="space-y-1 text-sm text-slate-700 block">
            <span className="font-semibold text-slate-800">{t('readingLibrary.editor.fields.text')}</span>
            <textarea
              className="w-full border border-slate-200 rounded-lg px-3 py-2 min-h-[120px]"
              value={draft.text}
              onChange={e => handleFieldChange('text', e.target.value)}
              placeholder={t('readingLibrary.editor.placeholders.text')}
            />
          </label>

          <label className="space-y-1 text-sm text-slate-700 block">
            <span className="font-semibold text-slate-800">{t('readingLibrary.editor.fields.image')}</span>
            <input
              type="text"
              className="w-full border border-slate-200 rounded-lg px-3 py-2"
              value={draft.image ?? ''}
              onChange={e => handleFieldChange('image', e.target.value)}
              placeholder={t('readingLibrary.editor.placeholders.image')}
            />
            <p className="text-xs text-slate-500">{t('readingLibrary.editor.hints.image')}</p>
          </label>

          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">{t('readingLibrary.editor.questions.title')}</p>
            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-800 text-sm"
            >
              <Plus className="h-4 w-4" /> {t('readingLibrary.editor.questions.add')}
            </button>
          </div>

          <div className="space-y-4">
            {draft.questions.map((q, index) => (
              <div key={q.id} className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50/60">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800">
                    {t('readingLibrary.editor.questions.label', { index: index + 1 })}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <label className="flex items-center gap-1">
                      <span>{t('readingLibrary.editor.questions.type')}</span>
                      <select
                        className="border border-slate-200 rounded px-2 py-1"
                        value={q.type}
                        onChange={e => handleQuestionChange(index, { type: e.target.value as QType })}
                      >
                        {QUESTION_TYPES.map(type => (
                          <option key={type.id} value={type.id}>
                            {t(type.labelKey)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      onClick={() => deleteQuestion(index)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 text-rose-700"
                      disabled={draft.questions.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <label className="space-y-1 text-xs text-slate-700 block">
                  <span className="font-semibold text-slate-800">{t('readingLibrary.editor.questions.fields.prompt')}</span>
                  <textarea
                    className="w-full border border-slate-200 rounded-lg px-3 py-2"
                    value={q.prompt}
                    onChange={e => handleQuestionChange(index, { prompt: e.target.value })}
                    placeholder={t('readingLibrary.editor.questions.placeholders.prompt')}
                  />
                </label>

                <div className="space-y-1 text-xs text-slate-700">
                  <span className="font-semibold text-slate-800">{t('readingLibrary.editor.questions.fields.options')}</span>
                  <div className="space-y-1">
                    {q.options.map((opt, optIndex) => (
                      <label key={`${q.id}-opt-${optIndex}`} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={q.correctIndex === optIndex}
                          onChange={() => handleQuestionChange(index, { correctIndex: optIndex })}
                          className="text-teal-600"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={e => handleOptionChange(index, optIndex, e.target.value)}
                          className="flex-1 border border-slate-200 rounded-lg px-3 py-2"
                          placeholder={t('readingLibrary.editor.questions.placeholders.option')}
                        />
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addOption(index)}
                    className="inline-flex items-center gap-1 text-teal-700 text-xs"
                  >
                    <Plus className="h-4 w-4" /> {t('readingLibrary.editor.questions.actions.addOption')}
                  </button>
                </div>

                <label className="space-y-1 text-xs text-slate-700 block">
                  <span className="font-semibold text-slate-800">{t('readingLibrary.editor.questions.fields.explanation')}</span>
                  <textarea
                    className="w-full border border-slate-200 rounded-lg px-3 py-2"
                    value={q.explanation}
                    onChange={e => handleQuestionChange(index, { explanation: e.target.value })}
                    placeholder={t('readingLibrary.editor.questions.placeholders.explanation')}
                  />
                </label>

                <label className="space-y-1 text-xs text-slate-700 block">
                  <span className="font-semibold text-slate-800">{t('readingLibrary.editor.questions.fields.evidence')}</span>
                  <input
                    type="text"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2"
                    value={q.evidence ?? ''}
                    onChange={e => handleQuestionChange(index, { evidence: e.target.value })}
                    placeholder={t('readingLibrary.editor.questions.placeholders.evidence')}
                  />
                  <p className="text-[11px] text-slate-500">{t('readingLibrary.editor.questions.hints.evidence')}</p>
                </label>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setDraft(selectedReading ?? emptyReading())}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800"
            >
              <RefreshCcw className="h-4 w-4" /> {t('readingLibrary.actions.reset')}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold shadow"
            >
              {t('readingLibrary.actions.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
