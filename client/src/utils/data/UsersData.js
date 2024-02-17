import axios from "axios";

const getUsers = async () => {
  try {
    const { data } = await axios.get("/users/accounts");
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};

export default getUsers;
