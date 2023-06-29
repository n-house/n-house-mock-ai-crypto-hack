import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next"
import React, { useState } from "react"
import {
  Box,
  Button,
  Center,
  Image,
  Text,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  HStack,
  Avatar,
  useToast,
} from "@chakra-ui/react"
import { usePrivy } from "@privy-io/react-auth"
import { useRouter } from "next/router"
import axios from "axios"

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const pass = context.query.pass
  if (!pass || pass !== process.env.NEXT_PUBLIC_PASS) {
    return {
      redirect: {
        destination: `/home?error=invalid pass`,
        permanent: false,
      },
    }
  }
  try {
    // const res = await axios.get(`https://n.house/api/fetchBeach`)
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_PATH || "http://localhost:7071/api"}/fetchBeach`)
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
        availableTickets: res.data.sort((a: any, b: any) => {
          const da = new Date(a.tokenUri.reservedDate)
          const db = new Date(b.tokenUri.reservedDate)
          return da.getTime() - db.getTime()
        }),
      },
    }
  } catch (error) {
    console.log(error)
    return {
      redirect: {
        destination: `/home?error=${error}`,
        permanent: false,
      },
    }
  }
}

type Props = {
  availableTickets: any[]
}

const NOnTheBeach: NextPage<Props> = ({ availableTickets }) => {
  const { ready, authenticated, user, login } = usePrivy()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  console.log(availableTickets)

  const handleReserveRequest = async () => {
    if (!user?.wallet?.address) return
    setIsLoading(true)
    onClose()
    toast({
      position: "top",
      title: "予約リクエストを受け付けました",
      status: "success",
      duration: 9000,
      isClosable: true,
    })
    try {
      const data = {
        tokenId: JSON.parse(availableTickets[0].tokenId),
        address: user?.wallet?.address,
      }
      console.log(data)
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_PATH || "http://localhost:7071/api"}/reserveBeach`,
        data,
      )

      if (res.data) {
        console.log(res.data)
        setIsLoading(false)
        toast({
          position: "top",
          title: "予約が正常に完了しました",
          status: "success",
          duration: 9000,
          isClosable: true,
        })
        // @ts-ignore
        router.push(`/key`)
        // await handleUpdateTickets()
      } else {
        console.log(res)
        setIsLoading(false)
        toast({
          position: "top",
          title: "予約が失敗しました",
          status: "error",
          duration: 9000,
          isClosable: true,
        })
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      }
    } catch (error) {
      setIsLoading(false)
      toast({
        position: "top",
        title: "予約が失敗しました",
        status: "error",
        duration: 9000,
        isClosable: true,
      })
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    }
  }
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent pos="absolute" bottom="0" mb="0" borderRadius="12px 12px 0 0" h="98vh">
          <HStack position="relative" mt="20px" justifyContent="center" alignItems="center">
            <Image position="absolute" left="0" ml="27px" w="10px" src="/icons/Back.png" onClick={onClose} />
            <Text fontSize="16px" fontWeight="700" fontFamily="Noto Sans JP" lineHeight="1.5">
              予約内容の確認
            </Text>
          </HStack>
          <Text ml="24px" mt="20px" fontSize="16px" fontWeight="700" fontFamily="Noto Sans JP" lineHeight="1.5">
            利用規約・個人情報保護方針
          </Text>
          <Box
            mt="20px"
            h="380px"
            overflow="scroll"
            mx="24px"
            fontSize="16px"
            fontWeight="700"
            fontFamily="Noto Sans JP"
            lineHeight="1.5"
          >
            法令等の遵守について 1. 法令等の遵守について
            Nhause（以下、「当社」といいます。）は、個人情報の漏洩、滅失、破棄損等の防止のために、個人情報の保護に関する法律（以下、「個人情報保護法」といいます。）その他の法令、ガイドライン及び当社の内部規則に従い、適切な安全管理策を施し、保有する個人情報の保護に努めます。また、従業員に対しても個人情報の適切な取扱い等についての教育を行い、その保護に万全を期するよう努めます。
            2. 個人情報の取得と利用目的について (1)
            当社は、お客様の個人情報を取得させていただく場合は、適正な手段でこれを行います。 (2)
            当社は次に掲げる利用目的の達成に必要な範囲内において個人情報を利用いたします 。 ①
            ご購入・ご登録いただいた商品・サービスのお申し込みの確認やお届けをするため A)
            本人認証、お客様の管理及びお客様に連絡を行うため B) 商品のご購入の確認やお届けをするため C)
            宿泊施設等に連絡をするため D) イベントへのお申し込みの確認や、入場券などのお届けをするため E)
            電子メール配信サービスのお申し込みの確認やメールの配信をするため F)
            各種会員制サービスへの登録の確認やサービスの提供をするため G)
            ご協力いただいたアンケートに対して謝礼等をお送りするため H)
            ご応募いただいた懸賞などに対する景品等をお送りするため ②
            ご利用いただいている商品・サービスの提供・改良や、新たなサービスを開発するため A)
            商品・サービス、Webサイトなどの内容を皆様がよりご満足いただけるよう改善するため B)
            商品・サービス、Webサイトなどの内容を個々のお客様に合わせてカスタマイズするため C)
            お客様が注文された情報や商品などに関する満足度を調査するため D)
            お客様の利用状況を把握し、サービスの改善や新サービスの開発に役立てるため ③
            提供している商品・サービスに関連した情報などをお届けするため A)
            当社が関連する各種イベント等に関するご案内をお届けするため B)
            各種会員制サービス、その他各種サービスのご案内をお届けするため C)
            アンケートへのご協力依頼や、その結果などをご報告するため (3)
            当社は、合併、分社化、営業譲渡等で事業を承継し個人情報を取得した場合は、承継前にご本人に同意を得ている範囲内又は通知若しくは公表した利用目的の達成に必要な範囲内で利用いたします。
            (4)
            法令に基づく場合、人の生命、身体又は財産の保護のために必要な場合であって、本人の同意を得ることが困難であるとき、公衆衛生の向上又は児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき、国の機関若しくは地方公共団体又はその委託を受けた者から法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき、上記利用目的の範囲外であっても事前の同意を得ずして個人情報を取得又は利用させていただく場合があります。
            3. 個人情報の第三者への提供について
            当社は、以下の場合を除き、個人情報を第三者に提供することはいたしません。 (1)
            あらかじめお客様の同意をいただいている場合 (2)
            利用目的の達成のため、当社が適切な監督を行う業務委託先に提供する場合 (3) 法令に基づく場合 (4)
            人の生命、身体又は財産の保護のために必要がある場合であって、お客様の同意を得ることが困難な場合 (5)
            公衆衛生の向上又は児童の健全な育成の推進のために特に必要がある場合であって、お客様の同意を得ることが困難である場合
            (6)
            国の機関若しくは地方公共団体又はその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、お客様の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがある場合
            (7) その他、法令で認められる場合 4. 外国の事業者に対する個人データの提供について
            当社は、個人情報を外国にある第三者に提供する場合、個人情報保護法で認められている場合を除き、あらかじめお客様の同意を得るものとします。
            5. 安全管理措置について
            当社は、個人情報の漏洩、滅失又は毀損の防止等その管理のために必要かつ適切な以下の措置を講じます。また、個人情報を取り扱う従業者や委託先（再委託先等を含みます。）に対して、必要かつ適切な監督を行います。
            【基本方針の策定】
            個人情報の適正な取扱いの確保のため、「関係法令・ガイドライン等の遵守」、「質問及び苦情処理の窓口」等についての基本方針を策定しています。
            【個人情報の取扱いに係る規律の整備】
            取得、利用、保存、提供、削除・廃棄等の段階ごとに、取扱方法、責任者・担当者及びその任務等について個人情報の取扱規程を策定しています。
            【組織的安全管理措置】
            ・個人情報の取扱いに関する責任者を設置するとともに、個人情報を取り扱う従業者及び当該従業者が取り扱う個人情報の範囲を明確化し、法令や取扱規程に違反している事実又は兆候を把握した場合の責任者への報告連絡体制を整備しています。
            ・個人情報の取扱状況について、定期的に自己点検を実施するとともに、他部署や外部の者による監査を実施しています。
            【人的安全管理措置】
            個人情報の取扱いに関する留意事項について、従業者に定期的な研修を実施しています。
            【物理的安全管理措置】
            ・個人情報を取り扱う区域において、従業者の入退室管理及び持ち込む機器等の制限を行うとともに、権限を有しない者による個人情報の閲覧を防止する措置を実施しています。
            ・個人情報を取り扱う機器、電子媒体及び書類等の盗難又は紛失等を防止するための措置を講じるとともに、事業所内の移動を含め、当該機器、電子媒体等を持ち運ぶ場合、容易に個人情報が判明しないよう措置を実施しています。
            【技術的安全管理措置】
            ・アクセス制御を実施して、担当者及び取り扱う個人情報データベース等の範囲を限定しています。
            ・個人情報を取り扱う情報システムを外部からの不正アクセス又は不正ソフトウェアから保護する仕組みを導入しています。
            6. 個人情報の開示等のお問い合わせと手続について (1)
            お客様の個人情報に関して訂正、追加、削除、利用の停止、第三者提供の停止等を希望される場合は、以下の窓口までご連絡いただきますよう、お願い申し上げます。お客様ご自身がWeb上から登録された会員情報等につきましては、お客様ご自身で、お客様の個人情報を訂正、追加することができます。
            お問い合わせ窓口：？！ここどうする？！ (2)
            お問い合わせの際に、お客様ご本人又はお客様の正当な代理人であるかについて、確認を求める場合がございますので、あらかじめご了承ください。訂正、追加、削除、利用の停止、第三者提供の停止等をご希望の場合は、諸手続きについて、窓口にお問い合わせ下さい。
            (3) 以下の事項に該当する場合、ご要望に応じられない場合がありますので、あらかじめご了承下さい。 ①
            ご本人又は正当な代理人との確認ができない場合 ②
            当社の保有個人データに該当しない個人情報に関して開示、訂正、追加、削除、利用停止等のご請求をされた場合
            ③
            当社が保有個人データを開示することによって、ご本人又は第三者の生命・身体・財産その他の権利利益を害するおそれがある場合
            ④
            当社が保有個人データを開示することによって、当社の業務の適正な実施に著しい支障を及ぼすおそれがある場合
            ⑤ 当社が保有個人データを開示することによって、他の法令に違反することとなる場合 ⑥
            当社の保有個人データに関して訂正、追加等のご請求をされた場合に、利用目的からして訂正等が必要ない場合やご要求が事実とは相違する場合
            ⑦
            当社の保有個人データに関して削除、利用停止等（以下、「利用停止等」といいます。）のご請求をされた場合に、当社の手続上の違反（利用目的外の利用、取得又は3.（1）～（8）に該当する事由以外での第三者への提供）が認められない場合
            ⑧
            当社の保有個人データに関して利用停止等のご請求をされた場合に、利用停止等を行うことが困難な場合であって、かつ代替手段によりお客様の権利利益を保護しうる場合
            (4)
            お問い合わせ窓口にお電話いただいた場合には、通話内容に関する事実確認、お問い合わせへの正確なご回答、窓口担当者の電話対応マナー向上のため等の目的で、通話内容を録音させていただくことがあります。
            7. Webサイトにおける個人情報の取扱いについて (1) クッキーについて
            クッキーは、お客様がWebサイトを快適にご利用できるように、Webサーバがお客様のブラウザに送信する情報です。当社では、Webサイトをご利用になるお客様に対し、クッキーを使用することがあります。なお、お客様は、クッキーの受け取りを拒否するように設定することも出来ますが、その場合、当社が提供するサービスの全部又は一部をご利用できなくなることがありますのでご了承ください。
            (2) リンク先における個人情報の保護
            Webサイトからリンクされている当社以外が運営するWebサイトにおける個人情報の取扱いについては、当社は責任を負うことはできません。
            8. 改定について 当社は、法令の変更等に伴い、本プライバシーポリシーを変更することがあります。
            制定日： 2023/6/29 nhouse、西山泰生
          </Box>
          <Center w="100%">
            <Button
              position="absolute"
              bottom="32px"
              color="white"
              fontFamily="Noto Sans JP"
              mt="53px"
              fontSize="16px"
              fontWeight={700}
              lineHeight="1.5"
              bg="#00A7C1"
              w="83.5%"
              h="56px"
              borderRadius="0px"
              _hover={{ bg: "#00A7C1" }}
              onClick={handleReserveRequest}
            >
              上記規約に同意して予約する
            </Button>
          </Center>
        </ModalContent>
      </Modal>
      <VStack
        mt="20px"
        w="100%"
        h="72.5vh"
        bgSize="cover"
        maxW="440px"
        borderRadius="16px"
        bgImage="/images/Beach.jpeg"
        justifyContent={"space-between"}
        position="relative"
      >
        <Box
          w="100%"
          fontFamily="Oswald"
          color="white"
          fontWeight="700"
          lineHeight="1.5"
          fontStyle="normal"
          mt="20px"
        >
          <Text lineHeight="1" mr="50%" textAlign="center" fontSize="100px">
            N
          </Text>
          <Box mr="50%" textAlign="center">
            <Text lineHeight="1" fontSize="40px">
              on
            </Text>
            <Text lineHeight="1" fontSize="40px">
              the
            </Text>
            <Text lineHeight="1" fontSize="40px">
              beach
            </Text>
          </Box>
        </Box>
        <Center w="100%" pb="40px">
          <Button
            isDisabled={!availableTickets.length}
            position="absolute"
            bottom="32px"
            isLoading={!ready || isLoading}
            opacity={!ready || isLoading || !availableTickets.length ? "0.8 !important" : 1}
            loadingText={!ready ? "認証情報読み込み中" : "リクエスト処理中"}
            spinnerPlacement="end"
            color="#00A7C1"
            fontFamily="Noto Sans JP"
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
            {ready && !authenticated
              ? "ログインして予約する"
              : !availableTickets.length
              ? "公式リリースをお待ちください。"
              : "予約する"}
          </Button>
        </Center>
      </VStack>
    </>
  )
}

export default NOnTheBeach
