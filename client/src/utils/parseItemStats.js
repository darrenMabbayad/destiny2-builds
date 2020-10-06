export default function parseItemStats(manifest, item, itemType) {
  const weaponRegex = /(kinetic)|(special)|(power)/;
  const armorRegex = /(helmet)|(gloves)|(chest)|(boots)|(classItem)/;
  // Data to display for weapons
  if (weaponRegex.test(itemType)) {
    const weaponPerks = getWeaponPerks(manifest, item);
    const weaponGeneralInfo = getGeneralInfo(manifest, item);
    const weaponStats = getWeaponStats(manifest, item);
    const weaponMods = getWeaponModSocket(manifest, item);
    const weaponIntrinsicTrait = getWeaponIntrinsicTrait(manifest, item);
    const weaponDetails = {
      generalInfo: weaponGeneralInfo,
      instrinsicTrait: weaponIntrinsicTrait,
      stats: weaponStats,
      perks: weaponPerks,
      mods: weaponMods,
    };
    console.log(weaponDetails.mods);
    return weaponDetails;
  } else if (armorRegex.test(itemType)) {
    const armorMods = getArmorMods(manifest, item);
    const armorGeneralInfo = getGeneralInfo(manifest, item);
    const armorDetails = {
      generalInfo: armorGeneralInfo,
      mods: armorMods,
    };
    return armorDetails;
  }
}

function getGeneralInfo(manifest, item) {
  // Get generic info right from the item object itself
  const slotHash = item.equippingBlock.equipmentSlotTypeHash;
  const slotType = manifest.equipmentSlots[slotHash].displayProperties.name;
  const itemInfo = {
    itemType: item.itemTypeDisplayName,
    itemTier: item.itemTypeAndTierDisplayName,
    itemSlot: slotType,
  };
  return itemInfo;
}

// ---------- START: WEAPON FUNCTIONS ----------//
function getWeaponIntrinsicTrait(manifest, item) {
  // 1) filter all socket entries by only looking for WEAPON PERKS entries
  const filteredSocketEntries = item.sockets.socketCategories.filter(
    category =>
      manifest.socketCategories[category.socketCategoryHash].displayProperties
        .name === "INTRINSIC TRAITS"
  );
  // 2) get a list of all the weapon perk plugs by index
  const plugIndexes = new Set([...filteredSocketEntries[0].socketIndexes]);
  const plugList = item.sockets.socketEntries.filter((entry, index) =>
    plugIndexes.has(index)
  );
  const intrinsicTrait = [];
  plugList.forEach(plug => {
    intrinsicTrait.push(
      manifest.inventoryItems[plug.singleInitialItemHash].displayProperties
    );
  });
  return intrinsicTrait;
}
function getWeaponPerks(manifest, item) {
  // 1) filter all socket entries by only looking for WEAPON PERKS entries
  const filteredSocketEntries = item.sockets.socketCategories.filter(
    category =>
      manifest.socketCategories[category.socketCategoryHash].displayProperties
        .name === "WEAPON PERKS"
  );
  // 2) get a list of all the weapon perk plugs by index
  const plugIndexes = new Set([...filteredSocketEntries[0].socketIndexes]);
  const plugList = item.sockets.socketEntries.filter((entry, index) =>
    plugIndexes.has(index)
  );
  // 3) get a list of all possible perks for each plug
  const perkSlotList = plugList.map(plug => {
    if (plug.hasOwnProperty("randomizedPlugSetHash")) {
      return manifest.plugSets[plug.randomizedPlugSetHash].reusablePlugItems;
    } else if (plug.hasOwnProperty("reusablePlugSetHash")) {
      return manifest.plugSets[plug.reusablePlugSetHash].reusablePlugItems;
    } else return null;
  });
  //4) get all the display information for each perk for a specific plug
  const specificSlotPerks = [];
  perkSlotList.forEach(slot => {
    const perks = slot.map(entry => {
      return manifest.inventoryItems[entry.plugItemHash].displayProperties;
    });
    specificSlotPerks.push(perks);
  });
  return specificSlotPerks;
}

