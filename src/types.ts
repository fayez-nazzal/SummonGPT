import { JSXElement } from "solid-js";

export enum EBobbleType {
  System,
  User,
  Assistant,
  Spell,
}

export interface IBobble {
  role: EBobbleType;
  content: string | JSXElement;
}

export interface IHistoryItem {
  id: string;
  bobbles: IBobble[];
}

export enum ESpells {
  History = "history",
  Export = "export",
  Avatar = "avatar",
  GptAvatar = "gpt-avatar",
  None = "none",
}
