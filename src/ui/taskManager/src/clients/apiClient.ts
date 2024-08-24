import axios from "axios";
import { Board, Column, ColumnOrdering, Profile, Task } from "../types";
import configClient from "./configClient";

const performRequest = async ({ data, url, method = "get", headers = {} } : { data?: any, url: string, method?: string, headers?: {} }) => {
     const response = await axios.request({
      data,
      method,
      url,
      baseURL: (await configClient.getConfig()).apiUrl,
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        ...headers
      },
    });
  
    return response;
  }

  const apiClient = {

    checkAuth: async (): Promise<{isOk: boolean, profile: Profile}> => {

      try {
        var response = await performRequest({
          url: '/auth/me'
        });
  
        return {isOk: response.status === 200, profile: {
          picture: response.headers['me-picture'],
          name: response.headers['me-name'],
          email: response.headers['me-email']
        } };
        
      } catch (error) {

      }

      return { isOk: false, profile: {picture:'', email:'', name:''} }
    },

    setupAuth: async (token: string) => {
      await performRequest({
        url: '/auth/setup',
        data: {token: token},
        method: 'POST',
        headers: {'Authorization': `Bearer ${token}`},
      });
    },

    getBoards: async () : Promise<Board[]> => {
      const response = await performRequest({
        url: '/boards/get'
      });

      return response.data;
    },

    updateBoard: async (board: Board) => {
      const response = await performRequest({
          url: '/boards/update',
          method: 'POST',
          data: board
      });

      return response.data;
    },

    addBoard: async (board: Board) => {
      await performRequest({
          url: '/boards/add',
          method: 'PUT',
          data: board
      });
    },

    getColumns: async (boardId: string) : Promise<Column[]> => {
      const response =  await performRequest({
        url: `/columns/get/${boardId}`,
      });
  
      return response.data;
    },

    addColumn: async (column: Column) => {
      const response = await performRequest({
          url: '/columns/add',
          method: 'PUT',
          data: column
      });

      return response.data;
    },

    updateColumn: async (column: Column) => {
        const response = await performRequest({
            url: '/columns/update',
            method: 'POST',
            data: column
        });

        return response.data;
    },

    updateColumnsOrder: async (ordering: ColumnOrdering) => {
        const response = await performRequest({
            url: '/columns/update/order',
            method: 'POST',
            data: ordering
        });

        return response.data;
    },

    deleteColumn: async (columnId: string ) => {
        const response = await performRequest({
            url: `/columns/delete/${columnId}`,
            method: 'DELETE'
        });

        return response.data;
    },

    getTasks: async (columnId: string) => {
      const response =  await performRequest({
        url: `/tasks/get/${columnId}`
      });
  
      return response.data;
    },

    getTaskDetails: async (taskId: string) => {
        const response =  await performRequest({
          url: `/tasks/details/${taskId}`
        });
    
        return response.data;
    },

    addTask: async (task: Task) => {
      const response = await performRequest({
          url: '/tasks/add',
          method: 'PUT',
          data: task
      });

      return response.data;
  },

    updateTask: async (task: Task) => {
        const response = await performRequest({
            url: '/tasks/update',
            method: 'POST',
            data: task
        });

        return response.data;
    },

    moveTaskToColumn: async (taskId: string, toColumnId: string) => {
      const response = await performRequest({
        url: '/tasks/moveToColumn',
        method: 'POST',
        data: {taskId, toColumnId}
    });

      return response.data;
    },

    moveOverTask: async (taskId: string, overTaskId: string) => {
      const response = await performRequest({
        url: '/tasks/reorderTask',
        method: 'POST',
        data: {taskId, overTaskId}
    });

      return response.data;
    },

    deleteTask: async (taskId: string ) => {
        const response = await performRequest({
            url: `tasks/delete/${taskId}`,
            method: 'DELETE'
        });

        return response.data;
    },  


  }
  
  export default apiClient;