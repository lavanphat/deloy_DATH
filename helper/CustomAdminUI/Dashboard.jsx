import {
  ApiClient,
  Box,
  DropDown,
  DropDownItem,
  DropDownMenu,
  DropDownTrigger,
  Header,
  Icon,
  Illustration,
  Link,
} from 'admin-bro';
import React, { Fragment, useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Count ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Avg ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const Dashboard = () => {
  const [dataBill, setDataBill] = useState({});
  const [billChart, setBillChart] = useState([]);
  const [courseChart, setCourseChart] = useState([]);
  const [totalChart, setTotalChart] = useState([]);
  const [timeBill, setTimeBill] = useState('Day');
  const [timeCourse, setTimeCourse] = useState('Day');
  const [timeTotal, setTimeTotal] = useState('Day');
  const [activeCourse, setActiveCourse] = useState(0);

  useEffect(() => {
    const api = new ApiClient();
    api.getDashboard().then(({ data }) => {
      setBillChart(data.billsDay);
      setDataBill(data);
      setCourseChart(data.coursesDay);
      setTotalChart(data.totalDay);
    });
  }, []);

  const onClick = (e) => {
    setTimeBill(e.target.innerHTML);
  };

  const onClickCourse = (e) => {
    setTimeCourse(e.target.innerHTML);
  };

  const onClickTotal = (e) => {
    setTimeTotal(e.target.innerHTML);
  };

  useEffect(() => {
    setBillChart(dataBill[`bills${timeBill}`]);
  }, [timeBill]);

  useEffect(() => {
    setCourseChart(dataBill[`courses${timeCourse}`]);
  }, [timeCourse]);

  useEffect(() => {
    setTotalChart(dataBill[`total${timeTotal}`]);
  }, [timeTotal]);

  const onPieEnter = (data, index) => {
    setActiveCourse(index);
  };

  return (
    <Fragment>
      <Box bg="grey100" p="xxl" flex justifyContent="space-between">
        <Illustration variant="Rocket" />
        <Box color="white" width="sidebarWidth" flex alignItems="center">
          <Header.H1>Dashboard</Header.H1>
        </Box>
      </Box>
      <Chart
        title={`Bill ${timeBill}`}
        onClick={onClick}
        chart={renderChartBill(billChart)}
      />
      <Chart
        title={`Course ${timeBill}`}
        onClick={onClickCourse}
        chart={renderChartCourse(activeCourse, courseChart, onPieEnter)}
      />
      <Chart
        title={`Total ${timeBill}`}
        onClick={onClickTotal}
        chart={renderChartTotal(totalChart)}
      />
    </Fragment>
  );
};

export default Dashboard;

function renderChartTotal(totalChart) {
  return (
    <Box width="100%" height={250} mt={32}>
      <ResponsiveContainer>
        <BarChart
          width={500}
          height={300}
          data={totalChart}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

function renderChartCourse(activeCourse, courseChart, onPieEnter) {
  return (
    <PieChart width={400} height={400} style={{ margin: '0 auto' }}>
      <Pie
        activeIndex={activeCourse}
        activeShape={renderActiveShape}
        data={courseChart}
        cx={200}
        cy={200}
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        onMouseEnter={onPieEnter}
      />
    </PieChart>
  );
}

function renderChartBill(billChart) {
  return (
    <Box width="100%" height={250} mt={32}>
      <ResponsiveContainer>
        <AreaChart
          data={billChart}
          margin={{
            right: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}

function Chart({ title, onClick, chart }) {
  return (
    <Box variant="grey">
      <Box variant="white" p="xxl" mt={-50} mb={20} boxShadow="card">
        <Box flex justifyContent="space-between">
          <Header.H5>{title}</Header.H5>
          <DropDown>
            <DropDownTrigger p="default">
              <Icon size={24} icon="OverflowMenuHorizontal" />
            </DropDownTrigger>
            <DropDownMenu top="xxl">
              <DropDownItem>
                <Link onClick={onClick}>Day</Link>
              </DropDownItem>
              <DropDownItem>
                <Link onClick={onClick}>Month</Link>
              </DropDownItem>
              <DropDownItem>
                <Link onClick={onClick}>Year</Link>
              </DropDownItem>
            </DropDownMenu>
          </DropDown>
        </Box>
        {chart}
      </Box>
    </Box>
  );
}
