import axios from "axios";

const deleteComment = async (courseSlug, lessonSlug, commentId) => {
  try {
    await axios.delete(
      `/api/courses/${courseSlug}/lessons/${lessonSlug}/comments/${commentId}`
    );
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data,
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
  try {
    const { data } = await axios.put(
      `/api/courses/${courseSlug}/lessons/${lessonSlug}/comments/${commentId}`,
      commentText
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
const addComment = async (courseSlug, lessonSlug, commentData) => {
  try {
    const { data } = await axios.post(
      `/api/courses/${courseSlug}/lessons/${lessonSlug}/add-comment`,
      commentData,
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

export { deleteComment, updateComment, addComment };
