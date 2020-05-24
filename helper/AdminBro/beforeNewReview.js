const beforeNewReview = (request, { currentAdmin }) => {
  if (request.payload) {
    request.payload = { ...request.payload, user: currentAdmin._id };
  }
  return request;
};
exports.beforeNewReview = beforeNewReview;
