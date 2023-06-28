import { NextPage } from "next"
import React, { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper"
import "swiper/css"
import "swiper/css/pagination"
import axios from "axios"
import { usePrivy } from "@privy-io/react-auth"
import ReservedCard from "@/components/ReservedCard"
import { Box, Button, Center, HStack, Spinner, Text, useDisclosure } from "@chakra-ui/react"
import BeachReservedCard from "@/components/BeachReservedCard"

const Key: NextPage = () => {
  const [keys, setKeys] = useState<any[]>([])
  const [loading, setLoading] = useState<any>(false)
  const { ready, authenticated, user, login, logout } = usePrivy()

  const fetchKeys = async () => {
    if (!user?.wallet?.address) return
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_PATH || "http://localhost:7071/api"}/fetchKeys`,
      { address: user?.wallet?.address },
    )
    const resp = await axios.post(
      `${process.env.NEXT_PUBLIC_API_PATH || "http://localhost:7071/api"}/fetchBeachKeys`,
      { address: user?.wallet?.address },
    )
    if (!res.data.length && !resp.data.length) return
    console.log(res.data, resp.data)
    const sortedKeys = res.data.sort((a: any, b: any) => JSON.parse(b.tokenId) - JSON.parse(a.tokenId))
    const sortedBeachKeys = resp.data.sort((a: any, b: any) => JSON.parse(b.tokenId) - JSON.parse(a.tokenId))
    setKeys([...sortedBeachKeys, ...sortedKeys])
    setLoading("done")
  }

  useEffect(() => {
    if (ready && authenticated) fetchKeys()
    if (ready && !authenticated) setLoading("done")
  }, [ready])

  useEffect(() => {
    setLoading(true)
  }, [])

  if (loading === true)
    return (
      <>
        <HStack justifyContent="center" mt="200px">
          <Text fontFamily="Oswald" color="white" fontSize="30px" fontWeight="700" lineHeight="1.5">
            キーを取得中
          </Text>
          <Spinner color="white" size="lg" />
        </HStack>
      </>
    )

  if (!keys.length && loading === "done")
    return (
      <>
        <HStack justifyContent="center" mt="200px">
          <Text fontFamily="Oswald" color="white" fontSize="30px" fontWeight="700" lineHeight="1.5">
            キーがありません
          </Text>
        </HStack>
        <Center w="100%" maxW="440px" pb="98px">
          <Button
            maxW="368px"
            position="absolute"
            bottom="100px"
            color="white"
            fontFamily="Noto Sans"
            mt="20px"
            fontSize="16px"
            fontWeight={700}
            lineHeight="1.5"
            bg="#00A7C1"
            w="83.5%"
            h="56px"
            borderRadius="0px"
            _hover={{ bg: "#00A7C1" }}
            onClick={() => {
              ready && authenticated ? logout() : login()
            }}
          >
            {ready && authenticated ? "別のアカウントでログイン" : "ログイン"}
          </Button>
        </Center>
      </>
    )
  return (
    <>
      <Swiper modules={[Pagination]} spaceBetween={50} slidesPerView={1} pagination={{ clickable: true }}>
        {keys.map((key, index) => {
          return (
            <SwiperSlide key={index}>
              {/* @ts-ignore */}
              {key.tokenUri.propertyName.includes("beach") ? (
                <BeachReservedCard ticket={key.tokenUri} />
              ) : (
                <ReservedCard ticket={key.tokenUri} />
              )}
            </SwiperSlide>
          )
        })}
      </Swiper>
    </>
  )
}

export default Key
