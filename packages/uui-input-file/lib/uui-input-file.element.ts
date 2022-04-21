import { defineElement } from '@umbraco-ui/uui-base/lib/registration';
import { property, query, state } from 'lit/decorators.js';
import { css, html, LitElement } from 'lit';
import { UUIFileDropzoneElement } from '@umbraco-ui/uui-file-dropzone/lib';
import { FormControlMixin } from '@umbraco-ui/uui-base/lib/mixins';
import { demandCustomElement } from '@umbraco-ui/uui-base/lib/utils';
import { iconDelete } from '@umbraco-ui/uui-icon-registry-essential/lib/svgs';

interface FileWrapper {
  name: string;
  extension: string;
  isDirectory: boolean;
  show: boolean;
  size?: number;
  thumbnail?: string;
  source?: string;
  file?: File;
}

/**
 * @element uui-input-file
 * @description - A form associated file input that supports multiple files.
 */
@defineElement('uui-input-file')
export class UUIInputFileElement extends FormControlMixin(LitElement) {
  static styles = [
    css`
      :host {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        box-sizing: border-box;
        border: 1px solid var(--uui-interface-border);
      }

      #input {
        position: absolute;
        width: 0px;
        height: 0px;
        opacity: 0;
        display: none;
      }

      #files {
        display: grid;
        box-sizing: border-box;
        justify-items: center;
        width: 100%;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 16px;
        padding: 16px;
        overflow: auto;
        max-height: 100%;
      }

      #dropzone {
        display: none;
        position: absolute;
        inset: 0px;
        z-index: 10;
        justify-content: center;
        align-items: center;
      }

      #add-button {
        width: 150px;
        height: 150px;
        display: flex;
        padding: 16px;
        box-sizing: border-box;
        justify-content: center;
        align-items: center;
      }
    `,
  ];

  @query('#dropzone')
  private _dropzone!: UUIFileDropzoneElement;

  @query('#dropzone')
  private _dropZone: UUIFileDropzoneElement | undefined;

  /**
   * Accepted filetypes. Will allow all types if empty.
   * @type {string}
   * @attr
   * @default false
   */
  @property({ type: String })
  public accept: string = '';

  /**
   * Allows for multiple files to be selected.
   * @type {boolean}
   * @attr
   * @default false
   */
  @property({ type: Boolean })
  public multiple: boolean = false;

  get value() {
    return this._value;
  }
  set value(newValue) {
    super.value = newValue;

    if (newValue instanceof FormData) {
      const data = (
        this.multiple ? newValue.getAll(this.name) : [newValue.get(this.name)]
      ) as Array<File>;
      this._updateFileWrappers(data);
      return;
    }

    if (newValue instanceof File) {
      this._updateFileWrappers([newValue]);
      return;
    }
  }

  @state()
  private _fileWrappers: FileWrapper[] = [];

  constructor() {
    super();
    this.addEventListener('dragenter', () => this._setShowDropzone(true));
    this.addEventListener('dragleave', () => this._setShowDropzone(false));
    this.addEventListener('drop', () => this._setShowDropzone(false));
  }

  connectedCallback(): void {
    super.connectedCallback();
    demandCustomElement(this, 'uui-icon');
    demandCustomElement(this, 'uui-file-dropzone');
    demandCustomElement(this, 'uui-button');
    demandCustomElement(this, 'uui-action-bar');
    demandCustomElement(this, 'uui-file-preview');
  }

  protected getFormElement(): HTMLElement {
    return this._dropZone! as HTMLElement;
  }

  private _handleClick(e: Event) {
    e.stopImmediatePropagation();
    this._dropzone.browse();
  }

  private _updateFileWrappers = async (data: Array<File>) => {
    let newFileWrappers: Array<FileWrapper> = [];

    for await (const file of data) {
      const fileDisplay = await this._fileDisplayFromFile(file);

      if (this.multiple) {
        newFileWrappers.push(fileDisplay);
      } else {
        newFileWrappers = [fileDisplay];
      }
    }

    this._fileWrappers = newFileWrappers;
  };

