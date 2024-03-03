import axios from "axios";

const getComments = async (courseSlug, lessonSlug) => {
  try {
    const { data } = await axios.get(
      `/courses/${courseSlug}/lessons/${lessonSlug}`
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

const deleteComment = async (courseSlug, lessonSlug, commentId) => {
  try {
    await axios.delete(
      `/courses/${courseSlug}/lessons/${lessonSlug}/comments/${commentId}`
    );
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data.message,
      status: error.response.status,
    };
  }
};

const updateComment = async (
  courseSlug,
  lessonSlug,
  commentId,
  commentText
) => {
  console.log(courseSlug, lessonSlug, commentId, commentText);
  try {
    const { data } = await axios.put(
      `/courses/${courseSlug}/lessons/${lessonSlug}/comments/${commentId}`,
      commentText
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

export { getComments, deleteComment, updateComment };
