const fs = require('fs');
const path = require('path');
const { InfluxDB } = require('@influxdata/influxdb-client');
const moment = require('moment-timezone'); // นำเข้า moment-timezone

const token = 'd7werMaE4ga-5h37AYUgwpq1FWC69uWSJuCYuP7XoBkdb7h-H2yDwnXTwNXWv7c9NKssNbbaCNZuhq-9sChNDA==';
const org = '86e5ce4e5a6c211e';
const bucket = 'image';
const url = 'https://us-east-1-1.aws.cloud2.influxdata.com';

const client = new InfluxDB({ url, token });
const queryApi = client.getQueryApi(org);

const imagesDir = path.join(__dirname, '../public/images');

// ฟังก์ชันเพื่อแปลงเวลา UTC เป็นเวลาท้องถิ่น
const convertToLocalTime = (utcTime, timeZone) => {
  return moment.utc(utcTime).tz(timeZone).format('YYYY-MM-DD HH:mm:ss');
};

const fetchLatestImage = async (db) => {
  const query = `
    from(bucket: "${bucket}")
      |> range(start: -1h)
      |> filter(fn: (r) => r._measurement == "image_data")
      |> filter(fn: (r) => r._field == "image_base64")
      |> group(columns: ["_measurement", "_field"])
      |> last()
  `;

  return new Promise((resolve, reject) => {
    queryApi.queryRows(query, {
      next: (row, tableMeta) => {
        const o = tableMeta.toObject(row);
        const base64Image = o._value;
        const imageFilename = `image_${Date.now()}.jpg`;
        const imagePath = path.join(imagesDir, imageFilename);
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

        fs.writeFile(imagePath, base64Image, 'base64', (err) => {
          if (err) {
            return reject(err);
          }

          db.query(
            'INSERT INTO images (filename, timestamp) VALUES (?, ?) ON DUPLICATE KEY UPDATE timestamp = VALUES(timestamp)',
            [imageFilename, timestamp],
            (error) => {
              if (error) {
                return reject(error);
              }
              resolve(imageFilename);
            }
          );
        });
      },
      error: (error) => {
        reject(error);
      },
      complete: () => {
        console.log('Query completed');
      }
    });
  });
};

const insertMissingImages = (db) => {
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error('Unable to scan directory:', err);
      return;
    }

    const images = files.filter(file => file.endsWith('.jpg'));

    images.forEach((filename) => {
      db.query(
        'SELECT COUNT(*) AS count FROM images WHERE filename = ?',
        [filename],
        (err, results) => {
          if (err) {
            console.error('Database query error:', err);
            return;
          }

          if (results[0].count === 0) {
            const timestamp = fs.statSync(path.join(imagesDir, filename)).mtime.toISOString().slice(0, 19).replace('T', ' ');

            db.query(
              'INSERT INTO images (filename, timestamp) VALUES (?, ?)',
              [filename, timestamp],
              (error) => {
                if (error) {
                  console.error('Error inserting image:', error);
                }
              }
            );
          }
        }
      );
    });
  });
};

const listImages = (req, res) => {
  req.getConnection((err, db) => {
    if (err) {
      console.error('Database connection error:', err);
      return res.status(500).send('Database connection error');
    }

    insertMissingImages(db);

    fetchLatestImage(db)
      .then(() => {
        db.query('SELECT * FROM images ORDER BY id DESC', (error, results) => {
          if (error) {
            console.error('Database query error:', error);
            return res.status(500).send('Database query error');
          }

          // แปลงเวลาของแต่ละรายการใน results
          results.forEach(image => {
            image.timestamp = convertToLocalTime(image.timestamp, 'Asia/Bangkok'); // ใช้เขตเวลา 'Asia/Bangkok'
          });

          res.render('imageTable', { images: results });
        });
      })
      .catch(err => {
        console.error('Error fetching image data:', err);
        res.status(500).send('Error fetching image data: ' + err);
      });
  });
};

const deleteImage = (req, res) => {
  const { filename } = req.body;

  if (!filename) {
      return res.status(400).send({ error: 'Filename is required' });
  }

  console.log('Request to delete:', filename);

  req.getConnection((err, db) => {
      if (err) {
          console.error('Database connection error:', err);
          return res.status(500).send({ error: 'Database connection error' });
      }

      db.query('DELETE FROM images WHERE filename = ?', [filename], (error, results) => {
          if (error) {
              console.error('Database query error:', error);
              return res.status(500).send({ error: 'Database query error' });
          }

          if (results.affectedRows === 0) {
              console.warn('No record found for filename:', filename);
              return res.status(404).send({ error: 'Image not found in database' });
          }

          console.log('Record deleted from database:', filename);

          const imagePath = path.join(imagesDir, filename);
          fs.unlink(imagePath, (err) => {
              if (err) {
                  console.error('Error deleting file:', err);
                  return res.status(500).send({ error: 'Error deleting file' });
              }

              console.log('File deleted from directory:', imagePath);
              res.send({ message: 'Image deleted successfully' });
          });
      });
  });
};

