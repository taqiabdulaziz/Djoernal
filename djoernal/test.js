let json = {
    aset: {
        kas: this.state.kas,
        piutang: this.state.piutang,
        product: 
    },
    liabilitas: {
        utang: 0
    },
    ekuitas: {
        modal: 2
    }
}

const rows = []

for (const key in json) {
    let arr = [key.toUpperCase()]
    rows.push(arr)
    arr = []
    for (const key2 in json[key]) {
        arr.push(key2)
        arr.push(json[key][key2])
        rows.push(arr)
        arr = []
    }
    // rows.push(arr)
    arr = []
}

console.log(rows);
