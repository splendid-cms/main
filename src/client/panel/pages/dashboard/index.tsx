import type { NextPage } from "next";
import type { ReactElement } from "react";
import { useOverview, UseOverview } from "@hook/dashboard";
import {
  Title,
  Text,
  Container,
  LoadingOverlay,
  Divider,
  Card,
  Space,
} from "@mantine/core";

const Dashboard: NextPage = (): ReactElement => {
  const { overview, loading, error }: UseOverview = useOverview();
  return (
    <Container>
      <Title>Overview</Title>
      <Space h="xl" />
      {error ? (
        <Text>Having troubles making request to get overview!</Text>
      ) : (
        <Card mb="xl" p="lg">
          <Text dangerouslySetInnerHTML={{ __html: overview?.body.html }} />
        </Card>
      )}
      <LoadingOverlay visible={loading} />
    </Container>
  );
};

export default Dashboard;