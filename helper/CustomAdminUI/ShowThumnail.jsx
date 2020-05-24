import { Label } from 'admin-bro';
import React from 'react';

const ShowThumnail = (props) => {
  const { thumnail } = props.record.params;
  return (
    <>
      <Label>Thumnail</Label>
      {thumnail && thumnail.match(/^http/) ? (
        <img src={thumnail} alt="thum" width={300} height={150} />
      ) : (
        thumnail
      )}
    </>
  );
};

export default ShowThumnail;
