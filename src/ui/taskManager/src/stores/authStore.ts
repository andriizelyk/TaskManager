import { makeObservable, action, runInAction, observable } from "mobx";
import apiClient from "../clients/apiClient";
import { Profile } from "../types";

export class AuthStore {
    isLoading: boolean = false;
    isAuthenticated: boolean = false;
    profile: Profile | undefined = { email:'', name:'', picture:'' };

    constructor() {
        makeObservable(this, {
            checkMe: action,
            isAuthenticated: observable,
            profile: observable,
            isLoading: observable
        });
    }

    checkMe = async () => {
        if (!this.isLoading) {
            this.isLoading = true;

            const response = await apiClient.checkAuth();

            runInAction(() => {
                this.isLoading = false;
                this.isAuthenticated = response.isOk;
                this.profile = response.isOk ? response.profile : undefined;
            });
        }
    }
}