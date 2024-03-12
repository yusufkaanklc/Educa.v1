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
import { Link, useNavigate } from "react-router-dom";
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
const Enrollments = () => {
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
    apiUrl,
    isMobile,
    isLaptop,
    setErrors,
    errors,
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

  const data = {
    labels: ["Courses", "Lessons", "Enrollments", "Comments"],
    datasets: [
      {
        label: "Count",
        data: [
          //   ownedCourses.length,
          //   lessons.length,
          //   enrollments.length,
          //   comments.length,
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
              to="/enrollments"
            >
              Enrollments
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading
          mt={responsive("", "1em", "1.5em")}
          fontWeight={"600"}
          fontSize={responsive("", "2xl", "3xl")}
          color={"var(--secondary-color)"}
        >
          Welcome {account?.username}
        </Heading>
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
          </GridItem>
          <GridItem
            rowSpan={10}
            colSpan={1}
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
              Last course
            </Text>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};

export default Enrollments;
