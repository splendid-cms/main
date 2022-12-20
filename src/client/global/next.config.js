const { writeFileSync } = require('fs');

const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [],
        rehypePlugins: [],
        options: {
            providerImportSource: '@mdx-js/react',
        },
    },
});

module.exports = withMDX({
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx']
});