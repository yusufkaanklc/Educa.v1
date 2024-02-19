import { Flex, Text } from "@chakra-ui/react";
import dataContext from "../../utils/contextApi";
import { useContext } from "react";
const Footer = () => {
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
    <Flex
      align={"center"}
      borderTop={"1px solid var(--bg-color)"}
      justifyContent={"space-between"}
      px={responsive("", "8em", "10em")}
      py={responsive("", ".5em", "1em")}
    >
      <Text opacity={0.8} fontWeight={600}>
        Copyright © 2024 Educa
      </Text>
      <Text opacity={0.8} fontWeight={600}>
        Created by: Yusuf Kağan Kılıç
      </Text>
    </Flex>
  );
};

export default Footer;
