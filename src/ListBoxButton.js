import aria from './utils';

/**
 * Aria ListBoxButton adaption
 * @see https://www.w3.org/TR/wai-aria-practices-1.1/examples/listbox/js/listbox-collapsible.js
 * @licence https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */

/**
 * ARIA Collapsible Dropdown Listbox Example
 * @function onload
 * @desc Initialize the listbox example once the page has loaded
 */
aria.ListboxButton = function(button, listbox) {
  H5P.EventDispatcher.call(this);

  this.button = button;
  this.listbox = listbox;
  this.registerEvents();
};

// Extends the event dispatcher
aria.ListboxButton.prototype = Object.create(H5P.EventDispatcher.prototype);
aria.ListboxButton.prototype.constructor = aria.ListboxButton;

aria.ListboxButton.prototype.registerEvents = function() {
  this.button.addEventListener('click', this.showListbox.bind(this));
  this.button.addEventListener('keyup', this.checkShow.bind(this));
  this.listbox.listboxNode.addEventListener(
    'blur',
    this.hideListbox.bind(this)
  );
  this.listbox.listboxNode.addEventListener(
    'keydown',
    this.checkHide.bind(this)
  );
  this.listbox.setHandleFocusChange(this.onFocusChange.bind(this));
};

aria.ListboxButton.prototype.checkShow = function(evt) {
  var key = evt.which || evt.keyCode;

  switch (key) {
    case aria.KeyCode.UP:
    case aria.KeyCode.DOWN:
      evt.preventDefault();
      this.showListbox();
      this.listbox.checkKeyPress(evt);
      break;
  }
};

aria.ListboxButton.prototype.checkHide = function(evt) {
  var key = evt.which || evt.keyCode;

  switch (key) {
    case aria.KeyCode.RETURN:
    case aria.KeyCode.ESC:
      evt.preventDefault();
      this.hideListbox();
      this.button.focus();
      break;
  }
};

aria.ListboxButton.prototype.showListbox = function() {
  aria.Utils.removeClass(this.listbox.listboxNode, 'hidden');
  this.button.setAttribute('aria-expanded', 'true');
  this.listbox.listboxNode.focus();
};

aria.ListboxButton.prototype.hideListbox = function() {
  aria.Utils.addClass(this.listbox.listboxNode, 'hidden');
  this.button.removeAttribute('aria-expanded');
};

aria.ListboxButton.prototype.onFocusChange = function(focusedItem) {
  this.button.innerHTML = focusedItem.innerHTML;
  const description = this.button.querySelector('.description');
  description.style.color = 'inherit';
  this.trigger('focusChange', focusedItem);
};

export default aria.ListboxButton;
