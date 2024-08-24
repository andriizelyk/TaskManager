import { action, makeObservable, observable, runInAction } from "mobx";
import { Task } from "../types";
import apiClient from "../clients/apiClient";

export class TaskStore {
    tasks : Record<string, Task[]> = {};
    isLoading: boolean = false;
    isLoaded: boolean = false;
    isUpdating: boolean = false;

    constructor() {
        makeObservable(this, {
            tasks: observable,
            isLoaded: observable,
            isLoading: observable,
            addTask: action,
            moveToColumn: action,
            deleteTask: action,
            updateTask: action,
            loadTasks: action
        });
      }

      sortFunc = (a: Task, b: Task) => { return (a.order > b.order) ? -1 : (a.order === b.order) ? 0 : 1; };

      addTask = async (task: Task) => {
        this.tasks[task.columnId].push(task);
        this.tasks[task.columnId]?.sort(this.sortFunc);
        await apiClient.addTask(task);
      };

      updateTask = async (task: Task) => {
        this.isUpdating = true;
        const index =  this.tasks[task.columnId].findIndex(t => t.id === task.id);
        this.tasks[task.columnId][index] = task;
        await apiClient.updateTask(task);
        runInAction(() => {
            this.isUpdating = false;
          });
      };

      loadTasks = async (columndId: string) => {
            runInAction(async () => {
                this.isLoading = true;
                this.tasks[columndId] = (await apiClient.getTasks(columndId))?.sort(this.sortFunc) || [];
                this.isLoading = false;
                this.isLoaded = true;
              });
      };

      deleteTask = async (taskId: string, columnId: string) => {
        this.isLoading = true;
        await apiClient.deleteTask(taskId);
        const deletedTaskIndex = this.tasks[columnId].findIndex(t => t.id === taskId);
        runInAction(() => {
            this.tasks[columnId].splice(deletedTaskIndex, 1);
            this.tasks[columnId]?.sort(this.sortFunc)
            this.isLoading = false;
          });
      };

      moveToColumn = async (taskId: string, toColumnId: string) => {
        let fromColumn ='';
        let taskIndex = -1;

        for(const key in this.tasks) {
            const activeTaskIndex = this.tasks[key].findIndex(t => t.id === taskId);
            if (activeTaskIndex > -1) {
                fromColumn = this.tasks[key][activeTaskIndex].columnId;
                taskIndex = activeTaskIndex;
            }
        }
        runInAction(() => {
            const task = this.tasks[fromColumn][taskIndex];
            this.tasks[fromColumn].splice(taskIndex, 1);
            task.columnId = toColumnId;
            this.tasks[toColumnId].push(task);

            this.tasks[toColumnId].sort(this.sortFunc);
        });
        
        await apiClient.moveTaskToColumn(taskId, toColumnId);
      }

      moveOverTask = async (taskId: string, overTaskId: string) => {
        let fromColumn = '';
        let toColumn ='';
        let taskIndex = 0;
        let toTaskIndex = 0;

        for(const key in this.tasks) {
            const activeTaskIndex = this.tasks[key].findIndex(t => t.id === taskId);
            if (activeTaskIndex > -1) {
                fromColumn = this.tasks[key][activeTaskIndex].columnId;
                taskIndex = activeTaskIndex;
            }

            const overTaskIndex = this.tasks[key].findIndex(t => t.id === overTaskId);
            if (overTaskIndex > -1) {
                toColumn = this.tasks[key][overTaskIndex].columnId;
                toTaskIndex = overTaskIndex;
            }
        }

        const task = this.tasks[fromColumn][taskIndex];
        task.columnId = toColumn;
        task.order = `${this.tasks[toColumn][toTaskIndex].order}1`;

        runInAction(() => {
            this.tasks[fromColumn].splice(taskIndex, 1);
            this.tasks[toColumn].push(task);
            this.tasks[toColumn].sort(this.sortFunc);
        });

        await apiClient.moveOverTask(taskId, overTaskId);
      }
}