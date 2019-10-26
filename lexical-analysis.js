const lineTokenizer = require('./line-tokenizer');

const lexicalAnalysis = (srcCode) => {
    let tokensArr = []

    for( const [index, line] of srcCode.entries() ){
        if(line) {
            let lineTokens = lineTokenizer(line, index);
            tokensArr.push(lineTokens);
        }
    }
    // console.log(tokensArr[1])
    return tokensArr;
}

module.exports = lexicalAnalysis;