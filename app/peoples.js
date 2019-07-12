// require('electron').ipcRenderer.on('people', (event, message) => {
//   console.log(message);
//   // document.getElementById("thead").innerHTML += `<tr><th scope="col">年</th><th scope="col">月</th><th scope="col">日</th><th scope="col">人数</th></tr>`;
//   message.forEach(e => {
//     document.getElementById("tbody").innerHTML += `<tr><th scope="row">${e["_id"].year}</th><td>${e["_id"].month}</td><td>${e["_id"].day}</td><td>${e.count}</td></tr>`;
//   });
// });