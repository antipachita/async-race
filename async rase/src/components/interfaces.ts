export interface Car {
  name: string | null;
  color: string | null;
  id: number;
};

export interface EngineStatus {
  velocity: number;
  distance: number;
}

export interface Winner {
  id: number | null;
  wins: number | null;
  time: number | null;
}

export interface WinnerInfo {
  date: number | null;
  car: Element | null;
  raceStatus: boolean | null;
  id: string;
  name: string;
}

