import type { NextPage } from "next";
import { Box, Button, Container, Flex, Input, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { MediaRenderer, Web3Button, useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { HERO_IMAGE_URL, LOTTERY_CONTRACT_ADDRESS } from "../const/addresses";
import LotteryStatus from "../components/Status";
import { ethers } from "ethers";
import PrizeNFT from "../components/PrizeNFT";
import { useState } from "react";
import CurrentEntries from "../components/CurrentEntries";

const Home: NextPage = () => {
  const address = useAddress();

  const {
    contract
  } = useContract(LOTTERY_CONTRACT_ADDRESS);

  const {
    data: lotteryStatus
  } = useContractRead(contract, "lotteryStatus");

  const {
    data: ticketCost,
    isLoading: ticketCostLoading
  } = useContractRead(contract, "ticketCost");
  const ticketCostInEther = ticketCost ? ethers.utils.formatEther(ticketCost) : "0";

  const {
    data: totalEntries,
    isLoading: totalEntriesLoading
  } = useContractRead(contract, "totalEntries");

  const [ticketAmount, setTicketAmount] = useState(0);
  const ticketCostSubmit = parseFloat(ticketCostInEther) * ticketAmount;

  function increaseTicketAmount() {
    setTicketAmount(ticketAmount + 1);
  }

  function decreaseTicketAmount() {
    if (ticketAmount > 0) {
      setTicketAmount(ticketAmount - 1);
    }
  }

  return (
    <Container maxW={"1440px"}>
      <SimpleGrid columns={2} spacing={4} minH={"60vh"}>
        <Flex justifyContent={"center"} alignItems={"center"}>
          {lotteryStatus ? (
            <PrizeNFT/>
          ) : (
            <MediaRenderer
              src={HERO_IMAGE_URL}
              width="100%"
              height="100%"
            />
          )}
          
        </Flex>
        <Flex justifyContent={"center"} alignItems={"center"} p={"5%"}>
          <Stack spacing={10}>
            <Box>
              <Text fontSize={"xl"}>SMATh WORLD Raffle</Text>
              <Text fontSize={"4xl"} fontWeight={"bold"}>한정판 SMATY 티셔츠와 NFT 소장의 기회!</Text>
            </Box>
            
            <Text fontSize={"xl"}>응모권을 구매하시고 래플에 당첨되시면 고급스러운 SMATY 티셔츠와 NFT를 받을 수 있습니다. 세련된 스타일과 품격을 원하는 스마티분들에게 딱 맞는 기회입니다. 응모권을 많이 보유할수록 당첨 확률이 높아집니다. 지금 바로 참여하고, 독보적인 스타일을 완성하세요!</Text>
            
            <LotteryStatus status={lotteryStatus}/>
            {!ticketCostLoading && (
              <Text fontSize={"2xl"} fontWeight={"bold"}>응모권당 가격: {ticketCostInEther} ETH</Text>
            )}
            {address ? (
              <Flex flexDirection={"row"}>
                <Flex flexDirection={"row"} w={"25%"} mr={"40px"}>
                  <Button
                    onClick={decreaseTicketAmount}
                  >-</Button>
                  <Input
                    value={ticketAmount}
                    type={"number"}
                    onChange={(e) => setTicketAmount(parseInt(e.target.value))}
                    textAlign={"center"}
                    mx={2}
                  />
                  <Button
                    onClick={increaseTicketAmount}
                  >+</Button>
                </Flex>
                
                <Web3Button
                  contractAddress={LOTTERY_CONTRACT_ADDRESS}
                  action={(contract) => contract.call(
                    "buyTicket",
                    [
                      ticketAmount
                    ],
                    {
                      value: ethers.utils.parseEther(ticketCostSubmit.toString())
                    }
                  )}
                  isDisabled={!lotteryStatus}
                >{`응모권 구매`}</Web3Button>
              </Flex>
            ) : (
              <Text>응모권을 사실려면 지갑을 연결하세요.</Text>
            )}
            {!totalEntriesLoading && (
              <Text>총 응모권: {totalEntries.toString()}</Text>
            )}
          </Stack>
        </Flex>
      </SimpleGrid>
      <Stack mt={"40px"} textAlign={"center"}>
        <Text fontSize={"xl"}>현재 추첨 참여자 수:</Text>
        <CurrentEntries/>
      </Stack>
    </Container>
  );
};

export default Home;
