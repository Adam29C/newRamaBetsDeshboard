let arr = ["ram", "shyam", "sitha", "geittest"];

for (let a = 0; a < arr.length; a++) {
  if (arr[a].length > 7) {
    let ans = arr[a].split("");
    let t = "";
    for (let att = 0; att < ans.length; att++) {
      if (att == 2) {
        t = ans[att];
      }
      if (att == 7) {
        console.log(ans[att], t);
        ans[att] = t;
      }
    }
    if (arr[a].length > 7) {
      arr[a] = ans.join("");
    }
    console.log(arr);
  }
}
