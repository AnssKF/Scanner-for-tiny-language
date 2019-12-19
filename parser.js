const fs = require ('fs');

const NODETYPE = {
  SQR: 1,
  CIRCLE: 2
}
// main tokens to overwrite
let TOKENS = [
  {value: 'read', type: 'READ'},
  {value: 'x', type: 'IDENTIFIER'},
  {value: ';', type: 'SEMICOLON'},
  {value: 'if', type: 'IF'},
  {value: '0', type: 'NUMBER'},
  {value: '<', type: 'LESSTHAN'},
  {value: 'x', type: 'IDENTIFIER'},
  {value: 'then', type: 'THEN'},
  {value: 'fact', type: 'IDENTIFIER'},
  {value: ':=', type: 'ASSIGN'},
  {value: '1', type: 'NUMBER'},
  {value: '-', type: 'MINUS'},
  {value: '2', type: 'NUMBER'},
  {value: '+', type: 'PLUS'},
  {value: '3', type: 'NUMBER'},
  {value: ';', type: 'SEMICOLON'},
  {value: 'repeat', type: 'REPEAT'},
  {value: 'fact', type: 'IDENTIFIER'},
  {value: ':=', type: 'ASSIGN'},
  {value: 'fact', type: 'IDENTIFIER'},
  {value: '*', type: 'MULT'},
  {value: 'x', type: 'IDENTIFIER'},
  {value: '/', type: 'MULT'},
  {value: 'y', type: 'IDENTIFIER'},
  {value: ';', type: 'SEMICOLON'},
  {value: 'x', type: 'IDENTIFIER'},
  {value: ':=', type: 'ASSIGN'},
  {value: 'x', type: 'IDENTIFIER'},
  {value: '-', type: 'MINUS'},
  {value: '1', type: 'NUMBER'},
  {value: 'until', type: 'UNTIL'},
  {value: 'x', type: 'IDENTIFIER'},
  {value: '=', type: 'EQUAL'},
  {value: '0', type: 'NUMBER'},
  {value: ';', type: 'SEMICOLON'},
  {value: 'write', type: 'WRITE'},
  {value: 'fact', type: 'IDENTIFIER'},
  {value: 'end', type: 'END'},
];

// VALIDSTMT = [ 'SEMICOLON',  'IF',  'THEN',  'END',  'REPEAT',  'UNTIL',  'IDENTIFIER',  'ASSIGN',  'READ',  'WRITE',  'LESSTHAN',  'EQUAL',  'PLUS',  'MINUS',  'MULT',  'DIV',  'OPENBRACKET',  'CLOSEDBRACKET',  'NUMBER',];

// Generated tree to display
let TREE = {
  title: 'program',
  childs: [],
  type:NODETYPE.SQR
};


let TOKENINDEX = 0;
let CURRENTTOKEN = null;

function getToken () {
  if (TOKENINDEX >= TOKENS.length) return -1;
  CURRENTTOKEN = TOKENS[TOKENINDEX];
  TOKENINDEX++;
  return CURRENTTOKEN;
}

function program () {
  getToken (); // get fist token

  let tree = null;
  while (TOKENINDEX < TOKENS.length) {
    tree = stmt_Sequence ();
    TREE.childs = TREE.childs.concat (tree.childs);
  }

  // Write Tree to out.json
  fs.writeFileSync ('out.json', JSON.stringify (TREE, null, 2));
}

function stmt_Sequence () {
  let tree = {
    title: 'stmt_sequence',
    childs: [],
    type:NODETYPE.SQR
  }

  let temp = null;

  temp = statement ();
  tree.childs.push(temp);

  while (CURRENTTOKEN.type === 'SEMICOLON') {
    match('SEMICOLON');
    temp = statement ();
    tree.childs.push(temp);
  }

  return tree;
}

function statement () {
  let subtree;

  let tokenType = CURRENTTOKEN.type.toLowerCase ();

  switch (tokenType) {
    case 'if':
      subtree = if_stmt ();
      break;

    case 'repeat':
      subtree = repeat_stmt ();
      break;

    case 'identifier':
      // case 'assign':
      subtree = assign_stmt ();
      break;

    case 'read':
      subtree = read_stmt ();
      break;

    case 'write':
      subtree = write_stmt ();
      break;

    default: 
      throw new Error (`Invalid Token Type`);
      break;

  }

  return subtree;
}

function if_stmt () {
  let subtree = {
    title: 'if',
    childs: [],
    type:NODETYPE.SQR
  };

  let temp = null;

  match ('if');

  temp = exp ();
  subtree.childs.push (temp);

  match ('then');

  temp = stmt_Sequence ();
  subtree.childs = subtree.childs.concat (temp.childs);

  if (CURRENTTOKEN.type == 'else') {
    let elsetree = {
      title: 'else',
      childs: [],
      type:NODETYPE.SQR
    };
    match ('else');

    temp = stmt_Sequence ();
    elsetree.childs = elsetree.childs.concat (temp.childs);

    subtree.childs.push(elsetree)
  }
  match ('end');

  return subtree;
}

function repeat_stmt () {
  let subtree = {
    title: 'repeat',
    childs: [],
    type:NODETYPE.SQR
  };

  let temp = null;

  match ('repeat');

  temp = stmt_Sequence ();
  subtree.childs = subtree.childs.concat (temp.childs);

  match ('until');

  temp = exp ();
  subtree.childs.push (temp);

  return subtree;
}

