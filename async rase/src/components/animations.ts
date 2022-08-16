import { getCarX } from './helpers';
import { getTableX } from './helpers';
import api from './api-functions';
import { WinnerInfo } from './interfaces';



export async function animationRun(id: number, raceStatus: boolean): Promise<WinnerInfo | void> {
  const date = Date.now();
  const car = document.querySelector(`#car-${id}`) as HTMLElement;
  const engineInfo = await api.startEngine(id);
  let isRace = true; 
  animationPreparing(car);
  changeBtnsStyle(id, 'engineStopBtn');
    
  const engineRunAnimation = function () {
    const curentX = getCarX(car.style.transform);
    car.style.transform = `matrix(0.2, 0, 0, 0.2, ${+curentX + engineInfo!.velocity! / 120}, 5.5) scale(-1, 1)`;
    if (+(getCarX(car.style.transform)) < 290 && isRace === true && car.classList.contains('animated')) {
      window.requestAnimationFrame(engineRunAnimation);
    }  
  };
  engineRunAnimation();

  await api.checkEngine(id).then(function (res) {
    if (res === true) isRace = false;
  });
  if (raceStatus === true) {
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
  resultTable!.style.display = 'block';
  resultTable!.style.top = `${Number(getTableX(resultTable)) + 0.3}%`;
  if (Number(getTableX(resultTable)) < 100) {
    window.requestAnimationFrame(TableWinneranimation);
  } else {
    resultTable!.style.display = 'none';
    resultTable!.style.top = '0%';
  }
}


function changeBtnsStyle (id: number, activeBtn: string) {
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


function animationPreparing (car: HTMLElement) {
  car.style.transform = 'matrix(0.2, 0, 0, 0.2, 25, 5.5) scale(-1, 1)';
  car.classList.add('animated');
}