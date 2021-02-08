import React, { Component } from "react";
import "./App.less";
import CelebrityExchangeComponent from "./components/CelebrityExchangeComponent";
import PlayersTable from "./components/PlayersTable";
import HigherOrderComponent from "./hocs/Layout";
import { Helmet } from "react-helmet";
import {
	BrowserRouter as Router,
	HashRouter,
	Route,
	Switch,
} from "react-router-dom";

class App extends Component {
	render() {
		return (
			<React.Fragment>
				<HashRouter>
					<Switch>
						<Route
							exact
							path="/trade/:symbol"
							render={(props) => {
								return (
									<section className="celebrityExchange">
										<CelebrityExchangeComponent
											{...props} // for match
											drizzle={this.props.drizzle}
											drizzleState={this.props.drizzleState}
											buyOrders={this.props.buyOrders}
											sellOrders={this.props.sellOrders}
											completedTrades={this.props.completedTrades}
											tokensList={this.props.tokensList}
											handleOrderClick={this.props.handleOrderClick}
											clickedOrder={this.props.clickedOrder}
										/>
									</section>
								);
							}}
						></Route>
						<Route
							path="/"
							render={(props) => {
								return (
									<React.Fragment>
										<h1>Header</h1>
										<h1>APIs</h1>

										<div style={{ display: "flex", justifyContent: "center" }}>
											<PlayersTable
												tokensList={this.props.tokensList}
												drizzleState={this.props.drizzleState}
											/>
										</div>
										<Helmet>
											<script
												src="https://wallet.matic.today/embeds/widget-button.js"
												data-script-name="matic-embeds"
											></script>
										</Helmet>
									</React.Fragment>
								);
							}}
						></Route>
					</Switch>
				</HashRouter>
			</React.Fragment>
		);
	}
}

App = HigherOrderComponent(App);
export default App;
