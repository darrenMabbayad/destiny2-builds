import React, { useState, useContext } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import CharacterStat from "../components/build-editor/CharacterStat";
import ClassPicker from "../components/build-editor/ClassPicker";
import ItemFrame from "../components/build-editor/ItemFrame";
import FormInput from "../components/build-editor/FormInput";
import ClassPickerModal from "../components/build-editor/modals/ClassPickerModal";
import ItemSearchModal from "../components/build-editor/modals/ItemSearchModal";
import ItemInfoModal from "../components/build-editor/modals/ItemInfoModal";
import { DestinyContext } from "../context/DestinyContext";
import {
  loadout,
  weapons,
  armor,
  stats,
  saveBuild,
  updateBuild,
} from "../utils/loadout";
import { queryDestinyApi } from "../utils/destiny2";

function Editor() {
  // Initialize a build object to save/edit
  const { manifest } = useContext(DestinyContext);
  const location = useLocation();
  const buildToEdit =
    location.state !== undefined ? location.state.build : null;
  const [buildToSave, setBuildToSave] = useState(
    buildToEdit ? buildToEdit : loadout
  );

  // State variables for toggling the class picker/item finder
  const [showClassPicker, setShowClassPicker] = useState(false);
  const [showItemSearch, setShowItemSearch] = useState(false);
  const [showItemInfo, setShowItemInfo] = useState(false);
  const [itemToChange, setItemToChange] = useState("");
  const [itemToSearch, setItemToSearch] = useState("");
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

  function toggleClassPicker(e) {
    e.stopPropagation();
    setShowClassPicker(prevState => !prevState);
  }

  function toggleItemSearch(e) {
    e.stopPropagation();
    setShowItemSearch(prevState => !prevState);
    if (e.target.id) setItemToChange(e.target.id);
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

  async function searchItem(query) {
    const res = await queryDestinyApi(query);
    setItemToSearch("");
    return res;
  }

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

  function parseItemDetails(item) {
    console.log(item);
  }

  function displayItemDetails(itemHash, itemType) {
    const item = manifest.DestinyInventoryItemDefinition[itemHash];
    // data to display for a weapon
    let itemToParse = {};
    // TODO data to display for armor
    if (weaponRegex.test(itemType)) {
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
      };
      itemToParse = weaponDetails;
    } else if (armorRegex.test(itemType)) {
      console.log(item);
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
      itemToParse = armorDetails;
    }
    parseItemDetails(itemToParse);
    setShowItemInfo(prev => !prev);
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
      {showClassPicker
        ? createPortal(
            <ClassPickerModal
              selectClass={selectClass}
              toggleClassPicker={toggleClassPicker}
            />,
            document.getElementById("modal-root")
          )
        : null}
      {showItemSearch
        ? createPortal(
            <ItemSearchModal
              toggleItemSearch={toggleItemSearch}
              itemToSearch={itemToSearch}
              handleChange={handleChange}
              searchItem={searchItem}
              itemToChange={itemToChange}
              changeItem={changeItem}
            />,
            document.getElementById("modal-root")
          )
        : null}
      {showItemInfo
        ? createPortal(<ItemInfoModal />, document.getElementById("modal-root"))
        : null}
    </>
  );
}

export default Editor;
