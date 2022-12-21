import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import type { NextPage } from "next";
import type { ReactElement } from "react";
import { useAuth } from "../../hooks/useAuth";

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: 900,
    backgroundSize: "cover",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)",
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: 900,
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    width: 120,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const AuthLogin: NextPage = (): ReactElement => {
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
      <Paper className={classes.form} radius={0} p={30}>
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
            mt="md"
            mb={50}
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
          <Button type="submit" fullWidth mt="xl" size="md">
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

export default AuthLogin;
