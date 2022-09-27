export interface ICar {
  name: string | null;
  color: string | null;
  id: number;
};

export interface IEngineStatus {
  velocity: number;
  distance: number;
}

export interface IWinner {
  id: number | undefined;
  wins: number | null;
  time: number | null;
}

export interface IWinnerInfo {
  date: number | null;
  car: Element | null;
  raceStatus: boolean | null;
  id: string;
  name: string;
}


