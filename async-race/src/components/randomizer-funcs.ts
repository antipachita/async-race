function randomCarName(): string {
  const firstPartName: string[] = ['Lada', 'Niva', 'Ford', 'Mers', 'BMW', 'Porsh', 'BMW', 'Gaz', 'Suzuki', 'Citroen'];
  const secondtPartName: string[] = ['Model A', 'Model B', 'Model C', 'Model D', 'Model F', 'Model G', 'Model H', 'Model J', 'Model K', 'Model L'];
  const randomElem: number = Math.floor(Math.random() * 10);
  return `${firstPartName[randomElem]} ${secondtPartName[randomElem]}`;
}

function randomCarColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

export default { randomCarName, randomCarColor };
