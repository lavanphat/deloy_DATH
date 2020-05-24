// import * as flat from 'flat';
const flat = require('flat');

exports.convertParamsToArrayItems = (property, record) => {
  const tempName = 'arrayField';
  const regex = new RegExp(`^${property.name}`);
  const keys = Object.keys(record.params).filter(key => key.match(regex));
  const obj = keys.reduce(
    (memo, key) => ({
      ...memo,
      [key.replace(regex, tempName)]: record.params[key]
    }),
    {}
  );
  const unflatten = flat.unflatten(obj);
  return unflatten[tempName] || [];
};
