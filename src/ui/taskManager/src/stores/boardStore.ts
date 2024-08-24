import { makeObservable, observable, action, runInAction } from "mobx";
import { Board } from "../types";
import apiClient from "../clients/apiClient";

export class BoardStore {
    boards: Board[] = [];
    isLoaded: boolean = false;
    isLoading: boolean = false;

    constructor() {
        makeObservable(this, {
            boards: observable,
            loadBoards: action,
            addBoard: action, 
            updateBoard: action
            });
    }

    loadBoards = async () => {
        if (!this.isLoaded) {
            this.isLoading = true;

            this.boards = await apiClient.getBoards();

            runInAction(() => {
                this.isLoaded = true;
                this.isLoading = false;
            });
        }
    }

    addBoard = async (board: Board) => {
        this.boards.push(board);
        await apiClient.addBoard(board);
    }

    updateBoard = async (board: Board) => {
        await apiClient.updateBoard(board);

        this.boards = this.boards.map((c) => {
            
            if (c.id !== board.id) return c;
            
            return board;
        });
    }
}