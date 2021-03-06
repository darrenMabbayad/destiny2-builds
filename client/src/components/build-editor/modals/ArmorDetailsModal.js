import React, {useState} from "react";
import { Link } from "react-router-dom";
import QuickDetailsModal from "./QuickDetailsModal";

function ArmorDetailsModal({
  toggleItemInfo,
  details,
  currentArmor,
  equipArmorEnergyType,
  equipArmorMod,
  currentEnergyCost,
}) {
  const classItemRegex = /(Hunter Cloak)|(Warlock Bond)|(Titan Mark)/;
  const [quickHoverDetails, setQuickHoverDetails] = useState({})
  const [showQuickDetails, setShowQuickDetails] = useState(false)
  const [infoType, setInfoType] = useState('')
  let armorSlot = "";
  let equippedMods = [];
  let equippedEnergyType = "";
  if (details.generalInfo.itemSlot === "Helmet") {
    armorSlot = "helmet";
    equippedMods = currentArmor.helmet.mods;
    equippedEnergyType = currentArmor.helmet.energyType;
  } else if (details.generalInfo.itemSlot === "Gauntlets") {
    armorSlot = "gloves";
    equippedMods = currentArmor.gloves.mods;
    equippedEnergyType = currentArmor.gloves.energyType;
  } else if (details.generalInfo.itemSlot === "Chest Armor") {
    armorSlot = "chest";
    equippedMods = currentArmor.chest.mods;
    equippedEnergyType = currentArmor.chest.energyType;
  } else if (details.generalInfo.itemSlot === "Leg Armor") {
    armorSlot = "boots";
    equippedMods = currentArmor.boots.mods;
    equippedEnergyType = currentArmor.boots.energyType;
  } else if (classItemRegex.test(details.generalInfo.itemSlot)) {
    armorSlot = "classItem";
    equippedMods = currentArmor.classItem.mods;
    equippedEnergyType = currentArmor.classItem.energyType;
  }

  function getModClassName(mod, slotType) {
    if (!equippedMods[slotType]) {
      return null;
    } else {
      if (equippedMods[slotType].name === mod) return "armor-mod-equipped";
      else return null;
    }
  }

  function getEnergyTypeClassName(energyType) {
    if (equippedEnergyType === energyType) return "armor-energy-type-equipped";
    else return null;
  }

  function renderEnergyBars() {
    let energyBars = [];
    let filledClassName = "";
    for (let i = 1; i < 11; i++) {
      if (currentEnergyCost >= i) {
        if (!equippedEnergyType) {
          filledClassName = `generic-energy-filled`;
        } else {
          filledClassName = `${equippedEnergyType}-energy-filled`;
        }
      }
      energyBars.push(
        <div
          key={i}
          className={
            filledClassName
              ? `armor-detail-modal-energy-bar ${filledClassName}`
              : "armor-detail-modal-energy-bar"
          }
        />
      );
      filledClassName = "";
    }
    return energyBars;
  }

  function openQuickDetails(itemInfo, type) {
    setInfoType(type)
    setQuickHoverDetails(itemInfo)
    setShowQuickDetails(true)
  }

  function closeQuickDetails() {
    setShowQuickDetails(false)
  }

  return (
    <>
      <div
        id={details.selectedSlot}
        className="weapon-detail-overlay"
        onClick={e => toggleItemInfo(e)}
      />
      <div className="armor-detail-modal item-info">
        <div className="armor-detail-modal-name-desc">
          <h2>{details.generalInfo.itemName}</h2>
          <p>{details.generalInfo.itemDescription}</p>
        </div>
        <div className="armor-detail-modal-energy-types">
          {energyTypes.map((type, index) => (
            <img
              key={index}
              className={getEnergyTypeClassName(type.label)}
              src={type.icon}
              alt=""
              onClick={() => equipArmorEnergyType(type.label, armorSlot)}
            />
          ))}
        </div>
        <div
          className={
            equippedEnergyType
              ? `armor-detail-modal-energy-bar-container ${equippedEnergyType}-energy-bar-container`
              : "armor-detail-modal-energy-bar-container"
          }
        >
          {renderEnergyBars()}
        </div>
        {details.mods.map((modSlot, slotIndex) => (
          <div
            key={slotIndex}
            id={slotIndex}
            className="armor-detail-modal-mod-slot"
          >
            {modSlot.any.map((mod, index) => (
              <img
                key={index}
                src={`https://www.bungie.net${mod.displayProperties.icon}`}
                className={getModClassName(mod.displayProperties.name, slotIndex)}
                alt=""
                onClick={e => equipArmorMod(e, mod, armorSlot, slotIndex)}
                onMouseEnter={() => openQuickDetails(mod, 'armorMod')}
                    onMouseLeave={() => closeQuickDetails()}
              />
            ))}
            {equippedEnergyType === "arc" &&
              modSlot.arc.map((mod, index) => (
                <img
                  key={index}
                  src={`https://www.bungie.net${mod.displayProperties.icon}`}
                  className={getModClassName(mod.displayProperties.name, slotIndex)}
                  alt=""
                  onClick={e => equipArmorMod(e, mod, armorSlot, slotIndex)}
                  onMouseEnter={() => openQuickDetails(mod, 'armorMod')}
                    onMouseLeave={() => closeQuickDetails()}
                />
              ))}
            {equippedEnergyType === "solar" &&
              modSlot.solar.map((mod, index) => (
                <img
                  key={index}
                  src={`https://www.bungie.net${mod.displayProperties.icon}`}
                  className={getModClassName(mod.displayProperties.name, slotIndex)}
                  alt=""
                  onClick={e => equipArmorMod(e, mod, armorSlot, slotIndex)}
                  onMouseEnter={() => openQuickDetails(mod, 'armorMod')}
                    onMouseLeave={() => closeQuickDetails()}
                />
              ))}
            {equippedEnergyType === "void" &&
              modSlot.void.map((mod, index) => (
                <img
                  key={index}
                  src={`https://www.bungie.net${mod.displayProperties.icon}`}
                  className={getModClassName(mod.displayProperties.name, slotIndex)}
                  alt=""
                  onClick={e => equipArmorMod(e, mod, armorSlot, slotIndex)}
                  onMouseEnter={() => openQuickDetails(mod, 'armorMod')}
                    onMouseLeave={() => closeQuickDetails()}
                />
              ))}
          </div>
        ))}
        <div className="armor-detail-modal-links">
          <div className="armor-detail-modal-links-container">
            <Link className="armor-detail-modal-link" to="">
              Armor Stats
            </Link>
            <Link className="armor-detail-modal-link" to="">
              Gear Sunsetting
            </Link>
          </div>
          <div className="armor-detail-modal-links-container">
            <Link className="armor-detail-modal-link" to="">
              Mod Stacking
            </Link>
            <Link className="armor-detail-modal-link" to="">
              Activity Mod Slots
            </Link>
          </div>
        </div>
      </div>
      {showQuickDetails && <QuickDetailsModal details={quickHoverDetails} infoType={infoType}/>}
    </>
  );
}

const energyTypes = [
  {
    icon:
      "https://www.bungie.net/img/destiny_content/damage_types/destiny2/arc.png",
    label: "arc",
  },
  {
    icon:
      "https://www.bungie.net/img/destiny_content/damage_types/destiny2/thermal.png",
    label: "solar",
  },
  {
    icon:
      "https://www.bungie.net/img/destiny_content/damage_types/destiny2/void.png",
    label: "void",
  },
];

export default ArmorDetailsModal;
