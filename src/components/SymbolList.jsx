import { useEffect, useState } from 'react';

import '../styles/SymbolList.css';

export const SymbolList = ({ symbolSaved, setSymbolSaved }) => {
	const [symbols, setSymbols] = useState([]);

	useEffect(() => {
		const symbolsStorage = JSON.parse(localStorage.getItem('symbols'));
		symbolsStorage?.length > 0 && setSymbols(symbolsStorage);
		return () => setSymbolSaved(false);
	}, [symbolSaved]);
	const renderSymbols = () => {
		return symbols?.map((symbol) => <span className='symbol'>{symbol}</span>);
	};
	return (
		<div className='symbols-container'>
			<h3>Favorite Symbols</h3>
			<ul className='symbol-container'>{renderSymbols()}</ul>
		</div>
	);
};