module.exports = {
  listImages,
  deleteImage
};





// const fs = require('fs');
// const path = require('path');
// const { InfluxDB } = require('@influxdata/influxdb-client');
// const moment = require('moment-timezone'); // นำเข้า moment-timezone

// const token = 'd7werMaE4ga-5h37AYUgwpq1FWC69uWSJuCYuP7XoBkdb7h-H2yDwnXTwNXWv7c9NKssNbbaCNZuhq-9sChNDA==';
// const org = '86e5ce4e5a6c211e';
// const bucket = 'image';
// const url = 'https://us-east-1-1.aws.cloud2.influxdata.com';

// const client = new InfluxDB({ url, token });
// const queryApi = client.getQueryApi(org);

// const imagesDir = path.join(__dirname, '../public/images');

// // ฟังก์ชันเพื่อแปลงเวลา UTC เป็นเวลาท้องถิ่น
// const convertToLocalTime = (utcTime, timeZone) => {
//   return moment.utc(utcTime).tz(timeZone).format('YYYY-MM-DD HH:mm:ss');
// };

// const fetchLatestImage = async (db) => {
//   const query = `
//     from(bucket: "${bucket}")
//       |> range(start: -1h)
//       |> filter(fn: (r) => r._measurement == "image_data")
//       |> filter(fn: (r) => r._field == "image_base64")
//       |> last()
//   `;

//   return new Promise((resolve, reject) => {
//     queryApi.queryRows(query, {
//       next: (row, tableMeta) => {
//         const o = tableMeta.toObject(row);
//         const base64Image = o._value;
//         const imageFilename = `image_${Date.now()}.jpg`;
//         const imagePath = path.join(imagesDir, imageFilename);
//         const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

//         fs.writeFile(imagePath, base64Image, 'base64', (err) => {
//           if (err) {
//             return reject(err);
//           }

//           db.query(
//             'INSERT INTO images (filename, timestamp) VALUES (?, ?) ON DUPLICATE KEY UPDATE timestamp = VALUES(timestamp)',
//             [imageFilename, timestamp],
//             (error) => {
//               if (error) {
//                 return reject(error);
//               }
//               resolve(imageFilename);
//             }
//           );
//         });
//       },
//       error: (error) => {
//         reject(error);
//       },
//       complete: () => {
//         console.log('Query completed');
//       }
//     });
//   });
// };

// const insertMissingImages = (db) => {
//   fs.readdir(imagesDir, (err, files) => {
//     if (err) {
//       console.error('Unable to scan directory:', err);
//       return;
//     }

//     const images = files.filter(file => file.endsWith('.jpg'));

//     images.forEach((filename) => {
//       db.query(
//         'SELECT COUNT(*) AS count FROM images WHERE filename = ?',
//         [filename],
//         (err, results) => {
//           if (err) {
//             console.error('Database query error:', err);
//             return;
//           }

//           if (results[0].count === 0) {
//             const timestamp = fs.statSync(path.join(imagesDir, filename)).mtime.toISOString().slice(0, 19).replace('T', ' ');

//             db.query(
//               'INSERT INTO images (filename, timestamp) VALUES (?, ?)',
//               [filename, timestamp],
//               (error) => {
//                 if (error) {
//                   console.error('Error inserting image:', error);
//                 }
//               }
//             );
//           }
//         }
//       );
//     });
//   });
// };

// const listImages = (req, res) => {
//   req.getConnection((err, db) => {
//     if (err) {
//       console.error('Database connection error:', err);
//       return res.status(500).send('Database connection error');
//     }

//     insertMissingImages(db);

//     fetchLatestImage(db)
//       .then(() => {
//         db.query('SELECT * FROM images ORDER BY id DESC', (error, results) => {
//           if (error) {
//             console.error('Database query error:', error);
//             return res.status(500).send('Database query error');
//           }

