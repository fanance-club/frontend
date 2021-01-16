import React, { useState, useEffect } from "react";

export default function FetchContractData2(props) {
	const [buyOrderDetailsArray, setBuyOrderDetailsArray] = useState([]);
	const [sellOrderDetailsArray, setSellOrderDetailsArray] = useState([]);
	useEffect(() => {
		let buyOrdersArray = [];
		for (let i = 0; i < props.buyCount; i++) {
			let tempBuyOrderDetails =
				props.drizzleState.contracts.CelebrityExchange.buyOrders[
					props.buyOrders[i]
				];
			tempBuyOrderDetails = tempBuyOrderDetails && tempBuyOrderDetails.value;
			buyOrdersArray.push(tempBuyOrderDetails);
		}
		setBuyOrderDetailsArray(buyOrdersArray);

		let sellOrdersArray = [];
		for (let i = 0; i < props.sellCount; i++) {
			let tempSellOrderDetails =
				props.drizzleState.contracts.CelebrityExchange.sellOrders[
					props.sellOrders[i]
				];
			tempSellOrderDetails = tempSellOrderDetails && tempSellOrderDetails.value;
			sellOrdersArray.push(tempSellOrderDetails);
		}
		setSellOrderDetailsArray(sellOrdersArray);
		props.handleSellOrders(sellOrdersArray);
		props.handleBuyOrders(buyOrdersArray);
		let tempLatestPrice;
		for (let i = 0; i < props.tokensList.length; i++) {
			tempLatestPrice =
				props.drizzleState.contracts.CelebrityExchange.latestPrice[
					props.latestPrice[i]
				];
			tempLatestPrice = tempLatestPrice && tempLatestPrice.value;
			props.tokensList[i].previousPrice =
				typeof props.tokensList[i].latestPrice != "undefined"
					? props.tokensList[i].latestPrice
					: 0;
			props.tokensList[i].latestPrice = tempLatestPrice;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		props.drizzleState.contracts.CelebrityExchange.buyOrders,
		props.drizzleState.contracts.CelebrityExchange.sellOrders,
		props.sellOrders,
		props.sellCount,
		props.buyOrders,
		props.buyCount,
		props.tokensList,
	]);

	return <span></span>;
}
