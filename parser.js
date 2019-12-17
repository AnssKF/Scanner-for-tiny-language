const fs = require ('fs');

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
  {value: ';', type: 'SEMICOLON'},
  {value: 'repeat', type: 'REPEAT'},
  {value: 'fact', type: 'IDENTIFIER'},
  {value: ':=', type: 'ASSIGN'},
  {value: '*', type: 'MULT'},
  {value: 'x', type: 'IDENTIFIER'},
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

VALIDSTMT = [
  'SEMICOLON',
  'IF',
  'THEN',
  'END',
  'REPEAT',
  'UNTIL',
  'IDENTIFIER',
  'ASSIGN',
  'READ',
  'WRITE',
  'LESSTHAN',
  'EQUAL',
  'PLUS',
  'MINUS',
  'MULT',
  'DIV',
  'OPENBRACKET',
  'CLOSEDBRACKET',
  'NUMBER',
];

let TREE = {
  title: 'ROOT',
  childs: [],
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
    TREE.childs.push (tree);
  }

  fs.writeFileSync ('out.json', JSON.stringify (TREE, null, 2));
}

function stmt_Sequence () {
  let tree = {
    title: 'stmt_sequence',
    childs: []
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
  }

  return subtree;
}

function if_stmt () {
  let subtree = {
    title: 'if-stmt',
    childs: [],
  };

  let temp = null;

  subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
  match ('if');

  temp = exp ();
  subtree.childs.push (temp);

  subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
  match ('then');

  temp = stmt_Sequence ();
  subtree.childs.push (temp);

  if (CURRENTTOKEN.type == 'else') {
    subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
    match ('else');

    temp = stmt_Sequence ();
    subtree.childs.push (temp);
  }
  subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
  match ('end');

  return subtree;
}

function repeat_stmt () {
  let subtree = {
    title: 'repeat-stmt',
    childs: [],
  };

  let temp = null;

  subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
  match ('repeat');

  temp = stmt_Sequence ();
  subtree.childs.push (temp);

  subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
  match ('until');

  temp = exp ();
  subtree.childs.push (temp);

  return subtree;
}

function assign_stmt () {
  let subtree = {
    title: 'assign-stmt',
    childs: [],
  };

  subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
  match ('identifier');

  subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
  match ('ASSIGN');

  temp = exp ();
  subtree.childs.push (temp);

  return subtree;
}

function read_stmt () {
  let subtree = {
    title: 'read-stmt',
    childs: [],
  };

  subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
  match ('read');

  subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
  match ('identifier');

  return subtree;
}

function write_stmt () {
  let subtree = {
    title: 'write-stmt',
    childs: [],
  };

  let temp = null;

  subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
  match ('write');

  temp = exp ();
  subtree.childs.push (temp);
  return subtree;
}

function exp () {
  let subtree = {
    title: 'exp',
    childs: [],
  };

  let temp = null;

  temp = simple_exp ();
  subtree.childs.push (temp);

  if (CURRENTTOKEN.type === 'LESSTHAN' || CURRENTTOKEN.type === 'EQUAL') {
    temp = comparison_op ();
    subtree.childs.push (temp);

    temp = simple_exp ();
    subtree.childs.push (temp);
  }
  return subtree;
}

function comparison_op () {
  let subtree = {
    title: 'comparison-op',
    childs: [],
  };

  if (CURRENTTOKEN.type === 'LESSTHAN') {
    subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
    match ('LESSTHAN');
  } else if (CURRENTTOKEN.type === 'EQUAL') {
    subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
    match ('EQUAL');
  }
  return subtree;
}

function simple_exp () {
  let subtree = {
    title: 'simple-exp',
    childs: [],
  };

  let temp = null;

  temp = term ();
  subtree.childs.push (temp);

  while (CURRENTTOKEN.type === 'PLUS' || CURRENTTOKEN.type === 'MINUS') {
    temp = addop ();
    subtree.childs.push (temp);

    temp = term ();
    subtree.childs.push (temp);
  }
  return subtree;
}

function addop () {
  let subtree = {
    title: 'addop',
    childs: [],
  };

  if (CURRENTTOKEN.type === 'PLUS') {
    subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
    match ('PLUS');
  }
  if (CURRENTTOKEN.type === 'MINUS') {
    subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
    match ('MINUS');
  }
  return subtree;
}

function term () {
  let subtree = {
    title: 'term',
    childs: [],
  };

  let temp = null;
  // done
  temp = factor ();
  subtree.childs.push (temp);
  while (CURRENTTOKEN.type === 'MULT' || CURRENTTOKEN.type === 'DIV') {
    temp = mulop ();
    subtree.childs.push (temp);

    temp = factor ();
    subtree.childs.push (temp);
  }
  return subtree;
}

function mulop () {
  let subtree = {
    title: 'mulop',
    childs: [],
  };

  if (CURRENTTOKEN.type === 'MULT') {
    subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
    match ('MULT');
  } else if (CURRENTTOKEN.type === 'DIV') {
    subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
    match ('DIV');
  }
  return subtree;
}

function factor () {
  let subtree = {
    title: 'factor',
    childs: [],
  };

  let temp = null;

  let tokenType = CURRENTTOKEN.type.toLowerCase ();

  switch (tokenType) {
    case '(':
      subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
      match ('OPENBRACKET');

      temp = exp ();
      subtree.childs.push (temp);

      subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
      match ('CLOSEDBRACKET');
      break;

    case 'number':
      // push to tree
      subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
      match ('NUMBER');
      break;

    case 'identifier':
      // push to tree
      subtree.childs.push ({title: CURRENTTOKEN.value, childs: []});
      match ('IDENTIFIER');
      break;
  }
  return subtree;
}

function match (expected) {
  console.log ('current', CURRENTTOKEN);
  console.log ('expexted', expected.toLowerCase ());
  if (CURRENTTOKEN.type.toLowerCase () === expected.toLowerCase ()) getToken ();
  else throw new Error ('Token not matched');
}

// Run code
program ();
