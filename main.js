let newsArray = [];
let page = 1;
let totalPages = 0;
let menu = document.querySelectorAll(".menu button");
menu.forEach((menu) =>
	menu.addEventListener("click", (event) => getNewsByTopic(event))
);
let url;
const getNews = async () => {
	try {
		let header = new Headers({
			"x-api-key": "84KiV3HrOWlXN5HbVYuPOWt_LRDMj2iYfxikTDr_PXg",
		});
		url.searchParams.set("page", page); //setting the page query
		let response = await fetch(url, { headers: header });
		let data = await response.json();
		console.log(response.status);
		if (response.status == 200) {
			if (data.total_hits == 0) {
				throw new Error("No search Result");
			}
			console.log("data received", data);
			newsArray = data.articles; //array
			totalPages = data.total_pages;
			page = data.page;
			render();
			pagination();
		} else {
			throw new Error(data.message);
		}
	} catch (error) {
		alert(error.message, "danger");
	}
};

let alertPlaceholder = document.getElementById("liveAlertPlaceholder");

function alert(message, type) {
	var wrapper = document.createElement("div");
	wrapper.innerHTML =
		'<div class="alert alert-' +
		type +
		' alert-dismissible" role="alert">' +
		message +
		'<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';

	alertPlaceholder.append(wrapper);
}

const getLatestNews = async () => {
	url = new URL(
		"https://api.newscatcherapi.com/v2/latest_headlines?countries=CA&topic=business&page_size=10"
	);
	console.log(url);
	getNews();
};

const getNewsByTopic = async (event) => {
	console.log("clicked", event.target.textContents);

	let topic = event.target.textContent.toLowerCase();
	url = new URL(
		`https://api.newscatcherapi.com/v2/latest_headlines?countries=CA&page_size=10&topic=${topic}`
	);
	getNews();
};

const getNewsByKeyword = async () => {
	let keyword = document.getElementById("search-input").value;

	url = new URL(
		`https://api.newscatcherapi.com/v2/search?q=${keyword}&countries=CA&page_size=10`
	);
	getNews();
};

const render = () => {
	let newsHTML = ``;
	//don't use for loop
	newsHTML = newsArray
		.map((item) => {
			return `<div class="row news-articles">
      <div class="col-lg-4">
        <img
          class="news-img-size"
          src="${item.media}"
        />
      </div>

      <div class="col-lg-8">
        <h2>${item.title}</h2>
        <p>${item.summary}</p>
        <div>${item.rights} ${item.published_date}</div>
      </div>
    </div>`;
		})
		.join("");

	document.getElementById("news-board").innerHTML = newsHTML;
};

const pagination = () => {
	// 1.1~5까지를 보여준다
	// 2.6~10을 보여준다 => last, first 가필요
	// 3.만약에 first가 6 이상이면 prev 버튼을 단다
	// 4.만약에 last가 마지막이 아니라면 next버튼을 단다
	// 5.마지막이 5개이하이면 last=totalpage이다
	// 6.페이지가 5개 이하라면 first = 1이다
	let paginationHTML = ``;
	let pageGroup = Math.ceil(page / 5);

	let lastPage = pageGroup * 5;
	if (lastPage > totalPages) {
		lastPage = totalPages;
	}
	//if last pageGroup has less than 5 pages, set lastPage=totalPages, otherwise lastPage = pageGroup*5
	let firstPage = lastPage - 4 <= 0 ? 1 : lastPage - 4;

	//add previous button if firstPage of the pageGroup is 6 or higher
	if (firstPage >= 6) {
		paginationHTML += `
		<li class="page-item">
	  		<a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(1)">
	    	<span aria-hidden="true">&laquo;</span>
	 	 	</a>
		</li>
		<li class="page-item">
	  		<a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${
					page - 1
				})">
	    	<span aria-hidden="true">&lt;</span>
	 	 	</a>
		</li>`;
	}
	for (let i = firstPage; i <= lastPage; i++) {
		paginationHTML += `	
		<li class="page-item">
			<a class="page-link ${
				page == i ? "active" : ""
			} href="#" onclick="moveToPage(${i})">
				${i}
			</a>
		</li>`;
	}
	if (lastPage < totalPages) {
		paginationHTML += `
		<li class="page-item">
			<a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${
				page + 1
			})">
	    	<span aria-hidden="true"> &gt;</span>
	  		</a>
		</li>
		<li class="page-item">
			<a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${totalPages})">
	    	<span aria-hidden="true">&raquo;</span>
	  		</a>
		</li>`;
	}

	document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
	page = pageNum;
	console.log(page);

	getNews();
};

let searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", getNewsByKeyword);
searchButton.addEventListener("mouseover", function () {
	searchButton.classList.toggle("btn-success");
});

searchButton.addEventListener("mouseout", function () {
	searchButton.classList.toggle("btn-success");
});

getLatestNews();
