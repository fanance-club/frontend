import React, { useState, useEffect } from "react";
import { Card, Progress } from "antd";

export default function UserOrders(props) {
	const [openFocused, setOpenFocus] = useState(true);
	const [allOpenOrders, setAllOpenOrders] = useState();
	const [allHistoryOrders, setAllHistoryOrders] = useState();
	useEffect(() => {
		setOpenFocus(openFocused);

		let tempAllOpenOrders = props.buyOrders
			.concat(props.sellOrders)

			.filter(
				(order) =>
					(typeof order != "undefined"
						? order.status == 0 || order.status == 1
						: null) &&
					(typeof order != "undefined"
						? order.user == props.drizzleState.accounts[0]
						: null)
			)
			.sort((trade1, trade2) => trade2.timestamp - trade1.timestamp);

		tempAllOpenOrders.map((order, index, array) => {
			if (typeof order != "undefined") {
				let tokens =
					order.tokenBuy >= 0
						? order.tokenBuy / 10 ** 18
						: order.tokenSell / 10 ** 18;

				let price =
					order.buyPrice >= 0
						? order.buyPrice / 10 ** 18
						: order.sellPrice / 10 ** 18;

				let tokensLeft =
					order.tokensLeftToBuy >= 0
						? 100 - (order.tokensLeftToBuy / order.tokenBuy) * 100
						: 100 - (order.tokensLeftToSell / order.tokenSell) * 100;
				array[index].tokens = tokens;
				array[index].price = price;
				array[index].tokensLeft = tokensLeft;
			}
		});
		setAllOpenOrders(tempAllOpenOrders);
		let tempAllHistoryOrders = props.buyOrders
			.concat(props.sellOrders)
			.filter(
				(order) =>
					(typeof order != "undefined"
						? order.status == 2 || order.status == 3
						: null) &&
					(typeof order != "undefined"
						? order.user == props.drizzleState.accounts[0]
						: null)
			)
			.sort((trade1, trade2) => trade2.timestamp - trade1.timestamp);
		tempAllHistoryOrders.map((order, index, array) => {
			if (typeof order != "undefined") {
				let tokens =
					order.tokenBuy >= 0
						? order.tokenBuy / 10 ** 18
						: order.tokenSell / 10 ** 18;

				let price =
					order.buyPrice >= 0
						? order.buyPrice / 10 ** 18
						: order.sellPrice / 10 ** 18;

				let tokensLeft =
					order.tokensLeftToBuy >= 0
						? 100 - (order.tokensLeftToBuy / order.tokenBuy) * 100
						: 100 - (order.tokensLeftToSell / order.tokenSell) * 100;
				array[index].tokens = tokens;
				array[index].price = price;
				array[index].tokensLeft = tokensLeft;
			}
		});
		setAllHistoryOrders(tempAllHistoryOrders);
	}, [
		openFocused,
		props.buyOrders,
		props.sellOrders,
		props.drizzleState.accounts,
	]);
	const changeStatus = (e) => {
		setOpenFocus(e.target.value == "OPEN" ? true : false);
	};

	return (
		<section>
			{/* buy order seperate component, sell order seperate, load dynamically */}
			<div
				style={{ position: "absolute", top: "5px", zIndex: "5", left: "5px" }}
			>
				<input
					type="radio"
					id="OPEN"
					name="openFocus"
					value="OPEN"
					onChange={(value) => changeStatus(value)}
					checked={openFocused}
				/>
				<label
					htmlFor="OPEN"
					style={{
						borderTop: `${
							openFocused ? "5px solid #f9de37" : "5px solid #424242"
						}`,
					}}
				>
					OPEN ORDERS
				</label>
				<input
					type="radio"
					id="COMPLETED"
					name="completedFocus"
					value="COMPLETED"
					onChange={(value) => changeStatus(value)}
					checked={!openFocused}
				/>
				<label
					htmlFor="COMPLETED"
					style={{
						borderTop: `${
							!openFocused ? "5px solid #55bd6c" : "5px solid #424242"
						}`,
					}}
				>
					HISTORY
				</label>
			</div>

			<Card className="userOrders" style={{ overflow: "hidden" }}>
				<table
					className="userTable"
					style={{
						width: "100%",
						top: "30px",
						left: "0px",
						position: "absolute",
						textAlign: "center",
					}}
				>
					<thead>
						<tr>
							<th>Celebrity</th>
							<th>Tokens</th>
							<th>Price</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{openFocused && typeof allOpenOrders != "undefined"
							? allOpenOrders
									.sort((order1, order2) => order2.timestamp - order1.timestamp)
									.map((order) => {
										return (
											<tr
												key={order.timestamp
													.concat(order.id)
													.concat(order.celebrityToken)}
											>
												<td>
													{order.tokensLeftToBuy >= 0 ? (
														<p
															style={{
																color: "#55bd6c",
																fontSize: "12px",
																margin: "0px",
															}}
														>
															BUY
														</p>
													) : (
														<p
															style={{
																color: "#f1432f",
																fontSize: "12px",
																margin: "0px",
															}}
														>
															SELL
														</p>
													)}
													{typeof props.tokensList[0] != "undefined"
														? props.tokensList.filter(
																(token) => token.address == order.celebrityToken
														  )[0].symbol
														: null}
												</td>
												<td>{order.tokens.toFixed(5)}</td>
												<td>{order.price.toFixed(5)}</td>
												<td>
													<Progress
														type="circle"
														percent={order.tokensLeft.toFixed(0)}
														width={30}
													/>
												</td>
											</tr>
										);
									})
							: null}
						{!openFocused && typeof allHistoryOrders != "undefined"
							? allHistoryOrders
									.sort((order1, order2) => order2.timestamp - order1.timestamp)
									.map((order) => {
										return (
											<tr
												key={order.timestamp
													.concat(order.id)
													.concat(order.celebrityToken)}
											>
												<td>
													{order.tokensLeftToBuy >= 0 ? (
														<p
															style={{
																color: "#55bd6c",
																fontSize: "12px",
																margin: "0px",
															}}
														>
															BUY
														</p>
													) : (
														<p
															style={{
																color: "#f1432f",
																fontSize: "12px",
																margin: "0px",
															}}
														>
															SELL
														</p>
													)}
													{typeof props.tokensList[0] != "undefined"
														? props.tokensList.filter(
																(token) => token.address == order.celebrityToken
														  )[0].symbol
														: null}
												</td>
												<td>{order.tokens.toFixed(5)}</td>
												<td>{order.price.toFixed(5)}</td>
												<td>{order.status == "2" ? "Filled" : "Cancelled"}</td>
											</tr>
										);
									})
							: null}
					</tbody>
				</table>
			</Card>
		</section>
	);
}
