import {
  Box,
  Heading,
  Text,
  Center,
  Stack,
  Link as ChakraLink,
  Card,
  CardBody,
  Skeleton,
  Image,
  Avatar,
  Flex,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { StarIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import dataContext from "../../utils/contextApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const Courses = () => {
  const { courses, isMobile, isLaptop, apiUrl } = useContext(dataContext);
  const [popularCourses, setPopularCourses] = useState([]);
  const responsive = (mobile, laptop, desktop) => {
    if (isMobile) {
      return mobile;
    } else if (isLaptop) {
      return laptop;
    } else {
      return desktop;
    }
  };

  useEffect(() => {
    setPopularCourses(courses.slice(0, 6));
  }, [courses]);

  return (
    <Box
      border={"2px dashed #cfcfcf"}
      mx={responsive("1em", "8em", "10em")}
      mt={isMobile && "2em"}
      mb={responsive("2em", "6em", "8em")}
      bgColor={"var(--bg-color)"}
      py={responsive("2em", "3em", "4em")}
      px={isMobile && "1em"}
      borderRadius={"10px"}
      id="courses"
    >
      <Center mb={isMobile && "1em"}>
        <Stack
          textAlign={"center"}
          gap={responsive(".5em", ".75em", "1em")}
          maxW={isMobile ? "100%" : "2xl"}
        >
          <Heading
            fontSize={responsive("lg", "xl", "2xl")}
            fontWeight={"500"}
            color={"var(--secondary-color)"}
          >
            Featured Courses
          </Heading>
          <Heading fontSize={responsive("2xl", "3xl", "4xl")}>
            Browse Our Popular Courses
          </Heading>
          <Text opacity={0.9} fontSize={responsive("sm", "sm", "md")}>
            Discover an array of our highly sought-after courses that cater to
            various interests and skill levels, designed to empower and enrich
            your learning journey.
          </Text>
        </Stack>
      </Center>
      {isMobile ? (
        popularCourses.length > 0 && (
          <Swiper
            centeredSlides={true}
            slidesPerView={"auto"} // "1" yerine "auto" kullanabilirsiniz, eğer her slide'ın kendi genişliğine sahip olmasını isterseniz.
            rebuildOnUpdate="true"
            shouldSwiperUpdate
            observer="true"
            navigation
            modules={[Navigation]}
          >
            {popularCourses.map((course, idx) => (
              <SwiperSlide key={idx}>
                <ChakraLink
                  as={Link}
                  to={`/courses/course/${course.slug}`}
                  key={idx}
                  border={"2px solid transparent"}
                  borderRadius={"10px"}
                  _hover={{
                    textDecoration: "none",
                    borderRadius: "10px",
                    border: "2px dashed #cfcfcf",
                  }}
                >
                  <Card maxW={responsive("100%", "xs", "sm")} h={"100%"}>
                    <CardBody h={"100%"}>
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
                              <Image src={apiUrl + course.imageUrl} />
                            </Center>
                          ) : (
                            <Skeleton
                              h={responsive("7em", "9em", "11em")}
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
                                {course.point ? Math.round(course.point) : 0}
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
                            {course.description.length > 100
                              ? course.description.substring(0, 100) + "..."
                              : course.description}
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
        )
      ) : (
        <>
          <Flex
            gap={responsive("1em", "1em", "2em")}
            justify={"center"}
            flexWrap={"wrap"}
            mt={responsive("", "3em", "4em")}
          >
            {popularCourses.length > 0 ? (
              popularCourses.map((course, index) => (
                <ChakraLink
                  as={Link}
                  to={`/courses/course/${course.slug}`}
                  key={index}
                  border={"2px solid transparent"}
                  borderRadius={"10px"}
                  _hover={{
                    textDecoration: "none",
                    borderRadius: "10px",
                    border: "2px dashed #cfcfcf",
                  }}
                >
                  <Card maxW={responsive("", "xs", "sm")} h={"100%"}>
                    <CardBody h={"100%"}>
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
                              <Image src={apiUrl + course.imageUrl} />
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
                                {course.point ? Math.round(course.point) : 0}
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
                            {course.description.length > 100
                              ? course.description.substring(0, 100) + "..."
                              : course.description}
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

      <Center pt={responsive("2em", "3em", "4em")}>
        <ChakraLink
          as={Link}
          to="/all-courses"
          fontSize={responsive("xs", "sm", "md")}
          color={"white"}
          padding={".8em 1.5em"}
          bgColor={"#FFD05A"}
          border={"1px solid transparent"}
          borderRadius={"30px"}
          fontWeight={"500"}
          transition={"all 0.5s ease"}
          _hover={{
            textDecoration: "none",
            opacity: 1,
            color: "black",
            bgColor: "transparent",
            border: "1px solid #FFD05A",
            transition: "all 0.5s ease",
          }}
        >
          Explore All Course
        </ChakraLink>
      </Center>
    </Box>
  );
};

export default Courses;
