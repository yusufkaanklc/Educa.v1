import {
  Box,
  Heading,
  Center,
  Flex,
  Skeleton,
  Text,
  Link as ChakraLink,
  Card,
  CardBody,
  Image,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  InputGroup,
  Button,
  InputLeftElement,
  Input,
  Avatar,
} from "@chakra-ui/react";
import { StarIcon, ChevronRightIcon, Search2Icon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import dataContext from "../utils/contextApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useContext, useEffect, useState } from "react";
import { getCourses } from "../utils/data/CoursesData";

const AllCourses = () => {
  const {
    apiUrl,
    isLaptop,
    isMobile,
    setTargetScroll,
    courses,
    setCourses,
    setErrors,
    categories,
    errors,
  } = useContext(dataContext);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
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

  useEffect(() => {
    getCourses(search, category)
      .then((data) => {
        setCourses(data);
      })
      .catch((error) => {
        setErrors([...errors, error]);
      });
  }, [category, search]);

  return (
    <Box
      border={"2px dashed #cfcfcf"}
      borderRadius={"10px"}
      bgColor={"var(--bg-color)"}
      p={responsive("1em", "2em  1em ", "4em 1em")}
      mx={responsive("1em", "8em", "10em")}
      my={responsive("2em", "2em", "3em")}
    >
      <Heading
        fontSize={responsive("lg", "xl", "2xl")}
        fontWeight={"500"}
        color={"var(--secondary-color)"}
        mb={responsive("1em", "1em", "1em")}
      >
        All Courses
      </Heading>
      <Flex
        align={!isMobile && "center"}
        justify={!isMobile && "space-between"}
        flexDir={isMobile ? "column" : "row"}
        gap={isMobile && "2em"}
      >
        <Breadcrumb
          spacing="8px"
          fontSize={responsive("sm", "sm", "md")}
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
              onClick={() => handleClick("courses")}
            >
              Courses
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink
              fontWeight={500}
              opacity={0.9}
              as={Link}
              to={"/all-courses"}
            >
              All Courses
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Flex w={"max-content"} align={"center"} gap={"1em"}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Search2Icon
                opacity={0.7}
                fontSize={responsive("sm", "sm", "md")}
              />
            </InputLeftElement>
            <Input
              type="text"
              fontSize={responsive("sm", "sm", "md")}
              value={search}
              placeholder="Search Course"
              _focus={{ border: "2px solid #cfcfcf", boxShadow: "none" }}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Flex>
      </Flex>

      {isMobile ? (
        <Swiper
          loop={true}
          slidesPerView={"1"} // "1" yerine "auto" kullanabilirsiniz, eğer her slide'ın kendi genişliğine sahip olmasını isterseniz.
          navigation
          spaceBetween={20}
          modules={[Navigation]}
        >
          {courses.length > 0 &&
            courses.map((course, idx) => (
              <SwiperSlide key={idx}>
                <ChakraLink
                  as={Link}
                  to={`/all-courses/course/${course.slug}`}
                  border={"2px solid transparent"}
                  borderRadius={"10px"}
                  _hover={{
                    textDecoration: "none",
                    borderRadius: "10px",
                    border: !isMobile && "2px dashed #cfcfcf",
                  }}
                >
                  <Card
                    maxW={responsive("xs", "xs", "sm")}
                    display={"flex"}
                    h={"100%"}
                  >
                    <CardBody>
                      <Flex
                        flexDir={"column"}
                        justify={"space-between"}
                        h={"100%"}
                      >
                        <Box>
                          {course.imageUrl ? (
                            <Center
                              maxH={responsive("8em", "10em", "12em")}
                              overflow={"hidden"}
                              borderRadius="lg"
                            >
                              <Image
                                src={apiUrl + course.imageUrl}
                                borderRadius="lg"
                              />
                            </Center>
                          ) : (
                            <Skeleton
                              h={responsive("8em", "9em", "11em")}
                              w={responsive("3xs", "2xs", "xs")}
                              borderRadius={"10px"}
                            />
                          )}

                          <Flex
                            my={"1em"}
                            justify={"space-between"}
                            align={"center"}
                            fontSize={responsive("xs", "xs", "sm")}
                          >
                            <Center
                              p={responsive("2px 5px", "3px 7px", "5px 10px")}
                              border={"1px solid var(--secondary-color)"}
                              borderRadius={"5px"}
                              color={"var(--secondary-color)"}
                            >
                              {course.title}
                            </Center>
                            <Flex align={"center"} gap={"0.5em"}>
                              <Text fontSize={responsive("xs", "xs", "sm")}>
                                {course.point ? course.point : 0}
                              </Text>
                              <StarIcon
                                color={"var(--accent-color)"}
                                pos={"relative"}
                                bottom={"1px"}
                              ></StarIcon>
                              <Text>({course.commentCount})</Text>
                            </Flex>
                          </Flex>
                          <Text fontSize={responsive("sm", "sm", "md")}>
                            {course.description.substring(0, 100 - 3) + "..."}
                          </Text>
                        </Box>
                        <Box>
                          <Flex
                            mt={responsive(".5em", ".5em", "1em")}
                            justify={"space-between"}
                            align={"center"}
                            fontSize={responsive("xs", "xs", "sm")}
                          >
                            <Flex gap={"0.5em"} align={"center"}>
                              <i
                                class="fi fi-rr-book-alt"
                                style={{ position: "relative", top: "2px" }}
                              ></i>
                              <Text>{course.lessons.length + " lessons"}</Text>
                            </Flex>
                            <Flex gap={"0.5em"} align={"center"}>
                              <i
                                class="fi fi-rr-clock-three"
                                style={{ position: "relative", top: "2px" }}
                              ></i>
                              <Text>
                                {" "}
                                {course.duration
                                  ? course.duration < 60
                                    ? course.duration + " sec"
                                    : Math.floor(course.duration / 60) +
                                      " min " +
                                      (course.duration % 60) +
                                      " sec"
                                  : "0 min"}
                              </Text>
                            </Flex>
                          </Flex>
                          <Flex
                            align={"center"}
                            mt={"1em"}
                            justify={"space-between"}
                          >
                            <Flex align={"center"} gap={"0.5em"}>
                              <Avatar
                                size={responsive("xs", "xs", "sm")}
                                src={apiUrl + course.ownerImage}
                              ></Avatar>
                              <Text
                                fontWeight={"600"}
                                w={"max-content"}
                                fontSize={responsive("sm", "sm", "md")}
                              >
                                {course.ownerName}
                              </Text>
                            </Flex>
                            <Text
                              fontWeight={600}
                              fontSize={responsive("sm", "sm", "md")}
                              color={"var(--primary-color)"}
                            >
                              {"$" + course.price}
                            </Text>
                          </Flex>
                        </Box>
                      </Flex>
                    </CardBody>
                  </Card>
                </ChakraLink>
              </SwiperSlide>
            ))}
        </Swiper>
      ) : (
        <>
          <Flex
            gap={responsive("1em", "1em", "2em")}
            justify={"center"}
            flexWrap={"wrap"}
            mt={responsive("2em", "3em", "4em")}
          >
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <ChakraLink
                  as={Link}
                  to={`/all-courses/course/${course.slug}`}
                  key={index}
                  border={"2px solid transparent"}
                  borderRadius={"10px"}
                  _hover={{
                    textDecoration: "none",
                    borderRadius: "10px",
                    border: "2px dashed #cfcfcf",
                  }}
                >
                  <Card
                    maxW={responsive("", "xs", "sm")}
                    display={"flex"}
                    h={"100%"}
                  >
                    <CardBody>
                      <Flex
                        flexDir={"column"}
                        justify={"space-between"}
                        h={"100%"}
                      >
                        <Box>
                          {course.imageUrl ? (
                            <Center
                              maxH={responsive("", "10em", "12em")}
                              overflow={"hidden"}
                              borderRadius="lg"
                            >
                              <Image
                                src={apiUrl + course.imageUrl}
                                borderRadius="lg"
                              />
                            </Center>
                          ) : (
                            <Skeleton
                              h={responsive("", "9em", "11em")}
                              w={responsive("", "2xs", "xs")}
                              borderRadius={"10px"}
                            />
                          )}

                          <Flex
                            my={"1em"}
                            justify={"space-between"}
                            align={"center"}
                            fontSize={responsive("xxs", "xs", "sm")}
                          >
                            <Center
                              p={responsive(
                                "",
                                "2px 5px",
                                "3px 7px",
                                "5px 10px"
                              )}
                              border={"1px solid var(--secondary-color)"}
                              borderRadius={"5px"}
                              color={"var(--secondary-color)"}
                            >
                              {course.title}
                            </Center>
                            <Flex align={"center"} gap={"0.5em"}>
                              <Text fontSize={responsive("xxs", "xs", "sm")}>
                                {course.point ? course.point : 0}
                              </Text>
                              <StarIcon
                                color={"var(--accent-color)"}
                                pos={"relative"}
                                bottom={"1px"}
                              ></StarIcon>
                              <Text>({course.commentCount})</Text>
                            </Flex>
                          </Flex>
                          <Text fontSize={responsive("", "sm", "md")}>
                            {course.description.substring(0, 100 - 3) + "..."}
                          </Text>
                        </Box>
                        <Box>
                          <Flex
                            mt={responsive("", ".5em", "1em")}
                            justify={"space-between"}
                            align={"center"}
                            fontSize={responsive("xxs", "xs", "sm")}
                          >
                            <Flex gap={"0.5em"} align={"center"}>
                              <i
                                class="fi fi-rr-book-alt"
                                style={{ position: "relative", top: "2px" }}
                              ></i>
                              <Text>{course.lessons.length + " lessons"}</Text>
                            </Flex>
                            <Flex gap={"0.5em"} align={"center"}>
                              <i
                                class="fi fi-rr-clock-three"
                                style={{ position: "relative", top: "2px" }}
                              ></i>
                              <Text>
                                {" "}
                                {course.duration
                                  ? course.duration < 60
                                    ? course.duration + " sec"
                                    : Math.floor(course.duration / 60) +
                                      " min " +
                                      (course.duration % 60) +
                                      " sec"
                                  : "0 min"}
                              </Text>
                            </Flex>
                          </Flex>
                          <Flex
                            align={"center"}
                            mt={"1em"}
                            justify={"space-between"}
                          >
                            <Flex align={"center"} gap={"0.5em"}>
                              <Avatar
                                size={responsive("", "xs", "sm")}
                                src={apiUrl + course.ownerImage}
                              ></Avatar>
                              <Text
                                fontWeight={"600"}
                                w={"max-content"}
                                fontSize={responsive("", "sm", "md")}
                              >
                                {course.ownerName}
                              </Text>
                            </Flex>
                            <Text
                              fontWeight={600}
                              fontSize={responsive("", "sm", "md")}
                              color={"var(--primary-color)"}
                            >
                              {"$" + course.price}
                            </Text>
                          </Flex>
                        </Box>
                      </Flex>
                    </CardBody>
                  </Card>
                </ChakraLink>
              ))
            ) : (
              <>
                <Skeleton
                  h={responsive("", "20em", "25em")}
                  w={responsive("", "xs", "sm")}
                  borderRadius={"10px"}
                />
                <Skeleton
                  h={responsive("", "20em", "25em")}
                  w={responsive("", "xs", "sm")}
                  borderRadius={"10px"}
                />
                <Skeleton
                  h={responsive("", "20em", "25em")}
                  w={responsive("", "xs", "sm")}
                  borderRadius={"10px"}
                />
              </>
            )}
          </Flex>
        </>
      )}
      <Box
        border={"2px dashed #cfcfcf"}
        borderLeft={0}
        borderRight={0}
        borderBottom={0}
        mx={responsive("1em", "5em", "7em")}
        my={"3em"}
      ></Box>
      <Box>
        <Text
          fontSize={responsive("sm", "sm", "md")}
          fontWeight={600}
          opacity={0.9}
          mb={"1em"}
        >
          Categories
        </Text>
        <Flex
          align={"center"}
          gap={responsive(".5em", "1em", "1em")}
          flexWrap={"wrap"}
        >
          {categories.length > 0 &&
            categories.map((category, index) => (
              <Button
                size={isMobile ? "sm" : "md"}
                key={index}
                bgColor={"var(--secondary-color)"}
                w={"max-content"}
                color={"white"}
                fontSize={responsive("xs", "sm", "md")}
                _hover={{ color: "var(--secondary-color)", bgColor: "white" }}
                onClick={() => setCategory(category.slug)}
              >
                {category.title}
              </Button>
            ))}
          <Button
            size={isMobile ? "sm" : "md"}
            bgColor={"var(--secondary-color)"}
            w={"max-content"}
            fontSize={responsive("xs", "sm", "md")}
            color={"white"}
            _hover={{ color: "var(--secondary-color)", bgColor: "white" }}
            onClick={() => setCategory("all")}
          >
            All
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default AllCourses;
