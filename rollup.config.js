export default [
    {
        input: './src/log2me_spa.js',
        output: [
            {
                file: 'dist/log2me_spa.js',
                format: 'cjs'
            },
            {
                file: 'dist/log2me_spa_es.js',
                format: 'es'
            }
        ]
    },
    {
        input: './src/log2me_cdn.js',
        output: [
            {
                file: 'dist/log2me_cdn.js',
                format: 'cjs'
            },
            {
                file: 'dist/log2me_cdn_es.js',
                format: 'es'
            }
        ]
    },
    {
        input: './src/log2me_sender.js',
        output: [
            {
                file: 'dist/log2me_sender.js',
                format: 'cjs'
            },
            {
                file: 'dist/log2me_sender_es.js',
                format: 'es'
            }
        ]
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