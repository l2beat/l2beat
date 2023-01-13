import { expect } from "earljs";

import { ContractParameters } from "../types";
import { diffDiscovery } from "./diffDiscovery";

describe(diffDiscovery.name, () => {
    it('works', () => {
        const committed: ContractParameters[] = []
        const discovered: ContractParameters[] = []
        const ignoreInWatchMode = {}
    
        const result = diffDiscovery(committed, discovered, ignoreInWatchMode)

        expect(result).toEqual([])
    })
})