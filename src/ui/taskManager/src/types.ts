export type ServerState = {
    tasks?: {
        [columnId: string] : {
            data?: Task[],
            isLoading: boolean
        }
    },
    columns?: {
        data?: Column[],
        isLoading: boolean
    }
};

export type Board = {
    id: string;
    title: string;
};

export type Column = {
    id: string;
    title: string;
    order: string,
    boardId: string
};

export type Task = {
    id: string,
    columnId: string,
    title: string,
    content: string,
    assignee: string,
    order: string,
    titleColor: string
};

export type TaskDetails = {
    id: string,
    columnId: string,
    title: string,
    content: string,
    assignee: string,
};

export type ColumnOrdering = {
    columndId : string;
    order: number;
};

export type ServerContextState = {
    serverState: ServerState,
    getColumns: () => void,
    updateColumn: (column: Column) => void,
    updateColumnsOrder: (ordering: ColumnOrdering) => void,
    deleteColumn:(columnId: string) => void,
    addColumn: (column: Column) => void,
    addTask: (task: Task) => void,
    getTasks: (columnId: string) => void,
    getTaskDetails: (taskId: string) => void,
    updateTask: (task: Task) => void,
    deleteTask: (taskId: string) => void,
  };

export type Config = {
    apiUrl: string,
    isLocal: boolean
};

export interface Profile {
    picture : string,
    name : string,
    email: string
  }

export interface GoogleJwtPayload {
    name: string;
    email: string;
    picture: string;
    [key: string]: any; // for other fields like 'sub', 'iat', etc.
  }

export enum Size  {
    sm = 'w-4 h-4 border-2',
    md = 'w-8 h-8 border-2',
    lg = 'w-12 h-12 border-4',
    xl = 'w-16 h-16 border-4'
  };
export enum Color {
    blue = 'border-blue-500',
    red = 'border-red-500',
    green = 'border-green-500',
    yellow = 'border-yellow-500',
    purple = 'border-purple-500',
    gray = 'border-gray-500'
  };;