var http = require('http');
const {InfluxDB, Point} = require('@influxdata/influxdb-client');
const token = "zChr4praVPidkZq0XP1LR8zQu-CYZ-vHf5XK3Pah6rNGstWGIOnFprFbQMxTReyyzrmDHY8dHuRtR12cy4GQiw=="
const url = 'https://us-east-1-1.aws.cloud2.influxdata.com'
const client = new InfluxDB({url, token})
let org = `86e5ce4e5a6c211e`
let bucket = `DHT`
let data1 = 0
let queryClient = client.getQueryApi(org)
http.createServer(function (req, res) {
getdata1()
res.writeHead(200, {'Content-Type': 'text/html'});
res.write('<head> <title>Khrueng Dashboard </title><meta charset="utf-8">')
res.write(' <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css?fbclid=IwAR3wx1kaxlhXtJlbVHqVTPunX9KAorD_Qa0paYWIYXGSKIpP1iYheI7uSiY" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous"><script src="https://ajax.googleapis.com/.../jquery/3.6.4/jquery.min.js"></script> <script src="https://maxcdn.bootstrapcdn.com/.../js/bootstrap.min.js"></script>')
res.write('<style> .row.content {height: 550px} .sidenav { background-color: #f1f1f1; height: 100%; } @media screen and (max-width: 767px) { .row.content {height: auto;} } </style></head><body>')
res.write('<div class="container"><h2> CPE@MIROT </h2>')
res.write('<div class="card bg-primary text-white"><div class="card-body"> Measurement <p> <h3>')
res.write(data1+" ")
res.write('</h2></p> </div></div> <br>')
res.end('</body></html>')
}).listen(8081, '127.0.0.1');
function getdata1(){
let fluxQuery = `from(bucket: "DHT")
|> range(start: -10m)
|> filter(fn: (r) => r._measurement == "measurement1")
|> last()`
queryClient.queryRows(fluxQuery, {
next: (row, tableMeta) => {
const tableObject = tableMeta.toObject(row)
data1 = tableObject._value
},
error: (error) => {
console.error('\nError', error)
},
complete: () => {
},
})
}