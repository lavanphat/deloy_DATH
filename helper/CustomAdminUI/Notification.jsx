import {
  Box,
  Button,
  FormGroup,
  FormMessage,
  Header,
  Icon,
  Input,
  Label,
  TextArea,
  useNotice,
} from 'admin-bro';
import React from 'react';

const Notification = (props) => {
  const {} = props;
  const [form, setForm] = React.useState({ title: '', body: '' });
  const [err, setErr] = React.useState({});
  const sendNotice = useNotice();

  const handleSubmit = (e) => {
    event.preventDefault();
    const err = validation(form, setErr);

    if (err.title || err.body) {
      setErr(err);
    } else {
      setErr({});
      sendNotification(form, sendNotice);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <Box variant="grey" as="form" onSubmit={handleSubmit}>
      <Box variant="white">
        <Header.H3>Gửi thông báo mã giảm giá</Header.H3>
      </Box>
      <Box variant="white">
        <FormGroup error={err.title}>
          <Label htmlFor="input1">Tiêu đề</Label>
          <Input
            name="title"
            value={form.title}
            onChange={onChange}
            style={{ width: '50%' }}
          />
          {err.title && <FormMessage>{err.title}</FormMessage>}
        </FormGroup>
      </Box>
      <Box variant="white">
        <FormGroup error={err.body}>
          <Label htmlFor="textarea1">Nội dung</Label>
          <TextArea
            name="body"
            width={1 / 2}
            value={form.body}
            onChange={onChange}
          />
          {err.body && <FormMessage>{err.body}</FormMessage>}
        </FormGroup>
      </Box>
      <Box variant="white"></Box>
      <Box variant="white">
        <Button mt="lg" type="submit">
          <Icon icon="Send" />
          Gửi
        </Button>
      </Box>
    </Box>
  );
};

export default Notification;

function sendNotification(form, sendNotice) {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'authorization',
    'key=AAAAcibDysY:APA91bE-GBKieMq1ylWMJk8DxyzRTtalurHrZFgipiNatb4eCM5UBsvz9AyC5LdiT1xCxDhaqLojjU_h-qH5j8aOIx-bgdn-BUa1pV6n8OylUibEcV5PnmGgKqRetLMApmdAlD9qL_nj'
  );
  var raw = {
    data: form,
    to: '/topics/all',
  };
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(raw),
    redirect: 'follow',
  };
  fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
    .then((response) => response.text())
    .then((result) => sendNotice({ message: 'Send success', type: 'success' }))
    .catch((error) => {
      console.log(error);
      sendNotice({ message: 'Send error', type: 'error' });
    });
}

const checkRequied = (value) => (value ? undefined : 'Bạn không được bỏ trống');

function validation(form, setErr) {
  const requiredFields = ['title', 'body'];
  let errors = {};
  requiredFields.forEach((field) => {
    errors[field] = checkRequied(form[field].trim());
  });
  return errors;
}
