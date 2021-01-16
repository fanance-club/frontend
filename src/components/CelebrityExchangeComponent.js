import React from "react";
import PriceChart from "../containers/CelebrityExchange/PriceChart";
import AssetStats from "../containers/CelebrityExchange/AssetStats";
import TokensList from "../containers/CelebrityExchange/TokensList";
import PlaceOrders from "../containers/CelebrityExchange/PlaceOrders";
import OrderBook from "../containers/CelebrityExchange/OrderBook";
import Trades from "../containers/CelebrityExchange/Trades";
import CelebrityStats from "../containers/CelebrityExchange/CelebrityStats";
import MarketActivities from "../containers/CelebrityExchange/MarketActivities";
import UserOrders from "../containers/CelebrityExchange/UserOrders";

import "../CelebrityExchange.less";

import { Row, Col } from "antd";

const CelebrityExchangeComponent = (props) => {
	const filterToken = () => {
		return props.tokensList.filter(
			(token) => token.symbol == props.match.params.symbol
		);
	};
	return (
		<React.Fragment>
			<Row>
				<Col span={6}>
					<TokensList
						tokensList={props.tokensList}
						symbol={props.match.params.symbol}
					/>
				</Col>
				<Col span={12}>
					<Row>
						<Col span={24}>
							<PriceChart
								completedTrades={props.completedTrades}
								symbol={props.match.params.symbol}
								token={filterToken()}
							/>
						</Col>
						<Col span={24}>
							<Row>
								<Col span={14}>
									<OrderBook
										drizzleState={props.drizzleState}
										buyOrders={props.buyOrders}
										sellOrders={props.sellOrders}
										token={filterToken()}
										handleOrderClick={props.handleOrderClick}
									/>
								</Col>
								<Col span={10}>
									<Trades
										drizzle={props.drizzle}
										drizzleState={props.drizzleState}
										completedTrades={props.completedTrades}
										token={filterToken()}
									/>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
				<Col span={6}>
					<Row>
						<Col span={24}>
							<PlaceOrders
								drizzle={props.drizzle}
								drizzleState={props.drizzleState}
								symbol={props.match.params.symbol}
								token={filterToken()}
								clickedOrder={props.clickedOrder}
							/>
						</Col>

						<Col span={24}>
							<UserOrders
								drizzleState={props.drizzleState}
								buyOrders={props.buyOrders}
								sellOrders={props.sellOrders}
								tokensList={props.tokensList}
							/>
						</Col>
					</Row>
				</Col>
			</Row>
			<section></section>
			<section>
				<AssetStats />
			</section>
			<section></section>
			<section></section>
			<section></section>
			<section></section>
			<section>
				<CelebrityStats />
			</section>
			<section>
				<MarketActivities />
			</section>
			<section></section>
		</React.Fragment>
	);
};

export default CelebrityExchangeComponent;
