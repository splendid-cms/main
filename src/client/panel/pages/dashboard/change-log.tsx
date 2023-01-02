import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";
import { useChangeLog } from "@hook/dashboard";
import {
  Title,
  Text,
  Container,
  Badge,
  LoadingOverlay,
  Card,
  Group,
  Space,
  Divider,
  Avatar,
  TypographyStylesProvider,
  Anchor,
} from "@mantine/core";

const ChangeLog: NextPage = (): ReactElement => {
  const [ changeLog, loading, error ]: UseChangeLog = useChangeLog();
  const Months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dates = changeLog.map((log: ChangeLog) => {
    log.publishedAt = new Date(log.publishedAt);
    return log;
  });
  const logList: ReactNode[] = dates.map((log: ChangeLog, index: number) => (
    <div key={log?.name}>
      <Group position="apart">
        <Group>
          <Title>{log?.name}</Title>
          {index === 0 && (
            <Badge color="purple-heart" radius="sm">
              Latest
            </Badge>
          )}
        </Group>
        <Group>
          <Avatar
            src={log?.author.avatar}
            alt={log?.author.name}
            size="sm"
            radius="sm"
          />
          <Anchor href={log?.author.url} target="_blank">
            {log?.author.name}
          </Anchor>
          {/* Parsing publish date */}
          <Text>
            {Months[log?.publishedAt.getMonth()]} {log?.publishedAt.getDate()},{" "}
            {log?.publishedAt.getFullYear()}
          </Text>
        </Group>
      </Group>
      <Card mt="xl">
        <TypographyStylesProvider>
          <div dangerouslySetInnerHTML={{ __html: log?.body.html }} />
        </TypographyStylesProvider>
      </Card>
      {index !== changeLog.length - 1 && <Divider my="xl" variant="dashed" />}
    </div>
  ));

  return (
    <Container>
      <Title align="center">Change Log</Title>
      <Space h="xl" />
      {error ? (
        <Text>Having troubles making request to get change log!</Text>
      ) : (
        logList
      )}
      <LoadingOverlay visible={loading} />
    </Container>
  );
};

export default ChangeLog;
