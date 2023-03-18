export enum EBobbleType {
  System,
  User,
  Assistant,
}

export interface IBobble {
  role: EBobbleType;
  content: string;
}

export interface IHistoryItem {
  id: string;
  bobbles: IBobble[];
}