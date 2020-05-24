import { Button, DropZone, Icon, Input, Label, Section } from 'admin-bro';
import React, { Fragment, useEffect, useState } from 'react';
import { convertParamsToArrayItems } from '../ConvertParamsToArrayItems';

const EditSectionCourse = (props) => {
  const [section, setSection] = useState([]);
  const { record, onChange } = props;
  const video = (item, i, j) => (
    <>
      <Label>Title Video</Label>
      {/* <input
        className="input"
        name={`titleVideo`}
        onChange={(e) => onChanges(e, i, j)}
        value={item['titleVideo'] || ''}
      /> */}
      <Input
        id="title"
        name={`titleVideo`}
        onChange={(e) => onChanges(e, i, j)}
        value={item['titleVideo'] || ''}
      />
      <Label>Video</Label>
      <DropZone
        onUpload={(files) => onUpload(files, i, j)}
        validate={{ maxSize: 1024 * 1000000 }}
      />
      <Label>istry</Label>
      {/* <CheckBox
        type="checkbox"
        name="isTry"
        onChange={(e) => onChanges(e, i, j)}
        value={item['isTry']}
        checked={item['isTry'] ? true : false}
      /> */}
      <input
        className="checkbox"
        type="checkbox"
        name="isTry"
        onChange={(e) => onChanges(e, i, j)}
        value={item['isTry']}
        checked={item['isTry'] ? true : false}
      />
      <br></br>
      <Button
        mb="default"
        variant="danger"
        mr="default"
        onClick={(e) => removeVideo(e, i, j)}
      >
        <Icon icon="Close" />
        Remove
      </Button>
    </>
  );
  const chuong = (item, i) => (
    <>
      <Label>Section {i}</Label>
      <Section>
        {/* <input
            className="input"
            onChange={(e) => input(e, i)}
            value={item['title'] || ''}
            name={`title`}
            id={`title`}
          /> */}
        <Input
          id="title"
          className="input"
          onChange={(e) => input(e, i)}
          value={item['title'] || ''}
          name={`title`}
        />
        {section[i]['content']
          ? section[i]['content'].map((item, j) => (
              <Label key={j} property={{ label: `video ${j + 1}` }}>
                <Section>{video(item, i, j)}</Section>
              </Label>
            ))
          : null}
        <Button
          mb="default"
          variant="primary"
          mr="default"
          onClick={(e) => addVideo(e, i)}
        >
          <Icon icon="Add" />
          Add video
        </Button>
      </Section>
      <Button
        mb="default"
        variant="danger"
        mr="default"
        onClick={(e) => removeSection(e, i)}
      >
        <Icon icon="Close" />
        Remove
      </Button>
    </>
  );

  const addSection = (e) => {
    e.preventDefault();
    setSection([...section, { title: '' }]);
  };

  const removeSection = (e, i) => {
    e.preventDefault();
    var array = [...section];
    array.splice(i, 1);
    setSection(array);
  };

  const input = (e, i) => {
    setSection(
      section.map((item, index) =>
        index === i ? { ...item, [e.target.name]: e.target.value } : item
      )
    );
  };

  const addVideo = (e, i) => {
    e.preventDefault();
    setSection(
      section.map((item, index) =>
        index === i
          ? {
              ...item,
              content: item['content'] ? [...item['content'], {}] : [{}],
            }
          : item
      )
    );
  };

  const removeVideo = (e, i, j) => {
    e.preventDefault();

    let listSection = [...section];
    listSection[i]['content'].splice(j, 1);
    setSection(listSection);
  };

  const onUpload = (files, i, j) => {
    const { size, type } = files[0];
    if (
      size > 0 &&
      size <= 1073741824 &&
      (type === 'video/mp4' || type === 'text/plain')
    ) {
      setSection(
        section.map((item, index) =>
          index === i
            ? {
                ...item,
                content: item.content.map((item, index) =>
                  index === j ? { ...item, video: files[0] } : item
                ),
              }
            : item
        )
      );
    } else {
      alert('File phải nhỏ hơn 1Gb và có dạng mp4');
    }
  };

  const onChanges = (e, i, j) => {
    console.log(e.target.type);
    setSection(
      section.map((item, index) =>
        index === i
          ? {
              ...item,
              content: item.content.map((item, index) =>
                index === j
                  ? {
                      ...item,
                      [e.target.name]:
                        e.target.type === 'checkbox'
                          ? e.target.checked
                          : e.target.value,
                    }
                  : item
              ),
            }
          : item
      )
    );
  };

  useEffect(() => {
    const newRecord = { ...record };
    if (newRecord.params._id) {
      const property = { name: 'section' };
      const sections = convertParamsToArrayItems(property, newRecord);

      setSection(sections);
    }
  }, []);

  useEffect(() => {
    const newRecord = { ...record };

    for (const key in newRecord.params) {
      if (newRecord.params.hasOwnProperty(key) && key.match(/^section/)) {
        delete newRecord.params[key];
      }
    }

    onChange({
      ...newRecord,
      params: {
        ...newRecord.params,
        section,
      },
    });
  }, [section]);

  return (
    <Fragment>
      <Label>Section</Label>
      <Section>
        {section.map((item, i) => (
          <Fragment key={i}>{chuong(item, i)}</Fragment>
        ))}
      </Section>
      <Button mb="default" variant="primary" mr="default" onClick={addSection}>
        <Icon icon="Add" />
        Add section
      </Button>
    </Fragment>
  );
};

export default EditSectionCourse;
