import ListBox from './ListBox';
import ListBoxButton from './ListBoxButton';
import './listbox.scss';

H5PEditor.widgets.multiLineSelect = H5PEditor.MultiLineSelect = class MultiLineSelect {
  constructor(parent, field, params, setValue) {
    this.parent = parent;
    this.field = field;
    this.params = params;
    this.setValue = setValue;
    this.value = this.params;
    this.id = H5PEditor.getNextFieldId(this.field);
    this.changes = [];
  }

  appendTo($wrapper) {
    const fieldMarkup = H5PEditor.createFieldMarkup(this.field, '', this.id);
    const select = this.createSelect();

    $wrapper[0].innerHTML = fieldMarkup;
    const errors = $wrapper[0].querySelector('.h5p-errors');
    errors.parentNode.insertBefore(select, errors);
    this.select = select;
  }

  createSelect() {
    const selectWrapper = document.createElement('div');
    selectWrapper.classList.add('h5p-editor-multi-line-select');

    const select = document.createElement('button');
    select.setAttribute('aria-haspopup', 'listbox');
    select.classList.add('multi-select');

    const listBox = document.createElement('ul');
    listBox.tabIndex = -1;
    listBox.setAttribute('role', 'listbox');
    listBox.classList.add('hidden');
    listBox.classList.add('listbox');

    let defaultOption;
    this.field.options.forEach(data => {
      const option = document.createElement('li');
      option.setAttribute('role', 'option');
      option.id = this.id + '-' + data.value;

      const title = document.createElement('div');
      title.classList.add('title');
      title.innerHTML = data.label;

      const description = document.createElement('div');
      description.classList.add('description');
      description.innerHTML = data.description;

      option.appendChild(title);
      option.appendChild(description);

      listBox.appendChild(option);

      if (this.params === data.value || !defaultOption) {
        defaultOption = option;
      }
    });

    select.innerHTML = defaultOption.innerHTML;
    listBox.setAttribute('aria-activedescendant', defaultOption.id);
    defaultOption.classList.add('focused');

    selectWrapper.appendChild(select);
    selectWrapper.appendChild(listBox);

    const ariaListBox = new ListBox(listBox);
    const ariaListboxButton = new ListBoxButton(select, ariaListBox);
    ariaListboxButton.on('focusChange', focusedButton => {
      const buttonId = focusedButton.data.id.split('-');
      this.value = buttonId[buttonId.length - 1];
      this.setValue(this.field, this.value);
      this.triggerListeners(this.value);
    });

    return selectWrapper;
  }

  triggerListeners(value) {
    this.changes.forEach(change => {
      change(value);
    });
  }

  validate() {
    return true;
  }

  getElement() {
    return this.select;
  }
};
