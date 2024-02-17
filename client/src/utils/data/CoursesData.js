import axios from "axios";

const getCourses = async () => {
  try {
    const { data } = await axios.get("/courses");
    return data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw new Error("Failed to fetch courses");
  }
};

export default getCourses;
