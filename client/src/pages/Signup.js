import {
  Flex,
  Box,
  Center,
  Input,
  Button,
  FormControl,
  InputRightElement,
  Select,
  Link as ChakraLink,
  FormLabel,
  Tooltip,
  useToast,
  InputGroup,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import dataContext from "../utils/contextApi";
import { registerUser } from "../utils/data/UsersData";
import Cookies from "js-cookie";
const Signup = () => {
  const { isMobile, isLaptop } = useContext(dataContext);
  // Kullanıcı bilgilerini tutacak state
  const [register, setRegister] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const responsive = (mobile, laptop, desktop) => {
    if (isMobile) {
      return mobile;
    } else if (isLaptop) {
      return laptop;
    } else {
      return desktop;
    }
  };

  const [passwordShow, setPasswordShow] = useState(false);
  const handleClick = () => setPasswordShow(!passwordShow);

  // Kullanıcı bilgilerini handle edecek fonksiyon
  const handleregisterChange = (e) =>
    setRegister({ ...register, [e.target.name]: e.target.value });

  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser(register)
      .then(() => {
        setRegister({
          username: "",
          email: "",
          password: "",
          role: "",
        });

        toast({
          title: "Account created.",
          description: "We've created your account for you.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        navigate("/login");
      })
      .catch((error) => {
        if (Array.isArray(error)) {
          error.message.forEach((element) => {
            toast({
              title: "Error",
              description: element,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      });
  };

  useEffect(() => {
    if (Cookies.get("isLoggedIn")) {
      navigate("/");
    }
  }, []);

  return (
    <Center h={"100vh"} bgPos={"center"} position={"relative"}>
      <Box position={"relative"} zIndex={2} w={"35%"}>
        <Box
          pos={"absolute"}
          top={responsive("", "-3em", "-4em")}
          right={responsive("", "-3em", "-4em")}
          zIndex={-1}
          w={responsive("", "8em", "10em")}
          h={responsive("", "8em", "10em")}
          bgColor={"var(--secondary-color)"}
        ></Box>
        <Box
          bgColor={"white"}
          p={responsive("", "2em 3em", "4em 5em")}
          pb={responsive("", "2em", "3em")}
          borderRadius={"10px"}
          boxShadow={"0 0 50px 0 rgba(0,0,0,0.2)"}
          border={"2px dashed  #cfcfcf"}
        >
          <form onSubmit={handleSubmit}>
            <Flex flexDirection={"column"} gap={"1em"}>
              <FormControl isRequired>
                <FormLabel fontSize={responsive("", "1em", "1.2em")}>
                  Username
                </FormLabel>
                <Input
                  h={responsive("", "2.5em", "3em")}
                  variant={"outline"}
                  border={"1px solid rgba(0,0,0,0.2)"}
                  type="text"
                  name="username"
                  value={register.username}
                  onChange={handleregisterChange}
                  _hover={{ border: "1px solid rgba(0,0,0,0.2)" }}
                  _focus={{ border: "1px solid var(--secondary-color)" }}
                  _active={{ bgColor: "transparent" }}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize={responsive("", "1em", "1.2em")}>
                  Email
                </FormLabel>
                <Input
                  h={responsive("", "2.5em", "3em")}
                  variant={"outline"}
                  border={"1px solid rgba(0,0,0,0.2)"}
                  type="text"
                  name="email"
                  value={register.email}
                  onChange={handleregisterChange}
                  _hover={{ border: "1px solid rgba(0,0,0,0.2)" }}
                  _focus={{ border: "1px solid var(--secondary-color)" }}
                  _active={{ bgColor: "transparent" }}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize={responsive("", "1em", "1.2em")}>
                  <Tooltip
                    label="Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character."
                    placement="top"
                    bgColor={"var(--accent-color)"}
                    borderRadius={"5px"}
                    p={"0.5em"}
                    hasArrow
                  >
                    Password
                  </Tooltip>
                </FormLabel>
                <InputGroup display={"flex"} alignItems={"center"}>
                  <Input
                    h={responsive("", "2.5em", "3em")}
                    variant={"outline"}
                    border={"1px solid rgba(0,0,0,0.2)"}
                    type={passwordShow ? "text" : "password"}
                    name="password"
                    pr={"4.5rem"}
                    value={register.password}
                    onChange={handleregisterChange}
                    _hover={{ border: "1px solid rgba(0,0,0,0.2)" }}
                    _focus={{ border: "1px solid var(--secondary-color)" }}
                    _active={{ bgColor: "transparent" }}
                  />

                  <InputRightElement width="4.5rem" top={"unset"}>
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {passwordShow ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              {register.role === "Teacher" && (
                <FormControl isRequired>
                  <FormLabel fontSize={responsive("", "1em", "1.2em")}>
                    <Tooltip
                      label="Write your profession"
                      placement="top"
                      bgColor={"var(--accent-color)"}
                      borderRadius={"5px"}
                      p={"0.5em"}
                      hasArrow
                    >
                      Profession
                    </Tooltip>
                  </FormLabel>
                  <Input
                    h={responsive("", "2.5em", "3em")}
                    variant={"outline"}
                    border={"1px solid rgba(0,0,0,0.2)"}
                    name="profession"
                    value={register.profession}
                    onChange={handleregisterChange}
                    _hover={{ border: "1px solid rgba(0,0,0,0.2)" }}
                    _focus={{ border: "1px solid var(--secondary-color)" }}
                    _active={{ bgColor: "transparent" }}
                  />
                </FormControl>
              )}
              <FormControl>
                <FormLabel fontSize={responsive("", "1em", "1.2em")}>
                  Account Type
                </FormLabel>
                <Select
                  h={responsive("", "2.5em", "3em")}
                  variant={"outline"}
                  border={"1px solid rgba(0,0,0,0.2)"}
                  name="role"
                  value={register.role}
                  onChange={handleregisterChange}
                  _hover={{ border: "1px solid rgba(0,0,0,0.2)" }}
                  _focus={{ border: "1px solid var(--secondary-color)" }}
                  _active={{ bgColor: "transparent" }}
                  placeholder="Select account type"
                >
                  <option>Student</option>
                  <option>Teacher</option>
                </Select>
              </FormControl>
            </Flex>
            <Flex flexDir={"column"} gap={"1em"} mt={"2em"}>
              <Button
                variant={"solid"}
                type="submit"
                bgColor={"var(--secondary-color)"}
                w={"100%"}
                p={"1.3em"}
                fontSize={responsive("", "1em", "1.2em")}
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
          </form>
        </Box>
        <Box
          pos={"absolute"}
          bottom={responsive("", "-3em", "-4em")}
          left={responsive("", "-3em", "-4em")}
          zIndex={-1}
          w={responsive("", "8em", "10em")}
          h={responsive("", "8em", "10em")}
          bgColor={"var(--secondary-color)"}
        ></Box>
      </Box>
    </Center>
  );
};

export default Signup;
