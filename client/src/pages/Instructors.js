import {
  Box,
  Stack,
  Text,
  Heading,
  Flex,
  Card,
  CardBody,
  Image,
  Center,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import dataContext from "../utils/contextApi";
const Instructors = () => {
  const { isMobile, isLaptop, teachers } = useContext(dataContext);
  const [instructors, setInstructors] = useState([]);

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
    setInstructors(teachers.slice(0, 3));
    console.log(teachers);
  }, [teachers]);

  return (
    <Box
      border={"2px dashed #cfcfcf"}
      borderRadius={"10px"}
      bgColor={"var(--bg-color)"}
      mx={responsive("", "8em", "10em")}
      py={"4em"}
      id="instructors"
    >
      <Stack textAlign={"center"} mx={"25%"} gap={"1em"}>
        <Heading
          fontSize={responsive("", "xl", "2xl")}
          fontWeight={"400"}
          color={"var(--secondary-color)"}
        >
          Our Instructors
        </Heading>
        <Heading fontSize={responsive("", "3xl", "4xl")} fontWeight={"bold"}>
          Meet Our Expert Instructors
        </Heading>
        <Text opacity={"0.9"} fontSize={responsive("", "sm", "md")}>
          Egestas faucibus nisl et ultricies. Tempus lectus condimentum
          tristique mauris id vitae. Id pulvinar a eget vitae pellentesque
          ridiculus platea. Vulputate cursus.
        </Text>
      </Stack>
      <Flex
        gap={"2em"}
        justify={"center"}
        flexWrap={"wrap"}
        mt={responsive("", "3em", "4em")}
      >
        {instructors &&
          instructors.map((instructor, index) => (
            <Card maxW={responsive("", "xs", "sm")} key={index}>
              <Flex flexDir={"column"} justify={"space-between"} h={"100%"}>
                <CardBody>
                  <Box pos={"relative"}>
                    <Image
                      src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                      alt="Green double couch with wooden legs"
                      borderRadius="lg"
                    />
                    <Center
                      position={"absolute"}
                      bottom={"1em"}
                      left={"1em"}
                      border={"1px solid var(--secondary-color)"}
                      color={"var(--secondary-color)"}
                      borderRadius={"5px"}
                      overflow={"hidden"}
                    >
                      <Box
                        pos={"absolute"}
                        top={0}
                        left={0}
                        w={"100%"}
                        h={"100%"}
                        opacity={0.8}
                        bgColor={"var(--bg-color)"}
                        zIndex={1}
                      ></Box>
                      <Flex
                        fontSize={responsive("", "xs", "sm")}
                        zIndex={2}
                        align={"center"}
                        gap={"0.5em"}
                        p={"3px 10px"}
                      >
                        <i
                          class="fi fi-rr-smile"
                          style={{ position: "relative", top: "1.5px" }}
                        ></i>
                        {(instructor.point / 5) * 100 + "% "}
                        positive feedback
                      </Flex>
                    </Center>
                  </Box>

                  <Stack mt={"1em"} gap={"0.5em"} pl={"0.5em"}>
                    <Text
                      fontSize={responsive("xxs", "xs", "sm")}
                      opacity={0.9}
                    >
                      {"Expert in " + instructor.profession}
                    </Text>
                    <Flex align={"center"} gap={"0.5em"}>
                      <Heading fontSize={responsive("md", "lg", "xl")}>
                        {instructor.username}
                      </Heading>
                      <i
                        class="fi fi-rr-hexagon-check"
                        style={{
                          color: "var(--secondary-color)",
                          fontSize: responsive("10px", "15px", "20px"),
                        }}
                      ></i>
                    </Flex>
                  </Stack>
                </CardBody>
              </Flex>
            </Card>
          ))}
      </Flex>
      <Center pt={"3em"}>
        <ChakraLink
          as={Link}
          to="/courses"
          fontSize={"md"}
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
          Become Instructors
        </ChakraLink>
      </Center>
    </Box>
  );
};

export default Instructors;
