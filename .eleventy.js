const moment = require('moment');

moment.locale('en');

const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {

  eleventyConfig.addFilter('dateIso', date => {
    return moment(date).toISOString();
  });

  eleventyConfig.addFilter('dateReadable', date => {
    return moment(date).utc().format('LL'); // E.g. May 31, 2022
  });

  eleventyConfig.addFilter('yymmdd', date => {
    return moment(date).format('YYYY/MM/DD');
  });

  eleventyConfig.addShortcode('excerpt', article => extractExcerpt(article));

  eleventyConfig.addPlugin(syntaxHighlight);
  // Folders to copy to output folder
  eleventyConfig.addPassthroughCopy("css");
};

function extractExcerpt(article) {
  if (!article.hasOwnProperty('templateContent')) {
    console.warn('Failed to extract excerpt: Document has no property "templateContent".');
    return null;
  }

  let excerpt = null;
  const content = article.templateContent;

  // The start and end separators to try and match to extract the excerpt
  const separatorsList = [
    { start: '<!-- Excerpt Start -->', end: '<!-- Excerpt End -->' },
    { start: '<p>', end: '</p>' }
  ];

  separatorsList.some(separators => {
    const startPosition = content.indexOf(separators.start);

    // This end position could use "lastIndexOf" to return all the paragraphs rather than just the first
    // paragraph when matching is on "<p>" and "</p>".
    const endPosition = content.indexOf(separators.end);

    if (startPosition !== -1 && endPosition !== -1) {
      excerpt = content.substring(startPosition + separators.start.length, endPosition).trim();
      return true; // Exit out of array loop on first match
    }
  });

  return excerpt;
}
