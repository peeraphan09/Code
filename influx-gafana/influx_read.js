const {InfluxDB, Point} = require('@influxdata/influxdb-client')
const token = "zChr4praVPidkZq0XP1LR8zQu-CYZ-vHf5XK3Pah6rNGstWGIOnFprFbQMxTReyyzrmDHY8dHuRtR12cy4GQiw=="
const url = 'https://us-east-1-1.aws.cloud2.influxdata.com'
const client = new InfluxDB({url, token})
let org = `86e5ce4e5a6c211e`
let bucket = `DHT`
let writeClient = client.getWriteApi(org, bucket, 'ns')
let queryClient = client.getQueryApi(org)
let fluxQuery = `from(bucket: "DHT")
|> range(start: -10m)
|> filter(fn: (r) => r._measurement == "measurement1")
|> last()`
queryClient.queryRows(fluxQuery, {
next: (row, tableMeta) => {
const tableObject = tableMeta.toObject(row)
console.log(tableObject)
},
error: (error) => {
console.error('\nError', error)
},
complete: () => {
console.log('\nSuccess')
},
})