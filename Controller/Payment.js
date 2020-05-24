const { VNPay } = require('vn-payments');
const Paid = require('../model/paid');
const Coupon = require('../model/coupon');

const code = {
  vnp_TmnCode: '0PR3QB5M',
  vnp_HashSecret: 'RWMTBOMCEKYWJVKLSYENURTJOQZEVWQM',
  vnp_Url: 'http://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  vnp_ReturnUrl: 'http://localhost:5000/order/vnpay_return',
};
let cart = null;
let coupon = null;

// const { paymentGateway, merchant, secureSecret } = VNPay.TEST_CONFIG;
const vnpay = new VNPay({
  paymentGateway: code.vnp_Url,
  merchant: code.vnp_TmnCode,
  secureSecret: code.vnp_HashSecret,
});

const checkoutVNPay = (req, res) => {
  const checkoutData = res.locals.checkoutData;

  checkoutData.returnUrl = `http://${req.headers.host}/api/payment/vnpay/callback`;
  checkoutData.orderInfo = `Thanh toan khoa hoc`;
  checkoutData.orderType = 'course';

  return vnpay.buildCheckoutUrl(checkoutData).then((checkoutUrl) => {
    res.locals.checkoutUrl = checkoutUrl;

    return checkoutUrl;
  });
};

const callbackVNPay = (req, res) => {
  const query = req.query;

  return vnpay.verifyReturnUrl(query).then((results) => {
    if (results) {
      res.locals.orderId = results.transactionId || '';
      res.locals.price = results.amount;
      res.locals.isSucceed = results.isSuccess;
      res.locals.message = results.message;
    } else {
      res.locals.isSucceed = false;
    }
  });
};

exports.checkOut = (req, res) => {
  const params = Object.assign({}, req.body);
  cart = params.cart;
  userID = params.userID;
  coupon = params.coupon;

  const clientIp =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  const amount = parseInt(params.amount.replace(/(\.|,)/g, ''), 10);
  const now = new Date();

  const checkoutData = {
    amount,
    clientIp: clientIp.length > 15 ? '127.0.0.1' : clientIp,
    locale: 'vn',
    billingCity: params.billingCity || '',
    billingPostCode: params.billingPostCode || '',
    billingStateProvince: params.billingStateProvince || '',
    billingStreet: params.billingStreet || '',
    billingCountry: params.billingCountry || '',
    deliveryAddress: params.billingStreet || '',
    deliveryCity: params.billingCity || '',
    deliveryCountry: params.billingCountry || '',
    currency: 'VND',
    deliveryProvince: params.billingStateProvince || '',
    orderId: `node-${now.toISOString()}`,
    // returnUrl: ,
    transactionId: `node-${now.toISOString()}`, // same as orderId (we don't have retry mechanism)
    // ko được bỏ trống
    customerEmail: params.email,
    customerPhone: params.phoneNumber,
    customerId: params.email,
  };
  res.locals.checkoutData = checkoutData;

  let asyncCheckout = null;
  switch (params.paymentMethod) {
    case 'vnPay':
      asyncCheckout = checkoutVNPay(req, res);
      break;
    default:
      break;
  }

  if (asyncCheckout) {
    asyncCheckout
      .then((checkoutUrl) => {
        // res.writeHead(301, { Location: checkoutUrl.href });
        // res.end();
        res.send(checkoutUrl.href);
      })
      .catch((err) => {
        res.send(err.message);
      });
  } else {
    res.send('Payment method not found');
  }
};

exports.checkOutCallBack = (req, res) => {
  const gateway = req.params.gateway;

  let asyncFunc = null;
  switch (gateway) {
    case 'vnpay':
      asyncFunc = callbackVNPay(req, res);
      break;
    default:
      break;
  }

  if (asyncFunc) {
    asyncFunc.then(() => {
      cart.forEach((element) => {
        Paid.create({
          course: element.id,
          user: userID,
          price: element.price,
        })
          .then((value) => console.log('success'))
          .catch((err) => console.log(err.response));
      });

      if (coupon) {
        Coupon.findByIdAndUpdate(coupon, {
          $inc: { quality: -1 },
        })
          .then((value) => console.log('update coupon success'))
          .catch((err) => console.log(err.response));
      }

      res.send(
        `<p>Thanh toán thành công. Nhấn vào <a href='http://${req.headers.host}'>đây</a> để về trang chủ</p>`
      );
    });
  } else {
    res.send('No callback found');
  }
};
