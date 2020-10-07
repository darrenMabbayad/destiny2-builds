import React, { createContext, useState, useEffect } from "react";
import { getManifestUrls } from "../utils/destiny2";
import axios from "axios";

const DestinyContext = createContext();

function DestinyContextProvider({ children }) {
  const [searchResults, setSearchResults] = useState({});

  const [inventoryItems, setInventoryItems] = useState({});
  const [itemCategories, setItemCategories] = useState({});
  const [equipmentSlots, setEquipmentSlots] = useState({});
  const [socketCategories, setSocketCategories] = useState({});
  const [plugSets, setPlugSets] = useState({});
  const [destinyStats, setDestinyStats] = useState({});
  const [sandboxPerks, setSandboxPerks] = useState({});

  const manifest = {
    inventoryItems,
    itemCategories,
    equipmentSlots,
    socketCategories,
    plugSets,
    destinyStats,
    sandboxPerks,
  };

  const itemTierRegex = /(Legendary)|(Exotic)/;
  const weaponSlotRegex = /(Kinetic Weapons)|(Energy Weapons)|(Power Weapons)/;
  const armorSlotRegex = /(Helmet)|(Gauntlets)|(Chest Armor)|(Leg Armor)|(Class Armor)/;
  const playerClassRegex = /(Warlock)|(Hunter)|(Titan)/;
  const weaponTypeRegex = /(Scout Rifle)|(Auto Rifle)|(Pulse Rifle)|(Fusion Rifle)|(Sniper Rifle)|(Hand Cannon)|(Shotgun)|(Sidearm)|(Machine Gun)|(Rocket Launcher)|(Sword)|(Grenade Launchers)|(Linear Fusion Rifles)|(Submachine Guns)|(Trace Rifles)|(Bows)/;

  useEffect(() => {
    async function getManifest() {
      try {
        let TIME_START = performance.now();
        let TIME_END = 0;
        // Fetch manifest URLs
        console.log("Fetching manifest URL...");
        const data = await getManifestUrls();
        const manifestUrl = `https://www.bungie.net${data.Response.jsonWorldContentPaths.en}`;
        // Fetch the manifest and set data in state
        const res = await axios.get(manifestUrl);
        setInventoryItems(res.data.DestinyInventoryItemDefinition);
        setEquipmentSlots(res.data.DestinyEquipmentSlotDefinition);
        setSocketCategories(res.data.DestinySocketCategoryDefinition);
        setItemCategories(res.data.DestinyItemCategoryDefinition);
        setPlugSets(res.data.DestinyPlugSetDefinition);
        setDestinyStats(res.data.DestinyStatDefinition);
        setSandboxPerks(res.data.DestinySandboxPerkDefinition);
        // Log performance
        TIME_END = performance.now();
        console.log(
          `Finished loading Destiny 2 manifest - ${TIME_END - TIME_START} ms`
        );
      } catch (e) {
        console.log("Could not load Destiny 2 manifest...");
        console.log(e);
      }
    }
    getManifest();
  }, []);

  function getInventoryItemsByEquipmentSlot(selectedSlot) {
    if (!selectedSlot) return;
    const itemList = [];
    for (const key in inventoryItems) {
      // weapons and armor have an equippingBlock property in their DestinyInventoryItemDefinition
      if (inventoryItems[key].hasOwnProperty("equippingBlock")) {
        const slotTypeHash =
          inventoryItems[key].equippingBlock.equipmentSlotTypeHash;
        if (
          armorSlotRegex.test(selectedSlot) &&
          checkArmor(inventoryItems[key], slotTypeHash, selectedSlot)
        ) {
          itemList.push(inventoryItems[key]);
        } else if (
          weaponSlotRegex.test(selectedSlot) &&
          checkWeapons(inventoryItems[key], slotTypeHash, selectedSlot)
        ) {
          itemList.push(inventoryItems[key]);
        }
      }
    }
    // categorize armor by class, categorize weapons by weapon type
    let itemsToReturn = {};
    if (armorSlotRegex.test(selectedSlot)) {
      itemsToReturn = categorizeArmor(itemList);
    } else if (weaponSlotRegex.test(selectedSlot)) {
      itemsToReturn = categorizeWeapons(itemList);
    }
    setSearchResults(itemsToReturn);
  }

  function checkSlotAndTier(item, slotTypeHash, selectedSlot) {
    // check if the armor corresponds to the selected loadout slot
    const isCorrespondingSlot =
      item.itemTypeDisplayName === selectedSlot &&
      equipmentSlots[slotTypeHash].displayProperties.name === selectedSlot;
    // check if the item is a Legendary or Exotic item
    const isLegendaryOrExoticTier = itemTierRegex.test(
      item.itemTypeAndTierDisplayName
    );
    return isCorrespondingSlot && isLegendaryOrExoticTier;
  }

  function checkWeapons(item, slotTypeHash, selectedSlot) {
    if (!item.hasOwnProperty("collectibleHash")) return false;
    const isCorrectSlotAndTier = checkSlotAndTier(
      item,
      slotTypeHash,
      selectedSlot
    );
    return isCorrectSlotAndTier;
  }

  function checkArmor(item, slotTypeHash, selectedSlot) {
    if (!item.hasOwnProperty("sockets")) return false;
    const isCorrectSlotAndTier = checkSlotAndTier(
      item,
      slotTypeHash,
      selectedSlot
    );
    /*
       check if the item is armor 2.0 (check if the number of mods slots is 3-4)
       only check corresponding slot AND legendary/exotic items
    */
    let isArmorTwoPointOh = false;
    if (isCorrectSlotAndTier) {
      const armorModSockets = item.sockets.socketCategories.filter(category => {
        return (
          socketCategories[category.socketCategoryHash].displayProperties
            .name === "ARMOR MODS"
        );
      });
      const armorPerks = item.sockets.socketCategories.filter(category => {
        return (
          socketCategories[category.socketCategoryHash].displayProperties
            .name === "ARMOR PERKS"
        );
      });
      const perkIndexes = new Set([...armorPerks[0].socketIndexes]);
      const filteredSocketCategories = item.sockets.socketEntries.filter(
        (entry, index) => perkIndexes.has(index)
      );
      let hasArmorPerks = false;
      for (const entry of filteredSocketCategories) {
        if (
          entry.singleInitialItemHash &&
          inventoryItems[entry.singleInitialItemHash].displayProperties.name
        ) {
          hasArmorPerks = true;
          return;
        }
      }
      isArmorTwoPointOh =
        !hasArmorPerks && armorModSockets[0].socketIndexes.length > 2;
    }
    return isArmorTwoPointOh && isCorrectSlotAndTier;
  }

  function categorizeWeapons(itemList) {
    const categorizedItems = {
      scoutRifle: [],
      autoRifle: [],
      pulseRifle: [],
      fusionRifle: [],
      sniperRifle: [],
      handCannon: [],
      shotgun: [],
      sidearm: [],
      machineGun: [],
      rocketLauncher: [],
      sword: [],
      grenadeLaunchers: [],
      linearFusionRifles: [],
      submachineGuns: [],
      traceRifles: [],
      bows: [],
    };
    itemList.forEach(item => {
      let itemType = "";
      // check the weapon type of the item, filter out non weapons
      for (const category of item.itemCategoryHashes) {
        if (
          weaponTypeRegex.test(itemCategories[category].displayProperties.name)
        ) {
          const tempString = [
            ...itemCategories[category].displayProperties.name,
          ]
            .join("")
            .replace(" ", "")
            .replace(" ", ""); // this is to cover Linear Fusion Rifles
          itemType = tempString[0].toLowerCase() + tempString.slice(1);
        }
      }
      categorizedItems[itemType].push(item);
    });
    return categorizedItems;
  }

  function categorizeArmor(itemList) {
    const categorizedItems = {
      warlock: [],
      hunter: [],
      titan: [],
    };
    itemList.forEach(item => {
      let playerClass = "";
      // first check what player class the armor item can be equipped on
      for (const category of item.itemCategoryHashes) {
        if (
          playerClassRegex.test(itemCategories[category].displayProperties.name)
        ) {
          playerClass =
            itemCategories[category].displayProperties.name[0].toLowerCase() +
            itemCategories[category].displayProperties.name.slice(1);
        }
      }
      categorizedItems[playerClass].push(item);
    });
    return categorizedItems;
  }

  return (
    <DestinyContext.Provider
      value={{
        manifest,
        searchResults,
        getInventoryItemsByEquipmentSlot,
      }}
    >
      {children}
    </DestinyContext.Provider>
  );
}

export { DestinyContextProvider, DestinyContext };
