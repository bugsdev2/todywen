const searchQuery = document.getElementById('search_query');
const searchButton = document.getElementById('search_btn');
const meaningContainer = document.getElementById('meaning-container');

searchButton.addEventListener('click', getMeaning);
searchQuery.addEventListener('change', getMeaning);


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
				//~ console.log(item);
				
				// FOR THE TITLE ITS RELATED ELEMENTS
				
				const titleContainer = document.createElement('div');
				titleContainer.className = 'row head-area py-2';
				const titleDiv = document.createElement('div');
				titleDiv.className = 'col d-flex justify-content-start align-items-baseline';
				
				if(item.phonetics[0].audio || item.phonetics[1].audio){
					var audioEl = document.createElement('audio');
					audioEl.src = item.phonetics[0].audio || item.phonetics[1].audio ;
					var audioBtn = document.createElement('button');
					audioBtn.className = 'btn btn-sm btn-dark badge rounded-circle';
					audioBtn.setAttribute('id', 'button');
					var buttonIcon = document.createElement('span');
					buttonIcon.className = 'bi bi-volume-up-fill';
					audioBtn.appendChild(buttonIcon);
				}
				
				
				const title = document.createElement('span');
				title.className = 'fw-bold fs-2 ms-2 text-decoration-capitalize';
				title.innerText = item.word;
				if(data.length > 1){					
					var itemNumber = document.createElement('span');
					itemNumber.className = 'ms-1';
					itemNumber.innerText = index+1;
				}
					
				
				const phoneticDiv = document.createElement('span');
				phoneticDiv.className = 'mx-3';
				phoneticDiv.innerText = item.phonetics[0].text || item.phonetics[1].text;
				if(item.phonetics[0].audio || item.phonetics[1].audio){
					titleDiv.appendChild(audioEl);
					titleDiv.appendChild(audioBtn);	
				}
				titleDiv.appendChild(title);
				if(data.length>1) titleDiv.appendChild(itemNumber);
				titleDiv.appendChild(phoneticDiv);
				titleContainer.appendChild(titleDiv);
				
				/////////////////////////////////////
				
				// FOR THE MEANINGS
				
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
				
				///////////////////
				
				meaningContainer.appendChild(titleContainer);
				meaningContainer.appendChild(definitionContainer);
			});
			
		})
}
