import React from "react";
import { Card } from "antd";
import Chart from "react-apexcharts";
import { chartOptions, dummyData } from "./PriceChart.config";
import { get, groupBy, maxBy, minBy } from "lodash";
import moment from "moment";

const buildGraphData = (orders) => {
	// Group the orders by hour for the graph
	orders = groupBy(orders, (o) =>
		moment.unix(o.timestamp).startOf("hour").format()
	);
	// Get each hour where data exists
	const hours = Object.keys(orders);
	// Build the graph series
	const graphData = hours.map((hour) => {
		// Fetch all the orders from current hour
		const group = orders[hour];
		// Calculate price values - open, high, low, close
		const open = group[0]; // first order
		const high = maxBy(group, "tokenPrice"); // high price
		const low = minBy(group, "tokenPrice"); // low price
		const close = group[group.length - 1]; // last order

		return {
			x: new Date(hour),
			y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice],
		};
	});

	return graphData;
};

const decorateOrder = (order) => {
	// Calculate token price to 5 decimal places
	const precision = 100000;
	let tokenPrice = order.price / 10 ** 18;
	tokenPrice = Math.round(tokenPrice * precision) / precision;

	return {
		...order,
		etherAmount: order.price / 10 ** 18,
		tokenAmount: order.numberOfTokens / 10 ** 18,
		tokenPrice,
		formattedTimestamp: moment.unix(order.timestamp).format("h:mm:ss a M/D"),
	};
};

const priceChart = (orders, token) => {
	// Sort orders by date ascending to compare history
	orders =
		typeof orders[0] != "undefined"
			? orders
					.filter(
						(order) =>
							order.celebrityToken ==
							(typeof token[0] != "undefined" ? token[0].address : null)
					)
					.sort((a, b) => a.timestamp - b.timestamp)
			: null;
	// Decorate orders - add display attributes
	orders = orders != null ? orders.map((o) => decorateOrder(o)) : null;
	// Get last 2 order for final price & price change
	let secondLastOrder, lastOrder;
	[secondLastOrder, lastOrder] =
		orders != null ? orders.slice(orders.length - 2, orders.length) : ["", ""];
	// get last order price
	const lastPrice = get(lastOrder, "tokenPrice", 0);
	// get second last order price
	const secondLastPrice = get(secondLastOrder, "tokenPrice", 0);

	return {
		lastPrice,
		lastPriceChange: lastPrice >= secondLastPrice ? "+" : "-",
		series: [
			{
				data: buildGraphData(orders),
			},
		],
	};
};

const priceSymbol = (lastPriceChange, lastPrice) => {
	let output;
	if (lastPriceChange === "+") {
		output = (
			<span style={{ color: "#55bd6c" }}>&#9650; &nbsp; {lastPrice}</span>
		); // Green up tiangle
	} else {
		output = (
			<span style={{ color: "#f1432f" }}>&#9660; &nbsp; {lastPrice}</span>
		); // Red down triangle
	}
	return output;
};

const showPriceChart = (priceChart, symbol) => {
	return (
		<div className="priceChart">
			<div className="price" style={{ color: "white" }}>
				<h4 style={{ color: "white", textAlign: "center" }}>
					{symbol} / ETH &nbsp;{" "}
					{priceSymbol(priceChart.lastPriceChange, priceChart.lastPrice)}
				</h4>
			</div>
			<Chart
				options={chartOptions}
				series={priceChart.series}
				// series={dummyData}
				type="candlestick"
				width="100%"
				height="85%"
			/>
		</div>
	);
};

const PriceChart = (props) => {
	return (
		<div>
			<Card className="priceChart">
				<div className="card bg-dark" style={{ color: "white" }}>
					<div className="card-body">
						{showPriceChart(
							priceChart(props.completedTrades, props.token),
							props.symbol
						)}
					</div>
				</div>
			</Card>
		</div>
	);
};

export default PriceChart;
