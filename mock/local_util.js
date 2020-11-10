console.log("+++[][][]++++>");

const files = require.context('../../mock', true, /\.js$/);
console.log(files);
files.keys().forEach(key => {
    const name = files(key).default
    console.log(name);
})
//
// console.log("====>", files, "<=====");


export default class {
    init(data) {
        console.log(data);
    }
}
