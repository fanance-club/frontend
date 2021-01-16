import React, { useState, useEffect } from "react";
import FetchContractData1 from "./FetchContractData1";

export default function FetchContractData(props) {
	const [buyOrderCount, setBuyOrderCount] = useState(0);
	const [sellOrderCount, setSellOrderCount] = useState(0);
	// To provide as dependency for useEffect
	const events = props.drizzleState.contracts["CelebrityExchange"].events;
	const [completedTrades, setCompletedTrades] = useState([]);
	const [tokensList, setTokensList] = useState([]);
	useEffect(() => {
		const tempBuyOrderCount = props.drizzle.contracts.CelebrityExchange.methods[
			"buyOrderCount"
		].cacheCall();
		setBuyOrderCount(tempBuyOrderCount);
		const tempSellOrderCount = props.drizzle.contracts.CelebrityExchange.methods[
			"sellOrderCount"
		].cacheCall();
		setSellOrderCount(tempSellOrderCount);
		//Fetch tokens from CelebrityToken
		const tempTokensList = props.drizzle.contracts.TokenGenerator.methods[
			"getAllCelebrities"
		].cacheCall();
		setTokensList(tempTokensList);

		// Fetch trades from events
		async function getTrades() {
			const web3 = props.drizzle.web3;
			const contract = props.drizzle.contracts["CelebrityExchange"];
			const yourContractWeb3 = new web3.eth.Contract(
				contract.abi,
				contract.address
			);
			let completedBuyOrders = [];
			let completedSellOrders = [];

			let FilledBuyOrders = await yourContractWeb3.getPastEvents(
				"BuyOrderFilled",
				{
					fromBlock: 0,
					toBlock: "latest",
				}
			);
			FilledBuyOrders.map((event) => {
				completedBuyOrders.push(event.returnValues);
			});

			let FilledSellOrders = await yourContractWeb3.getPastEvents(
				"SellOrderFilled",
				{
					fromBlock: 0,
					toBlock: "latest",
				}
			);
			FilledSellOrders.map((event) => {
				completedSellOrders.push(event.returnValues);
			});
			props.handleCompletedTrades(
				completedBuyOrders.concat(completedSellOrders)
			);
			return setCompletedTrades(completedBuyOrders.concat(completedSellOrders));
		}

		let trades = getTrades();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		props.drizzle.contracts.CelebrityExchange,
		props.drizzle.contracts.TokenGenerator,
		props.buyOrderCount,
		props.sellOrderCount,
		events,
	]);

	return (
		<FetchContractData1
			drizzle={props.drizzle}
			drizzleState={props.drizzleState}
			buyOrderCount={buyOrderCount}
			handleBuyOrders={props.handleBuyOrders}
			sellOrderCount={sellOrderCount}
			handleSellOrders={props.handleSellOrders}
			handleTokensList={props.handleTokensList}
			tokensList={tokensList}
			handleLatestPrice={props.handleLatestPrice}
		/>
	);
}
