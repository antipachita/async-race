export function getCarX(matrix: string): string {
  return matrix.slice(matrix.indexOf(',', 21) + 1, matrix.indexOf(',', 22)).trim();
}

export function getTableX(percent: HTMLElement | null): string {
  return percent!.style.top.replace('%', '');
}


