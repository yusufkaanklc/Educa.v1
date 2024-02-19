import {
  Flex,
  Box,
  Center,
  Input,
  Button,
  FormControl,
  Select,
  Link as ChakraLink,
  FormLabel,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
const Signup = () => {
  // Kullanıcı bilgilerini tutacak state
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  // Kullanıcı bilgilerini handle edecek fonksiyon
  const handleInputChange = (e) =>
    setInput({ ...input, [e.target.name]: e.target.value });

  // useEffect ile tetikleyici ile kullanıcı bilgilerini ekrana yazdır
  useEffect(() => {
    console.log(input);
  }, [input]);

  return (
    <Center
      h={"100vh"}
      bgColor={"var(--bg-color)"}
      bgImg={"./image.png"}
      bgPos={"center"}
      position={"relative"}
    >
      <Box
        position={"absolute"}
        top={0}
        left={0}
        backdropFilter={"blur(5px)"}
        bgColor={"rgba(0,0,0,0.1)"}
        w={"100%"}
        h={"100%"}
        zIndex={"1"}
      ></Box>
      <Box position={"relative"} zIndex={2} w={"35%"}>
        <Box
          pos={"absolute"}
          top={"-4em"}
          right={"-4em"}
          zIndex={-1}
          w={"10em"}
          h={"10em"}
          bgColor={"var(--secondary-color)"}
        >
          <Flex></Flex>
        </Box>
        <Box
          bgColor={"var(--bg-color)"}
          p={"4em 5em"}
          pb={"3em"}
          borderRadius={"10px"}
          boxShadow={"0 0 50px 0 rgba(0,0,0,0.2)"}
          border={"2px dashed  #cfcfcf"}
        >
          <FormControl display={"flex"} flexDirection={"column"} gap={"1em"}>
            <Box>
              <FormLabel fontSize={"1.2em"}>Username</FormLabel>
              <Input
                h={"3em"}
                variant={"outline"}
                border={"1px solid rgba(0,0,0,0.2)"}
                type="text"
                name="username"
                value={input.username}
                onChange={handleInputChange}
                _hover={{ border: "1px solid rgba(0,0,0,0.2)" }}
                _focus={{ border: "1px solid var(--secondary-color)" }}
              />
            </Box>
            <Box>
              <FormLabel fontSize={"1.2em"}>Email</FormLabel>
              <Input
                h={"3em"}
                variant={"outline"}
                border={"1px solid rgba(0,0,0,0.2)"}
                type="email"
                name="email"
                value={input.email}
                onChange={handleInputChange}
                _hover={{ border: "1px solid rgba(0,0,0,0.2)" }}
                _focus={{ border: "1px solid var(--secondary-color)" }}
              />
            </Box>
            <Box>
              <FormLabel fontSize={"1.2em"}>Password</FormLabel>
              <Input
                h={"3em"}
                variant={"outline"}
                border={"1px solid rgba(0,0,0,0.2)"}
                type="password"
                name="password"
                value={input.password}
                onChange={handleInputChange}
                _hover={{ border: "1px solid rgba(0,0,0,0.2)" }}
                _focus={{ border: "1px solid var(--secondary-color)" }}
              />
            </Box>
            <Box>
              <FormLabel fontSize={"1.2em"}>Account Type</FormLabel>
              <Select
                h={"3em"}
                variant={"outline"}
                border={"1px solid rgba(0,0,0,0.2)"}
                name="role"
                value={input.role}
                onChange={handleInputChange}
                _hover={{ border: "1px solid rgba(0,0,0,0.2)" }}
                _focus={{ border: "1px solid var(--secondary-color)" }}
              >
                <option>Student</option>
                <option>Teacher</option>
              </Select>
            </Box>
          </FormControl>
          <Flex flexDir={"column"} gap={"1em"} mt={"2em"}>
            <Button
              variant={"solid"}
              bgColor={"var(--secondary-color)"}
              w={"100%"}
              p={"1.3em"}
              fontSize={"1.2em"}
              border={"1px solid transparent"}
              color={"white"}
              _hover={{
                bgColor: "transparent",
                border: "1px solid var(--secondary-color)",
                color: "var(--secondary-color)",
              }}
            >
              Sign up
            </Button>
            <ChakraLink as={Link} to={"/login"} ml={"1em"}>
              {" "}
              Already have an account?
            </ChakraLink>
          </Flex>
        </Box>
        <Box
          pos={"absolute"}
          bottom={"-4em"}
          left={"-4em"}
          zIndex={-1}
          w={"10em"}
          h={"10em"}
          bgColor={"var(--secondary-color)"}
        >
          <Flex></Flex>
        </Box>
      </Box>
    </Center>
  );
};

export default Signup;
