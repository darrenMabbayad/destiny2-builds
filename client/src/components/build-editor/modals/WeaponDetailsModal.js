import React from "react";

function WeaponDetailsModal({ details }) {
  const weaponStats = [
    {
      label: "Impact",
      value: details.stats.impact,
    },
    {
      label: "Range",
      value: details.stats.range,
    },
    {
      label: "Stability",
      value: details.stats.stability,
    },
    {
      label: "Handling",
      value: details.stats.handling,
    },
    {
      label: "Reload Speed",
      value: details.stats.reloadSpeed,
    },
  ];
  const hiddenStats = [
    {
      label: "Aim Assistance",
      value: details.stats.aimAssistance,
    },
    {
      label: "Inventory Size",
      value: details.stats.inventorySize,
    },
    {
      label: "Zoom",
      value: details.stats.zoom,
    },
    {
      label: "Recoil",
      value: details.stats.recoil,
    },
  ];
  return (
    <div className="weapon-detail-modal item-info">
      <div>
        <h3>Weapon Stats</h3>
        {weaponStats.map((stat, index) => (
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
        {hiddenStats.map((stat, index) => (
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
        {details.perks.map((perkSlot, index) => (
          <div className="weapon-detail-modal-perks-slot" key={index}>
            {perkSlot.map((perk, index) => (
              <img
                key={index}
                src={`https://www.bungie.net${perk.icon}`}
                alt=""
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeaponDetailsModal;
