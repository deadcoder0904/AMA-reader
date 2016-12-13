document.addEventListener('DOMContentLoaded', function () {

	const fetchData = () =>
		fetch('https://raw.githubusercontent.com/deadcoder0904/scrape-amas/master/amas.json')
			.then(data => data.json());

	const displayData = (data) => {
		console.log(data);
		const arr = [];

		for (let item of data) {
			const {avatar, description, fullname, link, username} = item;

			const block = `
				<div class="items fl pa4 tc">
			  	<a href="${link}" target="_blank"><img src="${avatar}" class="img br-100 pa1 ba b--black-10 h4 w4 pointer" alt="${username}" onerror="this.src='https://github.com/sindresorhus.png?size=200'" title="Read AMA" /></a><br />
				  <a href="https://github.com/${username}" target="_blank" class="link white" title="Visit GitHub Profile">@${fullname}</a>
					<blockquote class="desc">${description}</blockquote>
				</div>
				`;
			arr.push(block);
		}
		const temporary = document.createElement(`div`);
		temporary.className = 'box';
		temporary.innerHTML = arr.join('');
		awesomeAmas.insertBefore(temporary,awesomeAmas.lastChild);

	}

	const togglePopularAMAs = () => {
		showPopularAMAs = !showPopularAMAs;
		awesomeAmas.style.display = showPopularAMAs ? 'block':'none';
		amaList.style.display = !showPopularAMAs ? 'block':'none';
	};

	const toggleDisplay = (el,value) => {
		el.style.display = value;
	}

	fetchData().then(data => displayData(data));

	let showPopularAMAs = true;
	const form = document.getElementById('search-form');
	const awesomeAmas = document.getElementById('awesome-amas');
	const amaList = document.getElementById('ama-list');
	const input = document.getElementsByName('search-input');
	const nooby = document.getElementById('nooby');
	const awe = document.getElementById('awe');
	const img = document.getElementsByClassName('img');
	toggleDisplay(awesomeAmas,'none');
	toggleDisplay(amaList,'none');

	awe.addEventListener('click',() => {
		toggleDisplay(awesomeAmas,'block');
		toggleDisplay(nooby,'none');
	});

	Array.from(img).map(a =>
			a.addEventListener('click',() => {
				toggleDisplay(awesomeAmas,'none');
				toggleDisplay(amaList,'block');
		})
	);

	form.addEventListener('submit',(e) => {
		e.preventDefault();
		if(input[0].value.trim().length === 0)
			return;
	});

});
