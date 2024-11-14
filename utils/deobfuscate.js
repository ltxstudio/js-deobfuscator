import beautify from 'js-beautify';

export function deobfuscateCode(obfuscatedCode) {
  try {
    return beautify.js(obfuscatedCode, { indent_size: 2 });
  } catch (error) {
    return `Error deobfuscating code: ${error.message}`;
  }
}
