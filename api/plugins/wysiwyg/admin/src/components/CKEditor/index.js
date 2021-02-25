
import React from 'react';
import PropTypes from 'prop-types';
import { CKEditor } from '@ckeditor/ckeditor5-react';
// Custom build
import ClassicEditor from '../../../../ckeditor5/packages/ckeditor5-build-classic/build/ckeditor';
import styled from 'styled-components';

const Wrapper = styled.div`
  .ck-editor__main {
    min-height: 200px;
    > div {
      min-height: 200px;
    }
  }
`;

const configuration = {
  alignment: {
    options: [ 'left', 'center', 'right' ]
  },
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    'bulletedList',
    'numberedList',
    '|',
    'alignment',
    '|',
    'indent', 
    'outdent',
    '|',
    'blockQuote',
    'mediaEmbed',
    'undo',
    'redo',
  ],
};

const Editor = ({ onChange, name, value }) => {
  return (
    <Wrapper>
      <CKEditor
        editor={ClassicEditor}
        config={configuration}
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange({ target: { name, value: data } });
        }}
      />
    </Wrapper>
  );
};

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default Editor;