import markdownToHtml from '../src/index';

describe('Link syntax', () => {
  test('should convert link syntax properly', () => {
    const html = markdownToHtml('[example](https://example.com)');
    expect(html).toContain(
      '<a href="https://example.com" target="_blank" rel="nofollow noopener noreferrer">example</a>'
    );
  });
  test('should convert link with no attributes if href starts with slash', () => {
    const html = markdownToHtml('[Articles](/articles)');
    expect(html).toContain('<a href="/articles">Articles</a>');
  });
  test('should convert link with no attributes if href starts with #', () => {
    const html = markdownToHtml('[Example](#example)');
    expect(html).toContain('<a href="#example">Example</a>');
  });
});

describe('Linkify properly', () => {
  test('should linkify url with nofollow if hostname is not zenn.dev', () => {
    expect(markdownToHtml('URL is https://example.com')).toContain(
      'URL is <a href="https://example.com" target="_blank" rel="nofollow noopener noreferrer">https://example.com</a>'
    );
    expect(markdownToHtml('URL is http://example.com')).toContain(
      'URL is <a href="http://example.com" target="_blank" rel="nofollow noopener noreferrer">http://example.com</a>'
    );
    expect(markdownToHtml('URL is https://zenn.dev.example.com')).toContain(
      'URL is <a href="https://zenn.dev.example.com" target="_blank" rel="nofollow noopener noreferrer">https://zenn.dev.example.com</a>'
    );
  });

  test('should linkify url without rel if hostname is zenn.dev', () => {
    const html = markdownToHtml('URL is https://zenn.dev');
    expect(html).toContain(
      'URL is <a href="https://zenn.dev" target="_blank">https://zenn.dev</a>'
    );
  });

  test('should convert links to card if prev elem is br', () => {
    const html = markdownToHtml('foo\nhttps://example.com');
    expect(html).toEqual(
      `<p>foo<br style="display: none">\n<div class="embed-zenn-link"><iframe src="https://card.zenn.dev/?url=https%3A%2F%2Fexample.com" frameborder="0" scrolling="no" loading="lazy"></iframe></div><a href="https://example.com" style="display: none" target="_blank" rel="nofollow noopener noreferrer">https://example.com</a></p>\n`
    );
  });

  test('should convert links to card if first element in p', () => {
    const html = markdownToHtml('foo\n\nhttps://example.com');
    expect(html).toEqual(
      `<p>foo</p>\n<p><div class="embed-zenn-link"><iframe src="https://card.zenn.dev/?url=https%3A%2F%2Fexample.com" frameborder="0" scrolling="no" loading="lazy"></iframe></div><a href="https://example.com" style="display: none" target="_blank" rel="nofollow noopener noreferrer">https://example.com</a></p>\n`
    );
  });

  test('should not convert links to card if text exists before url', () => {
    const html = markdownToHtml('foo https://example.com');
    expect(html).toEqual(
      '<p>foo <a href="https://example.com" target="_blank" rel="nofollow noopener noreferrer">https://example.com</a></p>\n'
    );
  });

  test('should not convert intentional links to card', () => {
    const html = markdownToHtml('[https://example.com](https://example.com)');
    expect(html).toEqual(
      '<p><a href="https://example.com" target="_blank" rel="nofollow noopener noreferrer">https://example.com</a></p>\n'
    );
  });

  test('should not convert links inside list', () => {
    const html = markdownToHtml('- https://example.com\n- second');
    expect(html).toEqual(
      '<ul>\n<li><a href="https://example.com" target="_blank" rel="nofollow noopener noreferrer">https://example.com</a></li>\n<li>second</li>\n</ul>\n'
    );
  });

  test('should not convert links inside block', () => {
    const html = markdownToHtml(':::message alert\nhttps://example.com\n:::');
    expect(html).toEqual(
      '<aside class="msg alert"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101 101" role="img" aria-label="alert" class="msg-icon"><circle cx="51" cy="51" r="50" fill="currentColor"></circle><text x="50%" y="50%" text-anchor="middle" fill="#ffffff" font-size="70" font-weight="bold" dominant-baseline="central">!</text></svg><div class="msg-content"><p><a href="https://example.com" target="_blank" rel="nofollow noopener noreferrer">https://example.com</a></p>\n</div></aside>\n'
    );
  });

  test('should not convert links inside block with 2 paragraphs', () => {
    const html = markdownToHtml(
      ':::message alert\nhello\n\nhttps://example.com\n:::'
    );
    expect(html).toContain(
      '<aside class="msg alert"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101 101" role="img" aria-label="alert" class="msg-icon"><circle cx="51" cy="51" r="50" fill="currentColor"></circle><text x="50%" y="50%" text-anchor="middle" fill="#ffffff" font-size="70" font-weight="bold" dominant-baseline="central">!</text></svg><div class="msg-content"><p>hello</p>\n<p><a href="https://example.com" target="_blank" rel="nofollow noopener noreferrer">https://example.com</a></p>\n</div></aside>'
    );
  });

  test('should not convert links inside list', () => {
    const html = markdownToHtml('- https://example.com\n- second');
    expect(html).toEqual(
      '<ul>\n<li><a href="https://example.com" target="_blank" rel="nofollow noopener noreferrer">https://example.com</a></li>\n<li>second</li>\n</ul>\n'
    );
  });

  test('should not convert links if text follows', () => {
    const html = markdownToHtml('https://example.com foo');
    expect(html).toEqual(
      '<p><a href="https://example.com" target="_blank" rel="nofollow noopener noreferrer">https://example.com</a> foo</p>\n'
    );
  });

  test('should not convert a link with any text in same paragraph', () => {
    const html = markdownToHtml(
      `a: https://example.com\nb: https://example.com`
    );
    expect(html).toEqual(
      '<p>a: <a href="https://example.com" target="_blank" rel="nofollow noopener noreferrer">https://example.com</a><br>\nb: <a href="https://example.com" target="_blank" rel="nofollow noopener noreferrer">https://example.com</a></p>\n'
    );
  });

  test('should convert a tweet-link to tweet-element', () => {
    const html = markdownToHtml(`https://twitter.com/jack/status/20`);
    expect(html).toEqual(
      '<p><div class="embed-tweet"><embed-tweet src="https://twitter.com/jack/status/20"></embed-tweet></div><a href="https://twitter.com/jack/status/20" style="display: none" target="_blank" rel="nofollow noopener noreferrer">https://twitter.com/jack/status/20</a></p>\n'
    );
  });

  test('should convert links when surrounded by softbreaks', () => {
    const html = markdownToHtml('\n\nhttps://example.com\n\n');
    expect(html).toEqual(
      '<p><div class="embed-zenn-link"><iframe src="https://card.zenn.dev/?url=https%3A%2F%2Fexample.com" frameborder="0" scrolling="no" loading="lazy"></iframe></div><a href="https://example.com" style="display: none" target="_blank" rel="nofollow noopener noreferrer">https://example.com</a></p>\n'
    );
  });

  test('should convert links when previous element is a softbreak and the links are end of the paragraph', () => {
    const html = markdownToHtml('text\nhttps://example.com\n\n');
    expect(html).toEqual(
      '<p>text<br style="display: none">\n<div class="embed-zenn-link"><iframe src="https://card.zenn.dev/?url=https%3A%2F%2Fexample.com" frameborder="0" scrolling="no" loading="lazy"></iframe></div><a href="https://example.com" style="display: none" target="_blank" rel="nofollow noopener noreferrer">https://example.com</a></p>\n'
    );
  });

  test('should convert links when previous and next elements are softbreaks', () => {
    const html = markdownToHtml('text\nhttps://example.com\ntext');
    expect(html).toEqual(
      '<p>text<br style="display: none">\n<div class="embed-zenn-link"><iframe src="https://card.zenn.dev/?url=https%3A%2F%2Fexample.com" frameborder="0" scrolling="no" loading="lazy"></iframe></div><a href="https://example.com" style="display: none" target="_blank" rel="nofollow noopener noreferrer">https://example.com</a><br style="display: none">\ntext</p>\n'
    );
  });

  test('should convert links when the links are the start of the line and the next elements are softbreaks', () => {
    const html = markdownToHtml('\n\nhttps://example.com\ntext');
    expect(html).toEqual(
      '<p><div class="embed-zenn-link"><iframe src="https://card.zenn.dev/?url=https%3A%2F%2Fexample.com" frameborder="0" scrolling="no" loading="lazy"></iframe></div><a href="https://example.com" style="display: none" target="_blank" rel="nofollow noopener noreferrer">https://example.com</a><br style="display: none">\ntext</p>\n'
    );
  });

  test('should not convert links even when the links are the start of the line unless the next elements are texts', () => {
    const html = markdownToHtml('\n\nhttps://example.com text');
    expect(html).toEqual(
      '<p><a href="https://example.com" target="_blank" rel="nofollow noopener noreferrer">https://example.com</a> text</p>\n'
    );
  });

  test('should not convert links even when the links are the end of the line, unless previous elements are texts', () => {
    const html = markdownToHtml('text https://example.com\n\n');
    expect(html).toEqual(
      '<p>text <a href="https://example.com" target="_blank" rel="nofollow noopener noreferrer">https://example.com</a></p>\n'
    );
  });

  test('should convert links even when some links exist in the line, unless softbreaks exist before and after the each links', () => {
    const html = markdownToHtml(
      'https://example1.com\nhttps://example2.com text\ntext https://example3.com\nhttps://example4.com\ntext'
    );
    expect(html).toEqual(
      '<p><div class="embed-zenn-link"><iframe src="https://card.zenn.dev/?url=https%3A%2F%2Fexample1.com" frameborder="0" scrolling="no" loading="lazy"></iframe></div><a href="https://example1.com" style="display: none" target="_blank" rel="nofollow noopener noreferrer">https://example1.com</a><br style="display: none">\n<a href="https://example2.com" target="_blank" rel="nofollow noopener noreferrer">https://example2.com</a> text<br>\ntext <a href="https://example3.com" target="_blank" rel="nofollow noopener noreferrer">https://example3.com</a><br style="display: none">\n<div class="embed-zenn-link"><iframe src="https://card.zenn.dev/?url=https%3A%2F%2Fexample4.com" frameborder="0" scrolling="no" loading="lazy"></iframe></div><a href="https://example4.com" style="display: none" target="_blank" rel="nofollow noopener noreferrer">https://example4.com</a><br style="display: none">\ntext</p>\n'
    );
  });

  test('should convert links even when some links exist in the line, when each links are separated by linebreaks', () => {
    const html = markdownToHtml('https://example1.com\nhttps://example2.com\n');
    expect(html).toEqual(
      '<p><div class="embed-zenn-link"><iframe src="https://card.zenn.dev/?url=https%3A%2F%2Fexample1.com" frameborder="0" scrolling="no" loading="lazy"></iframe></div><a href="https://example1.com" style="display: none" target="_blank" rel="nofollow noopener noreferrer">https://example1.com</a><br style="display: none">\n<div class="embed-zenn-link"><iframe src="https://card.zenn.dev/?url=https%3A%2F%2Fexample2.com" frameborder="0" scrolling="no" loading="lazy"></iframe></div><a href="https://example2.com" style="display: none" target="_blank" rel="nofollow noopener noreferrer">https://example2.com</a></p>\n'
    );
  });

  test('should convert a tweet-link with query string to tweet-element', () => {
    const html = markdownToHtml(
      `https://twitter.com/jack/status/20?foo=123456&t=ab-cd_ef`
    );
    expect(html).toEqual(
      '<p><div class="embed-tweet"><embed-tweet src="https://twitter.com/jack/status/20?foo=123456&t=ab-cd_ef"></embed-tweet></div><a href="https://twitter.com/jack/status/20?foo=123456&amp;t=ab-cd_ef" style="display: none" target="_blank" rel="nofollow noopener noreferrer">https://twitter.com/jack/status/20?foo=123456&amp;t=ab-cd_ef</a></p>\n'
    );
  });
});
