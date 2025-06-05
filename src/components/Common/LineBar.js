import React, { useMemo } from "react";
import ReactEcharts from "echarts-for-react";
import moment from "moment";

const getChartColorsArray = (colors) => {
  colors = JSON.parse(colors);
  return colors.map(function (value) {
    var newValue = value.replace(" ", "");
    if (newValue.indexOf(",") === -1) {
      var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);

      if (color.indexOf("#") !== -1)
        color = color.replace(" ", "");
      if (color) return color;
      else return newValue;
    } else {
      var val = value.split(',');
      if (val.length === 2) {
        var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
        rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
        return rgbaColor;
      } else {
        return newValue;
      }
    }
  });
};

const LineBar = ({ dataColors, data, from, to }) => {
  const spineareaChartColors = getChartColorsArray(dataColors);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const enumerateDaysBetweenDates = (startDate, endDate, format = 'MM-DD-YYYY') => {
    let date = [];

    for (var m = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
      date.push(m.format(format));
    }

    date.push(endDate.format(format))

    return date;
  }

  const checkDateSequence = () => {
    if (from && to) {
      return true;
    }
    return false;
  }

  const defaultDates = checkDateSequence() ? enumerateDaysBetweenDates(moment(moment(from)), moment(to)) : enumerateDaysBetweenDates(moment(moment().subtract(6, 'days').toDate()), moment());

  const mobileValues = () => {
    let values = [];

    defaultDates.map(date => {
      values.push(data.filter(value => value.device == 'Mobile' && moment(value.created_at).format('DD-MM-YYYY') == moment(date).format('DD-MM-YYYY')).length)
    });

    return values;
  }

  const desktopValues = () => {
    let values = [];

    defaultDates.map(date => {
      values.push(data.filter(value => value.device == 'Desktop' && moment(value.created_at).format('DD-MM-YYYY') == moment(date).format('DD-MM-YYYY')).length)
    });

    return values;
  }

  const options = {
    grid: {
      zlevel: 0,
      x: 80,
      x2: 50,
      y: 30,
      y2: 30,
      borderWidth: 0,
      backgroundColor: "rgba(0,0,0,0)",
      borderColor: "rgba(0,0,0,0)",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#999",
        },
      },
    },
    toolbox: {
      orient: "center",
      left: 0,
      top: 20,
      feature: {
        dataView: { show: true, readOnly: false, title: "Data View" },
        magicType: { show: true, type: ["line", "bar"], title: { line: "For line chart", bar: "For bar chart" } },
        restore: { show: true, title: "restore" },
        saveAsImage: { show: true, title: "Download Image" },
      },
    },
    color: spineareaChartColors,
    legend: {
      data: ["Mobile", "Desktop"],
      textStyle: {
        color: ["#8791af"],
      },
    },
    xAxis: [
      {
        type: "category",
        data: checkDateSequence() ? enumerateDaysBetweenDates(moment(moment(from)), moment(to), 'DD-MM-YYYY') : enumerateDaysBetweenDates(moment(moment().subtract(6, 'days').toDate()), moment(), 'DD-MM-YYYY'),
        axisPointer: {
          type: "shadow",
        },
        axisLine: {
          lineStyle: {
            color: "#8791af",
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "Contact Requests",
        min: 0,
        max: 30,
        interval: 5,
        axisLine: {
          lineStyle: {
            color: '#8791af'
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(166, 176, 207, 0.1)"
          }
        },
        axisLabel: {
          formatter: '{value} Req'
        }
      },
    ],
    series: [
      {
        name: "Mobile",
        type: "bar",
        data: mobileValues(),
      },
      {
        name: "Desktop",
        type: "bar",
        data: desktopValues(),
      },
    ],
    textStyle: {
      color: ["#74788d"],
    },
  }


  return (
    <React.Fragment>
      <ReactEcharts style={{ height: "350px" }} option={options} />
    </React.Fragment>
  );
};

export default LineBar;
