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
  Skeleton,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import dataContext from "../../utils/contextApi";
const Instructors = () => {
  const { isMobile, isLaptop, teachers, apiUrl } = useContext(dataContext);
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
        {instructors.length > 0 ? (
          instructors.map((instructor, index) => (
            <Card maxW={responsive("", "xs", "sm")} key={index}>
              <CardBody>
                <Flex flexDir={"column"} justify={"space-between"} h={"100%"}>
                  <Box pos={"relative"}>
                    {instructor.image ? (
                      <Box overflow={"hidden"} borderRadius={"lg"}>
                        <Image
                          src={
                            instructor.image
                              ? instructor.image
                              : apiUrl + instructor.image
                          }
                          w={responsive("", "18em", "22em")}
                          h={responsive("", "10.3em", "14em")}
                          aspectRatio={"1 / 1"}
                          objectFit={"cover"}
                          alt={instructor.name}
                          borderRadius={0}
                        />
                      </Box>
                    ) : (
                      <Skeleton
                        borderRadius={"lg"}
                        h={responsive("", "11em", "14em")}
                        w={responsive("", "18em", "22em")}
                      ></Skeleton>
                    )}
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
                </Flex>
              </CardBody>
            </Card>
          ))
        ) : (
          <>
            <Skeleton
              h={responsive("", "17em", "20em")}
              w={responsive("", "xs", "sm")}
              borderRadius={"10px"}
            />
            <Skeleton
              h={responsive("", "17em", "20em")}
              w={responsive("", "xs", "sm")}
              borderRadius={"10px"}
            />
            <Skeleton
              h={responsive("", "17em", "20em")}
              w={responsive("", "xs", "sm")}
              borderRadius={"10px"}
            />
          </>
        )}
      </Flex>

      <Center pt={"3em"}>
        <ChakraLink
          as={Link}
          to="/insturctors"
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
