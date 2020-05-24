const Paid = require('../model/paid');
const Course = require('../model/course');

const getDayinMonth = (dataBillMonth, key) => {
  const dayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();
  for (let i = 0; i < dayOfMonth; i++) {
    dataBillMonth.push({ name: i + 1, [key]: 0 });
  }
};

let frequencyDateFormatMap = {
  0: '%Y-%m-%d',
  1: '%d',
  2: '%m',
  3: '%H'
};

module.exports.statisticalPaid = async (startDate, endDate, frequency = 1) => {
  let frequencyDateFormat = frequencyDateFormatMap[frequency];

  const statistical = await Paid.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lt: endDate
        }
      }
    },
    {
      $project: {
        frequency: {
          $dateToString: {
            format: frequencyDateFormat,
            date: '$createdAt',
            timezone: '+07'
          }
        }
      }
    },
    {
      $group: {
        _id: '$frequency',
        count: {
          $sum: 1
        }
      }
    }
  ]);

  if (frequency === 3) {
    const data = [
      {
        name: '0:00 - 4:00',
        count: 0
      },
      {
        name: '4:00 - 8:00',
        count: 0
      },
      {
        name: '8:00 - 12:00',
        count: 0
      },
      {
        name: '12:00 - 16:00',
        count: 0
      },
      {
        name: '16:00 - 20:00',
        count: 0
      },
      {
        name: '20:00 - 24:00',
        count: 0
      }
    ];

    statistical.forEach(({ _id, count }) => {
      switch (true) {
        case _id >= 0 && _id < 4:
          data[0]['count'] += count;
          break;
        case _id >= 4 && _id < 8:
          data[1]['count'] += count;
          break;
        case _id >= 8 && _id < 12:
          data[2]['count'] += count;
          break;
        case _id >= 12 && _id < 16:
          data[3]['count'] += count;
          break;
        case _id >= 16 && _id < 20:
          data[4]['count'] += count;
          break;
        case _id >= 20 && _id < 24:
          data[5]['count'] += count;
          break;
      }
    });
    return data;
  } else if (frequency === 1) {
    const dataBillMonth = [];
    getDayinMonth(dataBillMonth, 'count');

    statistical.forEach(({ _id, count }) => {
      dataBillMonth[_id - 1]['count'] += count;
    });
    return dataBillMonth;
  } else if (frequency === 2) {
    const dataBillYear = [];
    for (let i = 0; i < 12; i++) {
      dataBillYear.push({ name: i + 1, count: 0 });
    }

    statistical.forEach(({ _id, count }) => {
      dataBillYear[_id - 1]['count'] += count;
    });
    return dataBillYear;
  }
};

module.exports.statisticalCourse = async (startDate, endDate) => {
  return await Paid.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lt: endDate
        }
      }
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course'
      }
    },
    {
      $project: {
        _id: 0,
        name: '$course.name'
      }
    },
    { $unwind: '$name' },
    {
      $group: {
        _id: '$name',
        name: { $first: '$name' },
        value: {
          $sum: 1
        }
      }
    },
    {
      $project: {
        _id: 0
      }
    }
  ]);
};

module.exports.statisticalTotal = async (startDate, endDate, frequency = 1) => {
  let frequencyDateFormat = frequencyDateFormatMap[frequency];

  const statistical = await Paid.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lt: endDate
        }
      }
    },
    {
      $project: {
        frequency: {
          $dateToString: {
            format: frequencyDateFormat,
            date: '$createdAt',
            timezone: '+07'
          }
        },
        price: '$price'
      }
    },
    {
      $group: {
        _id: '$frequency',
        total: {
          $sum: { $multiply: ['$price'] }
        }
      }
    },
    { $project: { _id: 0, name: '$_id', total: '$total' } }
  ]);

  if (frequency === 3) {
    const data = [
      {
        name: '0:00 - 4:00',
        total: 0
      },
      {
        name: '4:00 - 8:00',
        total: 0
      },
      {
        name: '8:00 - 12:00',
        total: 0
      },
      {
        name: '12:00 - 16:00',
        total: 0
      },
      {
        name: '16:00 - 20:00',
        total: 0
      },
      {
        name: '20:00 - 24:00',
        total: 0
      }
    ];

    statistical.forEach(({ name, total }) => {
      switch (true) {
        case name >= 0 && name < 4:
          data[0]['total'] += total;
          break;
        case name >= 4 && name < 8:
          data[1]['total'] += total;
          break;
        case name >= 8 && name < 12:
          data[2]['total'] += total;
          break;
        case name >= 12 && name < 16:
          data[3]['total'] += total;
          break;
        case name >= 16 && name < 20:
          data[4]['total'] += total;
          break;
        case name >= 20 && name < 24:
          data[5]['total'] += total;
          break;
      }
    });
    return data;
  } else if (frequency === 1) {
    const dataTotalMonth = [];
    getDayinMonth(dataTotalMonth, 'total');

    statistical.forEach(({ name, total }) => {
      dataTotalMonth[name - 1]['total'] += total;
    });
    return dataTotalMonth;
  } else if (frequency === 2) {
    const dataTotalYear = [];
    for (let i = 0; i < 12; i++) {
      dataTotalYear.push({ name: i + 1, total: 0 });
    }

    statistical.forEach(({ name, total }) => {
      dataTotalYear[name - 1]['total'] += total;
    });
    return dataTotalYear;
  }
};
