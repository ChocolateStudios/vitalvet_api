import { sequelize } from '../database/connectdb.js';
import { server } from "../index.js";
import { Species } from '../models/Species.js';
import { api, ensureOnlyInitialInstancesExist, expectOnlyInitialInstancesInDatabase, initialSpecies } from './testCommon.js';

const compareSpeciesFunc = async (speciesInDatabase, initialSpecies) => {
    const sameName = speciesInDatabase.name === initialSpecies.name;
    return sameName;
};

describe('species endpoints', () => {
    beforeEach(async () => {
        await ensureOnlyInitialInstancesExist(Species, initialSpecies, compareSpeciesFunc);
    });

    describe('test scenary ready', () => {
        test('expected initial species', async () => {
            expectOnlyInitialInstancesInDatabase(Species, initialSpecies, compareSpeciesFunc);
        });
    });
});

afterAll(() => {
    sequelize.close();
    server.close();
});