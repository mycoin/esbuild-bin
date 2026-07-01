const fetchAll = async (handler) => {
  const url = "https://rockroosterwholesale.com/products/" + handler + ".json";
  const res = await fetch(url, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "zh-CN,zh;q=0.9",
      "cache-control": "max-age=0",
      priority: "u=0, i",
      "sec-ch-ua":
        '"Microsoft Edge";v="149", "Chromium";v="149", "Not)A;Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
    },
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include",
  });
  const data = await res.json();
  return data;
};

fetchAll(
  "rockrooster-madison-tan-6-inch-zip-sided-steel-toe-leather-work-boots-ak052-d2quz",
);

// var els=document.querySelectorAll(".x-product-gallery--navigation img");
// var cmd = [];
// for (var i = 0; i < els.length; i++) {
//   cmd.push("wget --no-check-certificate -O "
//     + i + ".jpg "
//     + els[i].src.replace("_76x76", "").replace(/\?[\s\S]+/, ''));
// }
// console.log(cmd.join("\n"));

// var data = JSON.parse(document.querySelector('[data-section-id=static-product]').innerHTML);
// var images = data.product.images;

// images.forEach(e=>{

// })
