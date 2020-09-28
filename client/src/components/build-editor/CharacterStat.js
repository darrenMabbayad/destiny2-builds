import React from "react";
import chevronUp from "../../img/chevron-up.png";
import chevronDown from "../../img/chevron-down.png";

function CharacterStat({ icon, label, value, changeStat }) {
  return (
    <div className="character-stat">
      <div className="character-stat-label">
        <div className="character-stat-img-container">
          <img className="character-stat-img" src={icon} alt="" />
        </div>
        <p className="character-stat-name">{label}</p>
      </div>
      <div className="character-stat-value">
        <div className="character-stat-btn-container">
          <img
            id="stat-up"
            className="character-stat-btn"
            src={chevronUp}
            alt=""
            onClick={e =>
              changeStat(e, `${label.charAt(0).toLowerCase()}${label.slice(1)}`)
            }
          />
        </div>
        <p className="character-stat-number">{value}</p>
        <div className="character-stat-btn-container">
          <img
            id="stat-down"
            className="character-stat-btn"
            src={chevronDown}
            alt=""
            onClick={e =>
              changeStat(e, `${label.charAt(0).toLowerCase()}${label.slice(1)}`)
            }
          />
        </div>
      </div>
    </div>
  );
}

export default CharacterStat;
