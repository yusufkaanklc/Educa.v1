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
  useToast,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronRightIcon, StarIcon } from "@chakra-ui/icons";
import { useContext, useEffect, useState } from "react";
import dataContext from "../utils/contextApi";
import { Link } from "react-router-dom";
import { unenrollCourse } from "../utils/data/UsersData";
import { getCourses } from "../utils/data/CoursesData";
import { deleteComment, updateComment } from "../utils/data/CommentData";
const Enrollments = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isMobile,
    isLaptop,
    setErrors,
    errors,
    courses,
    setCourses,
    setTargetScroll,
    account,
  } = useContext(dataContext);
  const responsive = (mobile, laptop, desktop) => {
    if (isMobile) {
      return mobile;
    } else if (isLaptop) {
      return laptop;
    } else {
      return desktop;
    }
  };

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [lastCourse, setLastCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [commentsEdit, setCommentsEdit] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentDeleteList, setCommentDeleteList] = useState([]);
  const [activeButtonIndices, setActiveButtonIndices] = useState([]);
  const [commentTextList, setCommentTextList] = useState([]);

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

  const handleUnenroll = (course) => {
    setSelectedCourse(course);
    onOpen();
  };

  const handleUnenrollSubmit = async () => {
    try {
      await unenrollCourse(selectedCourse.slug);
      toast({
        title: "Success",
        description: `Successfully left the course`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
      try {
        const newCourses = await getCourses();
        setCourses(newCourses);
      } catch (error) {
        throw error;
      }
    } catch (error) {
      setErrors([...errors, error]);
    }
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
        .then(() => {
          toast({
            title: "Success",
            description: `Comments Deleted Successfully`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          getCourses()
            .then((data) => setCourses(data))
            .catch((error) => {
              throw error;
            });
        })
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
        getCourses()
          .then((data) => setCourses(data))
          .catch((error) => {
            throw error;
          });
        // Başarılı tost mesajını gösterin
        toast({
          title: "Success",
          description: `Comments Update Successfully`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        if (commentDeleteList.length > 0) {
          commentsDeleteFunc();
        }
      })
      .catch((error) => {
        // Hata durumunda hatayı kaydedin
        setErrors([...errors, error]);
      });
  };

  useEffect(() => {
    if (courses.length > 0) {
      const enrolledCourseList = courses.filter((course) =>
        course.enrollments.includes(account && account._id)
      );
      setEnrolledCourses(enrolledCourseList);
    }
  }, [courses, account]);

  useEffect(() => {
    if (enrolledCourses && !enrolledCourses.some((course) => course === null)) {
      const today = new Date();
      let closestCourse = null;
      let minDifference = Infinity;

      enrolledCourses.forEach((course) => {
        const currentDate = new Date(course.createdAt);
        const difference = Math.abs(currentDate - today);
        if (difference < minDifference) {
          minDifference = difference;
          closestCourse = course;
        }
      });

      setLastCourse(closestCourse);
      const comments = enrolledCourses.map((course) => course.comments).flat();
      const filteredComments = comments.filter((c) => c !== null);
      const ownedComments = filteredComments.filter(
        (c) => c.user._id === account?._id
      );
      setComments(ownedComments);
    }
  }, [enrolledCourses]);

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

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mx={isMobile && "1em"}>
          <ModalHeader>
            {`Are you sure you want to leave the ${selectedCourse?.title} course?`}
          </ModalHeader>
          <ModalBody>
            <ButtonGroup gap={"1em"}>
              <Button
                size={isMobile ? "sm" : "md"}
                border={"1px solid transparent"}
                bgColor={"var(--secondary-color)"}
                fontSize={responsive("sm", "sm", "md")}
                onClick={() => handleUnenrollSubmit()}
                color={"white"}
                _hover={{
                  bgColor: "var(--bg-color)",
                  color: "var(--secondary-color)",
                  border: "1px solid var(--secondary-color)",
                }}
              >
                Yes
              </Button>
              <Button
                size={isMobile ? "sm" : "md"}
                border={"1px solid transparent"}
                bgColor={"var(--accent-color)"}
                fontSize={responsive("sm", "sm", "md")}
                onClick={() => onClose()}
                color={"white"}
                _hover={{
                  bgColor: "var(--bg-color)",
                  color: "var(--accent-color)",
                  border: "1px solid var(--accent-color)",
                }}
              >
                No
              </Button>
            </ButtonGroup>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Box
        bgColor={"white"}
        border={isMobile ? "unset" : "2px dashed #cfcfcf"}
        borderRadius={"10px"}
        p={responsive("1em", "1em ", "2em")}
        mx={responsive("1em", "8em", "10em")}
        my={responsive("2em", "2em", "3em")}
      >
        <Breadcrumb
          fontSize={responsive("sm", "sm", "md")}
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
              to="/enrollments"
            >
              Enrollments
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading
          mt={responsive("1em", "1em", "1.5em")}
          fontWeight={"600"}
          fontSize={responsive("xl", "2xl", "3xl")}
          color={"var(--secondary-color)"}
        >
          Welcome {account?.username}
        </Heading>
        <Grid
          mt={responsive("1em", "2em", "3em")}
          templateRows="repeat(auto-fill, minmax(1em, auto))"
          templateColumns={responsive(
            "1fr",
            "repeat(3, 1fr)",
            "repeat(3, 1fr)"
          )}
          gap={isMobile ? 6 : 10}
        >
          <GridItem
            rowSpan={4}
            colSpan={2}
            maxH={"26em"}
            display={"flex"}
            flexDir={"column"}
            gap={"1em"}
            p={"1em"}
            borderRadius={"10px"}
            pb={"1em"}
            bgColor={"var(--bg-color)"}
            border={"2px dashed var(--secondary-color)"}
          >
            <Text
              fontWeight={"500"}
              fontSize={responsive("sm", "md", "lg")}
              w={"max-content"}
            >
              Last course
            </Text>
            <Flex align={"center"} w={"100%"} h={"100%"}>
              {lastCourse ? (
                <Flex
                  w={"100%"}
                  bgColor={"white"}
                  p={responsive(".5em", ".5em", "1em")}
                  borderRadius={"10px"}
                  gap={isMobile && ".5em"}
                  flexDir={isMobile ? "column" : "row"}
                  align={!isMobile && "center"}
                  justify={!isMobile && "space-between"}
                >
                  {isMobile ? (
                    <>
                      <Flex align={"center"} justify={"space-between"}>
                        <Text
                          fontWeight={"500"}
                          fontSize={responsive("sm", "sm", "md")}
                          opacity={0.9}
                        >
                          {lastCourse.title}
                        </Text>
                        <Text
                          textOverflow={"ellipsis"}
                          whiteSpace={"nowrap"}
                          overflow={"hidden"}
                          fontWeight={500}
                          maxW={responsive("8em", "10em", "12em")}
                          fontSize={responsive("sm", "sm", "md")}
                          opacity={0.9}
                        >
                          {lastCourse.description}
                        </Text>
                      </Flex>
                      <Flex align={"center"} justify={"flex-end"}>
                        <Button
                          size={isMobile ? "sm" : "md"}
                          s
                          as={Link}
                          to={`/enrollments/course/${lastCourse.slug}`}
                          variant={"outline"}
                          bgColor={"var(--secondary-color)"}
                          color={"white"}
                          fontSize={"sm"}
                          border={"1px solid var(--secondary-color)"}
                          _hover={{
                            bgColor: "white",
                            color: "var(--secondary-color)",
                          }}
                        >
                          view
                        </Button>
                      </Flex>
                    </>
                  ) : (
                    <>
                      <Text
                        fontWeight={"500"}
                        fontSize={responsive("sm", "sm", "md")}
                        opacity={0.9}
                      >
                        {lastCourse.title}
                      </Text>
                      <Text
                        textOverflow={"ellipsis"}
                        whiteSpace={"nowrap"}
                        overflow={"hidden"}
                        fontWeight={500}
                        maxW={responsive("8em", "10em", "12em")}
                        fontSize={responsive("sm", "sm", "md")}
                        opacity={0.9}
                      >
                        {lastCourse.description}
                      </Text>
                      <Button
                        size={isMobile ? "sm" : "md"}
                        as={Link}
                        to={`/enrollments/course/${lastCourse.slug}`}
                        variant={"outline"}
                        bgColor={"var(--secondary-color)"}
                        color={"white"}
                        fontSize={responsive("", "sm", "md")}
                        border={"1px solid var(--secondary-color)"}
                        _hover={{
                          bgColor: "white",
                          color: "var(--secondary-color)",
                        }}
                      >
                        view
                      </Button>
                    </>
                  )}
                </Flex>
              ) : (
                <Text
                  fontSize={responsive("sm", "sm", "md")}
                  fontWeight={500}
                  opacity={0.9}
                >
                  You are not enrolled in any course
                </Text>
              )}
            </Flex>
          </GridItem>
          {!isMobile && (
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
                <Text
                  fontWeight={"500"}
                  fontSize={responsive("sm", "md", "lg")}
                >
                  Your Comments
                </Text>
                <ButtonGroup>
                  {commentsEdit && (
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        setCommentsEdit(!commentsEdit);

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
                          flexDir="column"
                          gap="1em"
                        >
                          <Textarea
                            border={"2px dashed #cfcfcf"}
                            readOnly={!commentsEdit}
                            value={
                              updatedComment
                                ? updatedComment.text
                                : comment.text
                            }
                            _focus={{
                              boxShadow: "none",
                              border: "2px dashed #cfcfcf",
                            }}
                            onChange={(e) => {
                              const updatedCommentTextList = [
                                ...commentTextList,
                              ];
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
                            <Flex
                              align={"center"}
                              justify={"space-between"}
                              w={"100%"}
                            >
                              <Flex align={"center"} gap={"1em"}>
                                <Text
                                  textOverflow={"ellipsis"}
                                  whiteSpace={"nowrap"}
                                  overflow={"hidden"}
                                  fontWeight={500}
                                  maxW={responsive("", "10em", "12em")}
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
                              <Flex align={"center"} gap={"1em"}>
                                <Text
                                  minW={"max-content"}
                                  fontWeight="500"
                                  opacity={0.9}
                                  fontSize={responsive("", "sm", "md")}
                                >
                                  {getDate(comment.createdAt)}
                                </Text>
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
                                      style={{
                                        position: "relative",
                                        top: "2px",
                                      }}
                                    />
                                  </Button>
                                )}
                              </Flex>
                            </Flex>
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
                    You don't have any comment
                  </Text>
                )}
              </Flex>
            </GridItem>
          )}
          <GridItem
            rowSpan={isMobile ? 15 : 16}
            colSpan={2}
            display={"flex"}
            flexDir={"column"}
            maxH={responsive("33em", "35em", "37.5em")}
            gap={"1em"}
            p={"1em"}
            borderRadius={"10px"}
            pb={"1em"}
            bgColor={"var(--bg-color)"}
            border={"2px dashed var(--secondary-color)"}
          >
            <Text
              fontWeight={"500"}
              fontSize={responsive("sm", "md", "lg")}
              w={"max-content"}
            >
              Your Courses
            </Text>
            <Flex flexDir={"column"} gap={"1em"} overflow={"auto"}>
              {enrolledCourses.length > 0 &&
              !enrolledCourses.some((course) => course === null) ? (
                enrolledCourses.map((course, index) => (
                  <Flex
                    bgColor={"white"}
                    p={isMobile ? ".5em" : "1em"}
                    borderRadius={"10px"}
                    gap={isMobile && ".5em"}
                    key={index}
                    align={!isMobile && "center"}
                    flexDir={isMobile ? "column" : "row"}
                    justify={!isMobile && "space-between"}
                    transition={"all .3s ease"}
                  >
                    {isMobile ? (
                      <>
                        <Flex align={"center"} justify={"space-between"}>
                          <Text
                            fontWeight={"500"}
                            fontSize={"sm"}
                            opacity={0.9}
                          >
                            {course.title}
                          </Text>
                          <Text
                            textOverflow={"ellipsis"}
                            whiteSpace={"nowrap"}
                            overflow={"hidden"}
                            fontWeight={500}
                            maxW={"8em"}
                            fontSize={"sm"}
                            opacity={0.9}
                          >
                            {course.description}
                          </Text>
                        </Flex>
                        <Flex justify={"flex-end"}>
                          <ButtonGroup>
                            <Button
                              size={"sm"}
                              as={Link}
                              to={`/enrollments/course/${course.slug}`}
                              variant={"outline"}
                              bgColor={"var(--secondary-color)"}
                              color={"white"}
                              fontSize={"sm"}
                              border={"1px solid var(--secondary-color)"}
                              _hover={{
                                bgColor: "white",
                                color: "var(--secondary-color)",
                              }}
                            >
                              view
                            </Button>
                            <Button
                              size={"sm"}
                              onClick={() => handleUnenroll(course)}
                              variant={"outline"}
                              bgColor={"var(--accent-color)"}
                              color={"white"}
                              fontSize={"sm"}
                              border={"1px solid var(--accent-color)"}
                              _hover={{
                                bgColor: "white",
                                color: "var(--accent-color)",
                              }}
                            >
                              Unenroll
                            </Button>
                          </ButtonGroup>
                        </Flex>
                      </>
                    ) : (
                      <>
                        <Text
                          fontWeight={"500"}
                          fontSize={responsive("", "sm", "md")}
                          opacity={0.9}
                        >
                          {course.title}
                        </Text>
                        <Text
                          textOverflow={"ellipsis"}
                          whiteSpace={"nowrap"}
                          overflow={"hidden"}
                          fontWeight={500}
                          maxW={responsive("", "10em", "12em")}
                          fontSize={responsive("", "sm", "md")}
                          opacity={0.9}
                        >
                          {course.description}
                        </Text>
                        <ButtonGroup>
                          <Button
                            as={Link}
                            to={`/enrollments/course/${course.slug}`}
                            variant={"outline"}
                            bgColor={"var(--secondary-color)"}
                            color={"white"}
                            fontSize={responsive("", "sm", "md")}
                            border={"1px solid var(--secondary-color)"}
                            _hover={{
                              bgColor: "white",
                              color: "var(--secondary-color)",
                            }}
                          >
                            view
                          </Button>
                          <Button
                            onClick={() => handleUnenroll(course)}
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
                            Unenroll
                          </Button>
                        </ButtonGroup>
                      </>
                    )}
                  </Flex>
                ))
              ) : (
                <Text
                  fontSize={responsive("", "sm", "md")}
                  fontWeight={500}
                  opacity={0.9}
                >
                  You are not enrolled in any course
                </Text>
              )}
            </Flex>
          </GridItem>
          {isMobile && (
            <GridItem
              rowSpan={15}
              colSpan={2}
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
                <Text
                  fontWeight={"500"}
                  fontSize={responsive("sm", "md", "lg")}
                >
                  Your Comments
                </Text>
                <ButtonGroup>
                  {commentsEdit && (
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      onClick={() => {
                        setCommentsEdit(!commentsEdit);
                        commentsDeleteFunc();
                        handleCommentsSubmit();
                      }}
                      bgColor={"var(--secondary-color)"}
                      type={"submit"}
                      color={"white"}
                      fontSize={responsive("sm", "sm", "md")}
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
                    size={"sm"}
                    variant={"outline"}
                    onClick={() => {
                      setCommentsEdit(!commentsEdit);
                      setCommentDeleteList([]);
                      updatedCommentTextListFunc();
                    }}
                    bgColor={"var(--accent-color)"}
                    color={"white"}
                    fontSize={responsive("sm", "sm", "md")}
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
                mt={responsive(".5em", ".5em", ".5em")}
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
                          p={responsive(".5em", ".5em", "1em")}
                          borderRadius="10px"
                          justify="space-between"
                          flexDir="column"
                          gap="1em"
                        >
                          <Textarea
                            border={"2px dashed #cfcfcf"}
                            readOnly={!commentsEdit}
                            fontSize={"sm"}
                            value={
                              updatedComment
                                ? updatedComment.text
                                : comment.text
                            }
                            _focus={{
                              boxShadow: "none",
                              border: "2px dashed #cfcfcf",
                            }}
                            onChange={(e) => {
                              const updatedCommentTextList = [
                                ...commentTextList,
                              ];
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
                            <Flex
                              align={"center"}
                              justify={"space-between"}
                              w={"100%"}
                            >
                              <Flex align={"center"} gap={"1em"}>
                                <Text
                                  textOverflow={"ellipsis"}
                                  whiteSpace={"nowrap"}
                                  overflow={"hidden"}
                                  fontWeight={500}
                                  maxW={"6em"}
                                  fontSize={"sm"}
                                  opacity={0.9}
                                >
                                  {comment.lesson?.title}
                                </Text>
                                <Flex
                                  fontSize={"sm"}
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
                              <Flex align={"center"} gap={"1em"}>
                                <Text
                                  minW={"max-content"}
                                  fontWeight="500"
                                  opacity={0.9}
                                  fontSize={"sm"}
                                >
                                  {getDate(comment.createdAt)}
                                </Text>
                                {commentsEdit && (
                                  <Button
                                    size={"sm"}
                                    variant="outline"
                                    p=".5em"
                                    minH="max-content"
                                    minW="max-content"
                                    onClick={() =>
                                      handleCommentButtonClick(index, comment)
                                    }
                                    fontSize={"sm"}
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
                                      style={{
                                        position: "relative",
                                        top: "2px",
                                      }}
                                    />
                                  </Button>
                                )}
                              </Flex>
                            </Flex>
                          </Flex>
                        </Flex>
                      )
                    );
                  })
                ) : (
                  <Text
                    fontSize={responsive("sm", "sm", "md")}
                    fontWeight={"500"}
                    opacity={"0.9"}
                  >
                    You don't have any comment
                  </Text>
                )}
              </Flex>
            </GridItem>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default Enrollments;
