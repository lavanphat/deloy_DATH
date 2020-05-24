import { Label, Section } from 'admin-bro';
import React, { Fragment } from 'react';
import { convertParamsToArrayItems } from '../ConvertParamsToArrayItems';
// import PropTypes from 'prop-types';

const EditCourse = (props) => {
  const { record, property } = props;
  const items = convertParamsToArrayItems(property, record);
  const render = items.map((item, i) => (
    <>
      <Label key={i}>
        Content {i + 1} : {item.title}
      </Label>
      {item.content.map((video, j) => (
        <Section key={j}>
          <Label>
            Lecture {j + 1}:{' '}
            <a href={video.link} target="_blank">
              {video.titleVideo}
            </a>
          </Label>
          <Label>
            Duration: <span>{video.duration}</span>
          </Label>
          <Label>
            Is Try
            <input
              type="checkbox"
              disabled
              checked={video.isTry ? true : false}
            />
          </Label>
        </Section>
      ))}
    </>
  ));

  return (
    <Fragment>
      <Label>Section</Label>
      <Section children={render} />
    </Fragment>
  );
};

export default EditCourse;
