import axios from "axios";

const getLessons = async (courseSlug) => {
  try {
    const { data } = await axios.get(`/courses/${courseSlug}/lessons`);
    return data;
  } catch (error) {
    console.error("Error fetching lessons:", error);
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data,
      status: error.response.status,
    };
  }
};

export { getLessons };
