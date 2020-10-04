import React from "react";
import { Link } from "react-router-dom";

function ArmorDetailsModal({
  details,
  currentArmor,
  equipArmorEnergyType,
  equipArmorMod,
  currentEnergyCost,
}) {
  const classItemRegex = /(Hunter Cloak)|(Warlock Bond)|(Titan Mark)/;
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

  return (
    <div className="armor-detail-modal item-info">
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
              src={`https://www.bungie.net${mod.icon}`}
              className={getModClassName(mod.name, slotIndex)}
              alt=""
              onClick={e => equipArmorMod(e, mod, armorSlot, slotIndex)}
            />
          ))}
          {equippedEnergyType === "arc" &&
            modSlot.arc.map((mod, index) => (
              <img
                key={index}
                src={`https://www.bungie.net${mod.icon}`}
                className={getModClassName(mod.name, slotIndex)}
                alt=""
                onClick={e => equipArmorMod(e, mod, armorSlot, slotIndex)}
              />
            ))}
          {equippedEnergyType === "solar" &&
            modSlot.solar.map((mod, index) => (
              <img
                key={index}
                src={`https://www.bungie.net${mod.icon}`}
                className={getModClassName(mod.name, slotIndex)}
                alt=""
                onClick={e => equipArmorMod(e, mod, armorSlot, slotIndex)}
              />
            ))}
          {equippedEnergyType === "void" &&
            modSlot.void.map((mod, index) => (
              <img
                key={index}
                src={`https://www.bungie.net${mod.icon}`}
                className={getModClassName(mod.name, slotIndex)}
                alt=""
                onClick={e => equipArmorMod(e, mod, armorSlot, slotIndex)}
              />
            ))}
        </div>
      ))}
      <div className="armor-detail-modal-links">
        <Link className="armor-detail-modal-link" to="">
          Armor Stats
        </Link>
        <Link className="armor-detail-modal-link" to="">
          Mod Stacking
        </Link>
        <Link className="armor-detail-modal-link" to="">
          Activity Mod Slots
        </Link>
      </div>
    </div>
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
