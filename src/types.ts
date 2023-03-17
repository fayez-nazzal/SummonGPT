export enum EBobbleType {
  System,
  User,
  Assistant,
}

export interface IBobble {
  role: EBobbleType;
  content: string;
}
