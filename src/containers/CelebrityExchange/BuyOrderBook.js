import React from "react";

export default function BuyOrderBook(props) {
	const handleOrderClick = (order, volume) => {
		props.handleOrderClick(order, volume);
	};
	const buyOrders = props.buyOrders
		.filter((a) =>
			typeof a != "undefined"
				? a.celebrityToken ==
						(typeof props.token[0] != "undefined"
							? props.token[0].address
							: null) &&
				  (a.status == 0 || a.status == 1)
				: null
		)
		.sort((a, b) => b.buyPrice - a.buyPrice);
	let volume = 0;
	return (
		<React.Fragment>
			{typeof buyOrders != "undefined"
				? buyOrders.map((order, index, array) => {
						if (
							typeof order != "undefined" &&
							typeof array[index + 1] != "undefined"
								? order.buyPrice == array[index + 1].buyPrice
								: null
						) {
							volume += Number(order.tokensLeftToBuy);
							return null;
						} else {
							let tempVolume = Number(volume) + Number(order.tokensLeftToBuy);
							volume = 0;
							return (
								<tr
									key={index}
									onClick={() => handleOrderClick(order, tempVolume)}
								>
									<td>
										{typeof order != "undefined" ? tempVolume / 10 ** 18 : null}
									</td>
									<td style={{ color: "#55bd6c" }}>
										{typeof order != "undefined"
											? order.buyPrice / 10 ** 18
											: null}
									</td>
								</tr>
							);
						}
				  })
				: null}
		</React.Fragment>
	);
}
