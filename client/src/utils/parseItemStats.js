export default function parseItemStats(manifest, item, itemType) {
  const weaponRegex = /(kinetic)|(special)|(power)/;
  const armorRegex = /(helmet)|(gloves)|(chest)|(boots)|(classItem)/;
  // Data to display for weapons
  if (weaponRegex.test(itemType)) {
    const weaponPerks = getWeaponPerks(manifest, item);
    const weaponDetails = {
      itemType: item.itemTypeDisplayName,
      itemTier: item.itemTypeAndTierDisplayName,
      stats: {
        impact: item.stats.stats[4043523819].value,
        range: item.stats.stats[1240592695].value,
        stability: item.stats.stats[155624089].value,
        handling: item.stats.stats[943549884].value,
        reloadSpeed: item.stats.stats[4188031367].value,
        roundsPerMinute: item.stats.stats[4284893193].value,
        magazine: item.stats.stats[3871231066].value,
        aimAssistance: item.stats.stats[1345609583].value,
        inventorySize: item.stats.stats[4043523819].value,
        zoom: item.stats.stats[3555269338].value,
        recoil: item.stats.stats[2715839340].value,
      },
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
