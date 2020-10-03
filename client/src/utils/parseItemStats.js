export default function parseItemStats(manifest, item, itemType) {
  const weaponRegex = /(kinetic)|(special)|(power)/;
  const armorRegex = /(helmet)|(gloves)|(chest)|(boots)|(classItem)/;
  // Data to display for weapons
  if (weaponRegex.test(itemType)) {
    const weaponPerks = getWeaponPerks(manifest, item);
    const weaponGeneralInfo = getWeaponGeneralInfo(manifest, item);
    const weaponStats = getWeaponStats(manifest, item);
    const weaponMods = getWeaponModSocket(manifest, item);
    const weaponDetails = {
      generalInfo: weaponGeneralInfo,
      stats: weaponStats,
      perks: weaponPerks,
      mods: weaponMods,
    };
    return weaponDetails;
  } else if (armorRegex.test(itemType)) {
    // Data to display for armor
    const armorDetails = {
      modSockets: {
        socket0: {
          icon:
            manifest.DestinyInventoryItemDefinition[
              item.sockets.socketEntries[0].singleInitialItemHash
            ].displayProperties.icon,
        },
        socket1: {
          icon:
            manifest.DestinyInventoryItemDefinition[
              item.sockets.socketEntries[1].singleInitialItemHash
            ].displayProperties.icon,
        },
        socket2: {
          icon:
            manifest.DestinyInventoryItemDefinition[
              item.sockets.socketEntries[2].singleInitialItemHash
            ].displayProperties.icon,
        },
      },
    };
    return armorDetails;
  }
}

function getWeaponPerks(manifest, item) {
  // 1) filter all socket entries by only looking for WEAPON PERKS entries
  const filteredSocketEntries = item.sockets.socketCategories.filter(
    category =>
      manifest.DestinySocketCategoryDefinition[category.socketCategoryHash]
        .displayProperties.name === "WEAPON PERKS"
  );
  // 2) get a list of all the weapon perk plugs by index
  const plugIndexes = new Set([...filteredSocketEntries[0].socketIndexes]);
  const plugList = item.sockets.socketEntries.filter((entry, index) =>
    plugIndexes.has(index)
  );
  // 3) get a list of all possible perks for each plug
  const perkSlotList = plugList.map(plug => {
    if (plug.hasOwnProperty("randomizedPlugSetHash")) {
      return manifest.DestinyPlugSetDefinition[plug.randomizedPlugSetHash]
        .reusablePlugItems;
    } else if (plug.hasOwnProperty("reusablePlugSetHash")) {
      return manifest.DestinyPlugSetDefinition[plug.reusablePlugSetHash]
        .reusablePlugItems;
    } else return null;
  });
  //4) get all the display information for each perk for a specific plug
  const specificSlotPerks = [];
  perkSlotList.forEach(slot => {
    const perks = slot.map(entry => {
      return manifest.DestinyInventoryItemDefinition[entry.plugItemHash]
        .displayProperties;
    });
    specificSlotPerks.push(perks);
  });
  return specificSlotPerks;
}

function getWeaponModSocket(manifest, item) {
  // 1) filter all socket entries by only looking for WEAPON MODS entries
  const filteredSocketEntries = item.sockets.socketCategories.filter(
    category =>
      manifest.DestinySocketCategoryDefinition[category.socketCategoryHash]
        .displayProperties.name === "WEAPON MODS"
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
    const socketType =
      manifest.DestinyInventoryItemDefinition[entry.singleInitialItemHash]
        .displayProperties.name;
    const catalystRegex = /Catalyst/;
    if (socketType === "Empty Mod Socket") {
      modSockets.mods =
        manifest.DestinyPlugSetDefinition[
          entry.reusablePlugSetHash
        ].reusablePlugItems;
    } else if (socketType === "Tier 1 Weapon") {
      modSockets.masterwork =
        manifest.DestinyPlugSetDefinition[
          entry.reusablePlugSetHash
        ].reusablePlugItems;
    } else if (socketType === "Masterwork") {
      // in the case of pinnacle/ritual class weapons, there is only 1 masterwork
      modSockets.masterwork.push(
        manifest.DestinyInventoryItemDefinition[entry.singleInitialItemHash]
          .displayProperties
      );
    } else if (catalystRegex.test(socketType)) {
      // this only applies to exotic weapons
      modSockets.mods.push(
        manifest.DestinyInventoryItemDefinition[entry.singleInitialItemHash]
          .displayProperties
      );
    }
  }
  let equippableMods = [];
  if (modSockets.mods.length > 1) {
    equippableMods = modSockets.mods.map(item => {
      return manifest.DestinyInventoryItemDefinition[item.plugItemHash]
        .displayProperties;
    });
  } else {
    // only applies to exotic weapons
    equippableMods = modSockets.mods;
  }
  let masterworkChoices = [];
  if (modSockets.masterwork.length > 1) {
    for (const entry of modSockets.masterwork) {
      const socketType =
        manifest.DestinyInventoryItemDefinition[entry.plugItemHash]
          .displayProperties;
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

function getWeaponGeneralInfo(manifest, item) {
  // Get generic info right from the item object itself
  const slotHash = item.equippingBlock.equipmentSlotTypeHash;
  const slotType =
    manifest.DestinyEquipmentSlotDefinition[slotHash].displayProperties.name;
  const itemInfo = {
    itemType: item.itemTypeDisplayName,
    itemTier: item.itemTypeAndTierDisplayName,
    itemSlot: slotType,
  };
  return itemInfo;
}

function getWeaponStats(manifest, item) {
  // Get all general and hidden weapon stats from the item object
  const weaponStats = [];
  for (const [key, value] of Object.entries(item.stats.stats)) {
    const stat = {
      label: manifest.DestinyStatDefinition[key].displayProperties.name,
      value: value.value,
    };
    weaponStats.push(stat);
  }
  return weaponStats;
}
