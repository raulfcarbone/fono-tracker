export function isCorrectOrder(current: string[], correct: string[]) {
  if (current.length !== correct.length) return false;
  return current.every((id, index) => id === correct[index]);
}

export function countCorrectPositions(current: string[], correct: string[]) {
  let ok = 0;
  for (let i = 0; i < Math.min(current.length, correct.length); i += 1) {
    if (current[i] === correct[i]) ok += 1;
  }
  return ok;
}
