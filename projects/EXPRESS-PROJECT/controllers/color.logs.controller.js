// Color Logs
// ANSI 256 color codes https://talyian.github.io/ansicolors/
const rc = `\u001b[0m`;

const decorate = {
  bold: text => `\u001b[1m${text}${rc}`,
  ul: text => `\u001b[4m${text}${rc}`,
};

const color = {
  red: text => `\u001b[38;5;88m${text}${rc}`,
  green: text => `\u001b[38;5;83m${text}${rc}`,
  lime: text => `\x1b[38;5;191m${text}${rc}`,
  yellow: text => `\u001b[38;5;220m${text}${rc}`,
  orange: text => `\x1b[38;5;202m${text}${rc}`,
  blue: text => `\u001b[38;5;21m${text}${rc}`,
  mag: text => `\u001b[38;5;200m${text}${rc}`,
  cyan: text => `\u001b[38;5;123m${text}${rc}`,
  purple: text => `\x1b[38;5;92m${text}${rc}`,
  white: text => `\u001b[38;5;250m${text}${rc}`,
  br_red: text => `\u001b[38;5;160m${text}${rc}`,
  br_green: text => `\u001b[38;5;188m${text}${rc}`,
  br_yellow: text => `\u001b[38;5;3m${text}${rc}`,
  br_orange: text => `\x1b[38;5;214m${text}${rc}`,
  br_blue: text => `\u001b[38;5;51m${text}${rc}`,
  br_purple: text => `\x1b[38;5;171m${text}${rc}`,
  br_mag: text => `\u001b[38;5;201m${text}${rc}`,
  br_cyan: text => `\u001b[38;5;87m${text}${rc}`,
  br_white: text => `\u001b[38;5;255m${text}${rc}`,
};

const bg = {
  red: text => `\u001b[48;5;88m${text}${rc}`,
  green: text => `\u001b[48;5;83m${text}${rc}`,
  lime: text => `\x1b[48;5;191m${text}${rc}`,
  yellow: text => `\u001b[48;5;220m${text}${rc}`,
  orange: text => `	\x1b[48;5;202m${text}${rc}`,
  blue: text => `\u001b[48;5;21m${text}${rc}`,
  mag: text => `\u001b[48;5;200m${text}${rc}`,
  cyan: text => `\u001b[48;5;123m${text}${rc}`,
  purple: text => `\x1b[48;5;92m${text}${rc}`,
  grey: text => `\u001b[48;5;243m${text}${rc}`,
  white: text => `\u001b[48;5;250m${text}${rc}`,
  br_red: text => `\u001b[48;5;124m${text}${rc}`,
  br_green: text => `\u001b[48;5;188m${text}${rc}`,
  br_yellow: text => `\u001b[48;5;3m${text}${rc}`,
  br_orange: text => `\x1b[48;5;214m${text}${rc}`,
  br_blue: text => `\u001b[48;5;51m${text}${rc}`,
  br_purple: text => `\x1b[48;5;13m${text}${rc}`,
  br_mag: text => `\u001b[48;5;201m${text}${rc}`,
  br_cyan: text => `\u001b[48;5;87m${text}${rc}`,
  br_white: text => `\u001b[48;5;255m${text}${rc}`,
};

const hl = {
  orange_red: text => color.orange(`${bg.red(text)}`),
  yellow_mag: text => color.yellow(`${bg.mag(text)}`),
  br_blue_purple: text => color.br_blue(`${bg.purple(text)}`),
  keywords: text => color.lime(text),
};

const warn = {
  caution: text => bg.br_yellow(`${decorate.bold(text)}`),
  warning: text => bg.br_red(`${decorate.bold(text)}`),
};

module.exports = {
  rc,
  decorate,
  color,
  bg,
  hl,
  warn,
};
