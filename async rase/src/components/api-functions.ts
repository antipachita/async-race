import { render } from './render';
import { Car } from './interfaces';
import { Winner } from './interfaces';
import { EngineStatus } from './interfaces';
import { dataStorage } from './storage';

async function updateCounter():Promise<void> {
  const resp = await fetch('http://127.0.0.1:3000/garage');
  const carsArr = await resp.json();
  document.querySelector('.garage-counter')!.innerHTML = `Garage ${carsArr.length}`;
}

async function getGaragePage(pageId = 1): Promise<void> {
  const resp = await fetch(`http://127.0.0.1:3000/garage?_page=${dataStorage.pageNumber}&_limit=7`);
  const carsArr = await resp.json();
  const carsContainer: HTMLDivElement | null = document.querySelector('.cars-container');
  carsContainer!.innerHTML = '';
  for (let i = 0; i < carsArr.length; i += 1) {
    render.renderCar(carsArr[i]);
  }
  updateCounter();
}

async function getGaragePageInfo(pageId: number): Promise<Array<Car> | undefined>  {
  const resp = await fetch(`http://127.0.0.1:3000/garage?_page=${pageId}&_limit=7`);
  const carsArr = await resp.json();
  return carsArr;
}

async function getCarInfo(id: number | undefined):Promise<Car> {
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
    if (carsArr.length != 7) {
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
    const currentPage = document.querySelector('.page-num')?.textContent;
    getGaragePage(Number(currentPage!));
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

async function createWinner(id: number, time: number): Promise<void> {
  try {
    await fetch('http://127.0.0.1:3000/winners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, wins: 1, time: time }),
    });
  } catch (err) {
    throw err;
  }
}

async function getWinners(): Promise<Array<Winner> | undefined> {
  try {
    const res = await fetch(
      'http://127.0.0.1:3000/winners?_page=1&_limit=10&_sort=id&_order=ASC',
      {
        method: 'GET',
      },
    );
    if (res.ok) {
      return (await res.json()) as Array<Winner>;
    }
  } catch (err) {
    throw err;
  }
}

async function deleteWinner(id: number): Promise<void> {
  try {
    await fetch(`http://127.0.0.1:3000/winners/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    throw err;
  }
}

async function checkWinner(id: number): Promise<Winner | number | undefined > {
  try {
    const res = await fetch(`http://127.0.0.1:3000/winners/${id}`, {
      method: 'GET',
    });
    if (res.ok) {
      const winnerInfo = (await res.json()) as Winner;
      return winnerInfo;
    }
    if (res.status === 404) {
      return 404;
    }
  } catch (err) {
    throw err;
  }
}

async function updateWinner(id: number, wins: number, time: number): Promise<void> {
  try {
    await fetch(`http://127.0.0.1:3000/winners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wins: wins, time: time }),
    });
  } catch (err) {
    throw err;
  }
}

async function getWinnersPage(pageId = '1', sort?: string, order?: string): Promise<void> {
  const res = await fetch(
    `http://127.0.0.1:3000/winners?_page=${dataStorage.winennerPageNumber}&_limit=10getGaragePage&_sort=${dataStorage.sortType}&_order=${dataStorage.orderType}`,
    {
      method: 'GET',
    },
  );
  const tbody: Element | null = document.querySelector('.tbody');
  tbody!.innerHTML = '';
  const winnersArr = await res.json();
  for (let i = 0; i < winnersArr.length; i += 1) {
    const car  = await getCarInfo(winnersArr[i].id);
    render.renderWinner(winnersArr[i], i + 1, car.name!, car.color!);
  }
}

async function updateGarageCounter():Promise<void> {
  const resp = await fetch(
    'http://127.0.0.1:3000/winners?_page=1&_limit=10&_sort=id&_order=ASC',
    {
      method: 'GET',
    },
  );
  const winersArr = await resp.json();
  document.querySelector('#winners-counter')!.innerHTML = `Garage ${winersArr.length}`;
}




export default { getGaragePage, createNewCar, deleteCar, updateCarInfo, getCarInfo, startEngine, checkEngine, stopEngine, createWinner, getWinners, getWinnersPage, deleteWinner, checkWinner, updateWinner, updateGarageCounter, getGaragePageInfo };