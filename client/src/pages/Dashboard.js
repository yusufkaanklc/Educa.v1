import {
  Grid,
  GridItem,
  Box,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  ButtonGroup,
  Text,
  Heading,
  Button,
  Avatar,
  useToast,
  Image,
  Center,
  Textarea,
} from "@chakra-ui/react";
import { ChevronRightIcon, StarIcon } from "@chakra-ui/icons";
import { useContext, useEffect, useState } from "react";
import dataContext from "../utils/contextApi";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { deleteComment, updateComment } from "../utils/data/CommentData";

const Dashboard = () => {
  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
  );
  const {
    isMobile,
    isLaptop,
    setTargetScroll,
    courses,
    account,
    userPoint,
    setUserPoint,
    setErrors,
    errors,
  } = useContext(dataContext);
  const [ownedCourses, setOwnedCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [comments, setComments] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [starList, setStarList] = useState([]);
  const [commentsEdit, setCommentsEdit] = useState(false);
  const [commentDeleteList, setCommentDeleteList] = useState([]);
  const [activeButtonIndices, setActiveButtonIndices] = useState([]);
  const [commentTextList, setCommentTextList] = useState([]);
  const responsive = (mobile, laptop, desktop) => {
    if (isMobile) {
      return mobile;
    } else if (isLaptop) {
      return laptop;
    } else {
      return desktop;
    }
  };

  const data = {
    labels: ["Courses", "Lessons", "Enrollments", "Comments"],
    datasets: [
      {
        label: "Count",
        data: [
          ownedCourses.length,
          lessons.length,
          enrollments.length,
          comments.length,
        ],
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "#47bb8e",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false, // Label'i gizle
      },
    },
  };

  const toast = useToast();

  const getDate = (createdAt) => {
    if (createdAt) {
      const date = new Date(createdAt);
      return `${date.getDate()} / ${
        date.getMonth() + 1
      } / ${date.getFullYear()}`;
    }
    return ""; // Eğer createdAt değeri yoksa boş string döndür
  };

  const handleCommentButtonClick = (index, comment) => {
    setActiveButtonIndices((prev) => {
      const updatedActiveButtons = [...prev];
      updatedActiveButtons[index] = !updatedActiveButtons[index];
      return updatedActiveButtons;
    });

    setCommentDeleteList((prevComment) => {
      if (prevComment.includes(comment)) {
        return prevComment.filter((comments) => comments !== comment);
      } else {
        return [...prevComment, comment];
      }
    });
  };

  const commentsDeleteFunc = () => {
    if (commentDeleteList.length > 0) {
      const promise = commentDeleteList.map(async (comment) => {
        await deleteComment(comment.course, comment.lesson.slug, comment._id);
      });

      Promise.all(promise)
        .then(() =>
          toast({
            title: "Success",
            description: `Comments Deleted Successfully`,
            status: "success",
            duration: 5000,
            isClosable: true,
          })
        )
        .catch((error) => {
          setErrors([...errors, error]);
        });
    }
  };

  const handleCommentsSubmit = () => {
    const promises = commentTextList.map(async (comment) => {
      const formDataText = new FormData();
      formDataText.append("text", comment.text);

      // Güncellenmiş yorumu almak için updateComment fonksiyonunu bekleyin
      const updatedComment = await updateComment(
        comment.course,
        comment.lesson.slug,
        comment.commentId,
        formDataText
      );

      return updatedComment; // Güncellenmiş yorumu promise zinciri boyunca geçirin
    });

    Promise.all(promises)
      .then((updatedComments) => {
        // Tüm güncellenmiş yorumları aldıktan sonra commentTextList'i güncelleyin
        const updatedCommentTextList = commentTextList.map((comment) => {
          const updatedComment = updatedComments.find(
            (updatedComment) => updatedComment._id === comment.commentId
          );
          if (updatedComment) {
            return { ...comment, text: updatedComment.text };
          }
          return comment;
        });

        setCommentTextList(updatedCommentTextList);

        // Başarılı tost mesajını gösterin
        toast({
          title: "Success",
          description: `Comments Update Successfully`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        // Hata durumunda hatayı kaydedin
        setErrors([...errors, error]);
      });
  };

  useEffect(() => {
    setOwnedCourses(
      courses.filter((course) => course?.ownership === account?.username)
    );
  }, [courses]);

  useEffect(() => {
    setLessons(ownedCourses.flatMap((course) => course.lessons));
    setEnrollments(ownedCourses.flatMap((course) => course.enrollments));

    const pointList = ownedCourses
      .map((course) => course.point)
      .filter((point) => point !== null);

    if (pointList.length > 0) {
      if (pointList.length > 1) {
        setUserPoint(
          Math.round(
            pointList.reduce((acc, curr) => acc + curr, 0) / pointList.length
          )
        );
      } else {
        setUserPoint(Math.round(pointList[0]));
      }
    }

    setComments(
      ownedCourses
        .flatMap((course) => course.comments)
        .filter((comment) => comment !== null)
    );
  }, [ownedCourses]);

  const updatedCommentTextList = comments.map((comment) => ({
    commentId: comment?._id,
    text: comment.text,
    lesson: comment.lesson,
    course: comment.course,
  }));

  const updatedCommentTextListFunc = () => {
    setCommentTextList(updatedCommentTextList);
  };

  useEffect(() => {
    setActiveButtonIndices(Array(comments.length).fill(false));
    updatedCommentTextListFunc();
  }, [comments]);

  useEffect(() => {
    const starLisst = [];
    for (let i = 0; i < userPoint; i++) {
      starLisst.push(i);
    }
    setStarList(starLisst);
  }, [userPoint]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Box
        bgColor={"white"}
        border={"2px dashed #cfcfcf"}
        borderRadius={"10px"}
        p={responsive("", "1em ", "2em")}
        mx={responsive("", "8em", "10em")}
        my={responsive("", "2em", "3em")}
      >
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
          <BreadcrumbItem>
            <BreadcrumbLink
              fontWeight={500}
              opacity={0.9}
              as={Link}
              to="/dashboard"
            >
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Box mt={responsive("", "1em", "1.5em")}>
          <Heading
            fontWeight={"600"}
            fontSize={responsive("", "2xl", "3xl")}
            color={"var(--secondary-color)"}
          >
            Welcome {account?.username}
          </Heading>
        </Box>
        <Grid
          mt={responsive("", "2em", "3em")}
          templateRows="repeat(auto-fill, minmax(1em, auto))"
          templateColumns={responsive(
            "1fr",
            "repeat(3, 1fr)",
            "repeat(3, 1fr)"
          )}
          gap={10}
        >
          <GridItem
            rowSpan={10}
            colSpan={2}
            maxH={"26em"}
            display={"flex"}
            flexDir={"column"}
            gap={"1em"}
            p={"1em"}
            pr={0}
            borderRadius={"10px"}
            pb={"1em"}
            bgColor={"var(--bg-color)"}
            border={"2px dashed var(--secondary-color)"}
          >
            <Text
              fontWeight={"500"}
              fontSize={responsive("", "md", "lg")}
              w={"max-content"}
            >
              Your Courses
            </Text>
            <Flex
              pr={"1em"}
              overflow={"auto"}
              mt={responsive("", ".5em", ".5em")}
              flexDir={"column"}
              gap={"1em"}
            >
              {ownedCourses && ownedCourses.length > 0 ? (
                ownedCourses.map((course, index) => (
                  <Flex
                    bgColor={"white"}
                    p={responsive("", ".5em", "1em")}
                    borderRadius={"10px"}
                    key={index}
                    align={"center"}
                    justify={"space-between"}
                    transition={"all .3s ease"}
                  >
                    <Flex>
                      <Image />
                      <Text fontWeight={"500"}>{course.title}</Text>
                    </Flex>

                    <Flex
                      fontWeight={"500"}
                      align={"center"}
                      gap={"1em"}
                      fontSize={responsive("", "sm", "md")}
                    >
                      <Flex gap={".5em"} align={"center"}>
                        <i
                          class="fi fi-rr-book-alt"
                          style={{ position: "relative", top: "2px" }}
                        ></i>
                        <Text>{course.lessons.length}</Text>
                      </Flex>
                      <Flex gap={".5em"} align={"center"}>
                        <i
                          class="fi fi-rr-users-alt"
                          style={{ position: "relative", top: "2px" }}
                        ></i>
                        <Text>{course.enrollments.length}</Text>
                      </Flex>
                      <Flex gap={".5em"} align={"center"}>
                        <i
                          class="fi fi-rr-clock-three"
                          style={{ position: "relative", top: "2px" }}
                        ></i>
                        <Text>45h</Text>
                      </Flex>
                      <Flex gap={".5em"} align={"center"}>
                        <i
                          class="fi fi-rr-comment-alt"
                          style={{ position: "relative", top: "2px" }}
                        ></i>
                        <Text>
                          {course.comments[0] !== null
                            ? course.comments.length
                            : 0}
                        </Text>
                      </Flex>
                      <Flex
                        gap={".5em"}
                        align={"center"}
                        color={"var(--accent-color)"}
                      >
                        <StarIcon pos={"relative"} bottom={"2px"} />
                        <Text>{course.point ? course.point : 0}</Text>
                      </Flex>
                    </Flex>
                    <Button
                      as={Link}
                      to={`/dashboard/course/${course.slug}`}
                      variant={"outline"}
                      bgColor={"var(--accent-color)"}
                      color={"white"}
                      fontSize={responsive("", "sm", "md")}
                      border={"1px solid var(--accent-color)"}
                      _hover={{
                        bgColor: "white",
                        color: "var(--accent-color)",
                      }}
                    >
                      View
                    </Button>
                  </Flex>
                ))
              ) : (
                <Text
                  fontSize={responsive("", "sm", "md")}
                  fontWeight={"500"}
                  opacity={"0.9"}
                >
                  You dont have any course
                </Text>
              )}
            </Flex>
          </GridItem>
          <GridItem colSpan={1} rowSpan={2}>
            <Center
              fontSize={responsive("", "md", "lg")}
              fontWeight={"500"}
              borderRadius={"10px"}
              border={"2px dashed var(--secondary-color)"}
              as={Link}
              to="/create-course"
              p={responsive("", "1em", "1em")}
              color={"white"}
              bgColor={"var(--secondary-color)"}
              transition={"all .3s ease"}
              _hover={{
                bgColor: "white",
                color: "var(--secondary-color)",
                cursor: "pointer",
              }}
            >
              Create Course
            </Center>
          </GridItem>
          <GridItem colSpan={1} rowSpan={2}>
            <Center
              bgColor={"var(--accent-color)"}
              fontSize={responsive("", "md", "lg")}
              fontWeight={"500"}
              borderRadius={"10px"}
              p={responsive("", "1em", "1em")}
              color={"white"}
              transition={"all .3s ease"}
              style={{ fontSize: responsive("", "sm", "md") }}
            >
              Your Point &nbsp;
              {starList.length > 0 ? (
                starList.map((star) => (
                  <StarIcon pos={"relative"} bottom={"2px"} key={star} />
                ))
              ) : (
                <i
                  class="fi fi-rr-star"
                  style={{ position: "relative", top: "2px" }}
                ></i>
              )}
            </Center>
          </GridItem>
          <GridItem
            colSpan={1}
            rowSpan={8}
            bgColor={"var(--bg-color)"}
            borderRadius={"10px"}
            p={responsive("", "1em", "1em")}
            w={"100%"}
          >
            <Text
              fontWeight={"500"}
              fontSize={responsive("", "md", "lg")}
              w={"max-content"}
              mb={"1em"}
            >
              Instructor Summary
            </Text>
            <Box w={"100%"} h={"100%"}>
              <Line
                data={data}
                options={options}
                width={"200%"}
                height={"95%"}
              />
            </Box>
          </GridItem>
          <GridItem
            rowSpan={10}
            colSpan={2}
            maxH={"26em"}
            display={"flex"}
            flexDir={"column"}
            gap={"1em"}
            p={"1em"}
            pr={0}
            borderRadius={"10px"}
            pb={"1em"}
            bgColor={"var(--bg-color)"}
            border={"2px dashed var(--secondary-color)"}
          >
            <Text
              fontWeight={"500"}
              fontSize={responsive("", "md", "lg")}
              w={"max-content"}
            >
              Your Lessons
            </Text>
            <Flex
              pr={"1em"}
              overflow={"auto"}
              mt={responsive("", ".5em", ".5em")}
              flexDir={"column"}
              gap={"1em"}
            >
              {lessons && lessons.length > 0 ? (
                lessons.map((lesson, index) => (
                  <Flex
                    bgColor={"white"}
                    p={responsive("", ".5em", "1em")}
                    borderRadius={"10px"}
                    key={index}
                    align={"center"}
                    justify={"space-between"}
                    transition={"all .3s ease"}
                  >
                    <Text fontWeight={"500"}>{lesson.title}</Text>
                    <Text
                      fontWeight={"500"}
                      textOverflow={"ellipsis"}
                      overflow={"hidden"}
                      maxW={"30%"}
                      whiteSpace={"nowrap"}
                    >
                      {lesson.description}
                    </Text>
                    <Flex
                      fontWeight={"500"}
                      align={"center"}
                      gap={"1em"}
                      fontSize={responsive("", "sm", "md")}
                    >
                      <Flex gap={".5em"} align={"center"}>
                        <i
                          class="fi fi-rr-comment-alt"
                          style={{ position: "relative", top: "2px" }}
                        ></i>
                        <Text>{lesson.comments.length}</Text>
                      </Flex>
                      <Flex gap={".5em"} align={"center"}>
                        <i
                          class="fi fi-rr-clock-three"
                          style={{ position: "relative", top: "2px" }}
                        ></i>
                        <Text>
                          {lesson.duration < 60
                            ? lesson.duration + " sec"
                            : Math.round(lesson.duration / 60) + " min"}
                        </Text>
                      </Flex>
                    </Flex>

                    <Button
                      variant={"outline"}
                      bgColor={"var(--accent-color)"}
                      color={"white"}
                      fontSize={responsive("", "sm", "md")}
                      border={"1px solid var(--accent-color)"}
                      _hover={{
                        bgColor: "white",
                        color: "var(--accent-color)",
                      }}
                    >
                      View
                    </Button>
                  </Flex>
                ))
              ) : (
                <Text
                  fontSize={responsive("", "sm", "md")}
                  fontWeight={"500"}
                  opacity={"0.9"}
                >
                  You dont have any lesson
                </Text>
              )}
            </Flex>
          </GridItem>

          <GridItem
            rowSpan={20}
            colSpan={1}
            maxH={"50em"}
            display={"flex"}
            flexDir={"column"}
            gap={"1em"}
            p={"1em"}
            pr={0}
            borderRadius={"10px"}
            pb={"1em"}
            bgColor={"var(--bg-color)"}
            border={"2px dashed var(--secondary-color)"}
          >
            <Flex align={"center"} justify={"space-between"} mr={"1em"}>
              <Text fontWeight={"500"} fontSize={responsive("", "md", "lg")}>
                Your Comments
              </Text>
              <ButtonGroup>
                {commentsEdit && (
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setCommentsEdit(!commentsEdit);
                      commentsDeleteFunc();
                      handleCommentsSubmit();
                    }}
                    bgColor={"var(--secondary-color)"}
                    type={"submit"}
                    color={"white"}
                    fontSize={responsive("", "sm", "md")}
                    border={"1px solid var(--secondary-color)"}
                    _hover={{
                      bgColor: "white",
                      color: "var(--secondary-color)",
                    }}
                  >
                    Save
                  </Button>
                )}
                <Button
                  variant={"outline"}
                  onClick={() => {
                    setCommentsEdit(!commentsEdit);
                    setActiveButtonIndices(Array(comments.length).fill(false));
                    setCommentDeleteList([]);
                    updatedCommentTextListFunc();
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
                  {commentsEdit ? "Reset" : "Edit"}
                </Button>
              </ButtonGroup>
            </Flex>
            <Flex
              maxH={"100%"}
              overflow={"auto"}
              pr={"1em"}
              h={"100%"}
              mt={responsive("", ".5em", ".5em")}
              flexDir={"column"}
              gap={"1em"}
            >
              {comments && comments.length > 0 ? (
                comments.map((comment, index) => {
                  const updatedComment = commentTextList.find((c) => {
                    if (
                      c.text !== comment.text &&
                      c.commentId === comment._id
                    ) {
                      return c;
                    } else {
                      return null;
                    }
                  });
                  return (
                    !commentDeleteList.includes(comment) && (
                      <Flex
                        key={index}
                        bgColor="white"
                        p={responsive("", ".5em", "1em")}
                        borderRadius="10px"
                        justify="space-between"
                        transition="all .3s ease"
                        flexDir="column"
                        gap="1em"
                      >
                        <Flex align="center" justify="space-between">
                          <Flex gap=".5em" align="center">
                            <Avatar
                              src={`http://localhost:5000/${comment?.user.image}`}
                              bgColor="var(--secondary-color)"
                              name={comment?.user.username}
                              size={responsive("", "sm", "sm")}
                            />
                            <Text
                              fontWeight="500"
                              fontSize={responsive("", "sm", "md")}
                              opacity={0.9}
                            >
                              {comment?.user.username}
                            </Text>
                          </Flex>
                          {commentsEdit && (
                            <Button
                              variant="outline"
                              p=".5em"
                              minH="max-content"
                              minW="max-content"
                              onClick={() =>
                                handleCommentButtonClick(index, comment)
                              }
                              fontSize={responsive("", "sm", "md")}
                              _hover={{
                                bgColor: activeButtonIndices[index]
                                  ? "var(--accent-color)"
                                  : "unset",
                              }}
                              bgColor={
                                activeButtonIndices[index]
                                  ? "var(--accent-color)"
                                  : "unset"
                              }
                            >
                              <i
                                className="fi fi-rr-trash"
                                style={{ position: "relative", top: "2px" }}
                              />
                            </Button>
                          )}
                        </Flex>

                        <Textarea
                          border={"2px dashed #cfcfcf"}
                          readOnly={!commentsEdit}
                          value={
                            updatedComment ? updatedComment.text : comment.text
                          }
                          _focus={{
                            boxShadow: "none",
                            border: "2px dashed #cfcfcf",
                          }}
                          onChange={(e) => {
                            const updatedCommentTextList = [...commentTextList];
                            const commentIndex =
                              updatedCommentTextList.findIndex(
                                (c) => c.commentId === comment._id
                              );
                            if (commentIndex !== -1) {
                              updatedCommentTextList[commentIndex].text =
                                e.target.value;
                              setCommentTextList(updatedCommentTextList);
                            }
                          }}
                        ></Textarea>
                        <Flex align="center" justify="space-between">
                          <Flex align={"center"} gap={"1em"}>
                            <Text
                              fontWeight="500"
                              fontSize={responsive("", "sm", "md")}
                              opacity={0.9}
                            >
                              {comment.lesson?.title}
                            </Text>
                            <Flex
                              fontSize={responsive("", "sm", "md")}
                              fontWeight={500}
                              opacity={0.9}
                              color={"var(--accent-color)"}
                              gap={".3em"}
                              align={"center"}
                            >
                              <Text>{comment.point}</Text>
                              <StarIcon
                                pos={"relative"}
                                bottom={"2px"}
                              ></StarIcon>
                            </Flex>
                          </Flex>
                          <Text
                            fontWeight="500"
                            opacity={0.9}
                            fontSize={responsive("", "sm", "md")}
                          >
                            {getDate(comment.createdAt)}
                          </Text>
                        </Flex>
                      </Flex>
                    )
                  );
                })
              ) : (
                <Text
                  fontSize={responsive("", "sm", "md")}
                  fontWeight={"500"}
                  opacity={"0.9"}
                >
                  You dont have any comment
                </Text>
              )}
            </Flex>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};

export default Dashboard;