function getWeaponModSocket(manifest, item) {
  // 1) filter all socket entries by only looking for WEAPON MODS entries
  const filteredSocketEntries = item.sockets.socketCategories.filter(
    category =>
      manifest.socketCategories[category.socketCategoryHash].displayProperties
        .name === "WEAPON MODS"
  );
  // 2) get a list of all the weapon mod plugs by index
  const plugIndexes = new Set([...filteredSocketEntries[0].socketIndexes]);
  const modSocketEntries = item.sockets.socketEntries.filter((entry, index) =>
    plugIndexes.has(index)
  );
  /* 
    3) There are always going to be two elements in modSocketEntries
    One corresponds to mod sockets (e.g taken spec) and the other corresponds
    to masterwork choices (e.g tier 1-10 range). Push all relevant reusable plug
    items into the corresponding socket type
  */
  const modSockets = {
    mods: [],
    masterwork: [],
  };
  for (const entry of modSocketEntries) {
    if (!entry.singleInitialItemHash) {
      modSockets.masterwork =
        manifest.plugSets[entry.reusablePlugSetHash].reusablePlugItems;
    } else {
      const socketType =
        manifest.inventoryItems[entry.singleInitialItemHash].displayProperties
          .name;
      const catalystRegex = /Catalyst/;
      if (socketType === "Empty Mod Socket") {
        modSockets.mods =
          manifest.plugSets[entry.reusablePlugSetHash].reusablePlugItems;
      } else if (socketType === "Tier 1 Weapon") {
        modSockets.masterwork =
          manifest.plugSets[entry.reusablePlugSetHash].reusablePlugItems;
      } else if (socketType === "Masterwork") {
        // in the case of pinnacle/ritual class weapons, there is only 1 masterwork
        modSockets.masterwork.push(
          manifest.inventoryItems[entry.singleInitialItemHash].displayProperties
        );
      } else if (catalystRegex.test(socketType)) {
        // this only applies to exotic weapons
        // push the empty mod socket
        modSockets.mods.push(
          manifest.inventoryItems[entry.singleInitialItemHash].displayProperties
        );
      }
    }
  }
  let equippableMods = [];
  if (modSockets.mods.length > 1) {
    equippableMods = modSockets.mods.map(item => {
      const mod = manifest.inventoryItems[item.plugItemHash];
      const modDisplayProperties = mod.displayProperties;
      let modSandboxPerk = {};
      if (mod.perks.length >= 1) {
        for (const perk of mod.perks) {
          if (manifest.sandboxPerks[perk.perkHash].isDisplayable) {
            const description =
              manifest.sandboxPerks[perk.perkHash].displayProperties
                .description;
            const otherDisplayProperties = mod.displayProperties;
            modSandboxPerk = {
              ...otherDisplayProperties,
              description,
            };
          }
        }
      }
      const modToPush = {
        ...modDisplayProperties,
        ...modSandboxPerk,
      };
      return modToPush;
    });
  } else {
    // only applies to exotic weapons
    equippableMods = modSockets.mods;
  }
  let masterworkChoices = [];
  if (modSockets.masterwork.length > 1) {
    for (const entry of modSockets.masterwork) {
      const socketType =
        manifest.inventoryItems[entry.plugItemHash].displayProperties;
      if (socketType.name === "Masterwork") {
        masterworkChoices.push(socketType);
      }
    }
  } else {
    // only applies to pinnacle/ritual weapons, exotics will be an empty array
    masterworkChoices = modSockets.masterwork;
  }
  return { equippableMods, masterworkChoices };
}

function getWeaponStats(manifest, item) {
  // Get all general and hidden weapon stats from the item object
  const weaponStats = [];
  for (const [key, value] of Object.entries(item.stats.stats)) {
    const stat = {
      label: manifest.destinyStats[key].displayProperties.name,
      value: value.value,
    };
    weaponStats.push(stat);
  }
  return weaponStats;
}
// ---------- END: WEAPON FUNCTIONS ----------//

// ---------- START: ARMOR FUNCTIONS ----------//
function getArmorMods(manifest, item) {
  // 1) filter all socket entries by only looking for ARMOR MODS entries
  const filteredSocketEntries = item.sockets.socketCategories.filter(
    category =>
      manifest.socketCategories[category.socketCategoryHash].displayProperties
        .name === "ARMOR MODS"
  );
  // 2) filter item.socket.socketEntries and return only indexes with ARMOR MODS
  const plugIndexes = new Set([...filteredSocketEntries[0].socketIndexes]);
  const plugList = item.sockets.socketEntries.filter((entry, index) =>
    plugIndexes.has(index)
  );
  // 3) for each individual mod slot (each array index contains a list of mods), get a list of plugSetHashes for that slot
  const specificSlotMods = [];
  plugList.forEach(slot => {
    specificSlotMods.push(
      manifest.plugSets[slot.reusablePlugSetHash].reusablePlugItems
    );
  });
  // 4) for each individual mod slot (each array index contains a list of mods), get a list of all mods available for that slot
  let mods = [];
  specificSlotMods.forEach(slot => {
    const modList = slot.map(mod => {
      return manifest.inventoryItems[mod.plugItemHash];
    });
    mods.push(modList);
  });
  // 5) for each slot, categorize available mods by element type
  let allModsBySlotType = [];
  let energyType = "";
  mods.forEach(slot => {
    let modsByElementType = {
      any: [],
      arc: [],
      solar: [],
      void: [],
    };
    slot.forEach(mod => {
      energyType = checkModEnergyType(mod);
      const modToAdd = {
        ...mod.displayProperties,
        energyCost:
          mod.plug.hasOwnProperty("energyCost") &&
          mod.plug.energyCost.energyCost,
      };
      modsByElementType[energyType].push(modToAdd);
    });
    allModsBySlotType.push(modsByElementType);
  });
  return allModsBySlotType;
}

function checkModEnergyType(mod) {
  if (!mod.plug.hasOwnProperty("energyCost")) {
    return "any";
  } else if (mod.plug.energyCost.energyType === 0) {
    // any energy type
    return "any";
  } else if (mod.plug.energyCost.energyType === 1) {
    // arc
    return "arc";
  } else if (mod.plug.energyCost.energyType === 2) {
    // solar
    return "solar";
  } else if (mod.plug.energyCost.energyType === 3) {
    // void
    return "void";
  }
}
// ---------- END: ARMOR FUNCTIONS ----------//
