import { sequelize } from '../database/connectdb.js';
import { server } from "../index.js";
import { Owner } from '../models/Owner.js';
import { api, ensureOnlyInitialInstancesExist, expectOnlyInitialInstancesInDatabase } from './testCommon.js';

describe('owner endpoints', () => {
    beforeEach(async () => {
        await ensureOnlyInitialInstancesExist(Owner, initialSpecies, compareSpeciesFunc);
    });

    describe('test scenary ready', () => {
        test('expected initial owners', async () => {
            await expectOnlyInitialInstancesInDatabase(Owner, initialSpeciesAndSubspecies, compareSpeciesFunc);
        });
    });

    describe('register a new owner', () => {
        const endpointUrl = '/owners';

        test('owner created successfully', async () => {
            expect(true).toBe(true);
        });
    });
});