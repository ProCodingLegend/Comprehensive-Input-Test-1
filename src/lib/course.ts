import { LEVEL_ORDER, storiesForLang, type Level } from "./stories";
import type { LangCode } from "./languages";

export type CourseUnit = {
  id: string;
  title: string;
  blurb: string;
  stage: Level;
  lessonIds: string[];
};

export type LessonStatus = "locked" | "available" | "in_progress" | "completed" | "review";

type ProgressMap = Record<string, { completed?: boolean; heardScenes?: number[] }>;

const UNIT_STAGES: Level[] = [
  "superbeginner","superbeginner","superbeginner",
  "beginner","beginner","beginner","beginner",
  "intermediate","intermediate","advanced","advanced",
  "beginner","beginner","intermediate","intermediate",
  "advanced","advanced","advanced",
];

export function unitsForLang(lang: LangCode): CourseUnit[] {
  return UNIT_STAGES.map((stage, u) => {
    const n = u + 1;
    return {
      id: `${lang}-m${n}`,
      title: `Unit ${n}`,
      blurb: `CI path · 64 lessons · ${stage}`,
      stage,
      lessonIds: Array.from({ length: 64 }, (_, i) => `${lang}-u${n}-l${i + 1}`),
    };
  });
}

export function isReviewStage(stage: Level, start: Level) {
  return LEVEL_ORDER.indexOf(stage) < LEVEL_ORDER.indexOf(start);
}

export function requiredLessonIds(lang: LangCode, start: Level) {
  return unitsForLang(lang)
    .filter((u) => !isReviewStage(u.stage, start))
    .flatMap((u) => u.lessonIds);
}

export function orderedLessonIds(lang: LangCode) {
  return unitsForLang(lang).flatMap((u) => u.lessonIds);
}

function completed(progress: ProgressMap, id: string) {
  return Boolean(progress[id]?.completed);
}

export function lessonStatus(id: string, lang: LangCode, start: Level, progress: ProgressMap): LessonStatus {
  const units = unitsForLang(lang);
  const unit = units.find((u) => u.lessonIds.includes(id));
  if (!unit) return completed(progress, id) ? "completed" : "available";
  if (completed(progress, id)) return "completed";
  const p = progress[id];
  if (isReviewStage(unit.stage, start)) {
    if (p?.heardScenes?.length) return "in_progress";
    return "review";
  }
  const required = requiredLessonIds(lang, start);
  const idx = required.indexOf(id);
  if (idx === -1) return "available";
  const prior = required.slice(0, idx);
  if (!prior.every((lesson) => completed(progress, lesson))) return "locked";
  if (p?.heardScenes?.length) return "in_progress";
  return "available";
}

export function isLessonOpen(id: string, lang: LangCode, start: Level, progress: ProgressMap) {
  return lessonStatus(id, lang, start, progress) !== "locked";
}

export function nextLessonId(lang: LangCode, start: Level, progress: ProgressMap) {
  return requiredLessonIds(lang, start).find((id) => !completed(progress, id)) ?? null;
}

export function courseStats(lang: LangCode, start: Level, progress: ProgressMap) {
  const required = requiredLessonIds(lang, start);
  const done = required.filter((id) => completed(progress, id)).length;
  const total = required.length || 1;
  return { done, total: required.length, pct: Math.round((done / total) * 100), nextId: nextLessonId(lang, start, progress), complete: required.length > 0 && done === required.length };
}

export function unitProgress(unit: CourseUnit, progress: ProgressMap) {
  const done = unit.lessonIds.filter((id) => completed(progress, id)).length;
  return { done, total: unit.lessonIds.length, pct: unit.lessonIds.length ? Math.round((done / unit.lessonIds.length) * 100) : 0 };
}

export function seededStoryCount(lang: LangCode) {
  return storiesForLang(lang).length;
}

export function courseHours(_lang: LangCode) {
  return { lessons: 18 * 64, minutes: 18 * 64 * 10, hours: 192 };
}

export function statusLabel(status: LessonStatus) {
  switch (status) {
    case "locked": return "Locked";
    case "available": return "Up next";
    case "in_progress": return "In progress";
    case "completed": return "Done";
    case "review": return "Review";
  }
}
