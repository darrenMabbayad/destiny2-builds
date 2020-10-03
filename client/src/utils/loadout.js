import axios from "axios";

/* --------------------------------------------- */
/* ------ START: Definition of a loadout ------- */
/* --------------------------------------------- */
const leviathanIcon = `https://www.bungie.net/common/destiny2_content/icons/8b1bfd1c1ce1cab51d23c78235a6e067.png`;
const loadout = {
  name: "",
  description: "",
  selectedClass: "",
  stats: {
    mobility: 50,
    resilience: 50,
    recovery: 50,
    discipline: 50,
    intellect: 50,
    strength: 50,
  },
  weapons: {
    kinetic: {
      name: "",
      icon: leviathanIcon,
      itemHash: 0,
      perks: [],
      mod: {
        name: "",
        description: "",
        icon: "",
      },
      masterwork: {
        name: "",
        description: "",
        icon: "",
      },
    },
    special: {
      name: "",
      icon: leviathanIcon,
      itemHash: 0,
      perks: [],
      mod: {
        name: "",
        description: "",
        icon: "",
      },
      masterwork: {
        name: "",
        description: "",
        icon: "",
      },
    },
    power: {
      name: "",
      icon: leviathanIcon,
      itemHash: 0,
      perks: [],
      mod: {
        name: "",
        description: "",
        icon: "",
      },
      masterwork: {
        name: "",
        description: "",
        icon: "",
      },
    },
  },
  armor: {
    helmet: {
      name: "",
      icon: leviathanIcon,
      itemHash: 0,
    },
    gloves: {
      name: "",
      icon: leviathanIcon,
      itemHash: 0,
    },
    chest: {
      name: "",
      icon: leviathanIcon,
      itemHash: 0,
    },
    boots: {
      name: "",
      icon: leviathanIcon,
      itemHash: 0,
    },
    classItem: {
      name: "",
      icon: leviathanIcon,
      itemHash: 0,
    },
  },
};

// arrays to render editor UI elements
const weapons = ["kinetic", "special", "power"];
const armor = ["helmet", "gloves", "chest", "boots", "classItem"];
const stats = [
  {
    type: "mobility",
    label: "Mobility",
    icon:
      "https://www.bungie.net/common/destiny2_content/icons/c9aa8439fc71c9ee336ba713535569ad.png",
  },
  {
    type: "resilience",
    label: "Resilience",
    icon:
      "https://www.bungie.net/common/destiny2_content/icons/9f5f65d08b24defb660cebdfd7bae727.png",
  },
  {
    type: "recovery",
    label: "Recovery",
    icon:
      "https://www.bungie.net/common/destiny2_content/icons/47e16a27c8387243dcf9b5d94e26ccc4.png",
  },
  {
    type: "discipline",
    label: "Discipline",
    icon:
      "https://www.bungie.net/common/destiny2_content/icons/ca62128071dc254fe75891211b98b237.png",
  },
  {
    type: "intellect",
    label: "Intellect",
    icon:
      "https://www.bungie.net/common/destiny2_content/icons/59732534ce7060dba681d1ba84c055a6.png",
  },
  {
    type: "strength",
    label: "Strength",
    icon:
      "https://www.bungie.net/common/destiny2_content/icons/c7eefc8abbaa586eeab79e962a79d6ad.png",
  },
];

/* --------------------------------------------- */
/* ------- END: Definition of a loadout -------- */
/* --------------------------------------------- */

const fetchAllBuilds = async () => {
  let res = await axios.get("/builds");
  return res.data;
};

const fetchBuild = async buildId => {
  let res = await axios.get(`/builds/${buildId}`);
  return res.data;
};

const saveBuild = build => {
  console.log(build);
  axios
    .post("/builds/add", build)
    .then(res => console.log(res.data))
    .catch(error => console.error(error));
};

const updateBuild = build => {
  axios
    .post(`/builds/update/${build._id}`, build)
    .then(res => console.log(res.data))
    .catch(error => console.error(error));
};

const deleteBuild = id => {
  axios.delete(`/builds/${id}`);
};

export {
  loadout,
  weapons,
  armor,
  stats,
  fetchAllBuilds,
  fetchBuild,
  saveBuild,
  updateBuild,
  deleteBuild,
};
