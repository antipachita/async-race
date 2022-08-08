function randomCarName(): string {
  const firstPartName = ['Lada', 'Niva', 'Ford', 'Mers', 'BMW', 'Porsh', 'BMW', 'Gaz', 'Suzuki', 'Citroen'];
  const secondtPartName = ['Model A', 'Model B', 'Model C', 'Model D', 'Model F', 'Model G', 'Model H', 'Model J', 'Model K', 'Model L'];
  const randomElem = Math.floor(Math.random() * 10);
  return `${firstPartName[randomElem]} ${secondtPartName[randomElem]}`;
}

function randomCarColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

export default { randomCarName, randomCarColor };