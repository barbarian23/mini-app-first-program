let Parser = require('rss-parser');
let parser = new Parser();

export const rssFeeder = function(url){
  return parser.parseURL(url);
}