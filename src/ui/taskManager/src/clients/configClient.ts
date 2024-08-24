import { Config } from "../types";

const configClient = {
    getConfig : async () : Promise<Config> => {
        const res = await fetch('/config.json');
        return await res.json() as Config;
      }
}

export default configClient;