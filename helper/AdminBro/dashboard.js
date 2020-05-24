const { statisticalPaid, statisticalCourse, statisticalTotal } = require('../Statistical');
const dashboard = async () => {
  const billsDay = await statisticalPaid(new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(24, 0, 0, 0)), 3);
  const billsMonth = await statisticalPaid(new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));
  const billsYear = await statisticalPaid(new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), 11, 1), 2);
  const coursesDay = await statisticalCourse(new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(24, 0, 0, 0)));
  const coursesMonth = await statisticalCourse(new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));
  const coursesYear = await statisticalCourse(new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), 11, 1));
  const totalDay = await statisticalTotal(new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(24, 0, 0, 0)), 3);
  const totalMonth = await statisticalTotal(new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));
  const totalYear = await statisticalTotal(new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), 11, 1), 2);
  return {
    billsDay,
    billsMonth,
    billsYear,
    coursesDay,
    coursesMonth,
    coursesYear,
    totalDay,
    totalMonth,
    totalYear,
  };
};
exports.dashboard = dashboard;
