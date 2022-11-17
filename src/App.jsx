import { useEffect, useState } from 'react';
import { SearchForm } from './components/forms/SearchForm';
import { DisplayResults } from './components/DisplayResults';
import { SymbolList } from './components/SymbolList';
import axios from 'axios';
import './App.css';

function App() {
	const [stock, setStock] = useState({ price: 20 });
	const [tickerResults, setTickerResults] = useState([]);
	const [nextUrl, setNextUrl] = useState('');
	const [symbolSaved, setSymbolSaved] = useState(false);

	console.log(stock);

	const handleSaveSymbol = () => {
		const storageSymbols = JSON.parse(localStorage.getItem('symbols'));
		if (storageSymbols) {
			localStorage.setItem(
				'symbols',
				JSON.stringify([...storageSymbols, stock?.symbol]),
			);
		} else {
			localStorage.setItem('symbols', JSON.stringify([stock?.symbol]));
		}
		setSymbolSaved(true);
	};

	useEffect(() => {
		const baseUrl = process.env.REACT_APP_POLYGON_BASE_URL;
		const apiKey = process.env.REACT_APP_POLYGON_API_KEY;
		axios
			.get(`${baseUrl}/v3/reference/tickers?apiKey=${apiKey}`)
			.then(async (res) => {
				const data = await res.data;
				const { results, next_url } = data;
				setNextUrl(next_url);
				const createSelectOptions = results.map(({ ticker, name }) => {
					return { ticker, name };
				});
				setTickerResults(createSelectOptions);
			});
	}, []);
	return (
		<div className='App'>
			<div className='app-title'>
				<h1>Stock Ticker App</h1>
			</div>
			<div className='app-container'>
				<div className='app-nested-container'>
					<SearchForm
						setTickerResults={setTickerResults}
						tickerResults={tickerResults}
						setStock={setStock}
						nextUrl={nextUrl}
					/>
					<SymbolList
						symbolSaved={symbolSaved}
						setSymbolSaved={setSymbolSaved}
					/>
				</div>
				<DisplayResults handleSaveSymbol={handleSaveSymbol} stock={stock} />
			</div>
		</div>
	);
}

export default App;
