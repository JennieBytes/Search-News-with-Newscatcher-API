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
		let response = await fetch(url, { headers: header });
		let data = await response.json();
		if (response.status == 200) {
			if (data.total_hits == 0) {
				throw new Error("No search Result");
			}
			newsArray = data.articles; //array
			console.log(newsArray);
			render();
		} else {
			throw new Error(data.message);
		}
	} catch (error) {
		console.log(error.message);
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
		"https://api.newscatcherapi.com/v2/latest_headlines?countries=CA&topic=business"
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
	let newsHTML = "";
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
	console.log(newsHTML);
};

let searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", getNewsByKeyword);

getLatestNews();
