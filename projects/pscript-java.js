const fs = require('fs')

function addSemicolons(code) {
  var lines = code.split('\n');
  for (var i = 0; i < lines.length; i++) {
    // Skip blank lines
    if (lines[i].trim().length === 0) {
      // Remove semicolon from empty line
      lines[i] = '';
    } else if (!/;\s*$/.test(lines[i]) && !/}\s*$/.test(lines[i]) && !/\s.*$/.test(lines[i])) {
      // Add semicolon to end of line that doesn't end with semicolon or block end
      lines[i] += ';';
    }
  }

  // Join modified lines with newline character
  return lines.join('\n');
}



module.exports = function compile(file) {
  console.log("converting pscript to java")
  var code = fs.readFileSync(file, 'utf8');


  var javaCode = code.replace(/set\s+(\w+)\s+to\s+(.+)/g, '$1 = $2;');

    // Replace "int_new" statements with Java-style variable assignment
  javaCode = javaCode.replace(/int_new\s+(\w+)\s+to\s+(.+)/g, 'int $1 = $2;');
  javaCode = javaCode.replace(/str_new\s+(\w+)\s+to\s+(.+)/g, 'str $1 = $2;');

  // Replace "matches" statements with Java-style variable assignment
  javaCode = javaCode.replace(/matches/g, '==');

  // Replace "input" function calls with Java's "Scanner" class
  javaCode = javaCode.replace(/input\s*\((.*)\)/g, 'new Scanner(System.in).next($1)');

  // Replace ">>" and "<<" message delimiters with Java "System.out.println" function
  javaCode = javaCode.replace(/>>(.*)<</g, 'System.out.println("$1");');

  // Replace "arr" with Java array syntax
  javaCode = javaCode.replace(/arr\s+(\w+)\s*=>\s*\[(.*)\]/g, '$1 = new $2[];');

  // Replace "func" with Java method syntax
  javaCode = javaCode.replace(/func\s+(\w+)\s*\((.*)\)\s((\n.*))/g, 'public static void $1($2) { $3');

  // Replace "<<comment>>" with Java "// comment" syntax
  javaCode = javaCode.replace(/<<(.*)>>/g, '// $1');

  javaCode = javaCode.replace(/if (.*)/g, 'if($1) {');


  // Replace "print()" with Java "System.out.println" syntax
  javaCode = javaCode.replace(/print\s*\((.*)\)/g, 'System.out.println($1);');
  // Replace "class main[]" with a starting point function
  javaCode = javaCode.replace(/class main\[\]((\n.*)*)/g, 'public static void main(String[] args) {$1');
    // Replace "if" statements with Java syntax
  javaCode = javaCode.replace(/if (.*)/g, 'if ($1) {');
  javaCode = javaCode.replace(/end\[\]/g, '}');

  // Replace "for" loops with Java syntax
  javaCode = javaCode.replace(/for (.*) (.*) (.*)/g, 'for ($1 = 0; $1 $2 $3; $1++) {');

  // Replace "while" loops with Java syntax
  javaCode = javaCode.replace(/while (.*)/g, 'while ($1) {');

  // Replace "else if" statements with Java syntax
  javaCode = javaCode.replace(/else\s+if (.*)/g, 'else if ($1) {');

  // Replace "else" statements with Java syntax
  javaCode = javaCode.replace(/else/g, 'else {');
  // Replace "end[]" with Java "}" syntax
  javaCode = javaCode.replace(/end\[\]/g, '}');
  //add more goo-to-have java libraries here
modified = `
import java.util.*;
import java.io.*;
import java.math.*;
import java.net.*;
import java.awt.*;
import javax.swing.*;
import java.sql.*;
import java.util.concurrent.*;

public class ${file.replace('.pscript','')}{
  ${javaCode}
}`;
modified = addSemicolons(modified);

  fs.writeFileSync(file.replace('.pscript', '.java'), modified);
  console.log("done")
}
