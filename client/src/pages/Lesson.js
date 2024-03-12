import {
  Box,
  Grid,
  GridItem,
  Breadcrumb,
  Flex,
  BreadcrumbItem,
  FormControl,
  Input,
  Text,
  Heading,
  Avatar,
  Center,
  Button,
  Stack,
  Skeleton,
  BreadcrumbLink,
  Textarea,
  useToast,
  ButtonGroup,
  FormLabel,
} from "@chakra-ui/react";
import { ChevronRightIcon, StarIcon } from "@chakra-ui/icons";
import ReactPlayer from "react-player";
import { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import dataContext from "../utils/contextApi";
import {
  deleteLesson,
  getLessons,
  updateLesson,
  updateLessonState,
} from "../utils/data/LessonsData";
import { getCourse, getCourseState } from "../utils/data/CoursesData";
import { getUsers } from "../utils/data/UsersData";
import {
  addComment,
  deleteComment,
  updateComment,
} from "../utils/data/CommentData";
const Lesson = () => {
  const {
    apiUrl,
    isMobile,
    isLaptop,
    setTargetScroll,
    setErrors,
    errors,
    account,
  } = useContext(dataContext);
  const [lessons, setLessons] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [comments, setComments] = useState([]);
  const [courseStates, setCourseStates] = useState(null);
  const [course, setCourse] = useState(null);
  const [lessonPoint, setLessonPoint] = useState(null);
  const [commentOwnerList, setCommentOwnerList] = useState([]);
  const [starList, setStarList] = useState([]);
  const [currentVideoTime, setCurrentVideoTime] = useState(null);
  const [isLessonFinished, setIsLessonFinished] = useState(null);
  const [isFinishButtonClicked, setIsFinishButtonClicked] = useState(false);
  const [isCommentEditing, setIsCommentEditing] = useState(false);
  const [isLessonEditing, setIsLessonEditing] = useState(false);
  const [prevLessonState, setPrevLessonState] = useState(null);

  const [updatedCommentList, setUpdatedCommentList] = useState([]);
  const [filteredCommentList, setFilteredCommentList] = useState([]);
  const [deletionCommentList, setDeletionCommentList] = useState([]);
  const [filteredLessonList, setFilteredLessonList] = useState([]);
  const [deletionLessonList, setDeletionLessonList] = useState([]);
  const [lessonUpdateData, setLessonUpdateData] = useState(null);
  const [finishButtonFlag, setFinishButtonFlag] = useState(false);
  const [commentAddState, setCommentAddState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [commentData, setCommentData] = useState({
    text: "",
    point: "",
  });
  const { page, courseSlug, lessonSlug } = useParams();
  const responsive = (mobile, laptop, desktop) => {
    if (isMobile) {
      return mobile;
    } else if (isLaptop) {
      return laptop;
    } else {
      return desktop;
    }
  };

  const navigate = useNavigate();
  const handleClick = (link) => {
    setTargetScroll(link);
    navigate("/");
  };

  const getDate = (createdAt) => {
    if (createdAt) {
      const date = new Date(createdAt);
      return `${date.getDate()} / ${
        date.getMonth() + 1
      } / ${date.getFullYear()}`;
    }
    return ""; // Eğer createdAt değeri yoksa boş string döndür
  };

  const navigateLesson = (lessonSlug) => {
    if (!isLessonEditing) {
      navigate(`/${page}/course/${courseSlug}/lessons/${lessonSlug}`);
    }
  };

  const toast = useToast();

  const updateLessonStateFunc = async () => {
    setFinishButtonFlag(!finishButtonFlag);
    try {
      const data = await getCourseState(courseSlug);
      const courseState = data;
      let lessonStateList = courseState.lessonsStates;
      let currentLessonStateIndex;

      lessonStateList.forEach((l, index) => {
        if (l.lesson === lesson._id) {
          currentLessonStateIndex = index;
        }
      });

      if (currentLessonStateIndex === 0) {
        setPrevLessonState(true);
      } else {
        setPrevLessonState(lessonStateList[currentLessonStateIndex - 1].state);
      }
    } catch (error) {
      console.error("Veri alınırken hata oluştu:", error);
      setErrors([...errors, error]);
    }
  };
  useEffect(() => {
    // Sadece prevLessonState değiştiğinde bu blok çalışacak
    if (prevLessonState !== null) {
      if (
        isLessonFinished &&
        course.ownerId !== account._id &&
        prevLessonState
      ) {
        setIsFinishButtonClicked(true);
        updateLessonState(courseSlug, lessonSlug, "lesson").then(() => {
          const findCurrentIndex = lessons.findIndex(
            (l) => l.slug === lessonSlug
          );
          if (
            findCurrentIndex !== -1 &&
            findCurrentIndex < lessons.length - 1
          ) {
            const findLastLessonSlug = lessons[findCurrentIndex + 1].slug;
            showSuccessToastAndNavigate(findLastLessonSlug);
          } else if (findCurrentIndex === lessons.length - 1) {
            toast({
              title: "Success",
              description: "The course was completed successfully",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            navigate(`/${page}/course/${courseSlug}`);
          } else {
            console.error(
              "Current lesson index not found or next lesson not available."
            );
          }
        });
      } else {
        if (!isLessonFinished && prevLessonState) {
          toast({
            title: "Warning",
            description: "Please complete the lesson",
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
        }
        if (course.ownerId === account._id && prevLessonState) {
          // Eğer kurs sahibiyseniz, bildirim göstermek gerekli değilse burada başka bir işlem yapılabilir.
        }
        if (!prevLessonState && isLessonFinished) {
          toast({
            title: "Warning",
            description: "Please finish the previous lesson",
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    }
  }, [prevLessonState, finishButtonFlag]); // Sadece prevLessonState değiştiğinde bu useEffect çalışacak

  const showSuccessToastAndNavigate = (nextLessonSlug) => {
    toast({
      title: "Success",
      description: "The lesson was completed successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    navigate(`/${page}/course/${courseSlug}/lessons/${nextLessonSlug}`);
  };

  const handleCommentChange = (e, commentId) => {
    const updatedList = updatedCommentList.map((comment) => {
      if (comment._id === commentId) {
        return { ...comment, text: e.target.value };
      }
      return comment;
    });
    setUpdatedCommentList(updatedList);
  };

  const handleUpdateCommentSubmit = async (e) => {
    e.preventDefault();
    let isUpdatedOrDeleted = false;
    try {
      await Promise.all(
        updatedCommentList.map(async (updatedComment) => {
          const originalComment = comments.find(
            (comment) => comment._id === updatedComment._id
          );
          if (originalComment && originalComment.text !== updatedComment.text) {
            const formData = new FormData();
            formData.append("text", updatedComment.text);
            await updateSingleComment(
              courseSlug,
              lessonSlug,
              updatedComment._id,
              formData
            );
            if (!isLessonEditing) {
              isUpdatedOrDeleted = true;
            }
          }
        })
      );

      if (deletionCommentList.length > 0) {
        for (const comment of deletionCommentList) {
          try {
            await deleteSingleComment(courseSlug, lessonSlug, comment._id);
            if (!isLessonEditing) {
              isUpdatedOrDeleted = true;
            }
          } catch (error) {
            // Hata olursa burada yakalanacak ve işlenecek
            console.error("Error deleting comment:", error);
            throw error; // Hatanın yukarı doğru iletilmesi
          }
        }
      }

      if (isUpdatedOrDeleted) {
        toast({
          title: "Success",
          description: "Comments updated or deleted successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setComments(updatedCommentList);
      }
      setIsCommentEditing(false);
    } catch (error) {
      setIsCommentEditing(true);
      setErrors([...errors, error]); // Hata yakalanıp işleniyor
    }
  };

  const updateSingleComment = async (
    courseSlug,
    lessonSlug,
    commentId,
    formData
  ) => {
    try {
      await updateComment(courseSlug, lessonSlug, commentId, formData);
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error; // Hatanın yukarı doğru iletilmesi
    }
  };

  const deleteSingleComment = async (courseSlug, lessonSlug, commentId) => {
    try {
      await deleteComment(courseSlug, lessonSlug, commentId);
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error; // Hatanın yukarı doğru iletilmesi
    }
  };

  const handleDeleteComment = (commentId) => {
    // Silinecek yorumu filteredCommentList'ten filtreleyerek çıkarın
    const filteredComments = filteredCommentList.filter(
      (c) => c._id !== commentId
    );
    // Silinecek yorumu deletionCommentList'e ekleyin
    setDeletionCommentList((prevList) => [
      ...prevList,
      filteredCommentList.find((c) => c._id === commentId),
    ]);
    // Filtrelenmiş yorumları güncelleyin
    setFilteredCommentList(filteredComments);
  };

  const handleDeleteLesson = (lessonSlug) => {
    const filteredLessons = filteredLessonList.filter(
      (l) => l.slug !== lessonSlug
    );
    setDeletionLessonList((prevList) => [
      ...prevList,
      filteredLessonList.find((l) => l.slug === lessonSlug),
    ]);

    setFilteredLessonList(filteredLessons);
  };

  const handleLessonChange = (e) => {
    const { name, value } = e.target;
    setLessonUpdateData({ ...lessonUpdateData, [name]: value });
  };

  const handleLessonChangeForVideo = async (e) => {
    const { name, files } = e.target;
    setLessonUpdateData({ ...lessonUpdateData, [name]: files[0] });
    if (e.target.files.length > 0) {
      toast({
        title: "Success",
        description: "Video uploaded successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdateLessonSubmit = async (e) => {
    const loadingToastId = toast({
      title: "Loading",
      description: "Updating lesson...",
      status: "info",
      duration: null,
      isClosable: false,
    });

    try {
      let isUpdatedOrDeleted = false;
      if (lessonNeedsUpdate()) {
        const lessonUpdateFormData = new FormData();
        if (lesson.title !== lessonUpdateData.title) {
          lessonUpdateFormData.append("title", lessonUpdateData.title);
        }
        if (lesson.description !== lessonUpdateData.description) {
          lessonUpdateFormData.append(
            "description",
            lessonUpdateData.description
          );
        }
        if (lesson.notes !== lessonUpdateData.notes) {
          lessonUpdateFormData.append("notes", lessonUpdateData.notes);
        }
        if (
          lessonUpdateData.video &&
          lesson.videoUrl !== lessonUpdateData.video
        ) {
          const duration = await getVideoDuration(lessonUpdateData.video);
          lessonUpdateFormData.append("video", lessonUpdateData.video);
          lessonUpdateFormData.append("duration", duration);
        }

        try {
          await updateLesson(courseSlug, lessonSlug, lessonUpdateFormData);
        } catch (error) {
          throw error;
        }
      }

      if (deletionLessonList.length > 0) {
        await Promise.all(
          deletionLessonList.map(async (lesson) => {
            try {
              await deleteLesson(courseSlug, lesson.slug);
            } catch (error) {
              throw error;
            }
          })
        );
      }

      try {
        await handleUpdateCommentSubmit(e);
      } catch (error) {
        throw error;
      }

      isUpdatedOrDeleted = true;

      toast.close(loadingToastId);
      if (isUpdatedOrDeleted) {
        toast({
          title: "Success",
          description: "Lessons updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
      try {
        const updatedLessons = await getLessons(courseSlug);
        setLessons(updatedLessons);
      } catch (error) {
        throw error;
      }
      setIsLessonEditing(false);

      if (lessonNeedsUpdate() || deletionLessonList.length > 0) {
        navigate(`/${page}/course/${courseSlug}`);
      }
    } catch (error) {
      toast.close(loadingToastId);
      setErrors([...errors, error]);
    }
  };

  const lessonNeedsUpdate = () => {
    return (
      !deletionLessonList.includes(lesson) &&
      (lesson.title !== lessonUpdateData.title ||
        lesson.description !== lessonUpdateData.description ||
        lesson.notes !== lessonUpdateData.notes ||
        (lessonUpdateData.video && lesson.videoUrl !== lessonUpdateData.video))
    );
  };

  const getVideoDuration = async (videoFile) => {
    const url = URL.createObjectURL(videoFile);
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.muted = true;
      const videoSource = document.createElement("source");
      videoSource.src = url;
      video.preload = "metadata";
      video.appendChild(videoSource);
      video.onloadedmetadata = () => {
        resolve(Math.round(video.duration));
      };
    });
  };

  const handleChangeCreateComment = (e) => {
    const { name, value } = e.target;
    if (name === "point" && value.length <= 1 && /^\d*$/.test(value)) {
      // Sadece 1 karakter ve sayı kabul edilir
      setCommentData({ ...commentData, [name]: value });
    }
    if (name === "text") {
      setCommentData({ ...commentData, [name]: value });
    }
  };

  const handleSubmitCreateComment = async (e) => {
    e.preventDefault();
    const commentFormData = new FormData();
    commentFormData.append("text", commentData.text);
    commentFormData.append("point", commentData.point);
    try {
      await addComment(courseSlug, lesson.slug, commentFormData);
      toast({
        title: "Success",
        description: "Comment created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setCommentAddState(false);
      setCommentData({ text: "" });
      try {
        const newLessons = await getLessons(courseSlug);
        setLessons(newLessons);
      } catch (error) {
        throw error;
      }
    } catch (error) {
      setErrors([...errors, error]);
    }
  };

  useEffect(() => {
    if (courseSlug) {
      getCourse(courseSlug)
        .then((data) => {
          setCourse(data);
        })
        .catch((error) => setErrors([...errors, error]));
    }
  }, [courseSlug]);

  useEffect(() => {
    getLessons(courseSlug)
      .then((data) => setLessons(data))
      .catch((error) => setErrors([...errors, error]));
  }, [course]);

  useEffect(() => {
    setPrevLessonState(null);
    setFilteredLessonList(lessons);
  }, [lessons, lessonSlug]);

  useEffect(() => {
    const currentLesson = filteredLessonList.filter(
      (el) => el.slug === lessonSlug
    )[0];
    setLesson(currentLesson);
  }, [filteredLessonList, lessonSlug]);

  useEffect(() => {
    if (lesson) {
      setIsLoading(false);
      setLessonPoint(lesson.point);
      const commentList = lesson.comments.map((comment) => comment);
      setComments(commentList);
      setLessonUpdateData({
        title: lesson.title,
        description: lesson.description,
        notes: lesson.notes,
      });
    }
  }, [lesson]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userList = await getUsers(); // Kullanıcı listesini al
        const uniqueUserIds = [...new Set(comments.map((c) => c.user))];
        const owners = uniqueUserIds.map((userId) => {
          // Her yorum için ilgili kullanıcıyı bul
          return userList.find((user) => user._id === userId);
        });
        setCommentOwnerList(owners);
      } catch (error) {
        setErrors([...errors, error]);
      }
    };

    fetchData(); // fetchData fonksiyonunu çağır

    setUpdatedCommentList(comments);
    setFilteredCommentList(comments);
  }, [comments]);

  useEffect(() => {
    let starLisst = [];
    for (let i = 0; i < lessonPoint; i++) {
      starLisst.push(i);
    }
    setStarList(starLisst);
  }, [lessonPoint]);

  useEffect(() => {
    if ((currentVideoTime / lesson?.duration) * 100 >= 80) {
      setIsLessonFinished(true);
    }
  }, [currentVideoTime]);

  useEffect(() => {
    if (
      course &&
      account &&
      account._id !== course.ownerId &&
      !isLessonFinished
    ) {
      getCourseState(course.slug).then((data) => setCourseStates(data));
    }
  }, [account, course, isLessonFinished]);

  useEffect(() => {
    if (courseStates) {
      const lessonState = courseStates.lessonsStates.find(
        (el) => el.lesson === lesson?._id
      );
      setIsLessonFinished(lessonState?.state);
      setIsFinishButtonClicked(lessonState?.state);
    }
  }, [courseStates, lesson]);

  return (
    <Box
      bgColor={"white"}
      border={"2px dashed #cfcfcf"}
      borderRadius={"10px"}
      p={responsive("", "1em ", "2em")}
      mx={responsive("", "8em", "10em")}
      my={responsive("", "2em", "3em")}
    >
      {isLoading ? (
        <Skeleton
          h={responsive("", "1em", "1.5em")}
          w={responsive("", "10em", "15em")}
          borderRadius={"10px"}
        />
      ) : (
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink
              as={Link}
              to="/"
              onClick={() => setTargetScroll("")}
              fontWeight={500}
              opacity={0.9}
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          {page === "courses" ? (
            <BreadcrumbItem>
              <BreadcrumbLink
                fontWeight={500}
                opacity={0.9}
                onClick={() => handleClick("courses")}
              >
                Courses
              </BreadcrumbLink>
            </BreadcrumbItem>
          ) : page === "all-courses" ? (
            <BreadcrumbItem>
              <BreadcrumbLink
                fontWeight={500}
                opacity={0.9}
                as={Link}
                to={"/all-courses"}
              >
                All courses
              </BreadcrumbLink>
            </BreadcrumbItem>
          ) : page === "enrollments" ? (
            <BreadcrumbItem>
              <BreadcrumbLink
                fontWeight={500}
                opacity={0.9}
                as={Link}
                to={"/enrollments"}
              >
                Enrollments
              </BreadcrumbLink>
            </BreadcrumbItem>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbLink
                fontWeight={500}
                opacity={0.9}
                as={Link}
                to={"/dashboard"}
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
          )}
          <BreadcrumbItem>
            <BreadcrumbLink
              fontWeight={500}
              opacity={0.9}
              as={Link}
              to={`/${page}/course/${courseSlug}`}
            >
              {course && course.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink
              fontWeight={500}
              opacity={0.9}
              as={Link}
              to={`/${page}/course/${courseSlug}/lessons/${lessonSlug}`}
            >
              {lessonUpdateData?.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      )}
      {isLoading ? (
        <Grid
          mt={responsive("", "2em", "3em")}
          templateRows="repeat(auto-fill, minmax(1em, auto))"
          templateColumns={responsive(
            "1fr",
            "repeat(4, 1fr)",
            "repeat(4, 1fr)"
          )}
          gap={10}
        >
          <GridItem colSpan={1} rowSpan={17}>
            <Skeleton w={"100%"} h={"100%"} borderRadius={"10px"}></Skeleton>
          </GridItem>
          <GridItem colSpan={3} rowSpan={7}>
            <Skeleton w={"100%"} h={"100%"} borderRadius={"10px"}></Skeleton>
          </GridItem>
          <GridItem colSpan={3} rowSpan={10}>
            <Skeleton w={"100%"} h={"100%"} borderRadius={"10px"}></Skeleton>
          </GridItem>
          <GridItem colSpan={1} rowSpan={7}></GridItem>
          <GridItem colSpan={3} rowSpan={7}>
            <Skeleton w={"100%"} h={"100%"} borderRadius={"10px"}></Skeleton>
          </GridItem>
          <GridItem colSpan={1} rowSpan={17}></GridItem>
          <GridItem colSpan={3} rowSpan={17}>
            <Skeleton w={"100%"} h={"100%"} borderRadius={"10px"}></Skeleton>
          </GridItem>
        </Grid>
      ) : (
        <Grid
          mt={responsive("", "2em", "3em")}
          templateRows="repeat(auto-fill, minmax(1em, auto))"
          templateColumns={responsive(
            "1fr",
            "repeat(4, 1fr)",
            "repeat(4, 1fr)"
          )}
          gap={10}
        >
          <GridItem
            colSpan={1}
            rowSpan={17}
            display={"flex"}
            flexDir={"column"}
            gap={"1.5em"}
            maxW={"22em"}
            p={"1em"}
            borderRadius={"10px"}
            bgColor={"var(--bg-color)"}
            border={"2px dashed var(--secondary-color)"}
          >
            <Heading fontSize={responsive("", "md", "lg")} fontWeight={"600"}>
              Lessons
            </Heading>
            {filteredLessonList &&
              filteredLessonList.map((lesson, index) => (
                <Flex
                  onClick={() => navigateLesson(lesson.slug)}
                  cursor={"pointer"}
                  opacity={lesson.slug === lessonSlug ? 1 : 0.9}
                  _hover={{ border: "2px dashed #cfcfcf", opacity: "1" }}
                  border={
                    lesson.slug === lessonSlug
                      ? "2px dashed #cfcfcf"
                      : "2px dashed transparent"
                  }
                  key={index}
                  align={"center"}
                  justify={"space-between"}
                  bgColor={"white"}
                  borderRadius={"7px"}
                  p={".5em"}
                >
                  <Flex gap={".5em"} align={"center"}>
                    <Box
                      w={".5em"}
                      h={".5em"}
                      borderRadius={".5em"}
                      bgColor={"var(--accent-color)"}
                    ></Box>
                    <Text
                      fontWeight={500}
                      overflow={"hidden"}
                      textOverflow={"ellipsis"}
                      whiteSpace={"nowrap"}
                      fontSize={responsive("", "sm", "md")}
                    >
                      {lesson.title}
                    </Text>
                  </Flex>

                  {isLessonEditing && (
                    <Button
                      variant="outline"
                      p=".5em"
                      minH="max-content"
                      minW="max-content"
                      onClick={() => handleDeleteLesson(lesson.slug)}
                      border={"1px solid var(--accent-color)"}
                      fontSize={responsive("", "sm", "md")}
                      color={"white"}
                      _hover={{
                        color: "var(--accent-color)",
                        bgColor: "white",
                      }}
                      bgColor={"var(--accent-color)"}
                    >
                      <i
                        className="fi fi-rr-trash"
                        style={{
                          position: "relative",
                          top: "2px",
                        }}
                      />
                    </Button>
                  )}
                </Flex>
              ))}
          </GridItem>

          <GridItem
            colSpan={3}
            rowSpan={7}
            p={"1em"}
            borderRadius={"10px"}
            bgColor={"var(--bg-color)"}
            border={"2px dashed var(--secondary-color)"}
          >
            <Flex flexDir={"column"} justify={"space-between"} h={"100%"}>
              <Flex flexDir={"column"} gap={"1em"}>
                {isLessonEditing ? (
                  <>
                    <FormControl>
                      <Input
                        autoFocus
                        type={"text"}
                        name="title"
                        color={"var(--secondary-color)"}
                        variant={"flushed"}
                        fontWeight={"600"}
                        value={lessonUpdateData.title}
                        fontFamily={"Montserrat, sans-serif;"}
                        fontSize={responsive("", "2xl", "3xl")}
                        onChange={(e) => handleLessonChange(e)}
                        _focus={{
                          borderColor: "#cdcdcd",
                          outline: 0,
                          boxShadow: "none",
                        }}
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        type={"text"}
                        name="description"
                        variant={"flushed"}
                        value={lessonUpdateData.description}
                        fontFamily={"Montserrat, sans-serif;"}
                        fontWeight={500}
                        opacity={0.9}
                        fontSize={responsive("", "sm", "md")}
                        onChange={(e) => handleLessonChange(e)}
                        _focus={{
                          borderColor: "#cdcdcd",
                          outline: 0,
                          boxShadow: "none",
                        }}
                      />
                    </FormControl>
                  </>
                ) : (
                  <>
                    <Heading
                      fontSize={responsive("", "2xl", "3xl")}
                      fontWeight={600}
                      color={"var(--secondary-color)"}
                    >
                      {lessonUpdateData?.title}
                    </Heading>

                    <Text
                      fontWeight={500}
                      opacity={0.9}
                      fontSize={responsive("", "sm", "md")}
                    >
                      {lessonUpdateData?.description}
                    </Text>
                  </>
                )}
              </Flex>
              <Flex align={"center"} justify={"space-between"}>
                <Flex
                  align={"center"}
                  gap={".5em"}
                  fontSize={responsive("", "sm", "md")}
                >
                  <Box color={"var(--accent-color)"}>
                    {starList.length > 0 ? (
                      starList.map((star) => (
                        <StarIcon
                          key={star}
                          style={{ position: "relative", bottom: "3px" }}
                        ></StarIcon>
                      ))
                    ) : (
                      <i
                        class="fi fi-rr-star"
                        style={{ position: "relative", top: "2px" }}
                      ></i>
                    )}
                  </Box>
                  <Text
                    fontWeight={500}
                    opacity={0.9}
                    fontSize={responsive("", "sm", "md")}
                  >
                    ({lesson?.comments && lesson.comments.length})
                  </Text>
                </Flex>
                {account && course && account._id === course.ownerId && (
                  <ButtonGroup>
                    {isLessonEditing && (
                      <Button
                        variant={"outline"}
                        bgColor={"var(--secondary-color)"}
                        color={"white"}
                        onClick={(e) => handleUpdateLessonSubmit(e)}
                        fontSize={responsive("", "sm", "md")}
                        border={"1px solid var(--secondary-color)"}
                        _hover={{
                          bgColor: "var(--bg-color)",
                          color: "var(--secondary-color)",
                        }}
                      >
                        Save
                      </Button>
                    )}
                    <Button
                      variant={"outline"}
                      bgColor={"var(--accent-color)"}
                      color={"white"}
                      onClick={() => {
                        setIsLessonEditing(!isLessonEditing);
                        setIsCommentEditing(!isCommentEditing);
                        if (isCommentEditing && isLessonEditing) {
                          setUpdatedCommentList(comments);
                          setDeletionCommentList([]);
                          setFilteredCommentList(comments);
                          setDeletionLessonList([]);
                          setLessonUpdateData({
                            title: lesson.title,
                            description: lesson.description,
                            notes: lesson.notes,
                          });
                          setFilteredLessonList(lessons);
                        }
                      }}
                      fontSize={responsive("", "sm", "md")}
                      border={"1px solid var(--accent-color)"}
                      _hover={{
                        bgColor: "var(--bg-color)",
                        color: "var(--accent-color)",
                      }}
                    >
                      {isLessonEditing ? "Reset changes" : "Edit Lesson"}
                    </Button>
                  </ButtonGroup>
                )}
              </Flex>
            </Flex>
          </GridItem>
          <GridItem
            colSpan={3}
            rowSpan={10}
            p={"1em"}
            borderRadius={"10px"}
            bgColor={"var(--bg-color)"}
            border={"2px dashed var(--secondary-color)"}
          >
            <Center h={"100%"} borderRadius={"10px"} overflow={"hidden"}>
              <FormControl position={"relative"}>
                <ReactPlayer
                  style={{ position: "relative", top: "0", left: "0" }}
                  onProgress={(state) =>
                    setCurrentVideoTime(state.playedSeconds.toFixed(0))
                  }
                  controls
                  width={"100%"}
                  height={"100%"}
                  url={apiUrl + lesson.videoUrl}
                ></ReactPlayer>
                <Input
                  type="file"
                  onChange={(e) => handleLessonChangeForVideo(e)}
                  accept="video/*"
                  name="video"
                  display={"none"}
                  id="video"
                ></Input>
                {isLessonEditing && (
                  <FormLabel
                    htmlFor="video"
                    pos={"absolute"}
                    top={0}
                    left={0}
                    w={"100%"}
                    h={"100%"}
                    opacity={0.5}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    cursor={"pointer"}
                  >
                    {isLessonEditing && (
                      <i
                        class="fi fi-rr-camera"
                        style={{
                          position: "relative",
                          top: "2px",
                          fontSize: responsive("", "5em", "7em"),
                        }}
                      ></i>
                    )}
                  </FormLabel>
                )}
              </FormControl>
            </Center>
          </GridItem>
          <GridItem
            colSpan={1}
            rowSpan={7}
            p={"1em"}
            borderRadius={"10px"}
          ></GridItem>
          <GridItem
            colSpan={3}
            rowSpan={7}
            maxH={responsive("", "60em", "62em")}
            p={"1em"}
            borderRadius={"10px"}
            bgColor={"var(--bg-color)"}
            border={"2px dashed var(--secondary-color)"}
          >
            <Flex flexDir={"column"} justify={"space-between"} h={"100%"}>
              <Stack gap={"1em"}>
                <Heading
                  fontSize={responsive("", "md", "lg")}
                  fontWeight={"600"}
                >
                  Lesson Note
                </Heading>
                <Textarea
                  minH={"10em"}
                  border={"2px dashed #cfcfcf"}
                  onChange={(e) => handleLessonChange(e)}
                  readOnly={!isLessonEditing}
                  name="notes"
                  _focus={{
                    border: "2px dashed #cfcfcf",
                    boxShadow: "none",
                  }}
                  fontSize={responsive("", "sm", "md")}
                  fontWeight={500}
                  opacity={0.9}
                  value={lessonUpdateData?.notes}
                ></Textarea>
              </Stack>
              <Flex justify={"flex-end"}>
                {account && course && account._id !== course.ownerId && (
                  <Button
                    mt={"1em"}
                    variant={"outline"}
                    bgColor={"var(--accent-color)"}
                    color={"white"}
                    isDisabled={isFinishButtonClicked}
                    onClick={() => updateLessonStateFunc(lesson.slug)}
                    fontSize={responsive("", "sm", "md")}
                    border={"1px solid var(--accent-color)"}
                    _hover={{
                      bgColor: "white",
                      color: "var(--accent-color)",
                    }}
                  >
                    Finish
                  </Button>
                )}
              </Flex>
            </Flex>
          </GridItem>
          <GridItem colSpan={1} rowSpan={17}></GridItem>
          <GridItem
            colSpan={3}
            rowSpan={17}
            p={"1em"}
            borderRadius={"10px"}
            bgColor={"var(--bg-color)"}
            border={"2px dashed var(--secondary-color)"}
          >
            <Flex align={"center"} justify={"space-between"} mb={"1em"}>
              <Heading fontSize={responsive("", "md", "lg")} fontWeight={"600"}>
                Lesson Comments
              </Heading>
              <ButtonGroup>
                {!isCommentEditing && (
                  <Button
                    variant={"outline"}
                    onClick={() => setCommentAddState(!commentAddState)}
                    bgColor={"var(--secondary-color)"}
                    color={"white"}
                    fontSize={responsive("", "sm", "md")}
                    border={"1px solid var(--secondary-color)"}
                    _hover={{
                      bgColor: "var(--bg-color)",
                      color: "var(--secondary-color)",
                    }}
                  >
                    {commentAddState ? "Reset comment" : "Add Comment"}
                  </Button>
                )}
                {isCommentEditing && course.ownerId !== account._id && (
                  <Button
                    variant={"outline"}
                    onClick={(e) => handleUpdateCommentSubmit(e)}
                    bgColor={"var(--secondary-color)"}
                    color={"white"}
                    fontSize={responsive("", "sm", "md")}
                    border={"1px solid var(--secondary-color)"}
                    _hover={{
                      bgColor: "var(--bg-color)",
                      color: "var(--secondary-color)",
                    }}
                  >
                    Save
                  </Button>
                )}

                {account &&
                  course &&
                  commentOwnerList.some((c) => c._id === account._id) &&
                  course.ownerId !== account._id &&
                  updatedCommentList.length > 0 && (
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        setCommentAddState(false);
                        setIsCommentEditing(!isCommentEditing);
                        if (isCommentEditing) {
                          setUpdatedCommentList(comments);
                          setDeletionCommentList([]);
                          setFilteredCommentList(comments);
                        }
                      }}
                      bgColor={"var(--accent-color)"}
                      color={"white"}
                      fontSize={responsive("", "sm", "md")}
                      border={"1px solid var(--accent-color)"}
                      _hover={{
                        bgColor: "var(--bg-color)",
                        color: "var(--accent-color)",
                      }}
                    >
                      {isCommentEditing ? "Reset" : "Edit"}
                    </Button>
                  )}
              </ButtonGroup>
            </Flex>
            <Flex
              flexDir={"column"}
              gap={responsive("", "1em", "1.5em")}
              maxH={responsive("", "35em", "37em")}
              overflow={"auto"}
            >
              {commentAddState && (
                <Flex
                  bgColor="white"
                  p={responsive("", ".5em", "1em")}
                  borderRadius="10px"
                  justify="space-between"
                  flexDir="column"
                  gap="1em"
                >
                  <Flex
                    align={"center"}
                    gap={"1em"}
                    w={"100%"}
                    justify={"space-between"}
                  >
                    <Flex align={"center"} gap={"1em"}>
                      <Avatar
                        src={apiUrl + account.image}
                        bgColor={"var(--secondary-color)"}
                        name={account.username}
                        size={responsive("", "sm", "sm")}
                      />
                      <Text
                        fontWeight={500}
                        fontSize={responsive("", "sm", "md")}
                        opacity={0.9}
                      >
                        {account.username}
                      </Text>
                    </Flex>
                    <Button
                      variant={"outline"}
                      onClick={(e) => handleSubmitCreateComment(e)}
                      bgColor={"var(--secondary-color)"}
                      color={"white"}
                      fontSize={responsive("", "sm", "md")}
                      border={"1px solid var(--secondary-color)"}
                      _hover={{
                        bgColor: "var(--bg-color)",
                        color: "var(--secondary-color)",
                      }}
                    >
                      Save
                    </Button>
                  </Flex>
                  <Textarea
                    border={"2px dashed #cfcfcf"}
                    name="text"
                    onChange={(e) => handleChangeCreateComment(e)}
                    value={commentData.text}
                    _focus={{
                      border: "2px dashed #cfcfcf",
                      boxShadow: "none",
                    }}
                    fontSize={responsive("", "sm", "md")}
                    fontWeight={500}
                    opacity={0.9}
                  ></Textarea>
                  <Flex align={"center"} justify={"space-between"}>
                    <Flex
                      fontSize={responsive("", "sm", "md")}
                      fontWeight={500}
                      opacity={0.9}
                      gap={".3em"}
                      align={"center"}
                    >
                      <Text>Point: </Text>
                      &nbsp;
                      <Input
                        type={"number"}
                        name="point"
                        variant={"flushed"}
                        onChange={(e) => handleChangeCreateComment(e)}
                        value={commentData.point}
                        w={"2em"}
                        fontWeight={"600"}
                        _focus={{
                          borderColor: "#cdcdcd",
                          outline: 0,
                          boxShadow: "none",
                        }}
                      />
                    </Flex>
                    <Text
                      fontSize={responsive("", "sm", "md")}
                      fontWeight={500}
                      opacity={0.9}
                    >
                      {getDate(new Date().toLocaleDateString())}
                    </Text>
                  </Flex>
                </Flex>
              )}
              {filteredCommentList.length > 0 && commentOwnerList.length > 0
                ? filteredCommentList.map((comment, index) => (
                    <Flex
                      key={index}
                      bgColor="white"
                      p={responsive("", ".5em", "1em")}
                      borderRadius="10px"
                      justify="space-between"
                      flexDir="column"
                      gap="1em"
                    >
                      {commentOwnerList.map((owner) => {
                        // Yorumun sahibini bul
                        if (owner._id === comment.user) {
                          return (
                            <Flex align="center" justify={"space-between"}>
                              <Flex align={"center"} gap={"1em"}>
                                <Avatar
                                  key={owner._id}
                                  src={apiUrl + owner.image}
                                  bgColor={"var(--secondary-color)"}
                                  name={owner.username}
                                  size={responsive("", "sm", "sm")}
                                />
                                <Text
                                  fontWeight={500}
                                  fontSize={responsive("", "sm", "md")}
                                  opacity={0.9}
                                >
                                  {owner.username}
                                </Text>
                              </Flex>

                              {(account &&
                                course &&
                                account._id === course.ownerId &&
                                isCommentEditing) ||
                              (account._id === comment.user &&
                                isCommentEditing) ? (
                                <Button
                                  variant="outline"
                                  p=".5em"
                                  minH="max-content"
                                  minW="max-content"
                                  border={"1px solid var(--accent-color)"}
                                  fontSize={responsive("", "sm", "md")}
                                  onClick={() =>
                                    handleDeleteComment(comment._id)
                                  }
                                  color={"white"}
                                  _hover={{
                                    color: "var(--accent-color)",
                                    bgColor: "white",
                                  }}
                                  bgColor={"var(--accent-color)"}
                                >
                                  <i
                                    className="fi fi-rr-trash"
                                    style={{
                                      position: "relative",
                                      top: "2px",
                                    }}
                                  />
                                </Button>
                              ) : null}
                            </Flex>
                          );
                        }
                        return null;
                      })}
                      <Textarea
                        border={"2px dashed #cfcfcf"}
                        value={
                          updatedCommentList.find((c) => c._id === comment._id)
                            ?.text || ""
                        }
                        onChange={(e) => handleCommentChange(e, comment._id)}
                        readOnly={!isCommentEditing}
                        _focus={{
                          border: "2px dashed #cfcfcf",
                          boxShadow: "none",
                        }}
                        fontSize={responsive("", "sm", "md")}
                        fontWeight={500}
                        opacity={0.9}
                      ></Textarea>
                      <Flex align={"center"} justify={"space-between"}>
                        <Flex
                          fontSize={responsive("", "sm", "md")}
                          fontWeight={500}
                          opacity={0.9}
                          color={"var(--accent-color)"}
                          gap={".3em"}
                          align={"center"}
                        >
                          <Text>{comment.point}</Text>
                          <StarIcon pos={"relative"} bottom={"2px"}></StarIcon>
                        </Flex>
                        <Text
                          fontSize={responsive("", "sm", "md")}
                          fontWeight={500}
                          opacity={0.9}
                        >
                          {getDate(comment.createdAt)}
                        </Text>
                      </Flex>
                    </Flex>
                  ))
                : ""}
            </Flex>
          </GridItem>
        </Grid>
      )}
    </Box>
  );
};

export default Lesson;
