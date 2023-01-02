import type { NextPage } from "next";
import { ReactElement } from "react";
import { useTraffic } from "@hook/analytics";
import { ResponsiveLine } from "@nivo/line";
import type { Serie } from "@nivo/line";
import {
  Card,
  Container,
  LoadingOverlay,
  Divider,
  Text,
  Title,
  useMantineTheme,
  Group,
  ThemeIcon,
  SimpleGrid,
} from "@mantine/core";
import { IconArrowUpRight, IconArrowDownRight, IconEqual } from "@tabler/icons";

const Statistics = ({ stats }: { stats: any }): ReactElement => (
  <SimpleGrid cols={3} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
    {stats.map((stat: any) => (
      <Card p="md" key={stat.title}>
        <Group position="apart">
          <div>
            <Text color="dimmed" transform="uppercase" weight={700} size="xs">
              {stat.title}
            </Text>
            <Text weight={700} size="xl">
              {stat.value}
            </Text>
          </div>
          <ThemeIcon
            color="gray"
            variant="light"
            sx={(theme) => ({
              color:
                stat.diff > 0
                  ? theme.colors.teal[6]
                  : stat.diff == 0
                  ? theme.colors.gray[6]
                  : theme.colors.red[6],
            })}
            size={38}
          >
            {stat.diff > 0 ? (
              <IconArrowUpRight size={20} stroke={2} />
            ) : stat.diff == 0 ? (
              <IconEqual size={20} stroke={2} />
            ) : (
              <IconArrowDownRight size={20} stroke={2} />
            )}
          </ThemeIcon>
        </Group>
        <Text color="dimmed" size="sm" mt="md">
          <Text
            component="span"
            color={stat.diff > 0 ? "teal" : stat.diff == 0 ? "gray.6" : "red"}
            weight={700}
          >
            {stat.diff}%
          </Text>{" "}
          {stat.diff > 0
            ? "increase"
            : stat.diff == 0
            ? "equivalent"
            : "decrease"}{" "}
          compared to {stat.comparedTo}
        </Text>
      </Card>
    ))}
  </SimpleGrid>
);

const Line = ({ data }: { data: Serie[] }): ReactElement => {
  const theme = useMantineTheme();
  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 10, bottom: 100, left: 50 }}
      xScale={{ type: "point" }}
      yScale={{ type: "linear", min: "auto", max: "auto" }}
      // yFormat=" >-.2f"
      curve="monotoneX"
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      colors={{
        scheme: "accent",
      }}
      theme={{
        textColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[0]
            : theme.colors.gray[7],
        background:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.white,
        tooltip: {
          container: {
            background: theme.colors.dark[5],
            color: theme.colors.dark[0],
          },
        },
        grid: {
          line: {
            stroke:
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[2],
          },
        },
      }}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 72,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          symbolSize: 12,
          symbolShape: "circle",
        },
      ]}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Day",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Visits",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableCrosshair={false}
      enableSlices="x"
      useMesh
    />
  );
};
const Traffic: NextPage = (): ReactElement => {
  const [ data, traffic, loading, error ]: UseTraffic = useTraffic();

  // Get today's day of the week (0-6) and yesterday's day of the week (0-6)
  // JS is weird and Sunday is 0, so we add 1 and then subtract 1 to get 0-6
  const day = (new Date().getDay() || 7) - 1;
  const yesterday = (day || 1) - 1;

  // Replace 0 with 1 to avoid division by 0
  const stableTraffic = (dayTraffic: any = 0) =>
    dayTraffic !== 0 ? dayTraffic : 1;

  // Find difference between today and yesterday in percentage
  const findDifference = (todayNum: number, yesterdayNum: number) => {
    const dayDiff = stableTraffic(todayNum);
    const yesterdayDiff = stableTraffic(yesterdayNum);
    return Math.round((dayDiff * 100) / yesterdayDiff - 100);
  };

  // Days since first visit to today
  const daysSinceFirstVisit = Math.round(
    (new Date().getTime() -
      new Date(traffic?.complete.traffic[0].timestamp).getTime()) /
      (1000 * 3600 * 24)
  );

  const stats = [
    {
      title: "Visits",
      value: traffic?.weekly[day].length,
      comparedTo: "yesterday",
      diff: findDifference(
        traffic?.weekly[day].length,
        traffic?.weekly[yesterday].length
      ),
    },
    {
      title: "Visitors",
      value: traffic?.weekly[day].unique.visitors,
      comparedTo: "yesterday",
      diff: findDifference(
        traffic?.weekly[day].unique.visitors,
        traffic?.weekly[yesterday].unique.visitors
      ),
    },
    {
      title: "Growth Rate",
      value: Math.round(
        (traffic?.complete.length - traffic?.weekly[day].length) /
          daysSinceFirstVisit
      ),
      comparedTo: "all time",
      diff: findDifference(
        traffic?.weekly[day].length,
        (traffic?.complete.length - traffic?.weekly[day].length) /
          daysSinceFirstVisit
      ),
    },
  ];

  return (
    <Container>
      <Title align="center">
        Weekly Traffic
      </Title>
      <Card my="xl">
        <Text>
          This chart shows the number of visits to your website this week. You can hover over
          the chart to see the exact number of visits for each day. The chart is responsive and will
          adapt to the size of the screen.
        </Text>
      </Card>
      <Card h={600}>
        {error ? (
          <Text>Having troubles making request to get statistics!</Text>
        ) : (
          <Line data={data} />
        )}
        <LoadingOverlay visible={loading} />
      </Card>
      <Divider my="xl" variant="dashed" />
      <Title>Today</Title>
      <Card my="xl">
        <Text>
          This section shows the number of visits and visitors to your website today. You can compare
          the number of visits and visitors to yesterday to see how your website is performing. Other
          than that, you can also see the growth rate of your website - the average number of visits
          per day excluding today.
        </Text>
      </Card>
      <Card bg="transparent" p={0} mb="xl" withBorder={false}>
        {error ? (
          <Text>Having troubles making request to get statistics!</Text>
        ) : (
          <Statistics stats={stats} />
        )}
        <LoadingOverlay visible={loading} />
      </Card>
    </Container>
  );
};

export default Traffic;
