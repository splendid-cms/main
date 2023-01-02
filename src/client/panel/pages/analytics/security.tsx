import type { NextPage } from "next";
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import {
  Card,
  Container,
  Divider,
  Text,
  Title,
  Button,
  Dialog,
  Modal,
  MultiSelect,
  useMantineTheme,
  LoadingOverlay,
  Checkbox,
  ScrollArea,
} from "@mantine/core";
import {
  IconEye,
  IconBan,
  IconFileCheck,
  IconFileX,
  IconMapPin,
  IconChecks,
} from "@tabler/icons";
import { useIPs, useSecurity } from "@hook/analytics";
import { useMediaQuery } from "@mantine/hooks";

const BulkActions: FunctionComponent<{
  block: (ips: string[]) => Promise<void>;
  whitelist: (ips: string[]) => Promise<void>;
}> = ({ block, whitelist }): ReactElement => {
  // Bulk actions for every IP address
  const [bulk, setBulk] = useState<string[]>([]);

  return (
    <>
      <Divider my="xl" variant="dashed" />
      <Title>Bulk Actions</Title>
      <Card my="xl" sx={{ overflow: "unset" }}>
        <MultiSelect
          label="IP addresses"
          data={bulk}
          placeholder="Select IP addresses"
          icon={<IconMapPin size={16} stroke={2} />}
          searchable
          clearable
          creatable
          // "+ Add {query}" will be displayed when the query is not in the list
          getCreateLabel={(query) => `+ Add/Remove ${query}`}
          onChange={setBulk}
          // Look if the query is a valid IP address & not localhost
          shouldCreate={(query) =>
            /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/g.test(query)
            && query !== "127.0.0.1"
          }
        />
        <Button
          variant="light"
          color="red"
          mt="sm"
          mr="sm"
          leftIcon={<IconBan stroke={2} size={18} />}
          onClick={() => block(bulk)}
        >
          Block
        </Button>
        <Button
          variant="light"
          color="gray"
          mt="sm"
          mr="sm"
          leftIcon={<IconFileCheck stroke={2} size={18} />}
          onClick={() => whitelist(bulk)}
        >
          Whitelist
        </Button>
      </Card>
    </>
  );
};

/**
 * CertainIPsList component is used to display the list of blocked or whitelisted IP addresses.
 * A client can interact with the list by blocking an IP or removing it from whitelist.
 * @param {0 | 1} type 0: Blocked, 1: Whitelisted
 * @param {string[]} ips List of IP addresses
 * @param {() => Promise<void>} executable Function to execute when the client interacts with the list
 * @returns an element that contains the list of blocked or whitelisted IP addresses
 */
const CertainIPsList: FunctionComponent<{
  type: 0 | 1;
  ips: string[];
  executable: (ips: string[]) => Promise<void>
}> = ({ type, ips, executable }): ReactElement => {
  const [selected, setSelected] = useState<string[]>([]);
  const mappedIPs = ips?.map((ip) => <Checkbox value={ip} label={ip} />);

  return (
    <>
      <Divider my="xl" variant="dashed" />
      <Title>{type ? "Whitelisted" : "Blocked"} IP addresses</Title>
      <Card my="xl">
        <ScrollArea.Autosize maxHeight={350}>
          <Checkbox.Group
            value={selected}
            onChange={setSelected}
            orientation="vertical"
            label="Select IP addresses"
            description={`Following IP addresses are ${
              type ? "whitelisted" : "blocked"
            }`}
            spacing="xs"
            offset="xl"
          >
            {mappedIPs}
          </Checkbox.Group>
        </ScrollArea.Autosize>
        <Button
          variant="light"
          color={type ? "gray" : "splendid-green"}
          mt="sm"
          onClick={() => executable(selected)}
          leftIcon={
            type ? (
              <IconFileX stroke={2} size={18} />
            ) : (
              <IconChecks stroke={2} size={18} />
            )
          }
        >
          {type ? "Remove From Whitelist" : "Unblock"}
        </Button>
      </Card>
    </>
  );
};