  private async _handleFilesChange(event: CustomEvent) {
    const entries = event.detail.files as FileSystemFileEntry[] | FileList;

    if (!this.multiple) {
      if (this.value instanceof File) {
        const entry = entries[0];
        const isFile = entry instanceof File;
        this.value = isFile ? entry : await this._getFile(entry);
        return;
      }

      if (this.value instanceof FormData) {
        const entry = entries[0];
        const isFile = entry instanceof File;
        const file = isFile ? entry : await this._getFile(entry);
        this.value.delete(this.name);
        this.value.append(this.name, file);
        this._updateFileWrappers([file]);
        return;
      }
    }

    let newValue: FormDataEntryValue | FormData = this.value;

    if (entries.length > 0 && !(this.value instanceof FormData)) {
      newValue = new FormData();
    }

    if (newValue instanceof FormData) {
      for (const entry of entries) {
        const isFile = entry instanceof File;
        newValue.append(this.name, isFile ? entry : await this._getFile(entry));
      }
    }

    this.value = newValue;
  }

  private async _fileDisplayFromFile(file: File): Promise<FileWrapper> {
    const thumbnail = await this._getThumbnail(file);

    return {
      name: file.name.split('.')[0],
      extension: file.name.split('.')[1],
      isDirectory: false,
      show: true,
      size: file.size,
      file: file,
      source: this._isFileAnImage(file) ? thumbnail : undefined,
    };
  }

  private _isFileAnImage(file: File) {
    return file ? file['type'].split('/')[0] === 'image' : false;
  }

  private async _getFile(fileEntry: FileSystemFileEntry): Promise<File> {
    return await new Promise<File>((resolve, reject) =>
      fileEntry.file(resolve, reject)
    );
  }

  private async _getThumbnail(file: File): Promise<any> {
    return await new Promise<any>(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result);
      };
    });
  }

  private _removeFile(index: number) {
    const fileWrapper = this._fileWrappers[index];

    if (this.value instanceof FormData) {
      const files = this.value.getAll(this.name) as Array<File>;
      const filteredFiles = files.filter(file => file !== fileWrapper.file);

      if (filteredFiles.length === 0) {
        this.value = '';
      } else {
        this.value.delete(this.name);

        for (const file of filteredFiles) {
          this.value.append(this.name, file);
        }
      }

      this._updateFileWrappers(filteredFiles);
    }

    if (this.value instanceof File) {
      this.value = '';
      this._updateFileWrappers([]);
    }
  }

  private _setShowDropzone(show: boolean) {
    if (show) {
      this._dropZone!.style.display = 'flex';
    } else {
      this._dropZone!.style.display = 'none';
    }
  }

  private _renderFileItem(file: FileWrapper, index: number) {
    return html`<uui-file-preview
      .name=${file.name}
      .extension=${file.extension}
      .url=${file.source}
      .size=${file.size}
      .isDirectory=${file.isDirectory}
      .src="${file.source}">
      <uui-action-bar slot="actions">
        <uui-button @click=${() => this._removeFile(index)} look="danger">
          <uui-icon name="delete" .fallback=${iconDelete.strings[0]}></uui-icon>
        </uui-button>
      </uui-action-bar>
    </uui-file-preview>`;
  }

  private _renderFiles() {
    return html`${this._fileWrappers.map((file: FileWrapper, index: number) =>
      file.show ? this._renderFileItem(file, index) : ''
    )}`;
  }

  render() {
    return html`
      <uui-file-dropzone
        id="dropzone"
        ?multiple=${this.multiple}
        .accept=${this.accept}
        @file-change=${this._handleFilesChange}
        label="Drop files here"></uui-file-dropzone>
      <div id="files">
        ${this._renderFiles()}
        <uui-button
          @click=${this._handleClick}
          id="add-button"
          look="placeholder"
          label="Add"></uui-button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'uui-input-file': UUIInputFileElement;
  }
}
