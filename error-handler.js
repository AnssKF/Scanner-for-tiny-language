
const errors = [];

const isValidId = (id) => {
    return !(/[\d|_]/.test(id));
}

const isValidSymbol = (symbol) => {
    return /[\+|-|\*|\/|(|)|;|=|<|:=]/.test(symbol)
}


module.exports = {
    isValidId,
    isValidSymbol
}


