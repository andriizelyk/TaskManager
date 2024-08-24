import { action, makeObservable, observable, runInAction } from "mobx";
import { Column } from "../types";
import { arrayMove } from "@dnd-kit/sortable";
import { UniqueIdentifier } from "@dnd-kit/core";
import apiClient from "../clients/apiClient";

export class ColumnStore {
    columns : Column[] = [];
    isLoaded: boolean = false;
    isLoading: boolean = false;

    constructor() {
        makeObservable(this, {
        columns: observable,
        loadColumns: action,
        addColumn: action, 
        updateColumn: action, 
        updateColumnsOrder: action
        });
    }

    sortFunc = (a: Column, b: Column) => { return (a.order > b.order) ? -1 : (a.order === b.order) ? 0 : 1; };

    loadColumns = async (boardId: string) => {
        if (!this.isLoaded) {
            this.isLoading = true;
            this.columns = await apiClient.getColumns(boardId);

            runInAction(() => {
                this.isLoaded = true;
                this.isLoading = false;
            });
        }
    }

    addColumn = async (column: Column) => {
        this.columns.push(column);
        await apiClient.addColumn(column);
    };

    deleteColumn = async (id: string) => {
        this.columns = this.columns.filter(c => c.id !== id);
        await apiClient.deleteColumn(id);
    }

    updateColumn = async (column: Column) => {
        this.columns = this.columns.map((c) => {
            if (c.id !== column.id) return c;
            
            return column;
        });

        await apiClient.updateColumn(column);
    }

    updateColumnsOrder = (activeColumnId: UniqueIdentifier, overColumnId: UniqueIdentifier) => {
        const activeIndex = this.columns.findIndex(c => c.id === activeColumnId);
        const overIndex = this.columns.findIndex(c => c.id === overColumnId);
        this.columns = arrayMove(this.columns, activeIndex, overIndex);
    }
}