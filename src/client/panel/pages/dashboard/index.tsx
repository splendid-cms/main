import type { NextPage } from "next";
import type { ReactElement } from "react";
import { useOverview } from "@hook/dashboard";
import {
  Title,
  Text,
  Container,
  LoadingOverlay,
  Card,
  Space,
  TypographyStylesProvider,
} from "@mantine/core";

const Dashboard: NextPage = (): ReactElement => {
  const [overview, loading, error]: UseOverview = useOverview();
  
  return (
    <Container>
      <Title align="center">Overview</Title>
      <Space h="xl" />
      {error ? (
        <Text>Having troubles making request to get overview!</Text>
      ) : (
        <Card mb="xl" p="lg">
          <TypographyStylesProvider>
            <Container dangerouslySetInnerHTML={{ __html: overview?.body.html }} />
          </TypographyStylesProvider>
          <LoadingOverlay visible={loading} />
        </Card>
      )}
    </Container>
  );
};

export default Dashboard;