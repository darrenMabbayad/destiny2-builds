import React, { useState, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import CharacterStat from "../components/build-editor/CharacterStat";
import ClassPicker from "../components/build-editor/ClassPicker";
import ItemFrame from "../components/build-editor/ItemFrame";
import FormInput from "../components/build-editor/FormInput";
import ClassPickerModal from "../components/build-editor/modals/ClassPickerModal";
import ItemSearchModal from "../components/build-editor/modals/ItemSearchModal";
import WeaponDetailsModal from "../components/build-editor/modals/WeaponDetailsModal";
import ArmorDetailsModal from "../components/build-editor/modals/ArmorDetailsModal";
import { DestinyContext } from "../context/DestinyContext";
import {
  loadout,
  weapons,
  armor,
  stats,
  saveBuild,
  updateBuild,
  fetchBuild,
} from "../utils/loadout";
import parseItemStats from "../utils/parseItemStats";

function Editor() {
  // Initialize a build object to save/edit
  const { getInventoryItemsByEquipmentSlot, manifest } = useContext(
    DestinyContext
  );
  const location = useLocation();
  const buildToEdit =
    location.state !== undefined ? location.state.buildId : null;
  const [buildToSave, setBuildToSave] = useState(loadout);

  // Load a specific build on first render if there is one
  useEffect(() => {
    async function loadBuildToUpdate() {
      const data = await fetchBuild(buildToEdit);
      setBuildToSave(data);
    }
    if (buildToEdit) {
      loadBuildToUpdate();
    }
  }, [buildToEdit]);

  // State variables for toggling the class picker/item finder
  const [showClassPicker, setShowClassPicker] = useState(false);
  const [showItemSearch, setShowItemSearch] = useState(false);
  const [showWeaponDetails, setShowWeaponDetails] = useState(false);
  const [showArmorDetails, setShowArmorDetails] = useState(false);
  const [itemToChange, setItemToChange] = useState("");
  const [itemToSearch, setItemToSearch] = useState("");
  const [currentEnergyCost, setCurrentEnergyCost] = useState(0);
  const [hoveredItem, setHoveredItem] = useState({});
  const weaponRegex = /(kinetic)|(special)|(power)/;
  const armorRegex = /(helmet)|(gloves)|(chest)|(boots)|(classItem)/;

  // Handle state changes for the form inputs
  function handleChange(e) {
    const { name } = e.target;
    if (name === "name") {
      setBuildToSave({ ...buildToSave, name: e.target.value });
    } else if (name === "description") {
      setBuildToSave({ ...buildToSave, description: e.target.value });
    } else if (name === "search-query") {
      setItemToSearch(e.target.value);
    }
  }

  function selectClass(e) {
    const { name } = e.target;
    if (name === "btn-warlock") {
      setBuildToSave({ ...buildToSave, selectedClass: "Warlock" });
    } else if (name === "btn-hunter") {
      setBuildToSave({ ...buildToSave, selectedClass: "Hunter" });
    } else if (name === "btn-titan") {
      setBuildToSave({ ...buildToSave, selectedClass: "Titan" });
    }
  }

  function selectClassElement(e) {
    const { id } = e.target;
    const newSubClass = buildToSave.subClass;
    newSubClass.element = id;
    setBuildToSave({ ...buildToSave, subClass: newSubClass });
  }

  // ------------- START: Modal Toggles -------------- //
  function toggleClassPicker(e) {
    e.stopPropagation();
    setShowClassPicker(prevState => !prevState);
  }

  function toggleItemSearch(e) {
    e.stopPropagation();
    const { id } = e.target;
    let slotType = "";
    if (id === "kinetic") {
      slotType = "Kinetic Weapons";
    } else if (id === "special") {
      slotType = "Energy Weapons";
    } else if (id === "power") {
      slotType = "Power Weapons";
    } else if (id === "helmet") {
      slotType = "Helmet";
    } else if (id === "gloves") {
      slotType = "Gauntlets";
    } else if (id === "chest") {
      slotType = "Chest Armor";
    } else if (id === "boots") {
      slotType = "Leg Armor";
    } else if (id === "classItem") {
      slotType = "Class Armor";
    } else slotType = "";

    getInventoryItemsByEquipmentSlot(slotType);
    setShowItemSearch(prevState => !prevState);
    if (id) setItemToChange(id);
    else setItemToChange("");
    if (!showItemSearch) setItemToSearch("");
  }

  function toggleItemInfo(e) {
    const { id } = e.target;
    if (weaponRegex.test(id) && buildToSave.weapons[id].itemHash) {
      displayItemDetails(buildToSave.weapons[id].itemHash, id);
    } else if (armorRegex.test(id) && buildToSave.armor[id].itemHash) {
      displayItemDetails(buildToSave.armor[id].itemHash, id);
    }
  }

  function displayItemDetails(itemHash, itemType) {
    const item = manifest.inventoryItems[itemHash];
    const itemDetails = parseItemStats(manifest, item, itemType);
    if (weaponRegex.test(itemType)) {
      setHoveredItem(itemDetails);
      setShowWeaponDetails(prev => !prev);
    } else if (armorRegex.test(itemType)) {
      setHoveredItem(itemDetails);
      setShowArmorDetails(prev => !prev);
    }
  }
  // ------------- END: Modal Toggles -------------- //

  function changeItem(e, item, itemType) {
    e.stopPropagation();
    if (weaponRegex.test(itemType)) {
      const newWeapons = buildToSave.weapons;
      newWeapons[itemType] = item;
      setBuildToSave({ ...buildToSave, weapons: newWeapons });
    } else if (armorRegex.test(itemType)) {
      const newArmor = buildToSave.armor;
      newArmor[itemType] = item;
      setBuildToSave({ ...buildToSave, armor: newArmor });
    }
  }

  function changeStat(e, statToChange) {
    e.stopPropagation();
    const { id } = e.target;
    const newStats = buildToSave.stats;
    if (id === "stat-up") {
      if (newStats[statToChange] < 100) {
        newStats[statToChange] = newStats[statToChange] + 10;
      }
    } else if (id === "stat-down") {
      if (newStats[statToChange] > 0) {
        newStats[statToChange] = newStats[statToChange] - 10;
      }
    }
    setBuildToSave({ ...buildToSave, stats: newStats });
  }

  function changeClassAbility(ability) {
    const newSubClass = buildToSave.subClass;
    newSubClass.classSpecialty = ability;
    setBuildToSave({ ...buildToSave, subClass: newSubClass });
  }

  function changeJump(jump) {
    const newSubClass = buildToSave.subClass;
    newSubClass.movementMode = jump;
    setBuildToSave({ ...buildToSave, subClass: newSubClass });
  }

  function changeGrenade(grenade) {
    const newSubClass = buildToSave.subClass;
    newSubClass.grenade = grenade;
    setBuildToSave({ ...buildToSave, subClass: newSubClass });
  }

  function changeTree(tree) {
    const newSubClass = buildToSave.subClass;
    newSubClass.path = tree;
    setBuildToSave({ ...buildToSave, subClass: newSubClass });
  }

  function equipPerk(e, perk, weaponSlot) {
    const { parentElement } = e.target;
    const newWeapons = buildToSave.weapons;
    const perkToEquip = {
      name: perk.name,
      description: perk.description,
      icon: perk.icon,
    };
    const emptyPerkSlot = {
      name: "",
      description: "",
      icon: "",
    };
    newWeapons[weaponSlot].perks[parentElement.id] = perkToEquip;
    for (let i = 0; i < newWeapons[weaponSlot].perks.length; i++) {
      if (!(i in newWeapons[weaponSlot].perks)) {
        newWeapons[weaponSlot].perks[i] = emptyPerkSlot;
      }
    }
    setBuildToSave({ ...buildToSave, weapons: newWeapons });
  }

  function equipMod(mod, weaponSlot) {
    const newWeapons = buildToSave.weapons;
    const modToEquip = {
      name: mod.name,
      description: mod.description,
      icon: mod.icon,
    };
    newWeapons[weaponSlot].mod = modToEquip;
    setBuildToSave({ ...buildToSave, weapons: newWeapons });
  }

  function equipMasterwork(masterwork, weaponSlot) {
    const newWeapons = buildToSave.weapons;
    const masterworkToEquip = {
      name: masterwork.name,
      description: masterwork.description,
      icon: masterwork.icon,
    };
    newWeapons[weaponSlot].masterwork = masterworkToEquip;
    setBuildToSave({ ...buildToSave, weapons: newWeapons });
  }

  function equipArmorMod(e, mod, armorSlot, slotIndex) {
    if (checkModEnergyCost(mod.energyCost, armorSlot, slotIndex)) {
      const { parentElement } = e.target;
      const newArmor = buildToSave.armor;
      const modToEquip = {
        name: mod.name,
        description: mod.description,
        icon: mod.icon,
        energyCost: mod.energyCost,
      };
      const emptyModSlot = {
        name: "",
        description: "",
        icon: "",
        energyCost: 0,
      };
      newArmor[armorSlot].mods[parentElement.id] = modToEquip;
      for (let i = 0; i < newArmor[armorSlot].mods.length; i++) {
        if (!(i in newArmor[armorSlot].mods)) {
          newArmor[armorSlot].mods[i] = emptyModSlot;
        }
      }
      setBuildToSave({ ...buildToSave, armor: newArmor });
    }
  }

  function checkModEnergyCost(energyCost, armorSlot, slotIndex) {
    const armorToCheck = buildToSave.armor[armorSlot].mods;
    let totalEnergyCost = 0;
    armorToCheck.forEach((mod, index) => {
      if (index !== slotIndex) {
        totalEnergyCost += mod.energyCost;
      }
    });
    totalEnergyCost += energyCost;
    if (totalEnergyCost <= 10) {
      setCurrentEnergyCost(totalEnergyCost);
      return true;
    } else {
      return false;
    }
  }

  function equipArmorEnergyType(energyType, armorSlot) {
    console.log(armorSlot);
    const newArmor = buildToSave.armor;
    newArmor[armorSlot].energyType = energyType;
    // clear mods when picking a new energy type
    setCurrentEnergyCost(0);
    newArmor[armorSlot].mods = [];
    setBuildToSave({ ...buildToSave, armor: newArmor });
  }

  return (
    <>
      <div className="editor">
        <div className="editor-ui">
          <div className="editor-weapons-and-classes">
            <ClassPicker toggleClassPicker={toggleClassPicker} />
            {weapons.map((weapon, index) => (
              <ItemFrame
                key={index}
                currentItems={buildToSave}
                itemType={weapon}
                img={buildToSave.weapons[weapon].icon}
                toggleItemSearch={toggleItemSearch}
                toggleItemInfo={toggleItemInfo}
              />
            ))}
          </div>
          <div className="editor-armor-and-stats">
            <div>
              {stats.map((stat, index) => (
                <CharacterStat
                  key={index}
                  icon={stat.icon}
                  label={stat.label}
                  value={buildToSave.stats[stat.type]}
                  changeStat={changeStat}
                />
              ))}
            </div>
            <div>
              {armor.map((armor, index) => (
                <ItemFrame
                  key={index}
                  currentItems={buildToSave}
                  itemType={armor}
                  img={buildToSave.armor[armor].icon}
                  toggleItemSearch={toggleItemSearch}
                  toggleItemInfo={toggleItemInfo}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="editor-extra-info">
          <FormInput
            label="Name"
            name="name"
            value={buildToSave.name}
            placeholder="Build Name"
            handleChange={handleChange}
          />
          <FormInput
            label="Description"
            name="description"
            value={buildToSave.description}
            placeholder="Add a description"
            handleChange={handleChange}
          />
        </div>
        {buildToEdit ? (
          <button onClick={() => updateBuild(buildToSave)}>Update Build</button>
        ) : (
          <button onClick={() => saveBuild(buildToSave)}>Save Build</button>
        )}
      </div>
      {showClassPicker &&
        createPortal(
          <ClassPickerModal
            currentClass={buildToSave.selectedClass}
            currentSubClass={buildToSave.subClass}
            selectClass={selectClass}
            changeClassAbility={changeClassAbility}
            changeJump={changeJump}
            changeGrenade={changeGrenade}
            changeTree={changeTree}
            selectClassElement={selectClassElement}
            toggleClassPicker={toggleClassPicker}
          />,
          document.getElementById("modal-root")
        )}
      {showItemSearch &&
        createPortal(
          <ItemSearchModal
            toggleItemSearch={toggleItemSearch}
            itemToSearch={itemToSearch}
            handleChange={handleChange}
            itemToChange={itemToChange}
            changeItem={changeItem}
          />,
          document.getElementById("modal-root")
        )}
      {showWeaponDetails &&
        createPortal(
          <WeaponDetailsModal
            toggleItemInfo={toggleItemInfo}
            currentWeapons={buildToSave.weapons}
            details={hoveredItem}
            equipPerk={equipPerk}
            equipMod={equipMod}
            equipMasterwork={equipMasterwork}
          />,
          document.getElementById("modal-root")
        )}
      {showArmorDetails &&
        createPortal(
          <ArmorDetailsModal
            toggleItemInfo={toggleItemInfo}
            currentArmor={buildToSave.armor}
            details={hoveredItem}
            equipArmorMod={equipArmorMod}
            equipArmorEnergyType={equipArmorEnergyType}
            currentEnergyCost={currentEnergyCost}
          />,
          document.getElementById("modal-root")
        )}
    </>
  );
}

export default Editor;
