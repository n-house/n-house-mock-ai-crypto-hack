import { NextPage } from "next"
import React, { useState } from "react"
import { Box, Button, Center, Image, Text, VStack, useDisclosure } from "@chakra-ui/react"
import { usePrivy } from "@privy-io/react-auth"
import { useRouter } from "next/router"

const NOnTheBeach: NextPage = () => {
  const { ready, authenticated, login } = usePrivy()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  return (
    <VStack
      mt="20px"
      w="100%"
      h="72.5vh"
      bgSize="cover"
      maxW="440px"
      borderRadius="16px"
      bgImage="/images/Blue.png"
      justifyContent={"space-between"}
      position="relative"
    >
      <Box
        fontFamily="Oswald"
        color="white"
        fontSize="60px"
        fontWeight="700"
        lineHeight="1.5"
        fontStyle="normal"
        textAlign="right"
        mt="20px"
        mr="20px"
        ml="auto"
      >
        <Text>N’HOUSE</Text>
        <Text mt="-18px">beach</Text>
      </Box>
      {isLoading && (
        <>
          <Box
            fontFamily="Oswald"
            color="white"
            fontSize="40px"
            fontWeight="700"
            lineHeight="1.5"
            fontStyle="normal"
            mt="20px"
            mx="auto"
          >
            <Image
              src="https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!bw700"
              w="200px"
              h="200px"
            />
          </Box>
          {/* <Box
            position="absolute"
            bottom="92px"
            fontFamily="Oswald"
            color="white"
            fontSize="20px"
            fontWeight="700"
            lineHeight="1.5"
            fontStyle="normal"
            mx="auto"
          >
            <Text>{ticket && ticket.tokenUri.reservedDate.replaceAll("-", "/")}</Text>
          </Box> */}
        </>
      )}
      <Center w="100%" pb="40px">
        <Button
          position="absolute"
          bottom="32px"
          isLoading={!ready || isLoading}
          loadingText={!ready ? "認証情報読み込み中" : "リクエスト処理中"}
          spinnerPlacement="end"
          color="#00A7C1"
          fontFamily="Noto Sans"
          mt="20px"
          fontSize="16px"
          fontWeight={700}
          lineHeight="1.5"
          bg="white"
          w="83.5%"
          h="56px"
          borderRadius="0px"
          _hover={{ bg: "white" }}
          onClick={() => {
            ready && authenticated ? onOpen() : login()
          }}
        >
          予約する
        </Button>
      </Center>
    </VStack>
  )
}

export default NOnTheBeach
