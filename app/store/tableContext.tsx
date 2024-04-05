import { createContext } from "react";

interface TableContextProps {
  query: string | null;
}

export const TableContext = createContext<TableContextProps>({
  query: "",
});
