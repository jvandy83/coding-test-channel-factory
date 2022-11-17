import { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import '../../styles/SearchForm.css';

export const SearchForm = ({ setStock }) => {
	const [values, setValues] = useState({});
	const [symbols, setSymbols] = useState([]);
	const [errors, setErrors] = useState({});
	const [hint, setHint] = useState('');
	const [submitting, setSubmitting] = useState(false);

	const validateEntries = (entries) => {
		const isFutureDate = (d) => new Date(d) > new Date(Date.now());
		const { symbol, date } = entries;
		const tempErrors = {};
		if (!symbol) {
			tempErrors.symbol = 'Please select a symbol';
		}
		if (!date || isFutureDate(date)) {
			tempErrors.date = 'Please select a valid date';
		}
		setErrors(tempErrors);
		return tempErrors;
	};
	const handleSearchStock = async (e) => {
		e && e.preventDefault();
		const { symbol, date } = validateEntries(values);
		console.log('symbol: ', symbol, 'date: ', date);
		!symbol && !date && setSubmitting(true);
	};
	const handleSearchSymbol = async (e) => {
		e && e.preventDefault();
		const baseUrl = process.env.REACT_APP_POLYGON_BASE_URL;
		const apiKey = process.env.REACT_APP_POLYGON_API_KEY;
		try {
			const res = await axios.get(
				`${baseUrl}/v3/reference/tickers?active=true&search=${values.searchItem}&apiKey=${apiKey}`,
			);
			const { results } = res.data;
			if (results.length > 0) {
				setHint(
					'(The symbols that matched your search string are in the select input below)',
				);
				setSymbols(results);
			} else {
				setHint(
					'(Search results yielded no values, try a different search string)',
				);
			}
		} catch (error) {
			console.log(error.message);
		}
	};
	const handleChange = (e) => {
		const { name, value } = e.target;
		setValues((prev) => ({
			...prev,
			[name]: value,
		}));
	};
	useEffect(() => {
		const baseUrl = process.env.REACT_APP_POLYGON_BASE_URL;
		const apiKey = process.env.REACT_APP_POLYGON_API_KEY;
		submitting &&
			axios
				.get(
					`${baseUrl}/v1/open-close/${values.symbol}/${values.date}?adjusted=true&apiKey=${apiKey}`,
				)
				.then((res) => {
					const data = res.data;
					setValues({});
					setStock(data);
				})
				.catch((err) => console.error(err.message));
		return () => {
			setSubmitting(false);
			setHint('');
		};
	}, [submitting]);
	return (
		<form className='search-form'>
			<div>
				<h2>Search for stock symbol by company name</h2>
				<div className='hint-container'>
					<p className='hint'>{hint && hint}</p>
				</div>

				<div className='search-input'>
					<div>
						<label htmlFor='searchItem'>Company name: </label>
						<input
							id='searchItem'
							type='text'
							name='searchItem'
							onChange={handleChange}
							value={values.searchItem || ''}
						/>
					</div>
					<button onClick={handleSearchSymbol}>Search</button>
				</div>
			</div>
			<div>
				<div className='stock-search-container'>
					<h2>Search stock data</h2>
					<p className='input-errors'>
						{Object.keys(errors).length > 0 && (
							<>
								<p>{errors.date && errors.date}</p>
								<p>{errors.symbol && errors.symbol}</p>
							</>
						)}
					</p>
				</div>
				<div className='symbol-input-container'>
					<label htmlFor='symbol'>Symbol: </label>
					<select
						id='symbol'
						name='symbol'
						onChange={handleChange}
						value={values.symbol || ''}
					>
						<option value=''>Please select a symbol</option>
						{symbols &&
							symbols.map((item) => (
								<option key={uuidv4()} value={item.ticker}>
									{item.ticker}
								</option>
							))}
					</select>
				</div>
				<div>
					<label htmlFor='date'>Date: </label>
					<input
						id='date'
						type='date'
						name='date'
						onChange={handleChange}
						value={values.date || ''}
					/>
				</div>
			</div>
			<button className='find-button' onClick={handleSearchStock}>
				Find
			</button>
		</form>
	);
};