//           // แปลงเวลาของแต่ละรายการใน results
//           results.forEach(image => {
//             image.timestamp = convertToLocalTime(image.timestamp, 'Asia/Bangkok'); // ใช้เขตเวลา 'Asia/Bangkok'
//           });

//           res.render('imageTable', { images: results });
//         });
//       })
//       .catch(err => {
//         console.error('Error fetching image data:', err);
//         res.status(500).send('Error fetching image data: ' + err);
//       });
//   });
// };

// const deleteImage = (req, res) => {
//   const { filename } = req.body;

//   if (!filename) {
//       return res.status(400).send({ error: 'Filename is required' });
//   }

//   console.log('Request to delete:', filename);

//   req.getConnection((err, db) => {
//       if (err) {
//           console.error('Database connection error:', err);
//           return res.status(500).send({ error: 'Database connection error' });
//       }

//       db.query('DELETE FROM images WHERE filename = ?', [filename], (error, results) => {
//           if (error) {
//               console.error('Database query error:', error);
//               return res.status(500).send({ error: 'Database query error' });
//           }

//           if (results.affectedRows === 0) {
//               console.warn('No record found for filename:', filename);
//               return res.status(404).send({ error: 'Image not found in database' });
//           }

//           console.log('Record deleted from database:', filename);

//           const imagePath = path.join(imagesDir, filename);
//           fs.unlink(imagePath, (err) => {
//               if (err) {
//                   console.error('Error deleting file:', err);
//                   return res.status(500).send({ error: 'Error deleting file' });
//               }

//               console.log('File deleted from directory:', imagePath);
//               res.send({ message: 'Image deleted successfully' });
//           });
//       });
//   });
// };

// module.exports = {
//   listImages,
//   deleteImage
// };




//โค๊ดสำเร็จ
// const fs = require('fs');
// const path = require('path');
// const { InfluxDB } = require('@influxdata/influxdb-client');

// const token = 'd7werMaE4ga-5h37AYUgwpq1FWC69uWSJuCYuP7XoBkdb7h-H2yDwnXTwNXWv7c9NKssNbbaCNZuhq-9sChNDA==';
// const org = '86e5ce4e5a6c211e';
// const bucket = 'image';
// const url = 'https://us-east-1-1.aws.cloud2.influxdata.com';

// const client = new InfluxDB({ url, token });
// const queryApi = client.getQueryApi(org);

// const imagesDir = path.join(__dirname, '../public/images');

// const fetchLatestImage = async (db) => {
//   const query = `
//     from(bucket: "${bucket}")
//       |> range(start: -1h)
//       |> filter(fn: (r) => r._measurement == "image_data")
//       |> filter(fn: (r) => r._field == "image_base64")
//       |> last()
//   `;

//   return new Promise((resolve, reject) => {
//     queryApi.queryRows(query, {
//       next: (row, tableMeta) => {
//         const o = tableMeta.toObject(row);
//         const base64Image = o._value;
//         const imageFilename = `image_${Date.now()}.jpg`;
//         const imagePath = path.join(imagesDir, imageFilename);
//         const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

//         fs.writeFile(imagePath, base64Image, 'base64', (err) => {
//           if (err) {
//             return reject(err);
//           }

//           db.query(
//             'INSERT INTO images (filename, timestamp) VALUES (?, ?) ON DUPLICATE KEY UPDATE timestamp = VALUES(timestamp)',
//             [imageFilename, timestamp],
//             (error) => {
//               if (error) {
//                 return reject(error);
//               }
//               resolve(imageFilename);
//             }
//           );
//         });
//       },
//       error: (error) => {
//         reject(error);
//       },
//       complete: () => {
//         console.log('Query completed');
//       }
//     });
//   });
// };

// const insertMissingImages = (db) => {
//   fs.readdir(imagesDir, (err, files) => {
//     if (err) {
//       console.error('Unable to scan directory:', err);
//       return;
//     }

//     const images = files.filter(file => file.endsWith('.jpg'));

//     images.forEach((filename) => {
//       db.query(
//         'SELECT COUNT(*) AS count FROM images WHERE filename = ?',
//         [filename],
//         (err, results) => {
//           if (err) {
//             console.error('Database query error:', err);
//             return;
//           }

//           if (results[0].count === 0) {
//             const timestamp = fs.statSync(path.join(imagesDir, filename)).mtime.toISOString().slice(0, 19).replace('T', ' ');

//             db.query(
//               'INSERT INTO images (filename, timestamp) VALUES (?, ?)',
//               [filename, timestamp],
//               (error) => {
//                 if (error) {
//                   console.error('Error inserting image:', error);
//                 }
//               }
//             );
//           }
//         }
//       );
//     });
//   });
// };

