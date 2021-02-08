import React from "react";

export default function SellOrderBook(props) {
	const handleOrderClick = (order, volume) => {
		props.handleOrderClick(order, volume);
	};
	const sellOrders = props.sellOrders
		.filter((a) =>
			typeof a != "undefined"
				? a.celebrityToken ==
						(typeof props.token[0] != "undefined"
							? props.token[0].address
							: null) &&
				  (a.status == 0 || a.status == 1)
				: null
		)
		.sort((a, b) => a.sellPrice - b.sellPrice);
	let volume = 0;
	return (
		<React.Fragment>
			{typeof props.sellOrders != "undefined"
				? sellOrders.map((order, index, array) => {
						if (
							typeof order != "undefined" &&
							typeof array[index + 1] != "undefined"
								? order.sellPrice == array[index + 1].sellPrice
								: null
						) {
							volume += Number(order.tokensLeftToSell);
							return null;
						} else {
							let tempVolume = Number(volume) + Number(order.tokensLeftToSell);
							volume = 0;
							return (
								<tr
									key={index}
									onClick={() => handleOrderClick(order, tempVolume)}
								>
									<td style={{ color: "#f1432f" }}>
										{typeof order != "undefined"
											? (order.sellPrice / 10 ** 18).toFixed(5)
											: null}
									</td>
									<td>
										{typeof order != "undefined"
											? (tempVolume / 10 ** 18).toFixed(5)
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
