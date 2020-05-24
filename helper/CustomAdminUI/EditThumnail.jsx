import { DropZone, Label } from 'admin-bro';
import React, { Fragment, useEffect, useState } from 'react';

let imagePreview = {
  width: '30%',
  minHeight: '100px',
  border: '2px solid #dddddd',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  color: '#cccccc',
};

let imagePreviewImage = { display: 'none', width: '100%' };

const EditThumnail = (props) => {
  const [srcImage, setSrcImage] = useState('');
  const { record, onChange } = props;
  const { thumnail } = record.params;

  const onUpload = (files) => {
    const { size, type } = files[0];
    if (size > 0 && size <= 104857600 && type.startsWith('image/')) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setSrcImage(reader.result);
      };

      document.querySelector('#thumnail').style.display = 'block';
      document.querySelector('#textDefault').style.display = 'none';

      const newRecord = { ...record };
      onChange({
        ...newRecord,
        params: {
          ...newRecord.params,
          thumnail: files[0],
        },
      });
    } else {
      alert('File phải nhỏ hơn 100MB và phải là ảnh');
    }
  };

  useEffect(() => {
    if (thumnail && thumnail.match(/^http/)) {
      setSrcImage(thumnail);
      document.querySelector('#thumnail').style.display = 'block';
      document.querySelector('#textDefault').style.display = 'none';
    }
  }, []);

  return (
    <Fragment>
      <Label>Thumnail</Label>
      <DropZone onChange={(files) => onUpload(files)} />
      <div style={imagePreview}>
        <img id="thumnail" src={srcImage} style={imagePreviewImage} />
        <span id="textDefault">Thumnail</span>
      </div>
    </Fragment>
  );
};

export default EditThumnail;
