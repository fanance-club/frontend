import React, { Component } from "react";
import { Layout, Menu, Image, BackTop } from "antd";
import FetchContractData from "./FetchContractData";
import { DrizzleContext } from "drizzle-react";
import { HashRouter, Link } from "react-router-dom";
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
											backgroundColor: "#212121",
										}}
									>
										<Menu
											theme="dark"
											mode="horizontal"
											defaultSelectedKeys={[""]}
											style={{ backgroundColor: "#212121" }}
										>
											<HashRouter>
												<Link to="/">
													<img
														src="/logo rect.png"
														alt="Logo"
														height="25px"
													></img>
												</Link>
											</HashRouter>
											<Menu.Item
												key="2"
												className="matic-widget-button"
												data-default-page="home"
												data-wapp-id="D9TcxvjMLp2gCJhKeMIv"
												style={{ color: "white" }}
											>
												Wallet
											</Menu.Item>
											<Menu.Item key="3">
												<HashRouter>
													<Link to="/trade/FC-MSD" style={{ color: "white" }}>
														Trade
													</Link>
												</HashRouter>
											</Menu.Item>
											<Menu.Item key="4" style={{ color: "white" }}>
												Buy FANC Tokens
											</Menu.Item>
											<Menu.Item key="5" style={{ color: "white" }}>
												Account
											</Menu.Item>
											<span
												style={{
													float: "right",
													color: "#f6851b",
												}}
											>
												<img
													src="/Metamask.png"
													alt="Metamask Logo"
													height="30px"
												></img>{" "}
												Connect to Metamask
											</span>
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
								<BackTop />
							</React.Fragment>
						);
					}}
				</DrizzleContext.Consumer>
			);
		}
	};
};

export default HigherOrderComponent;
