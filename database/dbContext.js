import { Op } from "sequelize";
import { sequelize } from "./connectdb.js";

import { Owner } from "../models/Owner.js";
import { EventType } from "../models/EventType.js";
import { Patient } from "../models/Patient.js";
import { Profile } from "../models/Profile.js";
import { Species } from "../models/Species.js";
import { User } from "../models/User.js";
import { Event } from "../models/Event.js";
import { Medicine } from "../models/Medicine.js";
import { DocumentFile } from "../models/DocumentFile.js";
import { MedicalAttention } from "../models/MedicalAttention.js";



/************************************************
***************** Relationships *****************
*************************************************/

// One-to-one relationship between User and Profile with foreign key 'userId' in profile
User.hasOne(Profile, {
    foreignKey: { name: "userId", allowNull: false },
    onDelete: "CASCADE", onUpdate: "CASCADE", as: "profile"
});
Profile.belongsTo(User, {
    foreignKey: { name: "userId", allowNull: false },
    onDelete: "CASCADE", onUpdate: "CASCADE", as: "user"
});


// One-to-many relationship between Species and Species with foreign key 'speciesId' in Species
Species.hasMany(Species, {
    foreignKey: { name: "speciesId", allowNull: true },
    onDelete: "CASCADE", onUpdate: "CASCADE", as: "subspecies"
});
Species.belongsTo(Species, {
    foreignKey: { name: "speciesId", allowNull: true },
    onDelete: "CASCADE", onUpdate: "CASCADE", as: "species"
});

// One-to-many relationship between Species and Patient with foreign key 'speciesId' in Patient
Species.hasMany(Patient, {
    foreignKey: { name: 'subspeciesId', allowNull: false },
    onDelete: 'CASCADE', onUpdate: "CASCADE", as: "patients"
});
Patient.belongsTo(Species, {
    foreignKey: { name: 'subspeciesId', allowNull: false },
    onDelete: 'CASCADE', onUpdate: "CASCADE", as: "subspecies"
});


// One-to-many relationship between Owner and Patient with foreign key 'ownerId' in Patient
Owner.hasMany(Patient, {
    foreignKey: { name: "ownerId", allowNull: false },
    onDelete: 'CASCADE', onUpdate: "CASCADE", as: "patients"
});
Patient.belongsTo(Owner, {
    foreignKey: { name: "ownerId", allowNull: false },
    onDelete: 'CASCADE', onUpdate: "CASCADE", as: "owner"
});


// One-to-many relationship between Profile and Patient with foreign key 'profileId' in Patient
Profile.hasMany(Patient, {
    foreignKey: { name: "profileId", allowNull: false },
    onDelete: 'CASCADE', onUpdate: "CASCADE", as: "patients"
});
Patient.belongsTo(Profile, {
    foreignKey: { name: "profileId", allowNull: false },
    onDelete: 'CASCADE', onUpdate: "CASCADE", as: "profile"
});


// One-to-many relationship between Patient and Event with foreign key 'patientId' in Event
Patient.hasMany(Event, {
    foreignKey: { name: "patientId", allowNull: true },
    onDelete: "CASCADE", onUpdate: "CASCADE", as: "events"
});
Event.belongsTo(Patient, {
    foreignKey: { name: "patientId", allowNull: true },
    onDelete: "CASCADE", onUpdate: "CASCADE", as: "patient"
});

// One-to-many relationship between profile and Event with foreign key 'profileId' in Event
Profile.hasMany(Event, {
    foreignKey: { name: "profileId", allowNull: false },
    onDelete: 'CASCADE', onUpdate: "CASCADE", as: "events"
});
Event.belongsTo(Profile, {
    foreignKey: { name: "profileId", allowNull: false },
    onDelete: 'CASCADE', onUpdate: "CASCADE", as: "profile"
});

// One-to-many relationship between EventType and Event with foreign key 'eventTypeId' in Event
EventType.hasMany(Event, {
    foreignKey: { name: "eventTypeId", allowNull: false },
    onDelete: 'CASCADE', onUpdate: "CASCADE", as: "events"
});
Event.belongsTo(EventType, {
    foreignKey: { name: "eventTypeId", allowNull: false },
    onDelete: 'CASCADE', onUpdate: "CASCADE", as: "eventType"
});


// One-to-many relationship between Patient and DocumentFile with foreign key 'patientId' in DocumentFile
Patient.hasMany(DocumentFile, {
    foreignKey: { name: "patientId", allowNull: true },
    onDelete: 'CASCADE', onUpdate: "CASCADE", as: "documentFiles"
});
DocumentFile.belongsTo(Patient, {
    foreignKey: { name: "patientId", allowNull: true },
    onDelete: 'CASCADE', onUpdate: "CASCADE", as: "patient"
});

// One-to-many relationship between MedicalAttention and DocumentFile with foreign key 'medicalAttentionId' in DocumentFile
MedicalAttention.hasMany(DocumentFile, {
    foreignKey: { name: "medicalAttentionId", allowNull: true },
    onDelete: 'CASCADE', onUpdate: "CASCADE", as: "documentFiles"
});
DocumentFile.belongsTo(MedicalAttention, {
    foreignKey: { name: "medicalAttentionId", allowNull: true },
    onDelete: 'CASCADE', onUpdate: "CASCADE", as: "medicalAttention"
});




/************************************************
******************** Options ********************
*************************************************/

// Ensure that the tables are created in the database
// await sequelize.sync({ force: true });
await sequelize.sync();




/************************************************
*************** Default Instances ***************
*************************************************/

(async () => {
    if (process.env.MODE === "test")
        return;

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
            userId: adminUser.id
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

})();