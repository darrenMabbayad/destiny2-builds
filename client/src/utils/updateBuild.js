import axios from "axios";

const updateBuild = build => {
  axios
    .post(`/builds/update/${build._id}`, build)
    .then(res => console.log(res.data))
    .catch(error => console.error(error));
};

export default updateBuild;
