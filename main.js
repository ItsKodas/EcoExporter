const fs = require('fs')
const ncp = require('ncp').ncp
const unzipper = require('unzipper')
const { zip } = require('zip-a-folder')

    ; (async () => {
        if (process.argv.length === 2) return console.log('[Usage]   EcoExporter.exe   src="C:/YOUR/WORLD/Game.eco"   dst="C:/NEW/WORLD/DefaultWorld.eco"   attr=blocks,plants,civics    out="C:/OUTPUT/Game.eco"\n\n\n[src] is the source world that contains the data you want exported to a new world\n\n[dst] is the world that you want to import the data to\n\n[attr] are the attributes of the export, if you want to export everything then ignore it, otherwise the options are [blocks/plants/civics/objects]\n\n[out] is the output directory for the new world it creates with your inputs, leave this blank to output in the current directory')
        if (fs.existsSync('processing')) console.log('[EcoExporter] Processing folder found, deleting...'), await fs.promises.rm('processing', { recursive: true })

        console.log('[EcoExporter] Checking Input Parameters...')

        var args = {}
        process.argv.forEach((arg) => {
            if (arg.startsWith('src=')) args['src'] = arg.substring(4)
            if (arg.startsWith('dst=')) args['dst'] = arg.substring(4)
            if (arg.startsWith('out=')) args['out'] = arg.substring(4)
            if (arg.startsWith('attr=')) args['attr'] = arg.substring(5).toLowerCase().split(',')
        })

        if (!args.src || !args.dst) return console.log('[EcoExporter] Please specify a source and destination world!')
        console.log('[EcoExporter] All Input Parameters have been Verified!')

        if (!fs.existsSync(args.src)) return console.log('[EcoExporter] The source world does not exist!')
        if (!fs.existsSync(args.dst)) return console.log('[EcoExporter] The destination world does not exist!')
        if (args.src === args.dst) return console.log('[EcoExporter] The source and destination worlds cannot be the same!')

        var unzipped = 0
        fs.mkdirSync('processing')
        fs.createReadStream(args.src).pipe(unzipper.Extract({ path: 'processing/src' })).once('close', () => { console.log('[EcoExporter] The source world has been extracted!'), unzipped++, filesReady() })
        fs.createReadStream(args.dst).pipe(unzipper.Extract({ path: 'processing/dst' })).once('close', () => { console.log('[EcoExporter] The destination world has been extracted!'), unzipped++, filesReady() })
        
        async function filesReady() {
            if (unzipped !== 2) return
            console.log('[EcoExporter] All files have been extracted!')
            if (!args.attr) args.attr = ['blocks', 'plants', 'civics', 'objects']

            if (args.attr.includes('blocks')) {
                console.log('[EcoExporter] Exporting Blocks...')
                //await fs.promises.rm('processing/dst/World', { recursive: true })
                await ncp('processing/src/World', 'processing/dst/World')
                console.log('[EcoExporter] Blocks have been exported!')
            }

            if (args.attr.includes('plants')) {
                console.log('[EcoExporter] Exporting Plants...')
                //await fs.promises.rm('processing/dst/Plants', { recursive: true })
                await ncp('processing/src/Plants', 'processing/dst/Plants')
                console.log('[EcoExporter] Plants have been exported!')
            }

            if (args.attr.includes('civics')) {
                console.log('[EcoExporter] Exporting Civics...')
                //await fs.promises.rm('processing/dst/Civics', { recursive: true })
                await ncp('processing/src/Civics', 'processing/dst/Civics')
                console.log('[EcoExporter] Civics have been exported!')
            }

            if (args.attr.includes('objects')) {
                console.log('[EcoExporter] Exporting Objects...')
                //await fs.promises.rm('processing/dst/WorldObjects', { recursive: true })
                await ncp('processing/src/WorldObjects', 'processing/dst/WorldObjects')
                console.log('[EcoExporter] Objects have been exported!')
            }



            const spawn = require('child_process').spawn
            const zip = spawn('powershell.exe', ['Compress-Archive', '-Path .\\processing\\dst\\*', `-DestinationPath ${'Game.zip'}`])
            zip.on('close', async () => {
                console.log('[EcoExporter] Deleting Processing folder...'), await fs.promises.rm('processing', { recursive: true })
                console.log('[EcoExporter] Relocating Output...'), fs.renameSync('Game.zip', args.out || 'Game.eco')
                console.log('[EcoExporter] Finished!')
            })
        }
    })()