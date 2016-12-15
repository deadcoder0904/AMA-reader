document.addEventListener('DOMContentLoaded', function () {

	const fetchPopularAMAs = () =>
		fetch('https://raw.githubusercontent.com/deadcoder0904/scrape-amas/master/amas.json')
			.then(data => data.json());

	const displayPopularAMAs = (data) => {
		const arr = [];

		for (let item of data) {
			const {avatar, description, fullname, username} = item;

			const block = `
				<div class="items fl pa4 tc">
			  	<img src="${avatar}" class="avatar-img br-100 pa1 ba b--black-10 h4 w4 pointer" alt="${username}" onerror="this.src='https://avatars0.githubusercontent.com/u/1597919?v=3&s=88'" title="Read AMA" /><br />
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

	const fetchSpecificAMA = (username,page) =>
		fetch(`https://api.github.com/repos/${username}/ama/issues?state=closed&page=${page}&per_page=100`)
			.then(data => data.json());

	const displaySpecificAMA = (data) => {

	}

	const toggleDisplay = (el,value) => {
		el.style.display = value;
	}

	fetchPopularAMAs().then(data => displayPopularAMAs(data));

	let showPopularAMAs = true;
	const form = document.getElementById('search-form');
	const awesomeAmas = document.getElementById('awesome-amas');
	const amaList = document.getElementById('ama-list');
	const input = document.getElementsByName('search-input');
	const nooby = document.getElementById('nooby');
	const awe = document.getElementsByClassName('awe');
	let avatar;

	toggleDisplay(awesomeAmas,'none');
	toggleDisplay(amaList,'none');

	for (let a of awe) {
		a.addEventListener('click',() => {
			toggleDisplay(awesomeAmas,'block');
			toggleDisplay(nooby,'none');
			toggleDisplay(amaList,'none');
			avatar = document.getElementsByClassName('avatar-img');
			Array.from(avatar).map(img =>
					img.addEventListener('click',() => {
						toggleDisplay(awesomeAmas,'none');
						toggleDisplay(nooby,'none');
						toggleDisplay(amaList,'block');
				})
			);
			Array.from(document.getElementsByTagName('a')).map(anchor => anchor.className += ' link white');
		});
	}

	form.addEventListener('submit',(e) => {
		e.preventDefault();
		const username = input[0].value.trim();
		if(username.length === 0)
			return;
		toggleDisplay(amaList,'block');
		toggleDisplay(awesomeAmas,'none');
		toggleDisplay(nooby,'none');
		fetchSpecificAMA(username,page).then(d => displaySpecificAMA(d));
	});

});
