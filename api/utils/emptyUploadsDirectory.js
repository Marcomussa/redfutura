const fs = require('fs');

const uploadsSource = `${__dirname}/../../uploads`;

const emptyUploadsDirectory = () => {
  fs.readdir(uploadsSource, (err, files) => {
    // TODO: Better handling
    if (err) return console.log('ERROR WHILE EMPTYING UPLOADS DIRECTORY: ', err)

    files.forEach((file) => {
      fs.unlink(`${uploadsSource}/${file}`, (error) => {
        if (err) return console.log('ERROR WHILE DELETING FILE: ', err)
      })
    })
  });
};

module.exports = emptyUploadsDirectory;