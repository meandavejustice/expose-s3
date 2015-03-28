# expose-s3

Expose an s3 bucket like a filesystem

[![NPM](https://nodei.co/npm/expose-s3.png?downloads=true)](https://npmjs.org/package/expose-s3)

## Usage

`expose-s3 path/to/config.json [options]`

example config file
``` json
{
  "accessKeyId": "YOUR_S3_ACCESS_ID",
  "secretAccessKey": "YOUR_S3_ACCESS_KEY",
  "region": "us-west-2",
  "bucket": "YOUR_BUCKET_NAME",
  "port": 7777
}
```

Made to match the response from [expose-fs](https://www.npmjs.com/package/expose-fs)

## License
MIT
