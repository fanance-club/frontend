import React, { Component } from "react";
import { Layout, Menu } from "antd";
import FetchContractData from "./FetchContractData";
import { DrizzleContext } from "drizzle-react";
const { Header, Content, Footer } = Layout;

const HigherOrderComponent = (WrappedComponent) => {
	return class HOC extends Component {
		constructor(props) {
			super(props);
			// Don't call this.setState() here!
			this.state = {
				buyOrders: [],
				sellOrders: [],
				completedTrades: [],
				tokensList: [],
				latestPrice: {},
				clickedOrder: { price: 0, tokens: 0, total: 0 },
			};
		}
		handleBuyOrders = (buyOrders) => {
			this.setState({ buyOrders });
		};
		handleSellOrders = (sellOrders) => {
			this.setState({ sellOrders });
		};
		handleCompletedTrades = (trades) => {
			this.setState({ completedTrades: trades });
		};
		handleTokensList = (tokensList) => {
			this.setState({ tokensList });
		};
		handleLatestPrice = (price) => {
			this.setState({ ...this.state.latestPrice, price });
		};
		handleOrderClick = (order, volume) => {
			let tempOrder = {};
			if (order.buyPrice > 0) {
				tempOrder.price = order.buyPrice / 10 ** 18;
			} else {
				tempOrder.price = order.sellPrice / 10 ** 18;
			}

			tempOrder.tokens = volume / 10 ** 18;
			tempOrder.total = tempOrder.price * tempOrder.tokens;
			this.setState({ clickedOrder: tempOrder });
		};
		render() {
			return (
				<DrizzleContext.Consumer>
					{(drizzleContext) => {
						const { drizzle, drizzleState, initialized } = drizzleContext;
						if (!initialized) {
							return "Loading...";
						}

						return (
							<React.Fragment>
								<FetchContractData
									drizzle={drizzle}
									drizzleState={drizzleState}
									handleBuyOrders={this.handleBuyOrders}
									handleSellOrders={this.handleSellOrders}
									handleCompletedTrades={this.handleCompletedTrades}
									handleTokensList={this.handleTokensList}
									handleLatestPrice={this.handleLatestPrice}
								/>
								<Layout>
									<Header
										style={{
											position: "",
											zIndex: 1,
											width: "100%",
											height: "50px",
										}}
									>
										<Menu
											theme="dark"
											mode="horizontal"
											defaultSelectedKeys={["2"]}
										>
											<Menu.Item key="1">nav 1</Menu.Item>
											<Menu.Item key="2">nav 2</Menu.Item>
											<Menu.Item key="3">nav 3</Menu.Item>
										</Menu>
									</Header>
									<Content>
										<WrappedComponent
											drizzle={drizzle}
											drizzleState={drizzleState}
											buyOrders={this.state.buyOrders}
											sellOrders={this.state.sellOrders}
											completedTrades={this.state.completedTrades}
											tokensList={this.state.tokensList}
											handleOrderClick={this.handleOrderClick}
											clickedOrder={this.state.clickedOrder}
										/>
									</Content>
									<Footer></Footer>
								</Layout>
							</React.Fragment>
						);
					}}
				</DrizzleContext.Consumer>
			);
		}
	};
};

export default HigherOrderComponent;
