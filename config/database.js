if (process.env.NODE_ENV === 'production') {
  module.exports = {mongoURI: 'mongodb://Pizza2910:P!zza2910@ds237620.mlab.com:37620/vidjot'}
} else{
  module.exports = {mongoURI: "mongodb://localhost:27017/first"}
}
