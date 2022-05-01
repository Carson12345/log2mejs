export default [
    {
        input: './src/log2me.js',
        output: {
            file: 'dist/log2me.js',
            format: 'cjs'
        }
    },
    {
        input: './src/log2me_receiver.js',
        output: [
            {
                file: 'dist/log2me_receiver.js',
                format: 'cjs'
            },
            {
                file: 'dist/log2me_receiver_es.js',
                format: 'es'
            }
        ]
    }
];