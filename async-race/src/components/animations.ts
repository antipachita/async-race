import { getCarX } from './helpers';
import { getTableX } from './helpers';
import api from './api-functions';
import { IWinnerInfo, IEngineStatus } from './interfaces';

function animationPreparing(car: HTMLElement): void {
  car.style.transform = 'matrix(0.2, 0, 0, 0.2, 25, 5.5) scale(-1, 1)';
  car.classList.add('animated');
}

function changeBtnsStyle(id: number, activeBtn: string): void {
  const engineRunBtn: Element | null =  document.querySelector(`.engine-run-${id}`);
  const engineStopBtn: Element | null = document.querySelector(`.engine-stop-${id}`);
  if (activeBtn === 'engineStopBtn') {
    engineRunBtn?.classList.add('inactive');
    engineStopBtn?.classList.remove('inactive');
  } else if (activeBtn === 'engineRunBtn') {
    engineRunBtn?.classList.remove('inactive');
    engineStopBtn?.classList.add('inactive');
  }
}

export async function animationRun(id: number, raceStatus: boolean): Promise<IWinnerInfo | void> {
  const date: number = Date.now();
  const car = document.querySelector(`#car-${id}`) as HTMLElement;
  const engineInfo: IEngineStatus | undefined = await api.startEngine(id);
  let isRace = true; 
  animationPreparing(car);
  changeBtnsStyle(id, 'engineStopBtn');
    
  const engineRunAnimation = function (): void {
    const curentX: string = getCarX(car.style.transform);
    const distance = 290;
    const stepSize = 120;
    car.style.transform = `matrix(0.2, 0, 0, 0.2, ${+curentX + engineInfo!.velocity! / stepSize}, 5.5) scale(-1, 1)`;
    if (+(getCarX(car.style.transform)) < distance && isRace === true && car.classList.contains('animated')) {
      window.requestAnimationFrame(engineRunAnimation);
    }  
  };
  engineRunAnimation();

  await api.checkEngine(id)
  .then(function (res) {
    if (res) isRace = false;
  });
  if (raceStatus) {
    return { date: (Date.now() - date) / 1000, car: car, raceStatus: isRace, id: car.id.slice(4), name: car.getAttribute('data-model-name')! };
  }
}

export function createEngineStopBtn(id: number): void {
  const engineStopBtn: Element | null = document.querySelector(`.engine-stop-${id}`);
  engineStopBtn!.addEventListener('click', async function () {
    const car = document.querySelector(`#car-${id}`) as HTMLElement;
    changeBtnsStyle(id, 'engineRunBtn');
    await api.stopEngine(id);
    car.classList.remove('animated');
    car.style.transform = 'matrix(0.2, 0, 0, 0.2, 25, 5.5) scale(-1, 1)';
  });
}

export async function animationReset(id: number): Promise<void> {
  const car = document.querySelector(`#car-${id}`) as HTMLElement;
  await api.stopEngine(id);
  car.classList.remove('animated');
  car.style.transform = 'matrix(0.2, 0, 0, 0.2, 25, 5.5) scale(-1, 1)';
  changeBtnsStyle(id, 'engineRunBtn');
}
 
export function TableWinneranimation(): void {
  const resultTable: HTMLElement | null = document.querySelector('#result-table');
  const displaY = 100;
  resultTable!.style.display = 'block';
  resultTable!.style.top = `${Number(getTableX(resultTable)) + 0.3}%`;
  if (Number(getTableX(resultTable)) < displaY) {
    window.requestAnimationFrame(TableWinneranimation);
  } else {
    resultTable!.style.display = 'none';
    resultTable!.style.top = '0%';
  }
}



