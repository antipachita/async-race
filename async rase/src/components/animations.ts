import { getCarX } from './helpers';
import api from './api-functions';


export async function createEngineRunBtn(id: number): Promise<void> {
 
  document.querySelector(`.engine-run-${id}`)?.addEventListener('click', async function() {
    const car = document.querySelector(`#car-${id}`) as HTMLElement;
    car.style.transform = `matrix(0.2, 0, 0, 0.2, 25, 5.5) scale(-1, 1)`;
    car.classList.add('animated');
    let engineInfo = await api.startEngine(id);
    let isRace = true; 
      
    const engineRun = function () {
      let cuurentX = getCarX(car.style.transform);
      car.style.transform = `matrix(0.2, 0, 0, 0.2, ${+cuurentX + engineInfo?.velocity!/150}, 5.5) scale(-1, 1)`;
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
  document.querySelector(`.engine-stop-${id}`)?.addEventListener('click', async function() {
    const car = document.querySelector(`#car-${id}`) as HTMLElement;
    await api.stopEngine(id);
    car.classList.remove('animated');
    car.style.transform = `matrix(0.2, 0, 0, 0.2, 25, 5.5) scale(-1, 1)`;
  });

}

export async function animationRun(id: number): Promise<any> {
  const date = Date.now()
  const car = document.querySelector(`#car-${id}`) as HTMLElement;
  car.style.transform = `matrix(0.2, 0, 0, 0.2, 25, 5.5) scale(-1, 1)`;
  car.classList.add('animated');
  let engineInfo = await api.startEngine(id);
  let isRace = true; 
    
  const engineRun = function () {
    let curentX = getCarX(car.style.transform);
    car.style.transform = `matrix(0.2, 0, 0, 0.2, ${+curentX + engineInfo?.velocity!/150}, 5.5) scale(-1, 1)`;
    if (+(getCarX(car.style.transform)) < 290 && isRace === true && car.classList.contains('animated')) {
      window.requestAnimationFrame(engineRun);
    }
  }
  engineRun();

  await api.checkEngine(id).then(function (res) {
    if (res === true) isRace = false;
  });     
  return { date: (Date.now() - date) / 1000, car: car , isRace };
}

export async function animationReset(id: number): Promise<void> {
  const car = document.querySelector(`#car-${id}`) as HTMLElement;
  await api.stopEngine(id);
  car.classList.remove('animated');
  car.style.transform = `matrix(0.2, 0, 0, 0.2, 25, 5.5) scale(-1, 1)`;
}