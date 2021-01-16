import React from "react";
import { Card, Avatar } from "antd";
const { Meta } = Card;

const IndividualTokenDetail = (props) => {
	const percentage = (
		(props.token.latestPrice / props.token.previousPrice) * 100 -
		100
	).toFixed(2);
	return (
		<Card
			className="individualToken"
			bordered="true"
			style={{
				boxShadow: `${
					props.symbol == props.token.symbol ? "0px 0px 5px #18ffff" : ""
				}`,
			}}
		>
			<Meta
				avatar={<Avatar size={60} src={`/${props.token.playerName}.jpg`} />}
				title={props.token.playerName}
				description={
					props.token.latestPrice > 0 ? props.token.latestPrice / 10 ** 18 : "0"
				}
			/>
			{percentage > 0 && isFinite(percentage) ? (
				<span
					style={{
						position: "absolute",
						right: "10px",
						bottom: "5px",
						fontSize: "10px",
						color: "#55bd6c",
					}}
				>
					{percentage}% &#9650;
				</span>
			) : isFinite(percentage) ? (
				<span
					style={{
						position: "absolute",
						right: "10px",
						bottom: "5px",
						fontSize: "10px",
						color: "#f1432f",
					}}
				>
					{percentage}% &#9660;
				</span>
			) : (
				<span
					style={{
						position: "absolute",
						right: "10px",
						bottom: "5px",
						fontSize: "10px",
						color: "#fff",
					}}
				>
					--
				</span>
			)}
		</Card>
	);
};

export default IndividualTokenDetail;
