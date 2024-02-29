import { useContext } from "react";
import dataContext from "../utils/contextApi";
import {
  Flex,
  Grid,
  GridItem,
  Heading,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
const CourseCreate = () => {
  const { isMobile, isLaptop, setTargetScroll } = useContext(dataContext);
  const responsive = (mobile, laptop, desktop) => {
    if (isMobile) {
      return mobile;
    } else if (isLaptop) {
      return laptop;
    } else {
      return desktop;
    }
  };
  return (
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
        <BreadcrumbItem>
          <BreadcrumbLink
            as={Link}
            to="/create-course"
            onClick={() => setTargetScroll("")}
            fontWeight={500}
            opacity={0.9}
          >
            Create Course
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Box mt={responsive("", "1em", "1.5em")}>
        <Heading
          fontWeight={"600"}
          fontSize={responsive("", "2xl", "3xl")}
          color={"var(--secondary-color)"}
        >
          Create Course
        </Heading>
      </Box>
      <Grid
        mt={responsive("", "2em", "3em")}
        templateRows="repeat(auto-fill, minmax(1em, auto))"
        templateColumns={responsive("1fr", "repeat(3, 1fr)", "repeat(3, 1fr)")}
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
          bgColor={"var(--bg-color)"}
          border={"2px dashed var(--secondary-color)"}
        ></GridItem>
        <GridItem colSpan={1} rowSpan={2}>
          <ChakraLink
            display={"flex"}
            fontSize={responsive("", "md", "lg")}
            fontWeight={"500"}
            borderRadius={"10px"}
            as={Link}
            justifyContent={"center"}
            alignItems={"center"}
            to="/create-lesson"
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
            Create Lesson
          </ChakraLink>
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
        ></GridItem>
      </Grid>
    </Box>
  );
};
export default CourseCreate;
