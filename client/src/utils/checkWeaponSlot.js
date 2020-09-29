const weaponRegex = /(kinetic)|(special)|(power)/;
const armorRegex = /(helmet)|(gloves)|(chest)|(boots)|(classItem)/;

export default function checkArmorSlot(itemToChange, replacementItem) {
  if (
    (weaponRegex.test(itemToChange) && replacementItem.itemType !== 3) ||
    (armorRegex.test(itemToChange) && replacementItem.itemType !== 2)
  ) {
    return "That's a weapon slot, boss";
  } else if (
    itemToChange === "kinetic" &&
    replacementItem.equippingBlock.ammoType !== 1
  ) {
    return "That's a kinetic slot, boss";
  } else if (
    itemToChange === "special" &&
    replacementItem.equippingBlock.ammoType !== 2
  ) {
    return "That's a special slot, boss";
  } else if (
    itemToChange === "power" &&
    replacementItem.equippingBlock.ammoType !== 3
  ) {
    return "That's a heavy slot, boss";
  } else return "";
}
