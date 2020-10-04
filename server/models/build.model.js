const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// equipped items require:
// a name specific to an equipped item, fetched from bungie API
// a string path to the item's icon fetched from bungie API
const armorSchema = new Schema({
  name: { type: String },
  icon: { type: String },
  itemHash: { type: Number },
  mods: { type: Array },
  energyType: { type: String },
});

const weaponSchema = new Schema({
  name: { type: String },
  icon: { type: String },
  itemHash: { type: Number },
  perks: { type: Array },
  mod: {
    name: { type: String },
    description: { type: String },
    icon: { type: String },
  },
  masterwork: {
    name: { type: String },
    description: { type: String },
    icon: { type: String },
  },
});

// a subclass requires:
// the character class selected: hunter/warlock/titan
// associated tree: top/middle/bottom --- this will change with stasis subclasses
// skill choices: grenade, jump, classAbility selection
// const subClassSchema = new Schema({
//   class: { type: String, required: true },
// });

// a full build/character loadout includes:
// 1) name for the build REQUIRED
// 2) description for the build OPTIONAL
// 3) a class type: warlock, hunter, or titan with the associated tree/skill choices
// 4) character stats: a number for each of the stat types REQUIRED
// 5) weapons: a kinetic, special, and power weapon OPTIONAL
// 6) armor: helmet, gloves, chest, boots, classItem OPTIONAL
const buildSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    selectedClass: { type: String, required: true },
    stats: {
      mobility: { type: Number, required: true },
      resilience: { type: Number, required: true },
      recovery: { type: Number, required: true },
      discipline: { type: Number, required: true },
      intellect: { type: Number, required: true },
      strength: { type: Number, required: true },
    },
    weapons: {
      kinetic: weaponSchema,
      special: weaponSchema,
      power: weaponSchema,
    },
    armor: {
      helmet: armorSchema,
      gloves: armorSchema,
      chest: armorSchema,
      boots: armorSchema,
      classItem: armorSchema,
    },
  },
  {
    timestamps: true,
  }
);

const Build = mongoose.model("Build", buildSchema);

module.exports = Build;
