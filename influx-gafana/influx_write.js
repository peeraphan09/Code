const {InfluxDB, Point} = require('@influxdata/influxdb-client')
const token = "zChr4praVPidkZq0XP1LR8zQu-CYZ-vHf5XK3Pah6rNGstWGIOnFprFbQMxTReyyzrmDHY8dHuRtR12cy4GQiw=="
const url = 'https://us-east-1-1.aws.cloud2.influxdata.com'
const client = new InfluxDB({url, token})
let org = `86e5ce4e5a6c211e`
let bucket = `DHT`
let writeClient = client.getWriteApi(org, bucket, 'ns')
let point = new Point('measurement1')
.tag('tagname1', 'tagvalue1')
.tag('device', 'computer1')
.intField('filed1', "651998009")
.intField('count', "321")
void setTimeout(() => {
writeClient.writePoint(point)
}, 1000) // separate points by 1 second

void setTimeout(() => {
writeClient.flush()
}, 5000)