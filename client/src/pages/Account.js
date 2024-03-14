import {
  Box,
  Flex,
  Avatar,
  Text,
  Heading,
  Center,
  Stack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useToast,
  Input,
  Button,
  Textarea,
  Skeleton,
  SkeletonCircle,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  ButtonGroup,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import dataContext from "../utils/contextApi";
import { deleteAccount, updateAccount } from "../utils/data/UsersData";
import Cookies from "js-cookie";
const Account = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isMobile,
    isLaptop,
    setTargetScroll,
    account,
    setAccount,
    setErrors,
    errors,
  } = useContext(dataContext);
  const [formattedDate, setFormattedDate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    currentPassword: "",
    profession: "",
    introduce: "",
    image: "",
  });

  const toast = useToast();

  const responsive = (mobile, laptop, desktop) => {
    if (isMobile) {
      return mobile;
    } else if (isLaptop) {
      return laptop;
    } else {
      return desktop;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    updateAccount(formData)
      .then((data) => {
        setIsLoading(false);
        setAccount(data);
        toast({
          title: "Success",
          description: "Your account has been updated",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setIsEditing(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeForImage = (e) => {
    const { name, files } = e.target;

    setFormData({ ...formData, [name]: files[0] });

    toast({
      title: "Success",
      description: "Your image has been uploaded!",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const navigate = useNavigate();
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      Cookies.remove("isLoggedIn");
      navigate("/");
      toast({
        title: "Success",
        description: "Your account has been deleted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Hesap silindiği için sayfayı yeniden yükle
      window.location.reload();
    } catch (error) {
      setErrors([...errors, error]);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (account) {
      setIsLoading(false);
    }
  }, [account]);

  useEffect(() => {
    const createdAt = account?.createdAt;

    if (createdAt) {
      const date = new Date(createdAt);
      setFormattedDate(
        `${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}`
      );
    }

    setFormData({
      username: account?.username,
      email: account?.email,
      profession: account?.profession,
      image: account?.image,
      introduce: account?.introduce,
      password: "",
      currentPassword: "",
    });
  }, [account]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mx={isMobile && "1em"}>
          <ModalHeader>
            Are you sure you want to delete the account?
          </ModalHeader>
          <ModalBody>
            <ButtonGroup gap={"1em"}>
              <Button
                size={isMobile ? "sm" : "md"}
                border={"1px solid transparent"}
                bgColor={"var(--secondary-color)"}
                fontSize={responsive("sm", "sm", "md")}
                onClick={() => handleDeleteAccount()}
                color={"white"}
                _hover={{
                  bgColor: "var(--bg-color)",
                  color: "var(--secondary-color)",
                  border: "1px solid var(--secondary-color)",
                }}
              >
                Yes
              </Button>
              <Button
                size={isMobile ? "sm" : "md"}
                border={"1px solid transparent"}
                bgColor={"var(--accent-color)"}
                fontSize={responsive("sm", "sm", "md")}
                onClick={() => onClose()}
                color={"white"}
                _hover={{
                  bgColor: "var(--bg-color)",
                  color: "var(--accent-color)",
                  border: "1px solid var(--accent-color)",
                }}
              >
                No
              </Button>
            </ButtonGroup>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Box
        h={"100vh"}
        pl={isMobile ? "1em" : "2em"}
        pt={isMobile ? "1em" : "2em"}
        pr={isMobile && "1em"}
      >
        <Box
          p={responsive(".5em", "1em", "1em 2em")}
          bgColor={isMobile ? "unset" : "var(--secondary-color)"}
          w={"max-content"}
        >
          <Heading
            color={isMobile ? "black" : "white"}
            fontSize={responsive("lg", "xl", "2xl")}
            fontWeight={"600"}
            mb={"1em"}
          >
            Account
          </Heading>
          <Breadcrumb
            color={isMobile ? "black" : "white"}
            spacing="8px"
            fontSize={responsive("sm", "sm", "md")}
            separator={
              <ChevronRightIcon color={isMobile ? "black" : "white"} />
            }
          >
            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                to="/"
                onClick={() => setTargetScroll("")}
                fontWeight={500}
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink fontWeight={500} as={Link} to={"/account"}>
                Account
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
        <Center h={isMobile ? "80%" : "70%"}>
          <Box
            bgColor={"white"}
            border={"2px dashed #cfcfcf"}
            position={"relative"}
            borderRadius={"10px"}
            p={responsive("1em", "1em ", "2em")}
            w={isMobile ? "100%" : "30%"}
            h={"max-content"}
            boxShadow={"0 0 50px 0 rgba(0,0,0,0.2)"}
          >
            {!isMobile && (
              <Box
                pos={"absolute"}
                top={responsive("", "-3em", "-4em")}
                right={responsive("", "-3em", "-4em")}
                zIndex={-1}
                w={responsive("", "8em", "10em")}
                h={responsive("", "8em", "10em")}
                bgColor={"var(--secondary-color)"}
              ></Box>
            )}
            <form onSubmit={handleSubmit}>
              <Flex flexDir={"column"} gap={"2em"}>
                <Box mt={responsive("1em", "2em", "3em")}>
                  <Flex align={"center"} gap={responsive("1em", "1em", "2em")}>
                    <FormControl position={"relative"} w={"max-content"}>
                      {isLoading || !account ? (
                        <SkeletonCircle
                          size={responsive("4em", "6em", "8em")}
                        />
                      ) : (
                        <Avatar
                          pos={"relative"}
                          name={account?.username}
                          src={account?.image}
                          size={responsive("lg", "xl", "2xl")}
                          color={"white"}
                          bgColor={"var(--accent-color)"}
                        />
                      )}
                      <FormLabel
                        htmlFor="image"
                        pos={"absolute"}
                        bottom={responsive("-.7em", "-.3em", "-.5em")}
                        right={responsive("-.7em", "-.3em", "-.5em")}
                        display={isEditing ? "block" : "none"}
                      >
                        <Center
                          bgColor={"white"}
                          borderRadius={"full"}
                          w={responsive("1em", "1em", "2em")}
                          h={responsive("1em", "1em", "2em")}
                        >
                          <i
                            className="fi fi-rr-camera"
                            style={{
                              position: "relative",
                              top: "2px",
                            }}
                          ></i>
                        </Center>
                      </FormLabel>
                      <Input
                        type="file"
                        accept="image/*"
                        display={"none"}
                        name={"image"}
                        id={"image"}
                        onChange={(e) => handleChangeForImage(e)}
                      />
                    </FormControl>

                    <Stack gap={isEditing ? "0" : ".5em"}>
                      {isEditing ? (
                        <>
                          <FormControl>
                            <Input
                              autoFocus
                              type={"text"}
                              value={formData.username}
                              name="username"
                              variant={"flushed"}
                              fontWeight={"600"}
                              fontFamily={"Montserrat, sans-serif;"}
                              fontSize={responsive("lg", "xl", "2xl")}
                              onChange={(e) => handleChange(e)}
                              _focus={{
                                borderColor: "#cdcdcd",
                                outline: 0,
                                boxShadow: "none",
                              }}
                            />
                          </FormControl>
                          <FormControl>
                            <Input
                              type={"text"}
                              value={formData.email}
                              name={"email"}
                              variant={"flushed"}
                              fontWeight={"600"}
                              fontFamily={"Montserrat, sans-serif;"}
                              fontSize={responsive("sm", "sm", "md")}
                              onChange={(e) => handleChange(e)}
                              _focus={{
                                borderColor: "#cdcdcd",
                                outline: 0,
                                boxShadow: "none",
                              }}
                            />
                          </FormControl>
                          {account && account.role === "teacher" && (
                            <FormControl>
                              <Input
                                type={"text"}
                                mt={responsive(".5em", ".5em", "1em")}
                                value={formData.profession}
                                name={"profession"}
                                variant={"outline"}
                                border={"1px solid var(--secondary-color)"}
                                fontFamily={"Poppins, sans-serif;"}
                                fontWeight={"300"}
                                fontSize={responsive("xs", "xs", "sm")}
                                color={"var(--secondary-color)"}
                                p={responsive("2px 5px", "3px 7px", "5px 10px")}
                                w={"max-content"}
                                h={"max-content"}
                                onChange={(e) => handleChange(e)}
                                _focus={{
                                  borderColor: "var(--secondary-color)",
                                  outline: 0,
                                  boxShadow: "none",
                                }}
                                _hover={{
                                  borderColor: "var(--secondary-color)",
                                }}
                              />
                            </FormControl>
                          )}
                        </>
                      ) : (
                        <>
                          {isLoading || !account ? (
                            <>
                              <Skeleton
                                h={responsive("1em", "1em", "1em")}
                                w={responsive("8em", "10em", "15em")}
                                borderRadius={"10px"}
                              />
                              <Skeleton
                                h={responsive("1em", "1em", "1em")}
                                w={responsive("8em", "10em", "15em")}
                                borderRadius={"10px"}
                              />
                              <Skeleton
                                h={responsive("1em", "1em", "1em")}
                                w={responsive("8em", "10em", "15em")}
                                borderRadius={"10px"}
                              />
                            </>
                          ) : (
                            <>
                              <Heading
                                fontWeight={"600"}
                                fontSize={responsive("lg", "xl", "2xl")}
                              >
                                {account?.username}
                              </Heading>
                              <Text
                                fontWeight={"500"}
                                fontSize={responsive("sm", "sm", "md")}
                              >
                                {account?.email}
                              </Text>
                              {account && account.role === "teacher" && (
                                <>
                                  <Center
                                    p={responsive(
                                      "2px 5px",
                                      "3px 7px",
                                      "5px 10px"
                                    )}
                                    border={"1px solid var(--secondary-color)"}
                                    borderRadius={"5px"}
                                    w={"max-content"}
                                    color={"var(--secondary-color)"}
                                    fontSize={responsive("xs", "xs", "sm")}
                                  >
                                    {account?.profession}
                                  </Center>
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                      <Flex
                        fontWeight={"500"}
                        fontSize={responsive("xs", "xs", "sm")}
                        gap={"1em"}
                        mt={responsive(".5em", ".5em", "1em")}
                      >
                        <Text>Joined on : </Text>
                        <Text opacity={0.9}>{formattedDate}</Text>
                      </Flex>
                    </Stack>
                  </Flex>
                </Box>
                <Box>
                  {isEditing && (
                    <>
                      <FormControl>
                        <Input
                          type={"text"}
                          placeholder="Enter current password"
                          name="currentPassword"
                          variant={"flushed"}
                          fontWeight={"600"}
                          fontFamily={"Montserrat, sans-serif;"}
                          fontSize={responsive("sm", "sm", "md")}
                          onChange={(e) => handleChange(e)}
                          _focus={{
                            borderColor: "#cdcdcd",
                            outline: 0,
                            boxShadow: "none",
                          }}
                        />
                      </FormControl>
                      <br />
                      <FormControl>
                        <Input
                          type={"text"}
                          placeholder="Enter new password"
                          name="password"
                          variant={"flushed"}
                          fontWeight={"600"}
                          fontFamily={"Montserrat, sans-serif;"}
                          fontSize={responsive("sm", "sm", "md")}
                          onChange={(e) => handleChange(e)}
                          _focus={{
                            borderColor: "#cdcdcd",
                            outline: 0,
                            boxShadow: "none",
                          }}
                        />
                      </FormControl>
                    </>
                  )}
                </Box>
                {account && account.role === "teacher" && (
                  <Box mt={responsive("1em", "1em", "1em")}>
                    <Text fontWeight={"600"}>Introduce</Text>
                    {isEditing ? (
                      <FormControl>
                        <Textarea
                          minH={responsive("5em", "7em", "9em")}
                          onChange={(e) => handleChange(e)}
                          value={formData.introduce}
                          name={"introduce"}
                          border={"2px dashed var(--secondary-color)"}
                          _focus={{
                            borderColor: "var(--secondary-color)",
                            boxShadow: "none",
                          }}
                        />
                      </FormControl>
                    ) : (
                      <Textarea
                        readOnly
                        _hover={{ borderColor: "var(--secondary-color)" }}
                        minH={responsive("5em", "7em", "9em")}
                        value={account?.introduce}
                        name={"introduce"}
                        border={"2px dashed var(--secondary-color)"}
                        _focus={{
                          borderColor: "var(--secondary-color)",
                          boxShadow: "none",
                        }}
                      />
                    )}
                  </Box>
                )}

                <Flex
                  justifyContent={"center"}
                  mt={responsive("1em", "1em", "2em")}
                >
                  {isEditing && (
                    <>
                      <Flex gap={"1em"}>
                        <Button
                          size={isMobile ? "sm" : "md"}
                          border={"1px solid transparent"}
                          bgColor={"var(--secondary-color)"}
                          type="submit"
                          fontSize={responsive("sm", "sm", "md")}
                          color={"white"}
                          _hover={{
                            bgColor: "var(--bg-color)",
                            color: "var(--secondary-color)",
                            border: "1px solid var(--secondary-color)",
                          }}
                        >
                          Save Changes
                        </Button>
                        <Button
                          size={isMobile ? "sm" : "md"}
                          type="submit"
                          border={"1px solid transparent"}
                          onClick={() => {
                            setIsEditing(!isEditing);
                            setIsLoading(false);
                            setFormData({
                              username: account.username,
                              email: account.email,
                              profession: account.profession,
                              introduce: account.introduce,
                              image: account.image,
                              password: "",
                              currentPassword: "",
                            });
                          }}
                          bgColor={"var(--accent-color)"}
                          fontSize={responsive("sm", "sm", "md")}
                          color={"white"}
                          _hover={{
                            bgColor: "var(--bg-color)",
                            color: "var(--accent-color)",
                            border: "1px solid var(--accent-color)",
                          }}
                        >
                          Reset Changes
                        </Button>
                      </Flex>
                    </>
                  )}
                  {!isEditing && (
                    <>
                      {isLoading || !account ? (
                        <Skeleton
                          h={responsive("1em", "1.5em", "2em")}
                          w={responsive("6em", "10em", "16em")}
                          borderRadius={"5px"}
                        />
                      ) : (
                        <Flex
                          align={"center"}
                          justify={"space-between"}
                          w={"100%"}
                        >
                          <Button
                            border={"1px solid transparent"}
                            bgColor={"var(--secondary-color)"}
                            fontSize={responsive("sm", "sm", "md")}
                            onClick={() => setIsEditing(!isEditing)}
                            color={"white"}
                            _hover={{
                              bgColor: "var(--bg-color)",
                              color: "var(--secondary-color)",
                              border: "1px solid var(--secondary-color)",
                            }}
                          >
                            Edit Account
                          </Button>
                          <Button
                            border={"1px solid transparent"}
                            bgColor={"var(--accent-color)"}
                            fontSize={responsive("sm", "sm", "md")}
                            onClick={() => onOpen()}
                            color={"white"}
                            _hover={{
                              bgColor: "var(--bg-color)",
                              color: "var(--accent-color)",
                              border: "1px solid var(--accent-color)",
                            }}
                          >
                            Delete Account
                          </Button>
                        </Flex>
                      )}
                    </>
                  )}
                </Flex>
              </Flex>
            </form>
            {!isMobile && (
              <Box
                pos={"absolute"}
                bottom={responsive("", "-3em", "-4em")}
                left={responsive("", "-3em", "-4em")}
                zIndex={-1}
                w={responsive("", "8em", "10em")}
                h={responsive("", "8em", "10em")}
                bgColor={"var(--secondary-color)"}
              ></Box>
            )}
          </Box>
        </Center>
      </Box>
    </>
  );
};

export default Account;
