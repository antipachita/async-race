import { render } from './render';
import { ICar } from './interfaces';
import { IWinner } from './interfaces';
import { IEngineStatus } from './interfaces';
import { dataStorage } from './storage';
import { urls } from './urls';
import randomFunc from './randomizer-funcs';

enum responseStatus { 
  internalServerError = 500, 
  success = 200,
  error = 404, 
};

async function updateCounter():Promise<void> {
  const resp: Response = await fetch(`${urls.garage}`);
  const carsArr: Array<ICar> = await resp.json();
  document.querySelector('.garage-counter')!.innerHTML = `Garage ${carsArr.length}`;
}

async function getGaragePage(pageId = 1): Promise<void> {
  const resp: Response = await fetch(urls.getGaragePageUrl(dataStorage.pageNumber));
  const carsArr: Array<ICar> = await resp.json();
  const carsContainer: HTMLDivElement | null = document.querySelector('.cars-container');
  carsContainer!.innerHTML = '';
  for (let i = 0; i < carsArr.length; i += 1) {
    render.renderCar(carsArr[i]);
  }
  updateCounter();
}

async function getGaragePageInfo(pageId: number): Promise<Array<ICar> | undefined>  {
  const resp: Response = await fetch(urls.getGaragePageUrl(pageId));
  const carsArr: Array<ICar> = await resp.json();
  return carsArr;
}

async function getCarInfo(id: number | undefined):Promise<ICar> {
  const resp: Response = await fetch(`${urls.garage}${id}`);
  const carInfo: ICar = await resp.json();
  return carInfo;
}

async function getCars(currentPage: string | null | undefined):Promise<Array<ICar>> {
  return await fetch(`http://127.0.0.1:3000/garage?_page=${currentPage}&_limit=7`).then(value => value.json());
}

async function createNewCar(name: string | undefined, color: string | undefined, count: number): Promise<ICar | undefined> {
  if (count === 1) {
    try {
      const resp: Response = await fetch(urls.getGaragePageUrl(document.querySelector('.page-num')!.textContent));
      const carsArr: Array<ICar> = await resp.json();

      const res: Response = await fetch(`${urls.garage}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, color: color }),
      });
      const newCar: ICar =  (await res.json()) as ICar;
      if (carsArr.length != 7) {
        render.renderCar(newCar);
      }
      updateCounter();
      
      return newCar;
    } catch (err) {
      throw err;
    }
  } else if (count > 1) {
    for (let i = 0; i < count; i += 1) {
      await (createNewCar(randomFunc.randomCarName(), randomFunc.randomCarColor(), 1));
    }  
  }
}


async function deleteCar(id: number | undefined): Promise<void> {
  try {
    await fetch(`${urls.garage}${id}`, {
      method: 'DELETE',
    });
    const currentPage: string | null | undefined = document.querySelector('.page-num')?.textContent;
    getGaragePage(Number(currentPage!));
    updateCounter();
  } catch (err) {
    throw err;
  }
}

async function updateCarInfo(id: number, name: string, color: string): Promise<void> {
  try {
    await fetch(`${urls.garage}${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, color: color }),
    });
    
  } catch (err) {
    throw err;
  }
}

async function startEngine(id: number): Promise<IEngineStatus | undefined> {
  try {
    const res: Response = await fetch(urls.getEngineStatusUrl(id, 'started'), {
      method: 'PATCH',
    });
    if (res.ok) {
      return (await res.json()) as IEngineStatus;
    }
  } catch (err) {
    throw err;
  }
}

async function checkEngine(id: number): Promise<boolean | undefined> {
  try {
    const res: Response = await fetch(urls.getEngineStatusUrl(id, 'drive'), {
      method: 'PATCH',
    });
    if (res.status === responseStatus.internalServerError) {
      return true;
    }
    if (res.status === responseStatus.success) {
      return false;
    }
  } catch (err) {
    throw err;
  }
}

async function stopEngine(id: number): Promise<void> {
  try {
    await fetch(urls.getEngineStatusUrl(id, 'stopped'), {
      method: 'PATCH',
    });
  } catch (err) {
    throw err;
  }
}

async function createWinner(id: number, time: number): Promise<void> {
  try {
    await fetch(urls.winners, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, wins: 1, time: time }),
    });
  } catch (err) {
    throw err;
  }
}

async function getWinners(): Promise<Array<IWinner> | undefined> {
  try {
    const res: Response = await fetch(
      `${urls.winners}?_page=1&_limit=10&_sort=id&_order=ASC`, 
      {
        method: 'GET',
      },
    );
    if (res.ok) {
      return (await res.json()) as Array<IWinner>;
    }
  } catch (err) {
    throw err;
  }
}

async function deleteWinner(id: number): Promise<void> {
  try {
    await fetch(`${urls.winners}${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    throw err;
  }
}

async function checkWinner(id: number): Promise<IWinner | number | undefined > {
  try {
    const res: Response = await fetch(`${urls.winners}${id}`, {
      method: 'GET',
    });
    if (res.ok) {
      const winnerInfo = (await res.json()) as IWinner;
      return winnerInfo;
    }
    if (res.status === responseStatus.error) {
      return responseStatus.error;
    }
  } catch (err) {
    throw err;
  }
}

async function updateWinner(id: number, wins: number, time: number): Promise<void> {
  try {
    await fetch(`${urls.winners}${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wins: wins, time: time }),
    });
  } catch (err) {
    throw err;
  }
}

async function getWinnersPage(pageId = '1', sort?: string, order?: string): Promise<void> {
  const res: Response = await fetch(
    `${urls.winners}?_page=${dataStorage.winennerPageNumber}&_limit=10getGaragePage&_sort=${dataStorage.sortType}&_order=${dataStorage.orderType}`,
    {
      method: 'GET',
    },
  );
  const tbody: Element | null = document.querySelector('.tbody');
  tbody!.innerHTML = '';
  const winnersArr: Array<IWinner> = await res.json();
  for (let i = 0; i < winnersArr.length; i += 1) {
    const car: ICar  = await getCarInfo(winnersArr[i].id);
    render.renderWinner(winnersArr[i], i + 1, car.name!, car.color!);
  }
}

async function updateGarageCounter():Promise<void> {
  const resp = await fetch(
    `${urls.winners}?_page=1&_limit=10&_sort=id&_order=ASC`,
    {
      method: 'GET',
    },
  );
  const winersArr: Array<IWinner> = await resp.json();
  document.querySelector('#winners-counter')!.innerHTML = `Garage ${winersArr.length}`;
}




export default { getGaragePage, createNewCar, deleteCar, updateCarInfo, getCarInfo, startEngine, checkEngine, stopEngine, createWinner, getWinners, getWinnersPage, deleteWinner, checkWinner, updateWinner, updateGarageCounter, getGaragePageInfo, getCars };

