export enum EBobbleType {
  User = "user",
  Assistant = "assistant",
}

export interface IBobble {
  role: EBobbleType;
  content: string;
}
