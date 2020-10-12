import React, { useContext, useState } from "react";
import { DestinyContext } from "../../../context/DestinyContext";
import QuickDetailsModal from "./QuickDetailsModal";

function ClassPickerModal({
  currentClass,
  currentSubClass,
  selectClass,
  changeClassAbility,
  changeJump,
  changeGrenade,
  changeTree,
  selectClassElement,
  toggleClassPicker,
}) {
  const { getSubClass } = useContext(DestinyContext);
  const [subClassList, setSubClassList] = useState(
    currentClass ? getSubClass(currentClass) : []
  );
  const [quickHoverDetails, setQuickHoverDetails] = useState({})
  const [showQuickDetails, setShowQuickDetails] = useState(false)
  const [infoType, setInfoType] = useState('')
  const currentElement = currentSubClass.element;
  const [subClassByElement, setSubClassByElement] = useState(
    currentElement ? filterSubClasses(currentElement) : {}
  );
  const equippedAbility = currentSubClass.classSpecialty;
  const equippedJump = currentSubClass.movementMode;
  const equippedGrenade = currentSubClass.grenade;
  const equippedTree = currentSubClass.path;

  function filterSubClasses(element) {
    const list = getSubClass(currentClass);
    for (const item of list) {
      const subClass = item;
      if (subClass.element === element) {
        return subClass;
      }
    }
  }

  function selectClassAndGetSubClasses(e) {
    const { name } = e.target;
    const list = getSubClass(name);
    setSubClassList(list);
    selectClass(e);
  }

  function getElementClassName(element) {
    let className = currentClass ? currentClass : "";
    if (element === "arc") {
      className = `class-picker-element-img arc-class`;
    } else if (element === "solar") {
      className = `class-picker-element-img solar-class`;
    } else if (element === "void") {
      className = `class-picker-element-img void-class`;
    }
    return className;
  }

  function getAbilityClassName(ability) {
    if (equippedAbility === ability) {
      return `class-picker-talent-grid-class-specialty-skill ability-equipped`;
    } else return "class-picker-talent-grid-class-specialty-skill";
  }

  function getGrenadeClassName(grenade) {
    if (equippedGrenade === grenade) {
      return `class-picker-talent-grid-grenades-icon grenade-equipped`;
    } else return "class-picker-talent-grid-grenades-icon";
  }

  function getJumpClassName(jump) {
    if (equippedJump === jump) {
      return `class-picker-talent-grid-jumps-icon jump-equipped`;
    } else return "class-picker-talent-grid-jumps-icon";
  }

  function getTreeClassName(tree) {
    if (equippedTree === tree) {
      return `class-picker-talent-grid-trees-icon tree-equipped`;
    } else return "class-picker-talent-grid-trees-icon";
  }

  function selectElementandRenderTalents(e) {
    selectClassElement(e);
    const { id } = e.target;
    for (const item of subClassList) {
      const subClass = item;
      if (subClass.element === id) {
        setSubClassByElement({ ...subClass });
      }
    }
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
        className="class-picker-overlay"
        onClick={e => toggleClassPicker(e)}
      />
      {!currentClass && (
        <div className="class-picker-modal">
          <button
            name="btn-warlock"
            onClick={e => selectClassAndGetSubClasses(e)}
          >
            Warlock
          </button>
          <button
            name="btn-hunter"
            onClick={e => selectClassAndGetSubClasses(e)}
          >
            Hunter
          </button>
          <button
            name="btn-titan"
            onClick={e => selectClassAndGetSubClasses(e)}
          >
            Titan
          </button>
        </div>
      )}
      {currentClass && !currentElement && (
        <div className="class-picker-element-images">
          {subClassList.map((subClass, index) => (
            <div key={index} className={getElementClassName(subClass.element)}>
              <img
                id={subClass.element}
                src={`http://www.bungie.net${subClass.icon}`}
                alt=""
                onClick={e => selectElementandRenderTalents(e)}
              />
            </div>
          ))}
        </div>
      )}
      {currentClass && currentElement && (
        <div className="class-picker-talent-grid">
          <div className="class-picker-talent-grid-skills">
            <div className="class-picker-talent-grid-class-specialty">
              {subClassByElement.classSpecialties.map((ability, index) => (
                <div key={index} className={getAbilityClassName(ability.displayProperties.name)}>
                  <img
                    src={`http://www.bungie.net${ability.displayProperties.icon}`}
                    alt=""
                    onClick={() => changeClassAbility(ability.displayProperties.name)}
                    onMouseEnter={() => openQuickDetails(ability, 'subClassTalent')}
                    onMouseLeave={() => closeQuickDetails()}
                  />
                </div>
              ))}
            </div>
            <div className="class-picker-talent-grid-abilities">
              <div className="class-picker-talent-grid-grenades">
                {subClassByElement.grenades.map((grenade, index) => (
                  <div
                    key={index}
                    className={getGrenadeClassName(grenade.displayProperties.name)}
                  >
                    <img
                      src={`http://www.bungie.net${grenade.displayProperties.icon}`}
                      alt=""
                      onClick={() => changeGrenade(grenade.displayProperties.name)}
                      onMouseEnter={() => openQuickDetails(grenade, 'subClassTalent')}
                      onMouseLeave={() => closeQuickDetails()}
                    />
                  </div>
                ))}
              </div>
              <div className="class-picker-talent-grid-class-icon">
                <img
                  src={`http://www.bungie.net${subClassByElement.secondaryIcon}`}
                  alt=""
                />
              </div>
              <div className="class-picker-talent-grid-jumps">
                {subClassByElement.movementModes.map((jump, index) => (
                  <div key={index} className={getJumpClassName(jump.displayProperties.name)}>
                    <img
                      src={`http://www.bungie.net${jump.displayProperties.icon}`}
                      alt=""
                      onClick={() => changeJump(jump.displayProperties.name)}
                      onMouseEnter={() => openQuickDetails(jump, 'subClassTalent')}
                      onMouseLeave={() => closeQuickDetails()}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="class-picker-talent-grid-trees">
            <div className="class-picker-talent-grid-trees-icons-container">
              {subClassByElement.firstPath.talents.map((path, index) => (
                <div key={index} className={getTreeClassName("top")}>
                  <img
                    src={`http://www.bungie.net${path.displayProperties.icon}`}
                    alt=""
                    onClick={() => changeTree("top")}
                    onMouseEnter={() => openQuickDetails(path, 'subClassTalent')}
                    onMouseLeave={() => closeQuickDetails()}
                  />
                </div>
              ))}
            </div>
            <div className="class-picker-talent-grid-trees-icons-container">
              {subClassByElement.thirdPath.talents.map((path, index) => (
                <div key={index} className={getTreeClassName("middle")}>
                  <img
                    src={`http://www.bungie.net${path.displayProperties.icon}`}
                    alt=""
                    onClick={() => changeTree("middle")}
                    onMouseEnter={() => openQuickDetails(path, 'subClassTalent')}
                    onMouseLeave={() => closeQuickDetails()}
                  />
                </div>
              ))}
            </div>
            <div className="class-picker-talent-grid-trees-icons-container">
              {subClassByElement.secondPath.talents.map((path, index) => (
                <div key={index} className={getTreeClassName("bottom")}>
                  <img
                    src={`http://www.bungie.net${path.displayProperties.icon}`}
                    alt=""
                    onClick={() => changeTree("bottom")}
                    onMouseEnter={() => openQuickDetails(path, 'subClassTalent')}
                    onMouseLeave={() => closeQuickDetails()}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {showQuickDetails && <QuickDetailsModal details={quickHoverDetails} infoType={infoType}/>}
    </>
  );
}

export default ClassPickerModal;
