import { Box, Flex, Text, Stack, Heading, Center } from "@chakra-ui/react";
const About = () => {
  return (
    <Box mx={"10em"} h={"100vh"} id="about">
      <Flex
        bgColor={"var(--primary-color)"}
        align={"center"}
        justify={"space-around"}
        p={"3em 5em"}
        borderRadius={"10px"}
      >
        <Stack color={"white"} textAlign={"center"}>
          <Text fontSize={"6xl"} fontWeight={"600"}>
            34K +
          </Text>
          <Text>Success Stories</Text>
        </Stack>
        <Box w={"4px"} h={"5em"} bgColor={"white"} opacity={0.2}></Box>
        <Stack color={"white"} textAlign={"center"}>
          <Text fontSize={"6xl"} fontWeight={"600"}>
            201 +
          </Text>
          <Text>Expert Instructor</Text>
        </Stack>
        <Box w={"4px"} h={"5em"} bgColor={"white"} opacity={0.2}></Box>
        <Stack color={"white"} textAlign={"center"}>
          <Text fontSize={"6xl"} fontWeight={"600"}>
            54K +
          </Text>
          <Text>Online Courses</Text>
        </Stack>
        <Box w={"4px"} h={"5em"} bgColor={"white"} opacity={0.2}></Box>
        <Stack color={"white"} textAlign={"center"}>
          <Text fontSize={"6xl"} fontWeight={"600"}>
            80K +
          </Text>
          <Text>Worldwide Members</Text>
        </Stack>
      </Flex>
      <Flex w={"100%"} align={"center"} justify={"space-between"} mt={"3em"}>
        <Stack gap={"1.5em"} w={"50%"}>
          <Heading
            fontSize={"2xl"}
            color={"var(--secondary-color)"}
            fontWeight={"500"}
          >
            Who Are We
          </Heading>
          <Heading fontSize={"4xl"} fontWeight={"700"}>
            Your Online Learning Partner
          </Heading>
          <Text opacity={0.9} w={"80%"}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente
            obcaecati quos eius rem rerum. Totam velit architecto ex corrupti
            quia. Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Eligendi, mollitia!
          </Text>
        </Stack>
        <Box
          mt={"2em"}
          w={"45%"}
          bgColor={"var(--bg-color)"}
          p={"2em"}
          borderRadius={"10px"}
        >
          <Flex width={"100%"} justify={"space-between"} mb={"1em"}>
            <Text fontWeight={"600"}>Video Course</Text>
            <Text fontWeight={"600"}>(1/100)</Text>
          </Flex>
          <Flex
            align={"center"}
            justify={"space-between"}
            bgColor={"var(--primary-color)"}
            borderRadius={"5px"}
            p={".5em 1em"}
            mb={"1em"}
          >
            <Flex align={"center"} gap={"2em"}>
              <i
                class="fi fi-rr-play-circle"
                style={{
                  fontSize: "30px",
                  color: "white",
                  position: "relative",
                  top: "3px",
                }}
              ></i>
              <Text color={"white"}>Introduction</Text>
            </Flex>
            <Text color={"white"}>7:00</Text>
          </Flex>
          <Flex
            align={"center"}
            justify={"space-between"}
            bgColor={"white"}
            borderRadius={"5px"}
            p={".5em 1em"}
            mb={"1em"}
          >
            <Flex align={"center"} gap={"2em"}>
              <i
                class="fi fi-brands-node-js"
                style={{
                  fontSize: "30px",
                  color: "var(--primary-color)",
                  position: "relative",
                  top: "3px",
                }}
              ></i>
              <Text color={"black"}>Node.js</Text>
            </Flex>
            <Text color={"black"}>7:00</Text>
          </Flex>
        </Box>
      </Flex>
      <Flex
        align={"center"}
        justify={"space-between"}
        mt={"5em"}
        flexWrap={"wrap"}
      >
        <Box
          bgColor={"var(--bg-color)"}
          p={"2em"}
          borderRadius={"10px"}
          maxWidth={"400px"}
          w={"400px"}
        >
          <Center
            w={"50px"}
            h={"50px"}
            bgColor={"var(--primary-color)"}
            borderRadius={"5px"}
            mb={"1em"}
          >
            <i
              class="fi fi-rr-book-alt"
              style={{
                fontSize: "20px",
                position: "relative",
                top: "2px",
                color: "white",
              }}
            ></i>
          </Center>
          <Stack>
            <Heading fontSize={"2xl"}>Online Courses</Heading>
            <Text fontSize={"sm"}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Architecto, atque. Lorem ipsum dolor sit amet.
            </Text>
          </Stack>
        </Box>
        <Box
          bgColor={"var(--bg-color)"}
          p={"2em"}
          borderRadius={"10px"}
          maxWidth={"400px"}
          w={"400px"}
        >
          <Center
            w={"50px"}
            h={"50px"}
            bgColor={"var(--secondary-color)"}
            borderRadius={"5px"}
            mb={"1em"}
          >
            <i
              class="fi fi-rr-upload"
              style={{
                fontSize: "20px",
                position: "relative",
                top: "2px",
                color: "white",
              }}
            ></i>
          </Center>
          <Stack>
            <Heading fontSize={"2xl"}>Upgrade Skills</Heading>
            <Text fontSize={"sm"}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Architecto Lorem ipsum dolor sit amet.
            </Text>
          </Stack>
        </Box>
        <Box
          bgColor={"var(--bg-color)"}
          p={"2em"}
          borderRadius={"10px"}
          maxWidth={"400px"}
          w={"400px"}
        >
          <Center
            w={"50px"}
            h={"50px"}
            bgColor={"var(--accent-color)"}
            borderRadius={"5px"}
            mb={"1em"}
          >
            <i
              class="fi fi-rr-badge"
              style={{
                fontSize: "23px",
                position: "relative",
                top: "2px",
                color: "white",
              }}
            ></i>
          </Center>
          <Stack>
            <Heading fontSize={"2xl"}>Certification</Heading>
            <Text fontSize={"sm"}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem
              ipsum dolor sit amet. Architecto
            </Text>
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
};

export default About;
