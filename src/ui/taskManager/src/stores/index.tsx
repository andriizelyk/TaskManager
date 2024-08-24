import { createContext, useContext } from "react";
import { ColumnStore } from "./columnStore";
import { TaskStore } from "./taskStore";
import { BoardStore } from "./boardStore";
import { AuthStore } from "./authStore";

export const rootStoreContext = createContext({
  columnStore: new ColumnStore(),
  taskStore: new TaskStore(),
  boardStore: new BoardStore(),
  authStore: new AuthStore()
});

export const useStores = () => useContext(rootStoreContext);