function assign_stmt () {
  let subtree = {
    title: 'assign',
    childs: [],
    type:NODETYPE.SQR
  };

  subtree.title = subtree.title + ' (' +CURRENTTOKEN.value + ')';
  match ('identifier');

  match ('ASSIGN');

  temp = exp ();
  subtree.childs.push (temp);

  return subtree;
}

function read_stmt () {
  let subtree = {
    title: 'read',
    childs: [],
    type:NODETYPE.SQR
  };

  // subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
  match ('read');

  // subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
  subtree.title = subtree.title + ' (' + CURRENTTOKEN.value + ')';
  match ('identifier');

  return subtree;
}

function write_stmt () {
  let subtree = {
    title: 'write',
    childs: [],
    type:NODETYPE.SQR
  };

  let temp = null;

  // subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
  match ('write');

  temp = exp ();
  subtree.childs.push (temp);
  return subtree;
}

function exp () {
  let subtree = {
    title: 'exp',
    childs: [],
    type:NODETYPE.SQR
  };

  let opFlag = false; // flag indecate that there is op to be at root

  let left = simple_exp ();

  if (CURRENTTOKEN.type === 'LESSTHAN' || CURRENTTOKEN.type === 'EQUAL') {
    opFlag = true;

    subtree = comparison_op ();
    subtree.childs.push(left);

    let right = simple_exp ();
    subtree.childs.push (right);
  }
  return opFlag ? subtree: left;
}

function comparison_op () {
  let subtree = {
    title: 'op',
    childs: [],
    type:NODETYPE.CIRCLE
  };

  if (CURRENTTOKEN.type === 'LESSTHAN') {
    subtree.title = subtree.title + ' (' + CURRENTTOKEN.value + ')';
    match ('LESSTHAN');
  } else if (CURRENTTOKEN.type === 'EQUAL') {
    subtree.title = subtree.title + ' (' + CURRENTTOKEN.value + ')';
    match ('EQUAL');
  }
  return subtree;
}

function simple_exp () {
  let subtree = {
    title: 'simple-exp',
    childs: [],
    type:NODETYPE.SQR
  };

  let opFlag = false;

  let left = term ();

  if (CURRENTTOKEN.type === 'PLUS' || CURRENTTOKEN.type === 'MINUS') {
    opFlag = true;

    subtree = addop ();
    subtree.childs.push (left);

    let right = simple_exp ()
    subtree.childs.push (right);
  }
  return opFlag? subtree: left;
}

function addop () {
  let subtree = {
    title: 'op',
    childs: [],
    type:NODETYPE.CIRCLE
  };

  if (CURRENTTOKEN.type === 'PLUS') {
    subtree.title = subtree.title + ' (' + CURRENTTOKEN.value + ')';
    match ('PLUS');
  }
  if (CURRENTTOKEN.type === 'MINUS') {
    subtree.title = subtree.title + ' (' + CURRENTTOKEN.value + ')';
    match ('MINUS');
  }
  return subtree;
}

function term () {
  let subtree = {
    title: 'term',
    childs: [],
    type:NODETYPE.SQR
  };

  let opFlag = false;

  let left = factor ();

  if (CURRENTTOKEN.type === 'MULT' || CURRENTTOKEN.type === 'DIV') {
    opFlag = true;

    subtree = mulop ();
    subtree.childs.push (left);

    let right = term ();
    subtree.childs.push (right);
  }
  return opFlag? subtree: left;
}

function mulop () {
  let subtree = {
    title: 'op',
    childs: [],
    type:NODETYPE.CIRCLE
  };

  if (CURRENTTOKEN.type === 'MULT') {
    subtree.title = subtree.title + ' (' + CURRENTTOKEN.value + ')';
    match ('MULT');
  } else if (CURRENTTOKEN.type === 'DIV') {
    subtree.title = subtree.title + ' (' + CURRENTTOKEN.value + ')';
    match ('DIV');
  }
  return subtree;
}

function factor () {
  let subtree = {
    title: 'factor',
    childs: [],
    type:NODETYPE.SQR
  };

  let tokenType = CURRENTTOKEN.type.toLowerCase ();

  switch (tokenType) {
    case '(':
      match ('OPENBRACKET');

      subtree = exp ();

      match ('CLOSEDBRACKET');
      break;

    case 'number':
      subtree = {title: 'Const' + ' ('+ CURRENTTOKEN.value + ')', childs: [], type:NODETYPE.CIRCLE};
      match ('NUMBER');
      break;

    case 'identifier':
      subtree = {title: 'ID' + ' ('+ CURRENTTOKEN.value + ')', childs: [], type:NODETYPE.CIRCLE};
      match ('IDENTIFIER');
      break;
  }
  return subtree;
}

function match (expected) {
  if (CURRENTTOKEN.type.toLowerCase () === expected.toLowerCase ()) {
    getToken ();

    // if(CURRENTTOKEN.value == '{'){
    //   while(CURRENTTOKEN.value != '}'){
    //     getToken();
    //   }
    //   getToken();
    // }

    return;
  }

  let errmsg = 'Token not matched token type: ' + CURRENTTOKEN.type + '- expected: ' + expected;
  throw new Error (errmsg);
}

// Run code
program ();
