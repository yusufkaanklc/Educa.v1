import {
  Box,
  Heading,
  Text,
  Center,
  Stack,
  ChakraLink as Link,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
  Flex,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
const Courses = () => {
  return (
    <Box
      mx={"10em"}
      mt={"3em"}
      bgColor={"var(--bg-color)"}
      pt={"4em"}
      px={"2em"}
      borderRadius={"10px"}
      id="courses"
    >
      <Center>
        <Stack textAlign={"center"} gap={"1em"} maxW={"2xl"} mb={"3em"}>
          <Heading
            fontSize={"2xl"}
            fontWeight={"500"}
            color={"var(--secondary-color)"}
          >
            Featured Courses
          </Heading>
          <Heading fontSize={"4xl"}>Browse Our Popular Courses</Heading>
          <Text opacity={0.9} fontSize={"md"}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus,
            minima! Lorem ipsum dolor sit amet.
          </Text>
        </Stack>
      </Center>
      <SimpleGrid spacing={5} templateColumns={"repeat(3, 1fr)"}>
        <Card maxW="sm">
          <CardBody>
            <Image
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              alt="Green double couch with wooden legs"
              borderRadius="lg"
            />
            <Flex
              my={"1em"}
              justify={"space-between"}
              align={"center"}
              fontSize={"sm"}
            >
              <Center
                p={"5px 10px"}
                border={"1px solid var(--secondary-color)"}
                borderRadius={"5px"}
                color={"var(--secondary-color)"}
              >
                Web Development
              </Center>
              <Flex align={"center"} gap={"0.5em"}>
                <Text fontSize={"sm"}>4.8</Text>
                <StarIcon
                  color={"var(--accent-color)"}
                  pos={"relative"}
                  bottom={"1px"}
                ></StarIcon>
              </Flex>
            </Flex>
            <Text>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Accusamus, iusto.
            </Text>
            <Flex
              mt={"1em"}
              justify={"space-between"}
              align={"center"}
              fontSize={"sm"}
            >
              <Flex gap={"0.5em"} align={"center"}>
                <i
                  class="fi fi-rr-book-alt"
                  style={{ position: "relative", top: "2px" }}
                ></i>
                <Text>12 Lesson</Text>
              </Flex>
              <Flex gap={"0.5em"} align={"center"}>
                <i
                  class="fi fi-rr-clock-three"
                  style={{ position: "relative", top: "2px" }}
                ></i>
                <Text>24 h 40 min</Text>
              </Flex>
            </Flex>
          </CardBody>

          <CardFooter></CardFooter>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default Courses;
