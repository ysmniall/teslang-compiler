import moo from 'moo';

export const keyword= [
  'while',
  'function',
  'return',
  'returns',
  'Int',
  'end',
  'Val',
  'Array',
  'for',
  'if',
  'else',
];

export const pre_lexer = moo.compile({
  WS: /[ \t]+/,
  comment: /\-\-[^\n.]\n$/,
  number: /0|[1-9][0-9]*/,
  string: /"(?:\\["\\]|[^\n"\\])*"/,
  lparen: '(',
  rparen: ')',
  lcurly: '{',
  rcurly: '}',
  acL: '[',
  acr: ']',
  Equality: '==',
  assing: '=',
  addition: '+',
  Multiplication: '*',
  semicolon: ';',
  colon: ':',
  Comma: ',',
  and: '&&',
  or: '||',
  com: '--',
  identifier: /[a-zA-Z][a-zA-Z_0-9]*/,
  keyword,
  NL: { match: /\n/, lineBreaks: true },
})

export const init= () => {
  pre_lexer.reset(`
  function mul8(Array b,Int i) returns Int:
      val Array A;
      val Int a;
      val Int b;
      return b[i] * 2;
  end

  function main() returns Nil : 
      val Array A;
      val Int a;
      val Int b;
      A = createArray(3);
      foreach(b of A):
        c = mul8(A,b);
      end
  end
  `)
}

let followToken = null;
export const eof= () => getToken() == '\0'

export const dropToken = (ignored=false) => {
  if(followToken)
  {
    const t = followToken;
    followToken = null;
    return t;
  }

  let tok = pre_lexer.next()
  
  while (tok && (tok.type == 'WS' || tok.type == 'NL')) tok = pre_lexer.next()
  
  // console.log(0,tok && tok.text)

  return tok && tok.text
}

export const getToken=() =>{
  followToken = dropToken(true)
  // console.log(1,followToken)
  return followToken;
}