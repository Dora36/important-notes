import { MDCRipple } from '@material/ripple/index';
const ripple = new MDCRipple(document.querySelector('.foo-button'));



import { MDCDialog } from '@material/dialog';
const dialog = new MDCDialog(document.querySelector('.mdc-dialog'));



import { MDCList } from '@material/list';
const list = new MDCList(document.querySelector('.mdc-dialog .mdc-list'));

dialog.listen('MDCDialog:opened', () => {
  list.layout();
});