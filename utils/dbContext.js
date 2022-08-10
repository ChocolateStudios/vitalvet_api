import { Op } from "sequelize";
import { sequelize } from "../database/connectdb.js";

import Owner from "../models/Owner.js";
import EventType from "../models/EventType.js";
import Patient from "../models/Patient.js";
import Profile from "../models/Profile.js";
import Species from "../models/Species.js";
import User from "../models/User.js";


/************************************************
***************** Relationships *****************
*************************************************/

// One-to-one relationship between User and Profile with foreign key 'user_id' in profile
User.hasOne(Profile, { foreignKey: "user_id", onDelete: "CASCADE", onUpdate: "CASCADE", as: "profile" });
Profile.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE", onUpdate: "CASCADE", as: "user" });

// One-to-many relationship between Species and Species with foreign key 'species_id' in Species
Species.hasMany(Species, {
    foreignKey: { name: "species_id", allowNull: true },
    onDelete: "CASCADE", onUpdate: "CASCADE", as: "subspecies"
});
Species.belongsTo(Species, {
    foreignKey: { name: "species_id", allowNull: true },
    onDelete: "CASCADE", onUpdate: "CASCADE", as: "species"
});


// One-to-many relationship between Species and Patient with foreign key 'species_id' in Patient
Species.hasMany(Patient, { foreignKey: "species_id", onUpdate: "CASCADE", as: "patients" });
Patient.belongsTo(Species, { foreignKey: "species_id", onUpdate: "CASCADE", as: "subspecies" });

// One-to-many relationship between Owner and Patient with foreign key 'owner_id' in Patient
Owner.hasMany(Patient, { foreignKey: "owner_id", onUpdate: "CASCADE", as: "patients" });
Patient.belongsTo(Owner, { foreignKey: "owner_id", onUpdate: "CASCADE", as: "owner" });

// One-to-many relationship between Profile and Patient with foreign key 'profile_id' in Patient
Profile.hasMany(Patient, { foreignKey: "profile_id", onDelete: 'NO ACTION', onUpdate: "CASCADE", as: "patients" });
Patient.belongsTo(Profile, { foreignKey: "profile_id", onDelete: 'NO ACTION', onUpdate: "CASCADE", as: "profile" });



/************************************************
******************** Options ********************
*************************************************/

// Ensure that the tables are created in the database
// await sequelize.sync({ force: true });
await sequelize.sync();



/************************************************
*************** Default Instances ***************
*************************************************/

(async () => {      // Create default user and profile admin
    const userAdminExists = await User.findOne({ where: { email: "admin@user.com" } });

    if (userAdminExists)
        return;

    const profileAdminExists = await Profile.findOne({ where: { admin: true } });

    if (profileAdminExists)
        return;

    const adminUser = await User.create({ email: "admin@user.com", password: "adminUserWithPassword#123" });
    await Profile.create({
        name: "Fernando",
        lastname: "Salazar",
        birthday: "2020-01-01",
        picture: "http://www.example.com/image.png",
        admin: true,
        college: "Universidad Nacional de Colombia",
        review: "Lorem ipsum dolor sit amet, consectetur",
        user_id: adminUser.id
    });
})();

(async () => {      // Create default species
    const dogOrCatSpeciesCreated = await Species.findOne({
        where: {
            name: {
                [Op.or]: ["Perro", "Gato"]
            }
        }
    });

    if (dogOrCatSpeciesCreated)
        return;

    await Species.create({ name: "Perro" });
    await Species.create({ name: "Gato" });
})();