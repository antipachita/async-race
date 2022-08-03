export function getCarX(matrix: string): string {
  return matrix.slice(matrix.indexOf(',', 21)+1, matrix.indexOf(',', 22)).trim();
};

