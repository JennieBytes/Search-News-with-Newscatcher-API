let menu = document.querySelectorAll(".menu button");
menu.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);
const getLatestNews = async () => {
  let url = new URL(
    "https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=business"
  );
  console.log(url);

  let header = new Headers({
    // "x-api-key": "84KiV3HrOWlXN5HbVYuPOWt_LRDMj2iYfxikTDr_PXg",
  });
  let response = await fetch(url, { headers: header });
  let data = await response.json();

  newsArray = data.articles; //array

  render();
};

//PAUSED HERE: currently adding click events to the menu items (news categories).
//we looked up the queries to add them
const getNewsByTopic = (event) => {
  console.log("clicked", event.target.textContents);
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

getLatestNews();