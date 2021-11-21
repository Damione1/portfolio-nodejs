const stream = require('stream');

function setupStreams(dataInputStream, dataOutputStream, callback) {

  // receive the data from the dataInputStream
  let id = 0;
  dataInputStream.on('data', (data) => {

       // transform each chunk of data into an object 
    let dataObject = {
      id: id,
      data: data
    };
    id++;

     
      // write the data object to the dataOutputStream
      dataOutputStream.write(dataObject);
      
      //invoke the callback function
      callback(data);
    }
  );


}

let readable = new stream.Readable();
let writable = new stream.Writable({  objectMode: true, 
                                      write: (chunk, encoding, callback) => {
                                        console.log(chunk);
                                        callback(null, true);
                                      }
});
setupStreams(readable, writable, () => console.log("onEnd"));

readable.push('{ "log": "Request received" }');
readable.push(null);
module.exports.setupStreams = setupStreams;