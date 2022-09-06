import { sequelize } from '../database/connectdb.js';
import { server } from "../index.js";
import { Profile } from '../models/Profile.js';
import { User } from '../models/User.js';
import { initialProfiles, initialUsers } from './testCommon.js';

let iUsers = [];
let iProfiles = [];

describe('documentFile endpoints', () => {
    beforeAll(async () => {
        await Profile.destroy({ where: {} });
        await User.destroy({ where: {} });
        iUsers = [];
        iProfiles = [];

        for (let user of initialUsers) {
            iUsers.push(await User.create(user));
        }

        for (let i = 0; i < initialProfiles.length; i++) {
            const profile = initialProfiles[i];
            profile.userId = iUsers[i].id;
            iProfiles.push(await Profile.create(profile));
        }
    });

    beforeEach(async () => {

    });

    describe('test scenary ready', () => {
        test('expected number of initial users', async () => {
            const users = await User.findAll();
            expect(users.length).toBe(initialUsers.length);
        });

        test('expected initial users', async () => {
            const users = await User.findAll();

            for (let i = 0; i < users.length; i++) {
                expect(users[i].email).toBe(initialUsers[i].email);
            }
        });

        test('expected number of initial profiles', async () => {
            const profiles = await Profile.findAll();
            expect(profiles.length).toBe(initialProfiles.length);
        });

        test('expected initial profiles', async () => {
            const profiles = await Profile.findAll();

            for (let i = 0; i < profiles.length; i++) {
                expect(profiles[i].name).toBe(initialProfiles[i].name);
            }
        });
    });
});

afterAll(() => {
    sequelize.close();
    server.close();
});