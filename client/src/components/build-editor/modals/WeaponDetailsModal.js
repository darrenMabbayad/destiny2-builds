import React, {useState} from "react";
import QuickDetailsModal from './QuickDetailsModal'

function WeaponDetailsModal({
  toggleItemInfo,
  currentWeapons,
  details,
  equipPerk,
  equipMod,
  equipMasterwork,
}) {
  const [quickHoverDetails, setQuickHoverDetails] = useState({})
  const [showQuickDetails, setShowQuickDetails] = useState(false)
  const [infoType, setInfoType] = useState('')
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
  let equippedMod = {};
  let equippedMasterwork = {};
  if (details.generalInfo.itemSlot === "Kinetic Weapons") {
    equippedPerks = currentWeapons.kinetic.perks;
    equippedMod = currentWeapons.kinetic.mod;
    equippedMasterwork = currentWeapons.kinetic.masterwork;
    weaponSlot = "kinetic";
  } else if (details.generalInfo.itemSlot === "Energy Weapons") {
    equippedPerks = currentWeapons.special.perks;
    equippedMod = currentWeapons.special.mod;
    equippedMasterwork = currentWeapons.special.masterwork;
    weaponSlot = "special";
  } else if (details.generalInfo.itemSlot === "Power Weapons") {
    equippedPerks = currentWeapons.power.perks;
    equippedMod = currentWeapons.power.mod;
    equippedMasterwork = currentWeapons.power.masterwork;
    weaponSlot = "power";
  }

  function getPerkClassName(perkName, slotType) {
    if (!equippedPerks[slotType]) {
      return null;
    } else {
      if (equippedPerks[slotType].name === perkName) return "perk-equipped";
      else return null;
    }
  }

  function getModClassName(mod) {
    if (equippedMod.name === mod) return "mod-equipped";
    else return null;
  }

  function getMasterworkClassName(masterwork) {
    if (equippedMasterwork.icon === masterwork.icon)
      return "masterwork-equipped";
    else return null;
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
      <div className="weapon-detail-modal item-info">
        <div className="weapon-detail-modal-general">
          <div className="weapon-detail-modal-name-desc">
            <h2>{details.generalInfo.itemName}</h2>
            <p>{details.generalInfo.itemDescription}</p>
          </div>
          <div className="weapon-detail-modal-intrinsic">
            <img
              src={`https://www.bungie.net${details.intrinsicTrait[0].displayProperties.icon}`}
              alt=""
              onMouseEnter={e => openQuickDetails(details.intrinsicTrait[0], 'weaponIntrinsic')}
              onMouseLeave={() => closeQuickDetails()}
            />
          </div>
        </div>
        <div className="weapon-detail-modal-stats-container">
          <div>
            <div className="weapon-detail-modal-stats">
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
            <div className="weapon-detail-modal-stats">
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
                    className={getPerkClassName(perk.displayProperties.name, slotIndex)}
                    src={`https://www.bungie.net${perk.displayProperties.icon}`}
                    alt=""
                    onClick={e => equipPerk(e, perk, weaponSlot)}
                    onMouseEnter={e => openQuickDetails(perk, 'weaponPerk')}
                    onMouseLeave={() => closeQuickDetails()}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="weapon-detail-modal-mods">
          <div className="weapon-detail-modal-mods-equippable">
            {details.mods.equippableMods.map((mod, index) => (
              <img
                key={index}
                id={mod.name}
                className={getModClassName(mod.displayProperties.name)}
                src={`https://www.bungie.net${mod.displayProperties.icon}`}
                alt=""
                onClick={() => equipMod(mod, weaponSlot)}
                onMouseEnter={e => openQuickDetails(mod, 'weaponMod')}
                onMouseLeave={() => closeQuickDetails()}
              />
            ))}
          </div>
          <div className="weapon-detail-modal-mods-masterwork">
            {details.mods.masterworkChoices.map((masterwork, index) => (
              <img
                key={index}
                id={masterwork.name}
                className={getMasterworkClassName(masterwork.displayProperties)}
                src={`https://www.bungie.net${masterwork.displayProperties.icon}`}
                alt=""
                onClick={() => equipMasterwork(masterwork, weaponSlot)}
                onMouseEnter={e => openQuickDetails(masterwork, 'weaponMasterwork')}
                onMouseLeave={() => closeQuickDetails()}
              />
            ))}
          </div>
        </div>
      </div>
      {showQuickDetails && <QuickDetailsModal details={quickHoverDetails} infoType={infoType}/>}
    </>
  );
}

export default WeaponDetailsModal;
