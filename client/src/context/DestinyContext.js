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
  const [talentGrids, setTalentGrids] = useState({});
  const [collectibles, setCollectibles] = useState({})

  const manifest = {
    inventoryItems,
    itemCategories,
    equipmentSlots,
    socketCategories,
    plugSets,
    destinyStats,
    sandboxPerks,
    talentGrids,
    collectibles
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
        setTalentGrids(res.data.DestinyTalentGridDefinition);
        setCollectibles(res.data.DestinyCollectibleDefinition)
        // Log performance
        TIME_END = performance.now();
        console.log(
          `Finished loading Destiny 2 manifest from ${manifestUrl} - ${
            TIME_END - TIME_START
          } ms`
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
    let isCorrespondingSlot = false;
    if (weaponSlotRegex.test(selectedSlot)) {
      isCorrespondingSlot =
        equipmentSlots[slotTypeHash].displayProperties.name === selectedSlot;
    } else if (armorSlotRegex.test(selectedSlot)) {
      isCorrespondingSlot =
        item.itemTypeDisplayName === selectedSlot &&
        equipmentSlots[slotTypeHash].displayProperties.name === selectedSlot;
    }
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
          inventoryItems[entry.singleInitialItemHash].displayProperties.name &&
          inventoryItems[entry.singleInitialItemHash]
            .itemTypeAndTierDisplayName !== "Exotic Intrinsic"
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

  function getSubClass(selectedClass) {
    const subclassList = [];
    let subclassToFind = "";
    const hunterRegex = /(hunter)/i;
    const warlockRegex = /(warlock)/i;
    const titanRegex = /(titan)/i;
    if (hunterRegex.test(selectedClass)) {
      subclassToFind = "Hunter Subclass";
    } else if (warlockRegex.test(selectedClass)) {
      subclassToFind = "Warlock Subclass";
    } else if (titanRegex.test(selectedClass)) {
      subclassToFind = "Titan Subclass";
    } else return;
    for (const key in inventoryItems) {
      if (inventoryItems[key].itemTypeDisplayName === subclassToFind) {
        subclassList.push(inventoryItems[key]);
      }
    }

    const subclassTalents = [];
    subclassList.forEach(subclass => {
      if (subclass.talentGrid.hudDamageType === 2) {
        const subClassIcon = subclass.secondaryIcon;
        const uiIcon = subclass.displayProperties.icon;
        const element = "arc";
        const arcSubClass = getTalentGrid(
          subclass.talentGrid.talentGridHash,
          subClassIcon,
          uiIcon,
          element
        );
        subclassTalents.push(arcSubClass);
      } else if (subclass.talentGrid.hudDamageType === 3) {
        const subClassIcon = subclass.secondaryIcon;
        const uiIcon = subclass.displayProperties.icon;
        const element = "solar";
        const solarSubClass = getTalentGrid(
          subclass.talentGrid.talentGridHash,
          subClassIcon,
          uiIcon,
          element
        );
        subclassTalents.push(solarSubClass);
      } else if (subclass.talentGrid.hudDamageType === 4) {
        const subClassIcon = subclass.secondaryIcon;
        const uiIcon = subclass.displayProperties.icon;
        const element = "void";
        const voidSubClass = getTalentGrid(
          subclass.talentGrid.talentGridHash,
          subClassIcon,
          uiIcon,
          element
        );
        subclassTalents.push(voidSubClass);
      }
    });

    return subclassTalents;
  }

  function getTalentGrid(hash, subClassIcon, uiIcon, element) {
    let subClass = {
      icon: subClassIcon,
      secondaryIcon: uiIcon,
      element: element,
      classSpecialties: [],
      movementModes: [],
      grenades: [],
      super: [],
      firstPath: {
        name: "",
        icon: "",
        talents: [],
      },
      secondPath: {
        name: "",
        icon: "",
        talents: [],
      },
      thirdPath: {
        name: "",
        icon: "",
        talents: [],
      },
    };

    let classSpecialtiesIndexes;
    let movementModesIndexes;
    let grenadesIndexes;
    let superIndexes;
    let firstPathIndexes;
    let secondPathIndexes;
    let thirdPathIndexes;

    talentGrids[hash].nodeCategories.forEach(category => {
      if (category.identifier === "ClassSpecialties") {
        classSpecialtiesIndexes = new Set([...category.nodeHashes]);
      } else if (category.identifier === "MovementModes") {
        movementModesIndexes = new Set([...category.nodeHashes]);
      } else if (category.identifier === "Grenades") {
        grenadesIndexes = new Set([...category.nodeHashes]);
      } else if (category.identifier === "Super") {
        superIndexes = new Set([...category.nodeHashes]);
      } else if (category.identifier === "FirstPath") {
        firstPathIndexes = new Set([...category.nodeHashes]);
        subClass.firstPath.name = category.displayProperties.name;
        subClass.firstPath.icon = category.displayProperties.icon;
      } else if (category.identifier === "SecondPath") {
        secondPathIndexes = new Set([...category.nodeHashes]);
        subClass.secondPath.name = category.displayProperties.name;
        subClass.secondPath.icon = category.displayProperties.icon;
      } else if (category.identifier === "ThirdPath") {
        thirdPathIndexes = new Set([...category.nodeHashes]);
        subClass.thirdPath.name = category.displayProperties.name;
        subClass.thirdPath.icon = category.displayProperties.icon;
      }
    });

    talentGrids[hash].nodes.forEach((node, index) => {
      if (classSpecialtiesIndexes.has(index)) {
        subClass.classSpecialties.push({displayProperties: node.steps[0].displayProperties});
      } else if (movementModesIndexes.has(index)) {
        subClass.movementModes.push({displayProperties: node.steps[0].displayProperties});
      } else if (grenadesIndexes.has(index)) {
        subClass.grenades.push({displayProperties: node.steps[0].displayProperties});
      } else if (superIndexes.has(index)) {
        subClass.super = {displayProperties: node.steps[0].displayProperties};
      } else if (firstPathIndexes.has(index)) {
        subClass.firstPath.talents.push({displayProperties: node.steps[0].displayProperties});
      } else if (secondPathIndexes.has(index)) {
        subClass.secondPath.talents.push({displayProperties: node.steps[0].displayProperties});
      } else if (thirdPathIndexes.has(index)) {
        subClass.thirdPath.talents.push({displayProperties: node.steps[0].displayProperties});
      }
    });
    return subClass;
  }

  return (
    <DestinyContext.Provider
      value={{
        manifest,
        searchResults,
        getInventoryItemsByEquipmentSlot,
        getSubClass,
      }}
    >
      {children}
    </DestinyContext.Provider>
  );
}

export { DestinyContextProvider, DestinyContext };
