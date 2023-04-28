import './App.css';
import patternImg from './images/pattern-bg-desktop.png';
import iconArrow from './images/icon-arrow.svg';
import iconLocation from './images/icon-location.svg';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useState } from 'react';

function App() {
	const [iPAddressOrDomainInput, setIpAddressOrDomainInput] = useState('');
	const [location, setLocation] = useState({
		ip: '192.212.174.101',
		city: 'South San Gabriel',
		country: 'US',
		timezone: '-07:00',
		isp: 'Southern California Edison',
		latitude: 34.04915,
		longitude: -118.09462,
	});
	const [error, setError] = useState(null);

	const myIcon = L.icon({
		iconUrl: iconLocation,
		iconSize: [40, 50],
	});

	const handleInputChange = (event) => {
		setError(null);
		setIpAddressOrDomainInput(event.target.value);
	};

	const getLocation = async (inputType) => {
		const response = await fetch(
			`https://geo.ipify.org/api/v2/country,city?apiKey=at_COrOZ7WTZ2WyxRZCjjAF4uuvEGeY5&${inputType}=${iPAddressOrDomainInput}`
		);
		const data = await response.json();
		if (data.messages) {
			setError(data.messages);
			return;
		}
		setLocation({
			ip: data.ip,
			city: data.location.city,
			country: data.location.country,
			timezone: data.location.timezone,
			isp: data.isp,
			latitude: data.location.lat,
			longitude: data.location.lng,
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!iPAddressOrDomainInput) {
			alert('Please enter IP address or domain.');
			return;
		}
		if (!isNaN(iPAddressOrDomainInput.charAt(0))) {
			getLocation('ipAddress');
		} else {
			getLocation('domain');
		}
	};

	const handleKeypress = (e) => {
		if (e.key === 'Enter') {
			handleSubmit(e);
		}
	};

	return (
		<main className="App">
			<section className="header-input">
				<h1>IP Address Tracker</h1>
				<article className="input-article">
					<input
						type="text"
						value={iPAddressOrDomainInput}
						onChange={handleInputChange}
						onKeyPress={handleKeypress}
						placeholder="Search for any IP address or domain"
					/>
					<img
						onClick={handleSubmit}
						className="arrow-icon-img"
						src={iconArrow}
						alt="arrow"
					/>
				</article>
				{error && <p className="error-message">{error}</p>}
			</section>
			<ul className="header-description">
				<li>
					<h2>ip address</h2>
					<p>{location.ip}</p>
				</li>
				<li>
					<h2>location</h2>
					<p>{`${location.city}, ${location.country}`}</p>
				</li>
				<li>
					<h2>timezone</h2>
					<p>{`UTC ${location.timezone}`}</p>
				</li>
				<li>
					<h2>isp</h2>
					<p>{location.isp}</p>
				</li>
			</ul>
			<img className="banner-img" src={patternImg} alt="patten"></img>
			<MapContainer
				key={JSON.stringify([location.latitude, location.longitude])}
				center={[location.latitude, location.longitude]}
				zoom={12}
				scrollWheelZoom={true}
			>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				/>
				<Marker
					position={[location.latitude, location.longitude]}
					icon={myIcon}
				/>
			</MapContainer>
			<div className="attribution">
				Challenge by{' '}
				<a href="https://www.frontendmentor.io/challenges/ip-address-tracker-I8-0yYAH0">
					IP Address Tracker - Frontend Mentor
				</a>
				. Coded by:
				<a href="https://www.frontendmentor.io/profile/jadilovic">
					Jasmin Adilovic
				</a>
				.
			</div>
		</main>
	);
}

export default App;
