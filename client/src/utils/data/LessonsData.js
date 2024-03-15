import axios from "axios";

const getLessons = async (courseSlug) => {
  try {
    const { data } = await axios.get(`/api/courses/${courseSlug}/lessons`);
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
      `/api/courses/${courseSlug}/add-lesson`,
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
      message: error.response.data,
      status: error.response.status,
    };
  }
};

const deleteLesson = async (courseSlug, lessonSlug) => {
  try {
    const { data } = await axios.delete(
      `/api/courses/${courseSlug}/lessons/${lessonSlug}`
    );
    return data;
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data,
      status: error.response.status,
    };
  }
};

const updateLesson = async (courseSlug, lessonSlug, lessonData) => {
  try {
    const { data } = await axios.put(
      `/api/courses/${courseSlug}/lessons/${lessonSlug}`,
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
      message: error.response.data,
      status: error.response.status,
    };
  }
};

const updateLessonState = async (courseSlug, lessonSlug, stateType) => {
  try {
    const { data } = await axios.put(
      `/api/courses/${courseSlug}/lessons/${lessonSlug}/update-state?stateType=${stateType}`
    );
    return data;
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data,
      status: error.response.status,
    };
  }
};

export {
  getLessons,
  createLesson,
  deleteLesson,
  updateLessonState,
  updateLesson,
};
