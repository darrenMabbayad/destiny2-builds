export default function parseItemStats(manifest, item, itemType) {
  const weaponRegex = /(kinetic)|(special)|(power)/;
  const armorRegex = /(helmet)|(gloves)|(chest)|(boots)|(classItem)/;
  // Data to display for weapons
  if (weaponRegex.test(itemType)) {
    const weaponPerks = getWeaponPerks(manifest, item);
    const weaponGeneralInfo = getWeaponGeneralInfo(manifest, item);
    const weaponStats = getWeaponStats(manifest, item);
    const weaponDetails = {
      generalInfo: weaponGeneralInfo,
      stats: weaponStats,
      perks: weaponPerks,
      mod: "",
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

function getWeaponGeneralInfo(manifest, item) {
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