const Security: NextPage = (): ReactElement => {
  const [suspects, _, error] = useSecurity();
  const [
    block,
    unblock,
    whitelist,
    unwhitelist,
    blocked,
    whitelisted,
    loadingIPs,
    errorIPs,
  ] = useIPs();
  const [reportOpened, setReportOpened] = useState<boolean>(false);
  const [dialogOpened, setDialogOpened] = useState<boolean>(false);

  // Suspects list
  const [selectedSuspects, setSelectedSuspects] = useState<string[]>([]);

  // Set dialog (pop-up notification) width
  const matches = useMediaQuery("(max-width: 600px)");
  const theme = useMantineTheme();

  // pop-up notification when there are suspicious activities
  useEffect(() => {
    setDialogOpened(suspects?.length > 0);
  }, [suspects]);

  return (
    <Container>
      <Title align="center">Security Report</Title>
      <Card my="xl">
        <Text>
          Splendid provides you with a security report to help you monitor your
          website's security. From this page you can block, whitelist or track
          client usage. Panel will notify you if there are any suspicious
          activities on your website. You can also view the statistics of your
          website's security & current status.
        </Text>
      </Card>
      <BulkActions block={block} whitelist={whitelist} />
      {errorIPs ? (
        <Text>
          There was an error while fetching the list of blocked or whitelisted
        </Text>
      ) : null}
      {!errorIPs && blocked.length ? (
        <CertainIPsList type={0} ips={blocked} executable={unblock} />
      ) : null}
      {!errorIPs && whitelisted.length ? (
        <CertainIPsList type={1} ips={whitelisted} executable={unwhitelist} />
      ) : null}

      <Dialog
        opened={dialogOpened}
        withCloseButton
        withBorder={theme.colorScheme === "light"}
        sx={{
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[0],
        }}
        shadow="md"
        onClose={() => setDialogOpened(false)}
        size={matches ? "100%" : "lg"}
        left={matches ? 12 : "none"}
      >
        <Text size="sm" mb="sm" weight={500}>
          Suspicious activity detected
        </Text>
        <Text size="sm" mb="sm" color="dimmed">
          We've encountered suspicious activity on your website.
        </Text>
        <Button
          variant="light"
          color="purple-heart"
          leftIcon={<IconEye stroke={2} size={18} />}
          onClick={() => {
            setReportOpened(true);
            setDialogOpened(false);
          }}
        >
          View Report
        </Button>
      </Dialog>
      <Modal
        opened={reportOpened}
        onClose={() => setReportOpened(false)}
        title="Block suspicious IP addresses"
      >
        <Card>
          <Text>
            We recommend blocking the following IPs to prevent further attacks.
            If you think this is a false positive, you can ignore selected IP
            addresses by whitelisting them.
          </Text>
        </Card>
        {error ? (
          <Text>Error loading suspicious addresses!</Text>
        ) : (
          <>
            <MultiSelect
              value={selectedSuspects}
              onChange={setSelectedSuspects}
              data={suspects}
              placeholder="Select suspects"
              icon={<IconMapPin size={16} stroke={2} />}
              my="sm"
            />
            <Button.Group>
              <Button
                variant="light"
                color="red"
                leftIcon={<IconBan stroke={2} size={18} />}
                fullWidth
                onClick={() => block(selectedSuspects)}
              >
                Block
              </Button>
              <Button
                variant="light"
                color="gray"
                leftIcon={<IconFileCheck stroke={2} size={18} />}
                fullWidth
                onClick={() => whitelist(selectedSuspects)}
              >
                Whitelist
              </Button>
            </Button.Group>
          </>
        )}
      </Modal>
      <LoadingOverlay visible={loadingIPs} />
    </Container>
  );
};

export default Security;
