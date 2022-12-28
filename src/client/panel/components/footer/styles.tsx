import { createStyles } from "@mantine/core";

// Styles for the Footer component
// Used mantine's createStyles function
// see: https://emotion.sh/docs/introduction
export const useStyles = createStyles((theme) => ({
    footer: {
        [theme.fn.smallerThan(900)]: {
            paddingLeft: 0
        },
        paddingLeft: 300,
    },

    wrapper: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        borderTopLeftRadius: theme.radius.sm,
        borderTopRightRadius: theme.radius.sm
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

    info: {
        [theme.fn.smallerThan("xs")]: {
            marginTop: theme.spacing.md,
        },
    },
}));
