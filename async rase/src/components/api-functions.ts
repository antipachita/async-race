import {render} from './render';
import { Car } from './interfaces';
import { EngineStatus } from './interfaces';


async function getGaragePage(pageId: string = "1"): Promise<any> {
  const resp = await fetch(`http://127.0.0.1:3000/garage?_page=${pageId}&_limit=7`);
  const carsArr = await resp.json();
  const carsContainer: HTMLDivElement | null = document.querySelector('.cars-container');
  carsContainer!.innerHTML = '';
  for (let i = 0; i < carsArr.length; i += 1) {
    render.renderCar(carsArr[i]);
  }
  updateCounter();
}

async function updateCounter():Promise<void> {
  const resp = await fetch(`http://127.0.0.1:3000/garage`);
  const carsArr = await resp.json();
  document.querySelector('.garage-counter')!.innerHTML = `Garage ${carsArr.length}`;
}

async function getCarInfo(id: number | undefined):Promise<void> {
  const resp = await fetch(`http://127.0.0.1:3000/garage/${id}`);
  const carInfo = await resp.json();
  return carInfo;
}

async function createNewCar(name: string | undefined, color: string | undefined): Promise<Car | undefined> {
  try {
    const resp = await fetch(`http://127.0.0.1:3000/garage?_page=${document.querySelector('.page-num')?.textContent}&_limit=7`);
    const carsArr = await resp.json();

    const res = await fetch('http://127.0.0.1:3000/garage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, color: color }),
    });
    const newCar =  (await res.json()) as Car;
    if (carsArr.length !=7) {
      render.renderCar(newCar);
    }
    updateCounter();
    
    return newCar;
  } catch (err) {
    throw err;
  }
}

async function deleteCar(id: number | undefined): Promise<void> {
  try {
    await fetch(`http://127.0.0.1:3000/garage/${id}`, {
      method: 'DELETE',
    });
    let currentPage = document.querySelector('.page-num')?.textContent;
    getGaragePage(currentPage!);
    updateCounter();
  } catch (err) {
    throw err;
  }
}

async function updateCarInfo(id: number, name: string, color: string): Promise<void> {
  try {
    await fetch(`http://127.0.0.1:3000/garage/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, color: color }),
    });
    
  } catch (err) {
    throw err;
  }
}

async function startEngine(id: number): Promise<EngineStatus | undefined> {
  try {
    const res = await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=started`, {
      method: 'PATCH',
    });
    if (res.ok) {
      return (await res.json()) as EngineStatus;
    }
  } catch (err) {
    throw err;
  }
}

async function checkEngine(id: number): Promise<boolean | undefined> {
  try {
    const res = await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=drive`, {
      method: 'PATCH',
    });
    if (res.status === 500) {
      return true;
    }
    if (res.status === 200) {
      return false;
    }
  } catch (err) {
    throw err;
  }
}

async function stopEngine(id: number): Promise<void> {
  try {
    await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=stopped`, {
      method: 'PATCH',
    });
  } catch (err) {
    throw err;
  }
}


export default { getGaragePage, createNewCar, deleteCar, updateCarInfo, getCarInfo, startEngine, checkEngine, stopEngine };