const STATE = {
    START: 'START',
    DONE: 'DONE',
    ASSIGN: 'ASSIGN',
    NUM: 'NUM',
    ID: 'ID',
    COMMENT: 'COMMENT'
}

const TOKENTYPE = {
    ID: 'IDENTIFIER',
    NUM: 'NUMBER',
    RESERVED: 'RESERVED WORD',
    SPECIAL: 'SPECIAL SYMBOL',
    COMMENT: 'COMMENT'
}

const lineTokenizer = (line, lineNumber) => {
    line = line.trim()

    let _state = STATE.START;
    let startingIndex = 0
    tokensArr = []

    while(startingIndex < line.length){
        let token = '';
        let tokenType = null;
        for( let i=startingIndex; i<line.length; i++){
            let chr = line[i];

            switch(_state){
                case STATE.START:
                    if(isWhiteSpace(chr)){ // ----------------->
                        _state = STATE.START;
                        break;
                    }

                    if(isDigit(chr)){ // [0-9]
                        _state = STATE.NUM;
                        token += chr;
                        tokenType = TOKENTYPE.NUM;
                        break;
                    }

                    if(isLitter(chr)){ // [a-zA-Z]
                        _state = STATE.ID;
                        token += chr;
                        tokenType = TOKENTYPE.ID;
                        break;
                    }

                    if(isSpecialChr(chr)){ // :=
                        if(chr == ':' || chr == '!' || chr == '='){
                            _state = STATE.ASSIGN;
                            token += chr;
                            tokenType = TOKENTYPE.SPECIAL;
                            break;
                        }

                        if( chr == '{' ){
                            _state = STATE.COMMENT;
                            token += chr;
                            tokenType = TOKENTYPE.SPECIAL;
                            break;
                        }

                        _state = STATE.DONE;
                        token += chr;
                        tokenType = TOKENTYPE.SPECIAL;
                        break;
                    }

                    if(isOperator(chr)){
                        _state = STATE.DONE;
                        token += chr;
                        tokenType = TOKENTYPE.SPECIAL;
                        break;
                    }

                    _state = STATE.DONE;
                    i -= 1;
                    break;
                
                case STATE.NUM:
                    if(isDigit(chr)){ // [0-9]
                        _state = STATE.NUM;
                        token += chr;
                        tokenType = TOKENTYPE.NUM;
                        break;
                    }

                    _state = STATE.DONE;
                    i -= 1;
                    break;
                
                case STATE.ID:
                    if(isWordLitter(chr)){
                        _state = STATE.ID;
                        token += chr;
                        tokenType = TOKENTYPE.ID;
                        break;
                    }

                    _state = STATE.DONE;
                    i -= 1;
                    break;
                
                case STATE.ASSIGN: // :
                    if(isSpecialChr(chr)){
                        if(chr == '='){
                            _state = STATE.DONE;
                            token += chr;
                            tokenType = TOKENTYPE.SPECIAL;
                            break;
                        }
                    }

                    _state = STATE.DONE;
                    i -= 1;
                    break;

                case STATE.COMMENT:
                    if(line[i-1] == '{'){
                        tokensArr.push({token, tokenType});
                        token = '';
                        tokenType = TOKENTYPE.COMMENT;
                    }

                    if(chr == '}'){
                        _state = STATE.DONE;
                        i -= 1;
                        break;
                    }

                    _state = STATE.COMMENT;
                    token += chr;
                    tokenType = TOKENTYPE.COMMENT;
                    break;

                default:
                    _state = STATE.DONE;
                    i -= 1;
                    break;
            }

            if(_state == STATE.DONE || i ==line.length-1) {
                _state = STATE.START;
                startingIndex = i+1;
                break;
            }
        } // for chr

        if(isReservedWord(token) && tokenType == TOKENTYPE.ID){
            tokenType = TOKENTYPE.RESERVED
        }
        tokensArr.push({token, tokenType});
    }
    return tokensArr
}

const isLitter = (l) => {
    return /[a-zA-Z_]/.test(l);
}

const isDigit = (d) => {
    return /[0-9]/.test(d);
}

const isWordLitter = (w) => { 
    return /\w/.test(w);
}

const isSpecialChr = (c) => {
    return /[:!,;=(){}"'.]/.test(c);
}

const isOperator = (op) => {
    return /[-+*/<>]/.test(op);
}

const isWhiteSpace = (c) => {
    return /\s/.test(c);
}


const isReservedWord = (token) => {
    return /(if|then|else|end|repeat|until|read|write|int|float)/i.test(token);
}

module.exports = lineTokenizer;