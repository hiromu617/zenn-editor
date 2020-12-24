import markdownIt from 'markdown-it';
import { mdLineNumber } from './utils/md-line-number';
import { processDOM } from './utils/process-dom';

// plugis
import {
  containerDetailsOptions,
  containerMessageOptions,
} from './utils/md-container';
import { mdRendererFence } from './utils/md-renderer-fence';
import { mdLinkifyClass } from './utils/md-linkify-class';
import { mdPrism } from './utils/md-prism';
import { mdKatex } from './utils/md-katex';
import { mdBr } from './utils/md-br';
import { customBlockOptions } from './utils/md-custom-block';
import markdownItImSize from '@steelydylan/markdown-it-imsize';
import markdownItAnchor from 'markdown-it-anchor';

const mdContainer = require('markdown-it-container');
const mdFootnote = require('markdown-it-footnote');
const mdTaskLists = require('markdown-it-task-lists');
const mdInlineComments = require('markdown-it-inline-comments');
const mdCustomBlock = require('markdown-it-custom-block');
const mdLinkAttributes = require('markdown-it-link-attributes');

const md = markdownIt({
  breaks: true,
  linkify: true,
});

md.linkify.set({ fuzzyLink: false });

md.use(mdBr)
  .use(mdPrism)
  .use(mdRendererFence)
  .use(markdownItImSize)
  .use(markdownItAnchor, { level: [1, 2, 3] })
  .use(mdContainer, 'details', containerDetailsOptions)
  .use(mdContainer, 'message', containerMessageOptions)
  .use(mdFootnote)
  .use(mdTaskLists, { enabled: true })
  .use(mdInlineComments)
  .use(mdCustomBlock, customBlockOptions)
  .use(mdLinkAttributes, {
    pattern: /^(?!https:\/\/zenn\.dev\/)/,
    attrs: {
      rel: 'nofollow',
    },
  })
  .use(mdKatex)
  .use(mdLinkifyClass);

// custom footnote
md.renderer.rules.footnote_block_open = () =>
  '<section class="footnotes">\n' +
  '<div class="footnotes-title"><img src="https://twemoji.maxcdn.com/2/svg/1f58b.svg" class="emoji footnotes-twemoji" loading="lazy" width="20" height="20">脚注</div>\n' +
  '<ol class="footnotes-list">\n';

const markdownToHtml = (text: string): string => {
  if (!(text && text.length)) return text;
  const rawHtml = md.render(text);
  if (!rawHtml) return '';
  return processDOM(rawHtml);
};
export default markdownToHtml;

export const enablePreview = () => {
  mdLineNumber(md);
};
