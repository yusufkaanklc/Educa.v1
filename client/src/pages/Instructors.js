import {
  Box,
  Stack,
  Text,
  Heading,
  Flex,
  Card,
  CardBody,
  Image,
} from "@chakra-ui/react";
const Instructors = () => {
  return (
    <Box bgColor={"var(--bg-color)"} mx={"10em"} py={"4em"} id="instructors">
      <Stack textAlign={"center"} mx={"25%"} gap={"1em"}>
        <Heading
          fontSize={"2xl"}
          fontWeight={"400"}
          color={"var(--secondary-color)"}
        >
          Our Instructors
        </Heading>
        <Heading fontSize={"4xl"} fontWeight={"bold"}>
          Meet Our Expert Instructors
        </Heading>
        <Text opacity={"0.9"} fontSize={"sm"}>
          Egestas faucibus nisl et ultricies. Tempus lectus condimentum
          tristique mauris id vitae. Id pulvinar a eget vitae pellentesque
          ridiculus platea. Vulputate cursus.
        </Text>
      </Stack>
      <Flex gap={"2em"} justify={"center"} flexWrap={"wrap"} mt={"4em"}>
        <Card maxW="sm">
          <Flex flexDir={"column"} justify={"space-between"} h={"100%"}>
            <CardBody>
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
              />
              <Stack mt={"1em"} gap={"0.5em"} pl={"0.5em"}>
                <Text fontSize={"sm"} opacity={0.9}>
                  Expert in Full-Stack Development
                </Text>
                <Flex align={"center"} gap={"0.5em"}>
                  <Heading fontSize={"xl"}>John Doe</Heading>
                  <i
                    class="fi fi-rr-hexagon-check"
                    style={{
                      color: "var(--secondary-color)",
                      fontSize: "20px",
                    }}
                  ></i>
                </Flex>
              </Stack>
            </CardBody>
          </Flex>
        </Card>
      </Flex>
    </Box>
  );
};

export default Instructors;
