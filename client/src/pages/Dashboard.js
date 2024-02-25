import {
  Grid,
  GridItem,
  Box,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Skeleton,
  Text,
  Heading,
  Button,
  Avatar,
  Image,
  Center,
} from "@chakra-ui/react";
import { ChevronRightIcon, StarIcon } from "@chakra-ui/icons";
import { useContext, useEffect, useState } from "react";
import dataContext from "../utils/contextApi";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { isMobile, isLaptop, setTargetScroll, courses, account } =
    useContext(dataContext);
  const [ownedCourses, setOwnedCourses] = useState([]);

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
    setOwnedCourses(
      courses.filter((course) => course?.ownership === account?.username)
    );
  }, [courses]);

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
            Welcome Kaan
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
              fontSize={responsive("", "md", "lg")}
              w={"max-content"}
            >
              Your Courses
            </Text>
            <Box mt={responsive("", ".5em", ".5em")}>
              {ownedCourses && ownedCourses.length > 0
                ? ownedCourses.map((course, index) => (
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

                      <Flex fontWeight={"500"} align={"center"} gap={"1em"}>
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
                          <Text>{course.comments.length}</Text>
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
                        variant={"outline"}
                        bgColor={"var(--accent-color)"}
                        color={"white"}
                        border={"1px solid var(--accent-color)"}
                        _hover={{
                          bgColor: "var(--bg-color)",
                          color: "var(--accent-color)",
                        }}
                      >
                        View
                      </Button>
                    </Flex>
                  ))
                : ""}
            </Box>
          </GridItem>
          <GridItem colSpan={1} rowSpan={2} bgColor={"var(--bg-color)"}>
            <Center
              fontSize={responsive("", "md", "lg")}
              fontWeight={"500"}
              borderRadius={"10px"}
              border={"2px dashed var(--secondary-color)"}
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
          <GridItem
            colSpan={1}
            rowSpan={8}
            bgColor={"var(--bg-color)"}
            borderRadius={"10px"}
            p={responsive("", "1em", "1em")}
          ></GridItem>
        </Grid>
      </Box>
    </>
  );
};

export default Dashboard;
