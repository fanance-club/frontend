import React, { useState, useEffect } from "react";

import { Helmet } from "react-helmet";
import { Card, Collapse, Table, Button, Avatar } from "antd";

import { Link } from "react-router-dom";

const { Meta } = Card;
const { Panel } = Collapse;
// name, vertical, category, country, symbol, price
const PlayersTable = (props) => {
	const [tokenDetails, setTokenDetails] = useState([]);
	const [sortedInfo, setSortedInfo] = useState({ columnKey: null });
	const [filteredInfo, setFilteredInfo] = useState({ category: "Cricket" });
	const [categoryFilter, setCategoryFilter] = useState([]);
	const [countryFilter, setCountryFilter] = useState([]);

	useEffect(() => {
		let tokensList = props.tokensList;
		let temp =
			typeof tokensList != "undefined"
				? tokensList.map((token, index, array) => {
						let details = token.name.split(/\s*\-\s*/g);
						array[index].playerName = details[2];
						array[index].country = details[3];
						array[index].DOB = details[4];
						array[index].price = token.latestPrice / 10 ** 18;
						array[index].key = token.id;
						array[index].ImageURL = `/${token.playerName}.jpg`;
						return true;
				  })
				: null;

		setTokenDetails(tokensList);
		let tempCategoryFilter = [];
		let tempCountryFilter = [];
		filterData(tokensList)((i) => i.category).forEach(function (item) {
			var i = tempCategoryFilter.findIndex((x) => x.text == item.text);
			if (i <= -1) {
				tempCategoryFilter.push({ text: item.text, value: item.value });
			}
		});
		filterData(tokensList)((i) => i.country).forEach(function (item) {
			var i = tempCountryFilter.findIndex((x) => x.text == item.text);
			if (i <= -1) {
				tempCountryFilter.push({ text: item.text, value: item.value });
			}
		});
		setCategoryFilter(tempCategoryFilter);
		setCountryFilter(tempCountryFilter);
	}, [props.tokensList]);
	const handleChange = (pagination, filters, sorter) => {
		setSortedInfo(sorter);
		setFilteredInfo(filters);
	};

	const filterData = (filterList) => (formatter) =>
		filterList.map((item) => ({
			text: formatter(item),
			value: formatter(item),
		}));
	const columns = [
		{
			title: "Category",
			dataIndex: "category",
			width: 100,
			filters: categoryFilter,
			// specify the condition of filtering result
			// here is that finding the name started with `value`
			// filteredValue: filteredInfo.category || null,
			onFilter: (value, record) => record.category.indexOf(value) === 0,
			sortOrder: sortedInfo.field === "category" && sortedInfo.order,
			sorter: (a, b) => a.category.localeCompare(b.category),
			ellipsis: true,
		},
		{
			title: "Symbol",
			dataIndex: "symbol",
			width: 100,
			// specify the condition of filtering result
			// here is that finding the name started with `value`
			sortOrder: sortedInfo.field === "symbol" && sortedInfo.order,
			sorter: (a, b) => a.symbol.localeCompare(b.symbol),
			ellipsis: true,
		},
		{
			title: "",
			dataIndex: "ImageURL",
			render: (theImageURL) => (
				<Avatar size={40} src={theImageURL} alt={theImageURL} />
			),
			width: 50,
			align: "right",
		},
		{
			title: "Name",
			dataIndex: "playerName",
			width: 150,
			// specify the condition of filtering result
			// here is that finding the name started with `value`
			sortOrder: sortedInfo.field === "playerName" && sortedInfo.order,
			sorter: (a, b) => a.playerName.localeCompare(b.playerName),
			ellipsis: true,
		},
		{
			title: "Country",
			dataIndex: "country",
			width: 100,
			filters: countryFilter,
			// specify the condition of filtering result
			// here is that finding the name started with `value`
			onFilter: (value, record) => record.country.indexOf(value) === 0,
			sortOrder: sortedInfo.field === "country" && sortedInfo.order,
			sorter: (a, b) => a.country.localeCompare(b.country),
			ellipsis: true,
		},
		{
			title: "Price",
			dataIndex: "price",
			width: 100,
			// specify the condition of filtering result
			// here is that finding the name started with `value`
			sortOrder: sortedInfo.field === "price" && sortedInfo.order,
			sorter: (a, b) => a.price - b.price,
			ellipsis: true,
		},
		{
			title: "",
			dataIndex: "symbol",
			render: (symbol) => (
				<Link to={`/trade/${symbol}`}>
					<Button type="primary" style={{ color: "white" }}>
						BUY / SELL
					</Button>
				</Link>
			),
			width: 100,
			align: "left",
		},
	];

	return (
		<div style={{ width: "80%" }}>
			<Table
				columns={columns}
				dataSource={tokenDetails}
				pagination={{ pageSize: 50 }}
				scroll={{ y: 350 }}
				onChange={handleChange}
				loading={typeof tokenDetails[0] == "undefined"}
			/>
		</div>
	);
};

export default PlayersTable;
