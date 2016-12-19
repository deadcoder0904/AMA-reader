document.addEventListener('DOMContentLoaded', function () {

	const client_id = 'c2360ffa5fe8d1c8c28c';
	const client_secret = 'a18ab7121535f37ec0765f882cd5200cbb25ae7c';

	const expandAnswer = () => {

	};

	const fetchPopularAMAs = () =>
		fetch(`https://raw.githubusercontent.com/deadcoder0904/scrape-amas/master/amas.json?client_id=${client_id}&client_secret=${client_secret}`)
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
		fetch(`https://api.github.com/repos/${username}/ama/issues?state=closed&page=${page}&per_page=10&client_id=${client_id}&client_secret=${client_secret}`)
			.then(data => data.json());

	const displaySpecificAMA = (data,username) => {
		const arr = [];

		for (let item of data){
			const {title, body, user } = item;
			fetch(`${item.comments_url}?client_id=${client_id}&client_secret=${client_secret}`)
				.then(res => res.json())
				.then(ans => {
					let desc = marked(body).trim() === '' ? 'No Description Provided' : marked(body);
					let question = item.title.trim().length === 1 ? 'No Title for the Question Provided' : title;
					let block = `
							<div class="q ba b--white-40 pa3 pointer">
									<div class="white f3"> ↪ ${question}</div>
									<div class="a">
										<a class='black link f2 pv6' href='https://github.com/${user.login}' target='_blank'>@${user.login}</a>
										<div class="f4 text-box">
											${desc}
										</div>
							`;
					for (let a of ans) {
						block = `
							${block}
									<a class='black link f2 pv6' href='https://github.com/${a.user.login}' target='_blank'>@${a.user.login}</a>
									<div class="f3 text-box">${marked(a.body)}</div>
							`;
					}
					block = `${block}
							<div class="view_on_github shadow-5 br-pill"><a href='${item.html_url}' target='_blank'>View On GitHub</a></div>
						</div>
					</div>`;
					arr.push(block);
					const temporary = document.createElement(`div`);
					temporary.className = 'question-box';
					temporary.innerHTML = arr.join('');
					amaList.prepend(temporary);
			});
		}
		toggleDisplay(amaList,'block');
		expandAnswer();
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
						const username = img.alt;
						fetchSpecificAMA(username,1).then(data => displaySpecificAMA(data,username));
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
		input[0].value = '';
		toggleDisplay(awesomeAmas,'none');
		toggleDisplay(nooby,'none');
		fetchSpecificAMA(username,1).then(data => displaySpecificAMA(data,username));
	});

});
