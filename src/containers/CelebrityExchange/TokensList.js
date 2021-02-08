import React, { useState, useEffect } from "react";
import { Card, Collapse } from "antd";
import { groupBy, mapValues } from "lodash";

import { Link } from "react-router-dom";

import IndividualTokenDetail from "./IndividualTokenDetail";

const { Meta } = Card;
const { Panel } = Collapse;

const TokensList = (props) => {
	const [tokenDetails, setTokenDetails] = useState();
	const [verticalKey, setVerticalKey] = useState();
	const [categoryKey, setCategoryKey] = useState();
	useEffect(() => {
		let tokensList = props.tokensList;
		tokensList.map((token, index, array) => {
			let details = token.name.split(/\s*\-\s*/g);
			array[index].playerName = details[2];
			array[index].country = details[3];
			array[index].DOB = details[4];
			if (token.symbol === props.symbol) {
				setVerticalKey(token.vertical);
				setCategoryKey(token.category);
			}
			return true;
		});
		const nest = function (seq, keys) {
			if (!keys.length) return seq;
			var first = keys[0];
			var rest = keys.slice(1);
			return mapValues(groupBy(seq, first), function (value) {
				return nest(value, rest);
			});
		};
		tokensList = nest(tokensList, ["vertical", "category"]);
		setTokenDetails(tokensList);
	}, [props.tokensList, props.symbol]);
	const onPanelChange = (e) => {
		setCategoryKey(e[1]);
	};
	return (
		<div>
			<Card className="tokensList" style={{ overflow: "auto" }}>
				<Meta title="Celebrities" />
				{typeof tokenDetails != "undefined" ? (
					<Collapse
						activeKey={[verticalKey]}
						ghost
						className="site-collapse-custom-collapse"
						onChange={onPanelChange}
					>
						{Object.keys(tokenDetails).map((vertical, i) => {
							return (
								<Panel
									header={vertical}
									key={vertical}
									className="site-collapse-custom-panel"
								>
									<Collapse
										activeKey={[categoryKey]}
										ghost
										className="site-collapse-custom-collapse"
										onChange={onPanelChange}
									>
										{Object.keys(tokenDetails[vertical]).map((category, i) => {
											let tokens = tokenDetails[vertical][category];
											return (
												<Panel
													header={category}
													key={category}
													className="site-collapse-custom-panel"
												>
													{tokens.map((token) => {
														return (
															<Link
																to={`/trade/${token.symbol}`}
																key={token.address}
															>
																<IndividualTokenDetail
																	token={token}
																	key={token.address}
																	symbol={props.symbol}
																/>
															</Link>
														);
													})}
												</Panel>
											);
										})}
									</Collapse>
								</Panel>
							);
						})}
					</Collapse>
				) : null}
			</Card>
		</div>
	);
};

export default TokensList;
