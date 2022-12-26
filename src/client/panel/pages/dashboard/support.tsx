import {
  Container,
  Title,
  Text,
  Accordion,
  Space,
  Anchor,
  List,
} from "@mantine/core";
import { Image } from "@component/elements";

import type { NextPage } from "next";
import type { ReactElement } from "react";

import accountCreation from "@public/faq/account-creation.png";
import serverOptions from "@public/faq/server-options.png";

const FAQ = [
  {
    question: "How do I make an another account?",
    answer: () => (
      <>
        <Text mb="xl">
          In order to add an another account you'd have to head into splendid
          configuration (package.json) in your file manager. From there you'd
          have to add another account in the accounts array just like you have
          one by default separated with commas.
        </Text>
        <Image src={accountCreation} alt="How to create an account" />
      </>
    ),
  },
  {
    question: "Where do I find more information about the Splendid?",
    answer: () => (
      <Text>
        Splendid offers a lot of information about itself in its{" "}
        <Anchor href="https://docs.splendidjs.org/" target="_blank">
          documentation
        </Anchor>
        !
      </Text>
    ),
  },
  {
    question: "How do I install a theme/plugin?",
    answer: () => (
      <>
        <Text>Splendid provides several ways to install a theme/plugin:</Text>
        <List>
          <List.Item>From the store option on your panel.</List.Item>
          <List.Item>Using Splendid console CLI.</List.Item>
          <List.Item>
            Using manual npm package installation & adding it in the Splendid
            configuration (package.json).
          </List.Item>
        </List>
      </>
    ),
  },
  {
    question: "Any ways to integrate Next.js features externally?",
    answer: () => (
      <>
        <Text mb="xl">
          To provide a better experience for the users, Splendid provides a
          possibility to integrate Next.js features externally. To add an option
          to the custom server, you'd have to pass these options to the Splendid
          configuration (package.json) in the serverOptions property.
        </Text>
        <Image src={serverOptions} alt="How to create an account" />
      </>
    ),
  },
];

const Support: NextPage = (): ReactElement => {
  const FAQAccordion = FAQ.map((item) => (
    <Accordion.Item key={item.question} value={item.question} mb="lg">
      <Accordion.Control>{item.question}</Accordion.Control>
      <Accordion.Panel>
        <item.answer />
      </Accordion.Panel>
    </Accordion.Item>
  ));
  return (
    <Container size="sm" mih={650}>
      <Title align="center">Frequently Asked Questions</Title>
      <Space h="xl" />
      <Accordion variant="separated">{FAQAccordion}</Accordion>
    </Container>
  );
};

export default Support;
