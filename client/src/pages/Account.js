import { Box, Flex, Avatar, Text, Heading } from "@chakra-ui/react";
import { useContext } from "react";
import dataContext from "../utils/contextApi";
const Account = () => {
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
      bgColor={"white"}
      border={"2px dashed #cfcfcf"}
      borderRadius={"10px"}
      p={responsive("", "1em ", "2em")}
      mx={responsive("", "8em", "10em")}
      my={responsive("", "2em", "3em")}
    ></Box>
  );
};

export default Account;
