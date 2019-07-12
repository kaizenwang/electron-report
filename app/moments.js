require('electron').ipcRenderer.on('moment', (event, moment) => {
    require('electron').ipcRenderer.on('people', (event, people) => {
        document.getElementById("thead").innerHTML += `<tr><th scope="col">年</th><th scope="col">月</th><th scope="col">日</th><th scope="col">动态数</th><th scope="col">人数</th></tr>`;
        moment.forEach(e => {
            people.forEach(p => {
                let a = e["_id"];
                let b = p["_id"];
                if (JSON.stringify(a) === JSON.stringify(b)){
                    document.getElementById("tbody").innerHTML += `<tr><th scope="row">${e["_id"].year}</th><td>${e["_id"].month}</td><td>${e["_id"].day}</td><td>${e.count}</td><td>${p.count}</td></tr>`;
                }
            });
        });
    });
});