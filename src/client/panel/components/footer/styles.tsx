import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    footer: {
        // backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        borderTop: `1px solid ${
            theme.colorScheme === "dark"
                ? theme.colors.dark[5]
                : theme.colors.gray[2]
        }`,
    },

    inner: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,

        [theme.fn.smallerThan("xs")]: {
            flexDirection: "column",
        },
    },

    links: {
        [theme.fn.smallerThan("xs")]: {
            marginTop: theme.spacing.md,
        },
    },
}));
