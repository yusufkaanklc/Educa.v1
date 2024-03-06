import axios from "axios";

const getCourses = async (titleQuery, categoryQuery) => {
  let queryString = "/courses";

  // Her iki sorgu parametresi de varsa
  if (titleQuery && categoryQuery) {
    queryString += `?title=${titleQuery}&category=${categoryQuery}`;
  } else if (titleQuery && (!categoryQuery || categoryQuery === "all")) {
    // Sadece başlık sorgusu varsa
    queryString += `?title=${titleQuery}`;
  } else if (categoryQuery && (!titleQuery || titleQuery === "")) {
    // Sadece kategori sorgusu varsa
    queryString += `?category=${categoryQuery}`;
  } else if (
    (!titleQuery || titleQuery === "") &&
    (!categoryQuery || categoryQuery === "" || categoryQuery === "all")
  ) {
    // Herhangi bir sorgu yok
    queryString = "/courses";
  }

  try {
    const { data } = await axios.get(queryString);
    return data;
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data,
      status: error.response.status,
    };
  }
};

const getCourse = async (courseSlug) => {
  try {
    const { data } = await axios.get(`/courses/${courseSlug}`);
    return data;
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data,
      status: error.response.status,
    };
  }
};

const createCourse = async (courseData) => {
  try {
    const { data } = await axios.post("/courses/add-course", courseData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data,
      status: error.response.status,
    };
  }
};

const updateCourse = async (courseSlug, courseData) => {
  try {
    const { data } = await axios.put(`/courses/${courseSlug}`, courseData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data,
      status: error.response.status,
    };
  }
};

const getCourseState = async (courseSlug) => {
  try {
    const { data } = await axios.get(`/courses/${courseSlug}/state`);
    return data;
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data,
      status: error.response.status,
    };
  }
};

const updateCourseState = async (courseSlug) => {
  try {
    const { data } = await axios.put(
      `/courses/${courseSlug}/lessons/lessonSlug/update-state?stateType=course`
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
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  getCourseState,
  updateCourseState,
};
