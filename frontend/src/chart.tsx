import { LineChart } from '@mui/x-charts/LineChart';
import { greenPalette } from '@mui/x-charts/colorPalettes';

const tempLabels: { [key: string]: string } = {
  temperature: 'Temperature',
  humidity: 'Humidity',
};

const stackStrategy = {
  stack: 'total',
  area: false,
  stackOffset: 'none', // To stack 0 on top of others
} as const;

const customize = {
  height: 350,
  hideLegend: true,
  experimentalFeatures: { preferStrictDomainInLineCharts: true },
};

const dateFormatter = Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false,
  timeZone: "America/Los_Angeles",
});

// ADD CODE BELOW
