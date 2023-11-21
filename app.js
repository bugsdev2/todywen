const searchQuery = document.getElementById('search_query');
const searchButton = document.getElementById('search_btn');
const meaningContainer = document.getElementById('meaning-container');
const suggestionList = document.getElementById('suggestion-list');

searchButton.addEventListener('click', getMeaning);
searchQuery.addEventListener('change', getMeaning);

searchQuery.addEventListener('keypress', getSearchSuggestions);

function getSearchSuggestions(){
	suggestionList.innerText = '';
	fetch('word_list.json')
		.then(res => {
			return res.json();
		})
		.then(object => {
			const word_list = Object.keys(object);
			let searchWord = searchQuery.value.toLowerCase();
			let regex = new RegExp(`^${searchWord}`, '');
			const suggestions = [];
			for (word of word_list){
				if(word.match(regex)){
					if(suggestions.length<8){
						suggestions.push(word);
					}
				}
			}
			suggestions.map(suggestion => {
				if(searchQuery.value === '') {
					suggestionList.style.display = 'none';
					return;
				}
				const li = document.createElement('li');
				li.innerText = suggestion;
				li.addEventListener('click', (e) => {
					searchQuery.value = e.target.innerText;
					getMeaning(searchQuery.value);
					suggestionList.style.display = 'none';
				});
				suggestionList.appendChild(li);
				suggestionList.style.display = "block";
			});
		});
}

function getMeaning(){
	meaningContainer.innerText = '';
	let word = searchQuery.value.toLowerCase()
	if (word == '') return;
	fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
		.then(res => {
			 return res.json();
		})
		.then(data => {
			data.forEach((item,index) => {
				
				// FOR THE TITLE ITS RELATED ELEMENTS
				
				const titleContainer = document.createElement('div');
				titleContainer.className = 'row head-area py-2';
				const titleDiv = document.createElement('div');
				titleDiv.className = 'col d-flex justify-content-start align-items-baseline';
				
				
				//~ if(item.phonetics[0].audio !== '' || item.phonetics[1].audio !== ''){
					//~ var audioEl = document.createElement('audio');
					//~ audioEl.src = item.phonetics[0].audio || item.phonetics[1].audio;
					//~ var audioBtn = document.createElement('button');
					//~ audioBtn.addEventListener('click', () => {
						//~ audioEl.play();
					//~ });
					//~ audioBtn.className = 'btn btn-sm btn-dark text-light badge rounded-circle';
					//~ audioBtn.setAttribute('id', 'button');
					//~ var buttonIcon = document.createElement('span');
					//~ buttonIcon.className = 'bi bi-volume-up-fill';
					//~ audioBtn.appendChild(buttonIcon);
				//~ }
				
				
				const title = document.createElement('span');
				title.className = 'fw-bold fs-2 text-decoration-capitalize';
				title.innerText = item.word;
				if(data.length > 1){					
					var itemNumber = document.createElement('span');
					itemNumber.className = 'ms-1';
					itemNumber.innerText = index+1;
				}
					
				if(item.phonetics.length){
					var phoneticDiv = document.createElement('span');
					phoneticDiv.className = 'mx-3';
					phoneticDiv.innerText = item.phonetic || item.phonetics[0].text || item.phonetics[1].text;	
					//~ if(item.phonetics[0].audio || item.phonetics[1].audio){
						//~ titleDiv.appendChild(audioEl);
						//~ titleDiv.appendChild(audioBtn);	
					//~ }
				}
				titleDiv.appendChild(title);
				if(data.length>1) titleDiv.appendChild(itemNumber);
				if(phoneticDiv) titleDiv.appendChild(phoneticDiv);
				titleContainer.appendChild(titleDiv);
				
				/////////////////////////////////////
				
				//////////////////// FOR THE MEANINGS
				
				var definitionContainer = document.createElement('div');
				definitionContainer.className = 'row my-2';
				item.meanings.forEach(item => {
					const posDiv = document.createElement('div');
					posDiv.className = 'fs-5 my-2 fw-bold';
					posDiv.innerText = item.partOfSpeech;
					const definitionWord = document.createElement('div');
					definitionWord.className = 'fw-bold';
					definitionWord.innerText = 'Definition';
					const ul = document.createElement('ul');
					ul.className = 'd-flex flex-column gap-3 ps-5';
					item.definitions.forEach(nestedItem => {
						const li = document.createElement('li');
						li.innerText = nestedItem.definition;
						ul.appendChild(li);
					});
					definitionContainer.appendChild(posDiv);
					definitionContainer.appendChild(definitionWord);
					definitionContainer.appendChild(ul);
				});
				
				////////////////////////////////////
				
				meaningContainer.appendChild(titleContainer);
				meaningContainer.appendChild(definitionContainer);
			});
			suggestionList.style.display = 'none';
		})
		.catch(err => {
			console.log(err);
			if(err){
				meaningContainer.innerHTML = `<div class="h3">"${word}" not found in the Dictionary</div>`;
			}
		})
}
