const fs = require ('fs');
const tokenizer = require ('./tokenizer');

module.exports = tokenizer (fs.readFileSync ('./tiny.txt', 'utf-8'));
// fs.readFile ('./tiny.txt', 'utf8', (err, data) => {
//   if (err) throw err;
//   const tokens = tokenizer (data);
//   console.log (tokens);
// });

// console.log (fs.readFileSync ('./tiny.txt', 'utf-8'));
// const TOKEN = {
//     type: 'ID', // 'THEN' | 'PLUS' | 'MINUS | 'ID'
//     lexeme: 'a',
// }

// const REGEX = {
//     IDENTIFIER_REGEX: /^[a-zA-Z_][a-zA-Z0-9_]*$/
// }
