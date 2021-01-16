import React from "react";
import { Card, Row, Col } from "antd";
import BuyOrderBook from "./BuyOrderBook";
import SellOrderBook from "./SellOrderBook";

export default function Orderbook(props) {
	return (
		<React.Fragment>
			<Card className="orderBook" style={{ overflow: "hidden" }}>
				<Row>
					<Col span="12">
						<p
							style={{
								textAlign: "center",
								color: "white",
								fontSize: "14px",
							}}
						>
							Open Buy Orders
						</p>

						<table
							style={{
								width: "95%",
								textAlign: "right",
							}}
						>
							<thead>
								<tr>
									<th>Volume</th>
									<th>Buy Price</th>
								</tr>
							</thead>
						</table>
						<div style={{ height: "100%", overflow: "hidden" }}>
							<table
								style={{
									width: "95%",
									textAlign: "right",
								}}
							>
								<tbody>
									<BuyOrderBook
										drizzleState={props.drizzleState}
										buyOrders={props.buyOrders}
										token={props.token}
										handleOrderClick={props.handleOrderClick}
									/>
								</tbody>
							</table>
						</div>
					</Col>
					<Col span="12">
						<p
							style={{
								textAlign: "center",
								color: "white",
								fontSize: "14px",
							}}
						>
							Open Sell Orders
						</p>
						<div style={{ height: "100%", overflow: "hidden" }}>
							<table style={{ width: "95%" }}>
								<thead>
									<tr>
										<th>Sell Price</th>
										<th>Volume</th>
									</tr>
								</thead>
								<tbody>
									<SellOrderBook
										drizzleState={props.drizzleState}
										sellOrders={props.sellOrders}
										token={props.token}
										handleOrderClick={props.handleOrderClick}
									/>
								</tbody>
							</table>
						</div>
					</Col>
				</Row>
			</Card>
		</React.Fragment>
	);
}
