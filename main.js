const fs = require('fs')
module.exports = function compile(file) {
  var code = fs.readFileSync(file, 'utf8');

  var jsCode = code.replace(/set\s+(\w+)\s+to\s+(.+)/g, '$1 = $2');

  // Replace "matches" statements with JavaScript-style variable assignment
  jsCode = jsCode.replace(/matches/g, '==');

  // Replace "input" function calls with JavaScript's "prompt" function
  jsCode = jsCode.replace(/input\s*\((.*)\)/g, 'prompt($1)');

  // Replace ">>" and "<<" message delimiters with JavaScript alert function
  jsCode = jsCode.replace(/>>(.*)<</g, 'alert("$1")');

  // Replace "arr" with JavaScript array syntax
  jsCode = jsCode.replace(/arr\s+(\w+)\s*=>\s*\[(.*)\]/g, '$1 = [$2]');

  // Replace "func" with JavaScript "function" syntax
  jsCode = jsCode.replace(/func\s+(\w+)\s*\((.*)\)\s((\n.*))/g, 'function $1($2) { $3');

  // Replace "<<comment>>" with JavaScript "// comment" syntax
  jsCode = jsCode.replace(/<<(.*)>>/g, '// $1');

  jsCode = jsCode.replace(/if (.*)/g, 'if($1) {');
  jsCode = jsCode.replace(/else/g, 'else {\n');
  jsCode = jsCode.replace(/for (.*) (.*) (.*)/g, 'for($1 = 0; $1 $2 $3; $1++){\n');
  // Replace "rand(min,max)" with a random number between min and max
  jsCode = jsCode.replace(/rand\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/g, 'Math.floor(Math.random() * ($2 - $1 + 1)) + $1');


  // Replace "print()" with JavaScript "console.log" syntax
  jsCode = jsCode.replace(/print\s*\((.*)\)/g, 'console.log($1)');
  // Replace "class main[]" with a starting point function
  jsCode = jsCode.replace(/class main\[\]((\n.*)*)/g, 'function main() {$1');

  // Replace "end[]" with JavaScript "}" syntax
  jsCode = jsCode.replace(/end\[\]/g, '}');
  jsCode +="\nmain()"
  fs.writeFileSync(file.replace('.pscript', '.js'), jsCode);
}