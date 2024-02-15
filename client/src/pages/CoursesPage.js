import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CoursesPage = () => {
  const { courseSlug } = useParams(); // useParams hook'unu kullanarak courseId'yi al
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axios.get(`/courses/${courseSlug}`); // courseId'yi kullanarak URL'yi oluştur
        setCourse(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourse();
  }, [courseSlug]); // useEffect'i yeniden çağır, courseId değiştiğinde

  return (
    <>
      {course && (
        <>
          <div>{course.title}</div>
          <div>{course.description}</div>
          <div>{course.price}</div>
          <img
            src={"http://localhost:5000/" + course.imageUrl}
            alt={course.title}
          />{" "}
          {/*imageUrl'e tam URL'yi ekleyin*/}
        </>
      )}
    </>
  );
};

export default CoursesPage;
