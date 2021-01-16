import React, { Component } from "react";
import "./App.less";
import CelebrityExchangeComponent from "./components/CelebrityExchangeComponent";
import HigherOrderComponent from "./hocs/Layout";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends Component {
	render() {
		return (
			<React.Fragment>
				<Router>
					<section className="celebrityExchange">
						<Switch>
							<Route
								path="/trade/:symbol"
								render={(props) => {
									return (
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
									);
								}}
							></Route>
							<Route
								path="/"
								render={(props) => {
									return <h1>Homepage, go to /trade/FC-MSD to start</h1>;
								}}
							></Route>
						</Switch>
					</section>
				</Router>
			</React.Fragment>
		);
	}
}

App = HigherOrderComponent(App);
export default App;
