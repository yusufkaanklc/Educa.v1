import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    image: null,
    price: "",
  });

  const [lessonData, setLessonData] = useState({
    title: "",
    description: "",
    video: null,
  });

  const [authData, setAuthData] = useState({
    email: "",
    password: "",
  });

  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);

  const handleChangeForCourse = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleChangeForLesson = (e) => {
    const { name, value } = e.target;
    setLessonData({ ...lessonData, [name]: value });
  };

  const handleChangeForAuth = (e) => {
    const { name, value } = e.target;
    setAuthData({ ...authData, [name]: value });
  };

  const handleFileChange = (e) => {
    setCourseData({ ...courseData, image: e.target.files[0] });
  };

  const handleFileChangeForLesson = (e) => {
    setLessonData({ ...lessonData, video: e.target.files[0] });
  };

  const courseFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", courseData.title);
      formData.append("description", courseData.description);
      formData.append("price", courseData.price);
      formData.append("image", courseData.image);

      await axios.post("/api/courses/add-course", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Form data submitted");
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  const lessonFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", lessonData.title);
      formData.append("description", lessonData.description);
      formData.append("video", lessonData.video);

      await axios.post("/api/courses/deneme/add-lesson", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Form data submitted");
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  const authFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/users/login", authData);
      console.log("login success");
    } catch (error) {
      console.error(error);
    }
  };

  const getCourses = async () => {
    try {
      const response = await axios.get("/api/courses");
      console.log("get courses success");
      setCourses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getLesson = async () => {
    try {
      const response = await axios.get("/api/courses/deneme/lessons");
      console.log("get lesson success");
      setLessons(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(courses);
  }, [courses]);

  useEffect(() => {
    console.log(lessons);
  }, [lessons]);

  return (
    <>
      <form onSubmit={authFormSubmit}>
        <input
          type="text"
          name="email"
          placeholder="email"
          value={authData.email}
          onChange={handleChangeForAuth}
        />
        <input
          type="text"
          name="password"
          placeholder="password"
          value={authData.password}
          onChange={handleChangeForAuth}
        />
        <button type="submit">giriş yap</button>
      </form>

      <form onSubmit={courseFormSubmit}>
        <input
          type="text"
          name="title"
          placeholder="title"
          value={courseData.title}
          onChange={handleChangeForCourse}
        />
        <input
          type="text"
          name="description"
          placeholder="description"
          value={courseData.description}
          onChange={handleChangeForCourse}
        />
        <input type="file" name="image" onChange={handleFileChange} />
        <input
          type="text"
          placeholder="price"
          name="price"
          value={courseData.price}
          onChange={handleChangeForCourse}
        />
        <button type="submit">Gönder</button>
      </form>
      <div onClick={() => getCourses()}>Kursları getir</div>
      <hr />

      <form onSubmit={lessonFormSubmit}>
        <input
          type="text"
          name="title"
          placeholder="title"
          value={lessonData.title}
          onChange={handleChangeForLesson}
        />
        <input
          type="text"
          name="description"
          placeholder="description"
          value={lessonData.description}
          onChange={handleChangeForLesson}
        />
        <input type="file" name="video" onChange={handleFileChangeForLesson} />
        <button type="submit">Gönder</button>
      </form>
      <div onClick={() => getLesson()}>Dersleri getir</div>
      <hr />

      {courses.length === 0 ? (
        <div>Course not found</div>
      ) : (
        courses.map((course, index) => (
          <div key={index}>
            <div>{course.title}</div>
            <div>{course.description}</div>
            <img src={"http://localhost:5000/" + course.imageUrl} alt="" />
          </div>
        ))
      )}

      {lessons.length === 0 ? (
        <div>Course not found</div>
      ) : (
        lessons.map((lesson, index) => (
          <div key={index}>
            <div>{lesson.title}</div>
            <div>{lesson.description}</div>
            <iframe src={"http://localhost:5000/" + lesson.videoUrl}></iframe>
          </div>
        ))
      )}
    </>
  );
}

export default App;
