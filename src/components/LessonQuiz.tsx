import React, {useEffect, useState} from 'react';
import {CheckCircle2, XCircle} from 'lucide-react';
import {useLanguage} from '../i18n/LanguageContext';
import type {QuizQuestion} from '../types/trading';

interface LessonQuizProps {
  lessonId: string;
  questions: QuizQuestion[];
  bestScore?: number;
  onComplete: (score: number, total: number) => void;
}

export const LessonQuiz: React.FC<LessonQuizProps> = ({lessonId, questions, bestScore, onComplete}) => {
  const {t} = useLanguage();
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSelected({});
    setSubmitted(false);
  }, [lessonId]);

  const answeredCount = Object.keys(selected).length;
  const allAnswered = answeredCount === questions.length;
  const score = questions.reduce((acc, q) => (selected[q.id] === q.correctIndex ? acc + 1 : acc), 0);
  const passed = score >= Math.ceil(questions.length * 0.75);

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
    onComplete(score, questions.length);
  };

  const handleRetake = () => {
    setSelected({});
    setSubmitted(false);
  };

  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] p-5 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
            {t.academy.quizTitle} ({questions.length} {t.academy.questionsWord})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.academy.quizPassRule}
            {bestScore !== undefined && bestScore > 0 ? ` ${t.academy.bestScore} ${bestScore}/${questions.length}.` : ''}
          </p>
        </div>
        {submitted && (
          <span
            className={`font-mono text-sm font-semibold ${
              passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {t.academy.scoreLabel} {score}/{questions.length} · {passed ? t.academy.passed : t.academy.tryAgain}
          </span>
        )}
      </div>

      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const picked = selected[q.id];
          const isCorrect = picked === q.correctIndex;

          return (
            <div key={q.id} className="space-y-2.5">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {qIdx + 1}. {q.question}
              </p>

              <div className="grid grid-cols-1 gap-2">
                {q.options.map((opt, optIdx) => {
                  const isPicked = picked === optIdx;
                  const isRightAnswer = optIdx === q.correctIndex;

                  let style =
                    'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#090D16]/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700';

                  if (submitted) {
                    if (isRightAnswer) {
                      style =
                        'border-emerald-500/60 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200';
                    } else if (isPicked && !isRightAnswer) {
                      style = 'border-red-500/60 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200';
                    }
                  } else if (isPicked) {
                    style =
                      'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => setSelected((prev) => ({...prev, [q.id]: optIdx}))}
                      className={`w-full text-start px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm transition-colors flex items-center justify-between gap-3 ${
                        submitted ? 'cursor-default' : 'cursor-pointer'
                      } ${style}`}
                    >
                      <span>{opt}</span>
                      {submitted && isRightAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                      {submitted && isPicked && !isRightAnswer && (
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <p
                  className={`text-xs leading-relaxed pt-1 ${
                    isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <strong>{t.academy.explanation}</strong> {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
        {!submitted ? (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors cursor-pointer"
          >
            {t.academy.checkAnswers} ({answeredCount}/{questions.length})
          </button>
        ) : (
          <button
            type="button"
            onClick={handleRetake}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            {t.academy.retakeQuiz}
          </button>
        )}
      </div>
    </section>
  );
};
