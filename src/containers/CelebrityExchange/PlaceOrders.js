import React, { useState, useEffect } from "react";
import { Card, Button, Checkbox } from "antd";

export default function PlaceOrders(props) {
	const [stackId, setStackId] = useState(null);
	const [buyFocused, setBuyFocus] = useState(true);
	const [price, setPrice] = useState();
	const [tokens, setTokens] = useState();
	const [total, setTotal] = useState();
	const [totalForError, setTotalForError] = useState(1);
	useEffect(() => {
		setBuyFocus(buyFocused);
		setPrice(props.clickedOrder.price.toFixed(5));
		setTokens(props.clickedOrder.tokens.toFixed(5));
		setTotal(props.clickedOrder.total.toFixed(5));
		if (props.clickedOrder.total > 0) {
			setTotalForError(props.clickedOrder.total.toFixed(5));
		}
	}, [buyFocused, props.clickedOrder]);
	const changeStatus = (e) => {
		setBuyFocus(e.target.value == "BUY" ? true : false);
	};
	const handlePriceChange = (e) => {
		let tokens = total / e.target.value;
		let zero = 0;
		setPrice(e.target.value);
		if (isFinite(tokens)) {
			setTokens(tokens.toFixed(5));
		} else {
			setTokens(zero.toFixed(5));
		}
	};
	const handleTokensChange = (e) => {
		let total = price * e.target.value;
		setTokens(e.target.value);
		setTotal(total.toFixed(5));
		setTotalForError(total.toFixed(5));
	};
	const handleTotalChange = (e) => {
		let zero = 0;
		let tokens = e.target.value / price;
		if (isFinite(tokens)) {
			setTokens(tokens.toFixed(5));
		} else {
			setTokens(zero.toFixed(5));
		}
		setTotal(e.target.value);
		setTotalForError(e.target.value);
	};
	const submitOrder = async (e) => {
		// const _price = document.getElementById("price").value;
		const _tokens = document.getElementById("tokens").value;
		const _total = document.getElementById("total").value;
		const _payFeesUsingFANC = document.getElementById("payFeesUsingFANC")
			.checked;
		const { drizzle, drizzleState } = props;
		const contract = drizzle.contracts.CelebrityExchange;
		const tokenAddress = props.token[0].address;
		// get latest FANC Price from Oracle
		const web3 = props.drizzle.web3;
		const oracleContract = props.drizzle.contracts["Oracle"];
		const oracleContractWeb3 = new web3.eth.Contract(
			oracleContract.abi,
			oracleContract.address
		);

		let FANCPrice =
			(await oracleContractWeb3.methods.getAssetPrice().call()) / 10 ** 18;
		console.log(FANCPrice);
		// get the transaction states from the drizzle state
		// let drizzle know we want to call the `set` method with `value`
		// drizzle.web3.utils.toWei
		if (buyFocused) {
			const buyStackId = await contract.methods.placeBuyOrder.cacheSend(
				tokenAddress.toString(),
				(_tokens * 10 ** 5).toString(),
				(_total * 10 ** 5).toString(),
				_payFeesUsingFANC
					? ((_total * 10 ** 18) / FANCPrice / 200).toString()
					: ((_total * 10 ** 18) / 100).toString(),
				_payFeesUsingFANC,
				{
					from: drizzleState.accounts[0],
				}
			);
			setStackId(buyStackId);
		} else {
			const sellStackId = await contract.methods.placeSellOrder.cacheSend(
				tokenAddress.toString(),
				(_tokens * 10 ** 5).toString(),
				(_total * 10 ** 5).toString(),
				_payFeesUsingFANC
					? ((_total * 10 ** 18) / FANCPrice / 200).toString()
					: ((_total * 10 ** 18) / 100).toString(),
				_payFeesUsingFANC,
				{
					from: drizzleState.accounts[0],
				}
			);
			setStackId(sellStackId);
		}
	};
	const getTxStatus = () => {
		const { transactions, transactionStack } = props.drizzleState;
		// get the transaction hash using our saved `stackId`
		if (transactionStack[stackId]) {
			const txHash = transactionStack[stackId];

			return transactions[txHash] && transactions[txHash].status;
		}
	};

	return (
		<section>
			{/* buy order seperate component, sell order seperate, load dynamically */}
			<div
				style={{ position: "absolute", top: "5px", zIndex: "5", left: "5px" }}
			>
				<input
					type="radio"
					id="BUY"
					name="buyFocus"
					value="BUY"
					onChange={(value) => changeStatus(value)}
					checked={buyFocused}
				/>
				<label
					htmlFor="BUY"
					style={{
						borderTop: `${
							buyFocused ? "5px solid #55bd6c" : "5px solid #424242"
						}`,
					}}
				>
					BUY
				</label>
				<input
					type="radio"
					id="SELL"
					name="buyFocus"
					value="SELL"
					onChange={(value) => changeStatus(value)}
					checked={!buyFocused}
				/>
				<label
					htmlFor="SELL"
					style={{
						borderTop: `${
							!buyFocused ? "5px solid #f1432f" : "5px solid #424242"
						}`,
					}}
				>
					SELL
				</label>
			</div>
			<Card className="placeOrders">
				<div
					style={{
						position: "absolute",
						top: "10%",
						width: "80%",
						left: "10%",
						textAlign: "center",
					}}
				>
					<div className="input-group presuffix">
						<span className="input-group-addon prefix">PRICE</span>
						<input
							id="price"
							type="text"
							value={price}
							onChange={(e) => handlePriceChange(e)}
						/>
						<span className="input-group-addon suffix">ETH</span>
					</div>
					<div className="input-group presuffix">
						<span className="input-group-addon prefix">AMOUNT</span>
						<input
							id="tokens"
							type="text"
							value={tokens}
							onChange={(e) => handleTokensChange(e)}
						/>
						<span className="input-group-addon suffix">TOKENS</span>
					</div>
					<div className="input-group presuffix">
						<span className="input-group-addon prefix">TOTAL</span>
						<input
							id="total"
							type="text"
							value={total}
							onChange={(e) => handleTotalChange(e)}
						/>
						<span className="input-group-addon suffix">ETH</span>
					</div>
					{totalForError < 0.001 ? (
						<label
							style={{
								backgroundColor: "#212121",
								color: "red",
								border: "0px",
								fontSize: "10px",
								width: "100%",
							}}
						>
							Total value should be minimum 0.001 ETH
						</label>
					) : null}

					<Checkbox
						id="payFeesUsingFANC"
						style={{
							width: "100%",
							backgroundColor: "#212121",
							border: "0px",
							margin: "5% 0px 5% 0px",
						}}
					>
						<span style={{ color: "white" }}>Pay Fees using FANC Token</span>
					</Checkbox>

					<Button
						type="primary"
						htmlType="submit"
						onClick={() => submitOrder()}
						style={{
							backgroundColor: `${
								buyFocused
									? totalForError < 0.001
										? "#81c784"
										: "#55bd6c"
									: totalForError < 0.001
									? "#e57373"
									: "#f1432f"
							}`,
							border: "0px",
							color: "white",
							width: "60%",
						}}
						disabled={total < 0.001 ? true : false}
					>
						{buyFocused ? `BUY ${props.symbol}` : `SELL ${props.symbol}`}
					</Button>

					<div>{getTxStatus()}</div>
				</div>
			</Card>
		</section>
	);
}
