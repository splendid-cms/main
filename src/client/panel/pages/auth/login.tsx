import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  MantineProvider,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAuth } from "@hook/auth";

import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@page/_app";

import banner from "@public/scandinavian-fogs.png";

const useStyles = createStyles((theme) => ({
  wrapper: {
    // set the height to full viewport
    // filter top & bottom padding
    minHeight: `calc(100vh - 2 * ${theme.spacing.md}px)`,
    padding: theme.spacing.md,
    
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: `url(${banner.src})`,

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    height: "max-content",
    maxWidth: 450,
    paddingTop: 80,

  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },
}));

const AuthLogin: NextPageWithLayout = (): ReactElement => {
  const { classes } = useStyles();
  const { login } = useAuth();
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
  });

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} p={30} opacity={.9} withBorder>
        <form
          onSubmit={form.onSubmit((value) => {
            login(value.username, value.password).then(
              (statusCode) =>
                statusCode === 401 &&
                form.setFieldError("password", "Invalid credentials")
            );
          })}
        >
          <Title
            order={2}
            className={classes.title}
            align="center"
            mb="lg"
          >
            Welcome to Splendid!
          </Title>

          <TextInput
            label="Username"
            placeholder="John Doe"
            size="md"
            {...form.getInputProps("username")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            {...form.getInputProps("password")}
          />
          <Button
            type="submit"
            fullWidth
            mt="xl"
            size="md"
            color="splendid-green.8"
          >
            Login
          </Button>

          <Text align="center" mt="md" color="dimmed">
            For account details, check configuration file.
          </Text>
        </form>
      </Paper>
    </div>
  );
};

AuthLogin.getLayout = (page: ReactElement): ReactElement => {
  return (
    <MantineProvider
      withNormalizeCSS
      theme={{
        primaryColor: "splendid-green",
        colors: {
          "splendid-green": [
            "#F1F6EC",
            "#E4EDD8",
            "#D6E4C5",
            "#C8DBB1",
            "#BBD29E",
            "#ADC88B",
            "#9FBF77",
            "#91B664",
            "#76A43D",
            "#567E2D",
          ],
          "purple-heart": [
            "#F0ECF6",
            "#E1D8ED",
            "#D3C5E4",
            "#C4B1DB",
            "#B59ED2",
            "#A68BC8",
            "#9777BF",
            "#8964B6",
            "#6B3DA4",
            "#563183",
          ],
        },
      }}
    >
      {page}
    </MantineProvider>
  );
};

export default AuthLogin;
