const weaponRegex = /(kinetic)|(special)|(power)/;
const armorRegex = /(helmet)|(gloves)|(chest)|(boots)|(classItem)/;

export default function checkArmorSlot(
  manifest,
  itemToChange,
  replacementItem
) {
  if (
    (weaponRegex.test(itemToChange) && replacementItem.itemType !== 3) ||
    (armorRegex.test(itemToChange) && replacementItem.itemType !== 2)
  ) {
    return "That's a weapon slot, boss";
  } else if (
    itemToChange === "kinetic" &&
    manifest.DestinyEquipmentSlotDefinition[
      replacementItem.equippingBlock.equipmentSlotTypeHash
    ].displayProperties.name !== "Kinetic Weapons"
  ) {
    return "That's a kinetic slot, boss";
  } else if (
    itemToChange === "special" &&
    manifest.DestinyEquipmentSlotDefinition[
      replacementItem.equippingBlock.equipmentSlotTypeHash
    ].displayProperties.name !== "Energy Weapons"
  ) {
    return "That's a special slot, boss";
  } else if (
    itemToChange === "power" &&
    manifest.DestinyEquipmentSlotDefinition[
      replacementItem.equippingBlock.equipmentSlotTypeHash
    ].displayProperties.name !== "Power Weapons"
  ) {
    return "That's a heavy slot, boss";
  } else return "";
}
