import axios from "axios";

const getLessons = async (courseSlug) => {
  try {
    const { data } = await axios.get(`/courses/${courseSlug}/lessons`);
    return data;
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data,
      status: error.response.status,
    };
  }
};

const createLesson = async (courseSlug, lessonData) => {
  try {
    const { data } = await axios.post(
      `/courses/${courseSlug}/add-lesson`,
      lessonData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data.message,
      status: error.response.status,
    };
  }
};

export { getLessons, createLesson };
