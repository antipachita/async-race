import { getCarX } from './helpers';
import { getTableX } from './helpers';
import api from './api-functions';
import { dataStorage } from './storage';


export async function createEngineRunBtn(id: number): Promise<void> {
  const engineRunBtn: Element | null =  document.querySelector(`.engine-run-${id}`);
  const engineStopBtn: Element | null = document.querySelector(`.engine-stop-${id}`);
  document.querySelector(`.engine-run-${id}`)?.addEventListener('click', async function() {
    engineRunBtn?.classList.add('inactive');
    engineStopBtn?.classList.remove('inactive');
    const car = document.querySelector(`#car-${id}`) as HTMLElement;
    car.style.transform = `matrix(0.2, 0, 0, 0.2, 25, 5.5) scale(-1, 1)`;
    car.classList.add('animated');
    let engineInfo = await api.startEngine(id);
    let isRace = true; 
      
    const engineRun = function () {
      let cuurentX = getCarX(car.style.transform);
      car.style.transform = `matrix(0.2, 0, 0, 0.2, ${+cuurentX + engineInfo?.velocity!/120}, 5.5) scale(-1, 1)`;
      if (+(getCarX(car.style.transform)) < 290 && isRace === true && car.classList.contains('animated')) {
      window.requestAnimationFrame(engineRun);
      }
    }
    engineRun();
    await api.checkEngine(id).then(function (res) {
      if (res === true) isRace = false;
    }); 
  });

 

}

export function createEngineStopBtn(id: number): void {
  const engineRunBtn: Element | null =  document.querySelector(`.engine-run-${id}`);
  const engineStopBtn: Element | null = document.querySelector(`.engine-stop-${id}`);
  engineStopBtn!.addEventListener('click', async function() {
    engineStopBtn?.classList.add('inactive');
    const car = document.querySelector(`#car-${id}`) as HTMLElement;
    await api.stopEngine(id);
    car.classList.remove('animated');
    car.style.transform = `matrix(0.2, 0, 0, 0.2, 25, 5.5) scale(-1, 1)`;
    engineRunBtn?.classList.remove('inactive');
  });

}

export async function animationRun(id: number): Promise<any> {
  const engineRunBtn: Element | null =  document.querySelector(`.engine-run-${id}`);
  const engineStopBtn: Element | null = document.querySelector(`.engine-stop-${id}`);
  const date = Date.now()
  const car = document.querySelector(`#car-${id}`) as HTMLElement;
  car.style.transform = `matrix(0.2, 0, 0, 0.2, 25, 5.5) scale(-1, 1)`;
  car.classList.add('animated');
  let engineInfo = await api.startEngine(id);
  let isRace = true; 
  engineRunBtn?.classList.add('inactive');
  engineStopBtn?.classList.remove('inactive');
    
  const engineRun = function () {
    let curentX = getCarX(car.style.transform);
    car.style.transform = `matrix(0.2, 0, 0, 0.2, ${+curentX + engineInfo?.velocity!/120}, 5.5) scale(-1, 1)`;
    if (+(getCarX(car.style.transform)) < 290 && isRace === true && car.classList.contains('animated')) {
      window.requestAnimationFrame(engineRun);
    }
  }
  engineRun();

  await api.checkEngine(id).then(function (res) {
    if (res === true) isRace = false;
  });
  
  return { date: (Date.now() - date) / 1000, car: car , raceStatus: isRace, id: car.id.slice(4), name: car.getAttribute("data-model-name")};
}

export async function animationReset(id: number): Promise<void> {
  const car = document.querySelector(`#car-${id}`) as HTMLElement;
  await api.stopEngine(id);
  car.classList.remove('animated');
  car.style.transform = `matrix(0.2, 0, 0, 0.2, 25, 5.5) scale(-1, 1)`;
  const engineRunBtn: Element | null =  document.querySelector(`.engine-run-${id}`);
  const engineStopBtn: Element | null = document.querySelector(`.engine-stop-${id}`);
  engineRunBtn?.classList.remove('inactive');
  engineStopBtn?.classList.add('inactive');
}


 

export function animationWinner  (): void {
  const resultTable: HTMLElement | null = document.querySelector('#result-table');
  resultTable!.style.display = 'block';
  resultTable!.style.left = `${Number(getTableX(resultTable)) + 0.3}%`
  if (Number(getTableX(resultTable)) < 70) {
    window.requestAnimationFrame(animationWinner);
  } else {
    resultTable!.style.display = 'none';
    resultTable!.style.left = '0%';
  }
}
      