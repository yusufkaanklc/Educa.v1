import { Box, Stack, Heading, Text, Flex, Center } from "@chakra-ui/react";
import dataContext from "../../utils/contextApi";
import { useContext } from "react";
const Contact = () => {
  const { isMobile, isLaptop } = useContext(dataContext);
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
      mx={responsive("1em", "8em", "10em")}
      my={responsive("2em", "6em", "8em")}
      id="events"
    >
      <Stack
        w={responsive("100%", "40%", "50%")}
        gap={responsive("1em", "1.2em", "1.5em")}
      >
        <Heading
          fontSize={responsive("lg", "xl", "2xl")}
          color={"var(--secondary-color)"}
          fontWeight={"400"}
        >
          How it's work
        </Heading>
        <Heading fontSize={responsive("2xl", "3xl", "4xl")} fontWeight={"700"}>
          Your Online Learning Journey Made Easy
        </Heading>
        <Text opacity={0.9} fontSize={responsive("xs", "xs", "sm")}>
          Egestas faucibus nisl et ultricies. Tempus lectus condimentum
          tristique mauris id vitae. Id pulvinar a eget vitae pellentesque
          ridiculus platea. Vulputate cursus.
        </Text>
      </Stack>
      <Flex
        mt={responsive("2em", "3em", "4em")}
        align={"center"}
        gap={"1em"}
        flexDir={isMobile ? "column" : "row"}
      >
        <Box>
          <Flex align={"center"} gap={"0.5em"}>
            <Center
              borderRadius={"full"}
              bgColor={"var(--primary-color)"}
              w={responsive("35px", "50px", "55px")}
              h={responsive("35px", "50px", "55px")}
            >
              <Text
                color={"white"}
                fontSize={responsive("15px", "25px", "30px")}
                fontWeight={"600"}
              >
                01
              </Text>
            </Center>
            {!isMobile && (
              <Box
                height={"2px"}
                border={"2px dashed var(--bg-color)"}
                borderBottom={"transparent"}
                borderLeft={"transparent"}
                borderRight={"transparent"}
                w={"80%"}
              ></Box>
            )}
          </Flex>
          <Stack
            mt={responsive("1em", "2em", "3em")}
            w={responsive("100%", "70%", "80%")}
          >
            <Heading fontSize={responsive("lg", "xl", "2xl")}>
              Choose Your Courses
            </Heading>
            <Text opacity={0.9} fontSize={responsive("xs", "xs", "sm")}>
              Egestas faucibus nisl et ultricies. Tempus lectus condimentum
              tristique.
            </Text>
          </Stack>
        </Box>
        {isMobile && (
          <Box
            height={"2px"}
            border={"2px dashed var(--bg-color)"}
            borderBottom={"transparent"}
            borderLeft={"transparent"}
            borderRight={"transparent"}
            w={isMobile && "100%"}
          ></Box>
        )}
        <Box>
          <Flex align={"center"} gap={"0.5em"}>
            <Center
              borderRadius={"full"}
              bgColor={"var(--primary-color)"}
              w={responsive("35px", "50px", "55px")}
              h={responsive("35px", "50px", "55px")}
            >
              <Text
                color={"white"}
                fontSize={responsive("15px", "25px", "30px")}
                fontWeight={"600"}
              >
                02
              </Text>
            </Center>
            {!isMobile && (
              <Box
                height={"2px"}
                border={"2px dashed var(--bg-color)"}
                borderBottom={"transparent"}
                borderLeft={"transparent"}
                borderRight={"transparent"}
                w={"80%"}
              ></Box>
            )}
          </Flex>
          <Stack
            mt={responsive("1em", "2em", "3em")}
            w={responsive("100%", "70%", "80%")}
          >
            <Heading fontSize={responsive("lg", "xl", "2xl")}>
              Sign Up and Pay
            </Heading>
            <Text opacity={0.9} fontSize={responsive("xs", "xs", "sm")}>
              Egestas faucibus nisl et ultricies. Tempus lectus condimentum
              tristique.
            </Text>
          </Stack>
        </Box>
        {isMobile && (
          <Box
            height={"2px"}
            border={"2px dashed var(--bg-color)"}
            borderBottom={"transparent"}
            borderLeft={"transparent"}
            borderRight={"transparent"}
            w={isMobile && "100%"}
          ></Box>
        )}
        <Box>
          <Flex align={"center"} gap={"0.5em"}>
            <Center
              borderRadius={"full"}
              bgColor={"var(--primary-color)"}
              w={responsive("35px", "50px", "55px")}
              h={responsive("35px", "50px", "55px")}
            >
              <Text
                color={"white"}
                fontSize={responsive("15px", "25px", "30px")}
                fontWeight={"600"}
              >
                03
              </Text>
            </Center>
            {!isMobile && (
              <Box
                height={"2px"}
                border={"2px dashed var(--bg-color)"}
                borderBottom={"transparent"}
                borderLeft={"transparent"}
                borderRight={"transparent"}
                w={isMobile ? "100%" : "80%"}
              ></Box>
            )}
          </Flex>
          <Stack
            mt={responsive("1em", "2em", "3em")}
            w={responsive("100%", "70%", "80%")}
          >
            <Heading fontSize={responsive("lg", "xl", "2xl")}>
              Learn and Engage
            </Heading>
            <Text opacity={0.9} fontSize={responsive("xs", "xs", "sm")}>
              Egestas faucibus nisl et ultricies. Tempus lectus condimentum
              tristique.
            </Text>
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
};

export default Contact;
