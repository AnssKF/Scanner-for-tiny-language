const fs = require('fs')
const lexicalAnalysis = require('./lexical-analysis');

fs.readFile('./tiny.txt', 'utf8', (err, data) => {
    if(err) throw err;
    data = data.split('\n');
    const tokens = lexicalAnalysis(data)
    console.log(tokens)
})




// const TOKEN = {
//     type: 'ID', // 'THEN' | 'PLUS' | 'MINUS | 'ID'
//     lexeme: 'a',
// }

// const REGEX = {
//     IDENTIFIER_REGEX: /^[a-zA-Z_][a-zA-Z0-9_]*$/
// }
