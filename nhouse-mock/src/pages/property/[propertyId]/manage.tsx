import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next"
import React, { useState } from "react"
import { useRouter } from "next/router"
import { properties } from "@/data/mockdata"
import PropertyManageCard from "@/components/PropertyManageCard"
import {
  Box,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  Button,
  HStack,
  Image,
  Avatar,
  Center,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react"
import axios from "axios"

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_PATH || "http://localhost:3000"}/api/fetchMetadata`,
  )
  console.log(res.data)
  if (!res.data) {
    return {
      props: {
        availableTickets: [],
      },
    }
  }
  return {
    props: {
      availableTickets: res.data.sort((a: any, b: any) => JSON.parse(a.tokenId) - JSON.parse(b.tokenId)),
    },
  }
}

type Props = {
  availableTickets: any[]
}

const Manage: NextPage<Props> = ({ availableTickets }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [tickets, setTickets] = useState([...availableTickets])
  const router = useRouter()
  const propertyId = router.query.propertyId
  const property = properties.find((property) => property.id === propertyId)
  if (!property) {
    return <div>loading...</div>
  }

  let dates = []
  let date = new Date()
  date.setMonth(date.getMonth() + 2)
  dates.push(
    date.getFullYear() + "-" + ("0" + date.getMonth()).slice(-2) + "-" + ("0" + date.getDate()).slice(-2),
  )
  for (let i = 0; i < 50; i++) {
    date.setDate(date.getDate() + 1)
    dates.push(
      date.getFullYear() + "-" + ("0" + date.getMonth()).slice(-2) + "-" + ("0" + date.getDate()).slice(-2),
    )
  }

  dates = dates.filter((date) => {
    return !tickets.find((ticket) => JSON.stringify(ticket.tokenUri.reservedDate) === JSON.stringify(date))
  })

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        {confirm ? (
          <ModalContent pos="absolute" bottom="0" mb="0" borderRadius="12px 12px 0 0" h="98vh">
            <HStack position="relative" mt="20px" justifyContent="center" alignItems="center">
              <Image
                position="absolute"
                left="0"
                ml="27px"
                w="10px"
                src="/icons/Back.png"
                onClick={() => setConfirm(false)}
              />
              <Text fontSize="16px" fontWeight="700" fontFamily="Noto Sans" lineHeight="1.5">
                発行内容の確認
              </Text>
            </HStack>
            <HStack mt="20px" ml="24px" gap="16px">
              <Avatar w="60px" h="60px" src={properties[0].image} />
              <Box>
                <Text fontSize="12px" fontWeight="700" fontFamily="Noto Sans" lineHeight="1.5">
                  N’HOUSE
                </Text>
                <Text fontSize="16px" fontWeight="700" fontFamily="Noto Sans" lineHeight="1.5">
                  {properties[0].title}
                </Text>
              </Box>
            </HStack>

            <Box mt="40px" mx="24px">
              <Text fontSize="14px" fontWeight="700" fontFamily="Noto Sans" lineHeight="1.5">
                宿泊日
              </Text>
              <Text fontSize="18px" fontWeight="700" fontFamily="Noto Sans" lineHeight="1.5">
                {/* @ts-ignore */}
                {/* {selectedTicket && selectedTicket.tokenUri.reservedDate.replaceAll("-", "/")} */}
              </Text>
              <Text mt="24px" fontSize="14px" fontWeight="700" fontFamily="Noto Sans" lineHeight="1.5">
                到着時間
              </Text>
              <Text fontSize="18px" fontWeight="700" fontFamily="Noto Sans" lineHeight="1.5">
                13:00
              </Text>
            </Box>
            <Center w="100%">
              <Button
                position="absolute"
                bottom="32px"
                color="white"
                fontFamily="Noto Sans"
                mt="53px"
                fontSize="16px"
                fontWeight={700}
                lineHeight="1.5"
                bg="#00A7C1"
                w="83.5%"
                h="56px"
                borderRadius="0px"
                _hover={{ bg: "#00A7C1" }}
                // onClick={handleReserveRequest}
              >
                この内容で発行する
              </Button>
            </Center>
          </ModalContent>
        ) : (
          <ModalContent pos="absolute" bottom="0" mb="0" borderRadius="12px 12px 0 0" h="98vh">
            <HStack position="relative" mt="20px" justifyContent="center" alignItems="center">
              <Image position="absolute" left="0" ml="27px" w="10px" src="/icons/Back.png" onClick={onClose} />
              <Text fontSize="16px" fontWeight="700" fontFamily="Noto Sans" lineHeight="1.5">
                発行内容の入力
              </Text>
            </HStack>
            <HStack mt="20px" ml="24px" gap="16px">
              <Avatar w="60px" h="60px" src={properties[0].image} />
              <Box>
                <Text fontSize="12px" fontWeight="700" fontFamily="Noto Sans" lineHeight="1.5">
                  N’HOUSE
                </Text>
                <Text fontSize="16px" fontWeight="700" fontFamily="Noto Sans" lineHeight="1.5">
                  {properties[0].title}
                </Text>
              </Box>
            </HStack>

            <Box mt="20px" mx="15px">
              <Text fontSize="14px" fontWeight="700" fontFamily="Noto Sans" lineHeight="1.5">
                発行可能な日時
              </Text>
              {tickets.length === 0 && (
                <Text
                  mt="24px"
                  fontSize="18px"
                  textAlign="center"
                  fontWeight="700"
                  fontFamily="Noto Sans"
                  lineHeight="1.5"
                >
                  発行可能な日時はありません
                </Text>
              )}
              <SimpleGrid mt="24px" columns={3} spacing={2} overflow="scroll" maxH="400px">
                {tickets.length !== 0 &&
                  tickets.map((ticket, index) => {
                    const dateParts = ticket.tokenUri.reservedDate.split("-")
                    const month = parseInt(dateParts[1], 10).toString()
                    const day = parseInt(dateParts[2], 10).toString()
                    const formattedDate = `${month}月${day}日`
                    return (
                      <Button
                        key={index}
                        // onClick={() => {
                        //   selectedTicket === ticket ? setSelectedTicket(null) : setSelectedTicket(ticket)
                        // }}
                      >
                        <Text fontWeight="700" fontFamily="Noto Sans">
                          {formattedDate}
                        </Text>
                      </Button>
                    )
                  })}
              </SimpleGrid>
            </Box>
            <HStack mt="24px" mx="24px" justifyContent="space-between">
              <Text fontSize="14px" fontWeight="700" fontFamily="Noto Sans" lineHeight="1.5">
                到着時間
              </Text>
              <Text fontSize="14px" fontWeight="700" fontFamily="Noto Sans" lineHeight="1.5">
                13:00
              </Text>
            </HStack>
            <Center w="100%">
              <Button
                // isDisabled={!selectedTicket}
                position="absolute"
                bottom="32px"
                color="white"
                fontFamily="Noto Sans"
                mt="53px"
                fontSize="16px"
                fontWeight={700}
                lineHeight="1.5"
                bg="#00A7C1"
                w="83.5%"
                h="56px"
                borderRadius="0px"
                _hover={{ bg: "#00A7C1" }}
                onClick={() => setConfirm(true)}
              >
                発行内容を確認
              </Button>
            </Center>
          </ModalContent>
        )}
      </Modal>
      <PropertyManageCard property={property} onOpen={onOpen} isLoading={isLoading} />
    </>
  )
}

export default Manage