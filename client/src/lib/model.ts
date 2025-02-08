export enum Author {
  User = "User",
  Agent = "Agent",
}

export type Message = { author: Author; text: string };
