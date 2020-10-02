import React from "react";

function WeaponDetailsModal({ currentWeapons, details, equipPerk }) {
  const generalStatRegex = /(Impact)|(Range)|(Stability)|(Handling)|(Reload Speed)/;
  const hiddenStatRegex = /(Aim Assistance)|(Inventory Size)|(Zoom)|(Recoil Direction)/;
  let stats = {
    general: [],
    hidden: [],
  };
  for (const element of details.stats) {
    if (generalStatRegex.test(element.label)) {
      stats.general.push(element);
    } else if (hiddenStatRegex.test(element.label)) {
      stats.hidden.push(element);
    }
  }

  let weaponSlot = "";
  let equippedPerks = [];
  if (details.generalInfo.itemSlot === "Kinetic Weapons") {
    equippedPerks = currentWeapons.kinetic.perks;
    weaponSlot = "kinetic";
  } else if (details.generalInfo.itemSlot === "Energy Weapons") {
    equippedPerks = currentWeapons.special.perks;
    weaponSlot = "special";
  } else if (details.generalInfo.itemSlot === "Power Weapons") {
    equippedPerks = currentWeapons.power.perks;
    weaponSlot = "power";
  }

  function getClassName(perkName, slotIndex) {
    if (!equippedPerks[slotIndex]) {
      return "perk equipped";
    } else {
      if (equippedPerks[slotIndex].name === perkName) return "perk-equipped";
      else return null;
    }
  }

  return (
    <div className="weapon-detail-modal item-info">
      <div>
        <h3>Weapon Stats</h3>
        {stats.general.map((stat, index) => (
          <div key={index} className="weapon-detail-modal-info">
            <p className="weapon-detail-stat-label">{stat.label}</p>
            <p className="weapon-detail-stat-value">{stat.value}</p>
            <div className="weapon-detail-stat-bar">
              <div
                className="weapon-detail-stat-bar-filler"
                style={{ width: `${stat.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div>
        <h3>Hidden Stats</h3>
        {stats.hidden.map((stat, index) => (
          <div key={index} className="weapon-detail-modal-info">
            <p className="weapon-detail-stat-label">{stat.label}</p>
            <p className="weapon-detail-stat-value">{stat.value}</p>
            <div className="weapon-detail-stat-bar">
              <div
                className="weapon-detail-stat-bar-filler"
                style={{ width: `${stat.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="weapon-detail-modal-perks">
        {details.perks.map((perkSlot, slotIndex) => (
          <div
            id={slotIndex}
            className="weapon-detail-modal-perks-slot"
            key={slotIndex}
          >
            {perkSlot.map((perk, index) => (
              <img
                key={index}
                id={perk.name}
                className={getClassName(perk.name, slotIndex)}
                src={`https://www.bungie.net${perk.icon}`}
                alt=""
                onClick={e => equipPerk(e, perk, weaponSlot)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeaponDetailsModal;
