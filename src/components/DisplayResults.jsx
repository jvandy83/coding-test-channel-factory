import { useEffect, useState } from 'react';
import axios from 'axios';

import '../styles/DisplayResults.css';

export const DisplayResults = ({ stock, handleSaveSymbol }) => {
	const [metaData, setMetaData] = useState({});

	const renderStockValues = () => {
		return (
			<ul className='stock-values'>
				<li className='row'>{stock.close}</li>
				<li className='row'>{stock.from}</li>
				<li className='row'>{stock.high}</li>
				<li className='row'>{stock.low}</li>
				<li className='row'>{stock.open}</li>
				<li className='row'>{stock.symbol}</li>
				<li className='row'>{stock.volume}</li>
			</ul>
		);
	};

	const renderStockHeaders = () => {
		return (
			<ul className='stock-headers'>
				<li className='stock-value row row-header'>Close</li>
				<li className='stock-value row row-header'>From</li>
				<li className='stock-value row row-header'>High</li>
				<li className='stock-value row row-header'>Low</li>
				<li className='stock-value row row-header'>Open</li>
				<li className='stock-value row row-header'>Symbol</li>
				<li className='stock-value row row-header'>Volume</li>
			</ul>
		);
	};

	useEffect(() => {
		axios
			.get(
				`https://api.polygon.io/v3/reference/tickers/${stock?.symbol}?apiKey=${process.env.REACT_APP_POLYGON_API_KEY}`,
			)
			.then(async (res) => {
				const data = await res.data;
				const { results } = data;
				setMetaData(results);
			})
			.catch((err) => console.error(err.message));
	}, [stock.symbol]);

	return (
		<div className='display-results'>
			{Object.keys(metaData).length > 0 ? (
				<p className='stock-title'>{`${metaData?.name} (${metaData?.ticker})`}</p>
			) : (
				<p className='stock-title'>{`(Title)`}</p>
			)}
			<div className='stock-summary'>
				{renderStockHeaders()}
				{renderStockValues()}
			</div>
			{Object.keys(metaData).length > 0 && (
				<div className='button-container'>
					<button onClick={handleSaveSymbol} className='save-symbol-button'>
						Save this ticker symbol
					</button>
				</div>
			)}
		</div>
	);
};
