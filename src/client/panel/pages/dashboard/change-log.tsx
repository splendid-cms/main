import type { NextPage } from "next";
import type { ReactElement } from "react";
import { useChangeLog, UseChangeLog } from "@hook/dashboard";
import {
  Title,
  Text,
  Container,
  LoadingOverlay,
  Card,
  Space,
  Divider,
} from "@mantine/core";

const ChangeLog: NextPage = (): ReactElement => {
  const { changeLog, loading, error }: UseChangeLog = useChangeLog();
  const logList = changeLog.map((log) => (
    <Card key={log.name} mb="xl" p="lg">
      <Title order={1}>{log.name}</Title>
      <Divider mt="md" mb="xl" />
      <Text dangerouslySetInnerHTML={{ __html: log?.body.html }} />
    </Card>
  ));
  
  return (
    <Container>
      <Title align="center">Change Log</Title>
      <Space h="xl" />
      {error ? (
        <Text>Having troubles making request to get change log!</Text>
      ) : logList}
      <LoadingOverlay visible={loading} />
    </Container>
  );
};

export default ChangeLog;