// const listImages = (req, res) => {
//   req.getConnection((err, db) => {
//     if (err) {
//       console.error('Database connection error:', err);
//       return res.status(500).send('Database connection error');
//     }

//     insertMissingImages(db);

//     fetchLatestImage(db)
//       .then(() => {
//         db.query('SELECT * FROM images ORDER BY id DESC', (error, results) => {
//           if (error) {
//             console.error('Database query error:', error);
//             return res.status(500).send('Database query error');
//           }

//           res.render('imageTable', { images: results });
//         });
//       })
//       .catch(err => {
//         console.error('Error fetching image data:', err);
//         res.status(500).send('Error fetching image data: ' + err);
//       });
//   });
// };

// const deleteImage = (req, res) => {
//   const { filename } = req.body;

//   if (!filename) {
//       return res.status(400).send({ error: 'Filename is required' });
//   }

//   console.log('Request to delete:', filename);

//   req.getConnection((err, db) => {
//       if (err) {
//           console.error('Database connection error:', err);
//           return res.status(500).send({ error: 'Database connection error' });
//       }

//       db.query('DELETE FROM images WHERE filename = ?', [filename], (error, results) => {
//           if (error) {
//               console.error('Database query error:', error);
//               return res.status(500).send({ error: 'Database query error' });
//           }

//           if (results.affectedRows === 0) {
//               console.warn('No record found for filename:', filename);
//               return res.status(404).send({ error: 'Image not found in database' });
//           }

//           console.log('Record deleted from database:', filename);

//           const imagePath = path.join(imagesDir, filename);
//           fs.unlink(imagePath, (err) => {
//               if (err) {
//                   console.error('Error deleting file:', err);
//                   return res.status(500).send({ error: 'Error deleting file' });
//               }

//               console.log('File deleted from directory:', imagePath);
//               res.send({ message: 'Image deleted successfully' });
//           });
//       });
//   });
// };


// module.exports = {
//   listImages,
//   deleteImage
// };




// exports.listImages = listImages;









//โค๊ดต้นแบบ
// const fs = require('fs');
// const path = require('path');
// const { InfluxDB } = require('@influxdata/influxdb-client');

// // InfluxDB setup
// const token = 'd7werMaE4ga-5h37AYUgwpq1FWC69uWSJuCYuP7XoBkdb7h-H2yDwnXTwNXWv7c9NKssNbbaCNZuhq-9sChNDA==';
// const org = '86e5ce4e5a6c211e';
// const bucket = 'image';
// const url = 'https://us-east-1-1.aws.cloud2.influxdata.com';

// const client = new InfluxDB({ url, token });
// const queryApi = client.getQueryApi(org);

// // Path to images directory
// const imagesDir = path.join(__dirname, '../images');

// // Function to fetch the latest image from InfluxDB
// const fetchLatestImage = async () => {
//   const query = `
//     from(bucket: "${bucket}")
//       |> range(start: -1h)
//       |> filter(fn: (r) => r._measurement == "image_data")
//       |> filter(fn: (r) => r._field == "image_base64")
//       |> last()
//   `;

//   return new Promise((resolve, reject) => {
//     const imageFilename = `image_${Date.now()}.jpg`;
//     const imagePath = path.join(imagesDir, imageFilename);

//     queryApi.queryRows(query, {
//       next: (row, tableMeta) => {
//         const o = tableMeta.toObject(row);
//         const base64Image = o._value;

//         // Save Base64 image to file
//         fs.writeFile(imagePath, base64Image, 'base64', (err) => {
//           if (err) {
//             return reject(err);
//           }
//           resolve(imageFilename);
//         });
//       },
//       error: (error) => {
//         reject(error);
//       },
//       complete: () => {
//         console.log('Query completed');
//       }
//     });
//   });
// };

// // Function to list images from directory
// const listImages = (req, res) => {
//   fetchLatestImage().then((imageFilename) => {
//     fs.readdir(imagesDir, (err, files) => {
//       if (err) {
//         return res.status(500).send('Unable to scan directory: ' + err);
//       }

//       // Filter to show only .jpg files
//       const images = files.filter(file => file.endsWith('.jpg'));

//       // Render the view with image files
//       res.render('image', { images });
//     });
//   }).catch(err => {
//     res.status(500).send('Error fetching image data: ' + err);
//   });
// };

// exports.listImages = listImages;
